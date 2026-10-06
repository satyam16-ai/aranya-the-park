<?php
/**
 * Enquiries: the WordPress replacement for src/services/enquiryService.ts.
 *
 * The React site only wrote enquiries to the visitor's own localStorage. Here
 * every enquiry is stored as a private "Enquiry" post (Aranya → Enquiries,
 * with CSV export), then — when configured in Site Settings — emailed to the
 * sales team and POSTed to a CRM webhook.
 *
 * REST routes (namespace aranya/v1), all public:
 *   POST otp/send    { phone }                   → { success, message }
 *   POST otp/verify  { phone, code }             → { success, message, token }
 *   POST enquiry     { …form fields, otpToken }  → { success, leadId, message, timestamp }
 *
 * OTP "demo" mode keeps the React behaviour (any 6-digit code verifies); the
 * MSG91 mode sends and checks real codes. The form UI is the same either way.
 *
 * @package Aranya
 */

defined( 'ABSPATH' ) || exit;

const ARANYA_LEAD_TYPE = 'aranya_lead';

add_action( 'init', 'aranya_register_lead_post_type' );
add_action( 'rest_api_init', 'aranya_register_lead_routes' );

function aranya_register_lead_post_type() {
	register_post_type(
		ARANYA_LEAD_TYPE,
		array(
			'labels'          => array(
				'name'          => __( 'Enquiries', 'aranya' ),
				'singular_name' => __( 'Enquiry', 'aranya' ),
				'menu_name'     => __( 'Enquiries', 'aranya' ),
				'all_items'     => __( 'Enquiries', 'aranya' ),
				'edit_item'     => __( 'Enquiry', 'aranya' ),
				'search_items'  => __( 'Search enquiries', 'aranya' ),
				'not_found'     => __( 'No enquiries yet.', 'aranya' ),
			),
			'public'          => false,
			'show_ui'         => true,
			'show_in_menu'    => 'aranya',
			'show_in_rest'    => false,
			'supports'        => array( 'title' ),
			'capability_type' => 'post',
			'capabilities'    => array( 'create_posts' => 'do_not_allow' ),
			'map_meta_cap'    => true,
		)
	);
}

/** Stored fields: meta key => column label. */
function aranya_lead_fields(): array {
	return array(
		'lead_id'        => __( 'Lead ID', 'aranya' ),
		'full_name'      => __( 'Name', 'aranya' ),
		'phone'          => __( 'Mobile', 'aranya' ),
		'phone_verified' => __( 'Verified', 'aranya' ),
		'email'          => __( 'Email', 'aranya' ),
		'configuration'  => __( 'Configuration', 'aranya' ),
		'contact_method' => __( 'Contact via', 'aranya' ),
		'message'        => __( 'Message', 'aranya' ),
		'purpose'        => __( 'Purpose', 'aranya' ),
		'page_url'       => __( 'Page', 'aranya' ),
		'referrer'       => __( 'Referrer', 'aranya' ),
		'utm_source'     => 'utm_source',
		'utm_medium'     => 'utm_medium',
		'utm_campaign'   => 'utm_campaign',
		'utm_term'       => 'utm_term',
		'utm_content'    => 'utm_content',
	);
}

/* ─── REST ─────────────────────────────────────────────────────────────── */

function aranya_register_lead_routes() {
	$public = '__return_true';
	register_rest_route(
		'aranya/v1',
		'/otp/send',
		array(
			'methods'             => 'POST',
			'callback'            => 'aranya_rest_otp_send',
			'permission_callback' => $public,
		)
	);
	register_rest_route(
		'aranya/v1',
		'/otp/verify',
		array(
			'methods'             => 'POST',
			'callback'            => 'aranya_rest_otp_verify',
			'permission_callback' => $public,
		)
	);
	register_rest_route(
		'aranya/v1',
		'/enquiry',
		array(
			'methods'             => 'POST',
			'callback'            => 'aranya_rest_enquiry',
			'permission_callback' => $public,
		)
	);
}

/** Indian mobile numbers, as the React forms validate them. */
function aranya_valid_phone( string $phone ): bool {
	return (bool) preg_match( '/^[6-9]\d{9}$/', $phone );
}

/**
 * The visitor's IP. Behind a CDN or proxy every request arrives from the same
 * address, so the forwarded client address is preferred when present (it is
 * only used to rate-limit, never trusted for anything else).
 */
function aranya_client_ip(): string {
	foreach ( array( 'HTTP_CF_CONNECTING_IP', 'HTTP_X_REAL_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR' ) as $key ) {
		if ( ! empty( $_SERVER[ $key ] ) ) {
			$ip = trim( explode( ',', sanitize_text_field( wp_unslash( $_SERVER[ $key ] ) ) )[0] );
			if ( filter_var( $ip, FILTER_VALIDATE_IP ) ) {
				return $ip;
			}
		}
	}
	return '';
}

/**
 * Simple per-IP throttle. Returns true when the caller is over the limit.
 */
function aranya_throttled( string $bucket, int $limit, int $window ): bool {
	$ip  = aranya_client_ip();
	$key = 'aranya_rl_' . $bucket . '_' . md5( $ip );
	$hit = (int) get_transient( $key );
	if ( $hit >= $limit ) {
		return true;
	}
	set_transient( $key, $hit + 1, $window );
	return false;
}

/** A signed "this number was verified" token, valid for two hours. */
function aranya_otp_token( string $phone ): string {
	$expires = time() + 2 * HOUR_IN_SECONDS;
	return $expires . '.' . hash_hmac( 'sha256', $phone . '|' . $expires, wp_salt( 'auth' ) );
}

function aranya_otp_token_valid( string $phone, string $token ): bool {
	[ $expires, $sig ] = array_pad( explode( '.', $token, 2 ), 2, '' );
	if ( (int) $expires < time() ) {
		return false;
	}
	return hash_equals( hash_hmac( 'sha256', $phone . '|' . (int) $expires, wp_salt( 'auth' ) ), $sig );
}

function aranya_rest_otp_send( WP_REST_Request $request ) {
	$phone = preg_replace( '/\D+/', '', (string) $request->get_param( 'phone' ) );
	if ( ! aranya_valid_phone( $phone ) ) {
		return array(
			'success' => false,
			'message' => __( 'Enter a valid 10-digit mobile number.', 'aranya' ),
		);
	}
	if ( aranya_throttled( 'otp', 8, 15 * MINUTE_IN_SECONDS ) ) {
		return array(
			'success' => false,
			'message' => __( 'Too many attempts. Please try again in a few minutes.', 'aranya' ),
		);
	}

	$result = apply_filters( 'aranya_otp_send', null, $phone );
	if ( null === $result && 'msg91' === aranya_setting( 'otp_mode' ) ) {
		$result = aranya_msg91_send( $phone );
	}
	if ( is_array( $result ) && empty( $result['success'] ) ) {
		return $result;
	}
	/* translators: %s: 10-digit mobile number */
	return array(
		'success' => true,
		'message' => sprintf( __( 'Verification code sent to +91 %s.', 'aranya' ), $phone ),
	);
}

function aranya_rest_otp_verify( WP_REST_Request $request ) {
	$phone = preg_replace( '/\D+/', '', (string) $request->get_param( 'phone' ) );
	$code  = preg_replace( '/\D+/', '', (string) $request->get_param( 'code' ) );
	if ( ! preg_match( '/^\d{6}$/', $code ) ) {
		return array(
			'success' => false,
			'message' => __( 'Enter the 6-digit code.', 'aranya' ),
		);
	}
	if ( ! aranya_valid_phone( $phone ) || aranya_throttled( 'otpv', 12, 15 * MINUTE_IN_SECONDS ) ) {
		return array(
			'success' => false,
			'message' => __( 'That code could not be verified. Please try again.', 'aranya' ),
		);
	}

	$ok = apply_filters( 'aranya_otp_verify', null, $phone, $code );
	if ( null === $ok ) {
		$ok = 'msg91' === aranya_setting( 'otp_mode' ) ? aranya_msg91_verify( $phone, $code ) : true; // Demo: any 6 digits.
	}
	if ( ! $ok ) {
		return array(
			'success' => false,
			'message' => __( 'That code is not correct. Please check and try again.', 'aranya' ),
		);
	}
	return array(
		'success' => true,
		'message' => __( 'Number verified.', 'aranya' ),
		'token'   => aranya_otp_token( $phone ),
	);
}

/** MSG91 v5 OTP API. Needs an auth key and an approved OTP template (Site Settings). */
function aranya_msg91_send( string $phone ): array {
	$response = wp_remote_post(
		add_query_arg(
			array(
				'template_id' => aranya_setting( 'msg91_template_id' ),
				'mobile'      => '91' . $phone,
			),
			'https://control.msg91.com/api/v5/otp'
		),
		array(
			'headers' => array(
				'authkey'      => aranya_setting( 'msg91_authkey' ),
				'Content-Type' => 'application/json',
			),
			'timeout' => 10,
		)
	);
	$body = json_decode( (string) wp_remote_retrieve_body( $response ), true );
	if ( is_wp_error( $response ) || 'success' !== ( $body['type'] ?? '' ) ) {
		return array(
			'success' => false,
			'message' => __( 'We could not send a code just now. Please try again.', 'aranya' ),
		);
	}
	return array( 'success' => true );
}

function aranya_msg91_verify( string $phone, string $code ): bool {
	$response = wp_remote_get(
		add_query_arg(
			array(
				'otp'    => $code,
				'mobile' => '91' . $phone,
			),
			'https://control.msg91.com/api/v5/otp/verify'
		),
		array(
			'headers' => array( 'authkey' => aranya_setting( 'msg91_authkey' ) ),
			'timeout' => 10,
		)
	);
	$body = json_decode( (string) wp_remote_retrieve_body( $response ), true );
	return ! is_wp_error( $response ) && 'success' === ( $body['type'] ?? '' );
}

function aranya_rest_enquiry( WP_REST_Request $request ) {
	$p = $request->get_json_params() ?: $request->get_body_params();

	// Honeypot: a hidden field real visitors never fill.
	if ( ! empty( $p['website'] ) ) {
		return array(
			'success'   => true,
			'leadId'    => 'ATP-' . strtoupper( base_convert( (string) (int) round( microtime( true ) * 1000 ), 10, 36 ) ),
			'message'   => '',
			'timestamp' => gmdate( 'c' ),
		);
	}
	if ( aranya_throttled( 'lead', 6, 10 * MINUTE_IN_SECONDS ) ) {
		return new WP_REST_Response(
			array(
				'success' => false,
				'message' => __( 'Too many enquiries from this connection. Please call us instead.', 'aranya' ),
			),
			429
		);
	}

	$name  = sanitize_text_field( (string) ( $p['fullName'] ?? '' ) );
	$phone = preg_replace( '/\D+/', '', (string) ( $p['phoneNumber'] ?? '' ) );
	if ( '' === $name || ! aranya_valid_phone( $phone ) ) {
		return new WP_REST_Response(
			array(
				'success' => false,
				'message' => __( 'Please enter your name and a valid mobile number.', 'aranya' ),
			),
			400
		);
	}
	$verified = aranya_otp_token_valid( $phone, (string) ( $p['otpToken'] ?? '' ) );
	if ( ! $verified && 'demo' !== aranya_setting( 'otp_mode' ) ) {
		return new WP_REST_Response(
			array(
				'success' => false,
				'message' => __( 'Please verify your mobile number first.', 'aranya' ),
			),
			400
		);
	}

	$timestamp = gmdate( 'c' );
	$lead_id   = 'ATP-' . strtoupper( base_convert( (string) (int) round( microtime( true ) * 1000 ), 10, 36 ) );
	$record    = array(
		'lead_id'        => $lead_id,
		'full_name'      => $name,
		'phone'          => $phone,
		'phone_verified' => $verified ? 'yes' : 'no',
		'email'          => sanitize_email( (string) ( $p['email'] ?? '' ) ),
		'configuration'  => sanitize_text_field( (string) ( $p['configuration'] ?? '' ) ),
		'contact_method' => sanitize_text_field( (string) ( $p['contactMethod'] ?? '' ) ),
		'message'        => sanitize_textarea_field( (string) ( $p['message'] ?? '' ) ),
		'purpose'        => sanitize_text_field( (string) ( $p['purpose'] ?? '' ) ),
		'page_url'       => esc_url_raw( (string) ( $p['pageUrl'] ?? '' ) ),
		'referrer'       => esc_url_raw( (string) ( $p['referrer'] ?? '' ) ),
	);
	foreach ( array( 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content' ) as $utm ) {
		$record[ $utm ] = sanitize_text_field( (string) ( $p['utm'][ $utm ] ?? '' ) );
	}

	$post_id = wp_insert_post(
		array(
			'post_type'   => ARANYA_LEAD_TYPE,
			'post_status' => 'publish',
			'post_title'  => sprintf( '%s — +91 %s', $name, $phone ),
		),
		true
	);
	if ( is_wp_error( $post_id ) ) {
		return new WP_REST_Response(
			array(
				'success' => false,
				'message' => __( 'Sorry, something went wrong. Please call us instead.', 'aranya' ),
			),
			500
		);
	}
	foreach ( $record as $key => $value ) {
		update_post_meta( $post_id, '_aranya_' . $key, $value );
	}

	aranya_notify_lead( $record, $timestamp );
	do_action( 'aranya_lead_created', $post_id, $record );

	return array(
		'success'   => true,
		'leadId'    => $lead_id,
		'message'   => __( 'Your enquiry has been registered with the Aranya The Park sales desk.', 'aranya' ),
		'timestamp' => $timestamp,
	);
}

/**
 * Email + webhook. Both are off until Site Settings has recipients / a URL.
 */
function aranya_notify_lead( array $record, string $timestamp ) {
	$to = array_filter( array_map( 'sanitize_email', array_map( 'trim', explode( ',', (string) aranya_setting( 'lead_emails' ) ) ) ) );
	if ( $to ) {
		$lines = array();
		foreach ( aranya_lead_fields() as $key => $label ) {
			if ( '' !== (string) $record[ $key ] ) {
				$lines[] = $label . ': ' . $record[ $key ];
			}
		}
		$headers = array();
		if ( is_email( $record['email'] ) ) {
			$headers[] = 'Reply-To: ' . $record['full_name'] . ' <' . $record['email'] . '>';
		}
		/* translators: 1: lead id, 2: name */
		$subject = sprintf( __( 'New enquiry %1$s — %2$s', 'aranya' ), $record['lead_id'], $record['full_name'] );
		// Only buttons tied to a unit (e.g. Residences "3 BHK") send a configuration.
		if ( '' !== $record['configuration'] ) {
			$subject .= ' (' . $record['configuration'] . ')';
		}
		wp_mail(
			$to,
			$subject,
			implode( "\n", $lines ) . "\n\n" . admin_url( 'edit.php?post_type=' . ARANYA_LEAD_TYPE ),
			$headers
		);
	}

	$webhook = (string) aranya_setting( 'webhook_url' );
	if ( '' !== $webhook ) {
		wp_remote_post(
			$webhook,
			array(
				'blocking' => false,
				'timeout'  => 5,
				'headers'  => array( 'Content-Type' => 'application/json' ),
				'body'     => wp_json_encode( array_merge( $record, array( 'timestamp' => $timestamp, 'project' => aranya_setting( 'project_name' ) ) ) ),
			)
		);
	}
}

/* ─── Admin list ───────────────────────────────────────────────────────── */

add_filter(
	'manage_' . ARANYA_LEAD_TYPE . '_posts_columns',
	static function () {
		return array(
			'cb'                    => '<input type="checkbox" />',
			'title'                 => __( 'Enquiry', 'aranya' ),
			'aranya_lead_id'        => __( 'Lead ID', 'aranya' ),
			'aranya_configuration'  => __( 'Configuration', 'aranya' ),
			'aranya_contact_method' => __( 'Contact via', 'aranya' ),
			'aranya_purpose'        => __( 'Purpose', 'aranya' ),
			'aranya_utm_source'     => __( 'Source', 'aranya' ),
			'date'                  => __( 'Received', 'aranya' ),
		);
	}
);

add_action(
	'manage_' . ARANYA_LEAD_TYPE . '_posts_custom_column',
	static function ( $column, $post_id ) {
		if ( str_starts_with( $column, 'aranya_' ) ) {
			echo esc_html( (string) get_post_meta( $post_id, '_' . $column, true ) );
		}
	},
	10,
	2
);

add_filter(
	'post_row_actions',
	static function ( $actions, $post ) {
		if ( ARANYA_LEAD_TYPE === $post->post_type ) {
			unset( $actions['inline hide-if-no-js'] );
		}
		return $actions;
	},
	10,
	2
);

/** The enquiry detail screen: a read-only table instead of the title editor. */
add_action(
	'add_meta_boxes_' . ARANYA_LEAD_TYPE,
	static function () {
		add_meta_box(
			'aranya-lead-details',
			__( 'Enquiry details', 'aranya' ),
			static function ( $post ) {
				echo '<table class="widefat striped"><tbody>';
				foreach ( aranya_lead_fields() as $key => $label ) {
					printf(
						'<tr><th style="width:180px">%s</th><td>%s</td></tr>',
						esc_html( $label ),
						nl2br( esc_html( (string) get_post_meta( $post->ID, '_aranya_' . $key, true ) ) )
					);
				}
				echo '</tbody></table>';
			},
			ARANYA_LEAD_TYPE,
			'normal',
			'high'
		);
	}
);

/** "Export CSV" button above the list. */
add_action(
	'manage_posts_extra_tablenav',
	static function ( $which ) {
		if ( 'top' !== $which || ARANYA_LEAD_TYPE !== get_current_screen()?->post_type ) {
			return;
		}
		printf(
			'<a class="button" href="%s">%s</a>',
			esc_url( wp_nonce_url( admin_url( 'admin-post.php?action=aranya_export_leads' ), 'aranya_export_leads' ) ),
			esc_html__( 'Export CSV', 'aranya' )
		);
	}
);

add_action(
	'admin_post_aranya_export_leads',
	static function () {
		if ( ! current_user_can( 'edit_posts' ) || ! check_admin_referer( 'aranya_export_leads' ) ) {
			wp_die( esc_html__( 'Not allowed.', 'aranya' ) );
		}
		$fields = aranya_lead_fields();
		nocache_headers();
		header( 'Content-Type: text/csv; charset=utf-8' );
		header( 'Content-Disposition: attachment; filename=aranya-enquiries-' . gmdate( 'Y-m-d' ) . '.csv' );
		$out = fopen( 'php://output', 'w' );
		fputcsv( $out, array_merge( array( __( 'Received', 'aranya' ) ), array_values( $fields ) ) );
		$ids = get_posts(
			array(
				'post_type'      => ARANYA_LEAD_TYPE,
				'post_status'    => 'any',
				'posts_per_page' => -1,
				'fields'         => 'ids',
			)
		);
		foreach ( $ids as $id ) {
			$row = array( get_post_time( 'Y-m-d H:i', false, $id ) );
			foreach ( array_keys( $fields ) as $key ) {
				// A leading =,+,-,@ would run as a formula in Excel.
				$row[] = preg_replace( '/^([=+\-@])/', "'$1", (string) get_post_meta( $id, '_aranya_' . $key, true ) );
			}
			fputcsv( $out, $row );
		}
		fclose( $out );
		exit;
	}
);
