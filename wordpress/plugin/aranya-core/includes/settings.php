<?php
/**
 * Aranya → Site Settings.
 *
 * The WordPress home of src/data/projectData.ts: facts that appear in several
 * places (phone, WhatsApp, RERA number and QR, address, partner names, social
 * links) are entered once here, and every widget that shows them reads them from
 * here unless its own field overrides them. Also holds enquiry routing, the
 * timed popup, tracking code and the SEO fallbacks.
 *
 * @package Aranya
 */

defined( 'ABSPATH' ) || exit;

const ARANYA_SETTINGS_OPTION = 'aranya_settings';

/**
 * Settings schema: tab => [ key => [ label, type, default, help ] ].
 * Defaults are the React site's values, so a fresh install matches it.
 */
function aranya_settings_schema(): array {
	return array(
		'project'   => array(
			'_title'              => __( 'Project', 'aranya' ),
			'project_name'        => array( __( 'Project name', 'aranya' ), 'text', 'Aranya The Park' ),
			'positioning'         => array( __( 'Positioning line', 'aranya' ), 'text', 'The Lushury Life' ),
			'tagline'             => array( __( 'Tagline', 'aranya' ), 'text', 'A Serene Metropolitan Address' ),
			'location'            => array( __( 'Location (short)', 'aranya' ), 'text', 'Malad West, Mumbai' ),
			'address'             => array( __( 'Site address', 'aranya' ), 'textarea', 'CTS 1069A/1/A/3, off New Link Road, Ram Nagar, Behind Evershine Mall, Mindspace, Malad West, Mumbai - 400064' ),
			'maharera'            => array( __( 'MahaRERA registration no.', 'aranya' ), 'text', 'P51800011594' ),
			'rera_url'            => array( __( 'MahaRERA link', 'aranya' ), 'url', 'https://maharerait.maharashtra.gov.in/project/view/12387', __( 'The project page on MahaRERA, the same link as the QR code (client, 5 Oct).', 'aranya' ) ),
			'rera_qr'             => array( __( 'MahaRERA QR code', 'aranya' ), 'image', 'rera-qr.png', __( 'Shown in the footer and the MahaRERA card: the official MahaRERA QR, linking to the same page as the MahaRERA link.', 'aranya' ) ),
			'developer'           => array( __( 'Developer entity', 'aranya' ), 'text', 'Anuradha Real Estate Developers Private Limited' ),
			'joint_venture'       => array( __( 'Joint venture', 'aranya' ), 'text', 'Zaveri Realty & BKM Mindspace' ),
			'zaveri_url'          => array( __( 'Zaveri Realty website', 'aranya' ), 'url', 'https://zaverirealty.com/' ),
			'bkm_url'             => array( __( 'BKM Mindspace link', 'aranya' ), 'url', 'https://www.instagram.com/bkm.mindspace/', __( 'Website or social page that the BKM logo opens (footer and Project by). Empty = the logo is not linked.', 'aranya' ) ),
			'zaveri_instagram'    => array( __( 'Zaveri Realty Instagram', 'aranya' ), 'url', 'https://www.instagram.com/zaveri.realty/', __( 'Icons under the logos in Project by. Empty = no icon.', 'aranya' ) ),
			'zaveri_facebook'     => array( __( 'Zaveri Realty Facebook', 'aranya' ), 'url', 'https://www.facebook.com/ZaveriRealtyOfficial/' ),
			'bkm_instagram'       => array( __( 'BKM Mindspace Instagram', 'aranya' ), 'url', 'https://www.instagram.com/bkm.mindspace/' ),
			'bkm_facebook'        => array( __( 'BKM Mindspace Facebook', 'aranya' ), 'url', 'https://www.facebook.com/share/18LaNodNiQ/' ),
		),
		'contact'   => array(
			'_title'              => __( 'Contact', 'aranya' ),
			'phone'               => array( __( 'Phone (as displayed)', 'aranya' ), 'text', '+91 976 976 6500' ),
			'phone_link'          => array( __( 'Phone (for the call link)', 'aranya' ), 'text', '+919769766500', __( 'Digits with country code, no spaces.', 'aranya' ) ),
			'whatsapp_number'     => array( __( 'WhatsApp number', 'aranya' ), 'text', '918356005700', __( 'Country code + number, digits only. Calls go to the Phone above; chats to this number.', 'aranya' ) ),
			'email'               => array( __( 'Sales email', 'aranya' ), 'text', 'sales@aranyathepark.com' ),
			'google_business_url' => array( __( 'Google Business Profile link', 'aranya' ), 'url', '', __( 'Used by "Get Directions". Empty = Google Maps search for the address.', 'aranya' ) ),
			'map_embed_url'       => array( __( 'Google Maps embed URL', 'aranya' ), 'url', '', __( 'The src of the project pin\'s embed. Empty = a map search for the address.', 'aranya' ) ),
			'social_instagram'    => array( __( 'Instagram', 'aranya' ), 'url', 'https://www.instagram.com/zaveri.realty/' ),
			'social_facebook'     => array( __( 'Facebook', 'aranya' ), 'url', 'https://www.facebook.com/ZaveriRealtyOfficial/' ),
			'social_youtube'      => array( __( 'YouTube', 'aranya' ), 'url', '' ),
			'social_linkedin'     => array( __( 'LinkedIn', 'aranya' ), 'url', '' ),
		),
		'enquiries' => array(
			'_title'              => __( 'Enquiries', 'aranya' ),
			'popup_enabled'       => array( __( 'Show the enquiry popup', 'aranya' ), 'checkbox', '1', __( 'Opens once per visit; closing it keeps it closed for the session.', 'aranya' ) ),
			'popup_delay'         => array( __( 'Popup delay (seconds)', 'aranya' ), 'number', '10' ),
			'lead_emails'         => array( __( 'Email new enquiries to', 'aranya' ), 'text', '', __( 'Comma-separated addresses. Empty = no email; enquiries are always saved under Aranya → Enquiries.', 'aranya' ) ),
			'webhook_url'         => array( __( 'CRM webhook URL', 'aranya' ), 'url', '', __( 'Each enquiry is POSTed here as JSON (LeadSquared, HubSpot, Zoho, Salesforce, Zapier…). Empty = off.', 'aranya' ) ),
			'brochure_url'        => array( __( 'E-brochure PDF link', 'aranya' ), 'url', '', __( 'What the Download E-Brochure buttons give after the enquiry form. Empty = the brochure bundled with the site; to replace it, upload a PDF to Media and paste its link here.', 'aranya' ) ),
			'otp_mode'            => array( __( 'Mobile verification (OTP)', 'aranya' ), 'select', 'demo', __( 'Demo accepts any 6-digit code, as the current site does. Connect an SMS provider before taking live leads.', 'aranya' ), array( 'demo' => __( 'Demo — any 6-digit code', 'aranya' ), 'msg91' => __( 'MSG91', 'aranya' ) ) ),
			'msg91_authkey'       => array( __( 'MSG91 auth key', 'aranya' ), 'text', '' ),
			'msg91_template_id'   => array( __( 'MSG91 OTP template ID', 'aranya' ), 'text', '' ),
		),
		'seo'       => array(
			'_title'              => __( 'SEO & Code', 'aranya' ),
			'schema_enabled'      => array( __( 'Output project schema (JSON-LD)', 'aranya' ), 'checkbox', '1', __( 'ApartmentComplex + developer details on the home page. Turn off if your SEO plugin outputs its own.', 'aranya' ) ),
			'home_title'          => array( __( 'Fallback home page title', 'aranya' ), 'text', 'Aranya The Park, Malad West | Luxury 2, 3 & 5 BHK Residences in Mumbai', __( 'Only used when no SEO plugin is active.', 'aranya' ) ),
			'meta_description'    => array( __( 'Fallback meta description', 'aranya' ), 'textarea', 'Aranya The Park, Malad West, Mumbai. Spacious, Vastu-compliant 2, 3 & 5 BHK residences, 40% open green spaces, rooftop amenities and an 18.3 m access road to New Link Road.', __( 'Only printed when no SEO plugin (Rank Math / Yoast) is active.', 'aranya' ) ),
			'og_image'            => array( __( 'Fallback social share image', 'aranya' ), 'image', 'og-image.jpg' ),
			'code_head'           => array( __( 'Code in &lt;head&gt;', 'aranya' ), 'code', '', __( 'Google Tag Manager, GA4, Meta Pixel, verification tags…', 'aranya' ) ),
			'code_body'           => array( __( 'Code after &lt;body&gt;', 'aranya' ), 'code', '', __( 'e.g. the GTM noscript iframe.', 'aranya' ) ),
			'code_footer'         => array( __( 'Code before &lt;/body&gt;', 'aranya' ), 'code', '' ),
		),
	);
}

/**
 * All settings, saved values over defaults.
 */
function aranya_settings(): array {
	static $cache = null;
	if ( null !== $cache ) {
		return $cache;
	}
	$defaults = array();
	foreach ( aranya_settings_schema() as $fields ) {
		foreach ( $fields as $key => $field ) {
			if ( '_title' !== $key ) {
				$defaults[ $key ] = $field[2];
			}
		}
	}
	$saved = get_option( ARANYA_SETTINGS_OPTION, array() );
	$cache = array_merge( $defaults, is_array( $saved ) ? $saved : array() );
	return $cache;
}

/**
 * One setting. Image settings return a URL (attachment or bundled default).
 */
function aranya_setting( string $key ) {
	$settings = aranya_settings();
	return $settings[ $key ] ?? '';
}

/**
 * An image setting as an Elementor-style media value [ id, url ].
 */
function aranya_setting_media( string $key ): array {
	$value = aranya_setting( $key );
	if ( is_numeric( $value ) && (int) $value > 0 ) {
		return array(
			'id'  => (int) $value,
			'url' => (string) wp_get_attachment_url( (int) $value ),
		);
	}
	return array(
		'id'  => '',
		'url' => aranya_asset_url( (string) $value ),
	);
}

/**
 * The call link, e.g. tel:+919769766500.
 */
function aranya_tel_url(): string {
	return 'tel:' . preg_replace( '/[^\d+]/', '', (string) aranya_setting( 'phone_link' ) );
}

/**
 * The e-brochure PDF: the Site Settings link, else the copy bundled with the
 * site (scripts/web-brochure.py makes it).
 */
function aranya_brochure_url(): string {
	$url = trim( (string) aranya_setting( 'brochure_url' ) );
	return '' !== $url ? $url : aranya_asset_url( 'aranya-e-brochure.pdf' );
}

/**
 * Social channels with a URL, in the React order.
 */
function aranya_socials(): array {
	$out = array();
	foreach ( array( 'Instagram', 'Facebook', 'YouTube', 'LinkedIn' ) as $label ) {
		$url = (string) aranya_setting( 'social_' . strtolower( $label ) );
		if ( '' !== $url ) {
			$out[] = array(
				'label' => $label,
				'url'   => $url,
			);
		}
	}
	return $out;
}

/* ─── Admin page ────────────────────────────────────────────────────────── */

add_action( 'admin_menu', 'aranya_settings_menu' );
add_action( 'admin_init', 'aranya_settings_register' );

function aranya_settings_menu() {
	add_menu_page(
		__( 'Aranya', 'aranya' ),
		__( 'Aranya', 'aranya' ),
		'manage_options',
		'aranya',
		'aranya_settings_page',
		'dashicons-building',
		3
	);
	add_submenu_page( 'aranya', __( 'Site Settings', 'aranya' ), __( 'Site Settings', 'aranya' ), 'manage_options', 'aranya', 'aranya_settings_page' );
}

function aranya_settings_register() {
	register_setting(
		'aranya_settings_group',
		ARANYA_SETTINGS_OPTION,
		array(
			'type'              => 'array',
			'sanitize_callback' => 'aranya_settings_sanitize',
			'default'           => array(),
		)
	);
}

/**
 * Sanitises by field type. Tracking-code fields keep raw HTML only for users
 * allowed unfiltered HTML (administrators on single sites).
 */
function aranya_settings_sanitize( $input ): array {
	$input = is_array( $input ) ? $input : array();
	$clean = array();
	foreach ( aranya_settings_schema() as $fields ) {
		foreach ( $fields as $key => $field ) {
			if ( '_title' === $key ) {
				continue;
			}
			$type  = $field[1];
			$value = $input[ $key ] ?? ( 'checkbox' === $type ? '0' : '' );
			switch ( $type ) {
				case 'url':
					$clean[ $key ] = esc_url_raw( trim( (string) $value ) );
					break;
				case 'textarea':
					$clean[ $key ] = sanitize_textarea_field( (string) $value );
					break;
				case 'checkbox':
					$clean[ $key ] = '1' === (string) $value ? '1' : '0';
					break;
				case 'number':
					$clean[ $key ] = (string) max( 0, (int) $value );
					break;
				case 'image':
					$clean[ $key ] = is_numeric( $value ) && (int) $value > 0 ? (string) (int) $value : sanitize_text_field( (string) $value );
					break;
				case 'select':
					$clean[ $key ] = array_key_exists( (string) $value, $field[4] ?? array() ) ? (string) $value : $field[2];
					break;
				case 'code':
					$clean[ $key ] = current_user_can( 'unfiltered_html' ) ? (string) $value : wp_kses_post( (string) $value );
					break;
				default:
					$clean[ $key ] = sanitize_text_field( (string) $value );
			}
		}
	}
	return $clean;
}

function aranya_settings_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	wp_enqueue_media();
	$settings = aranya_settings();
	$schema   = aranya_settings_schema();
	?>
	<div class="wrap aranya-settings">
		<h1><?php esc_html_e( 'Aranya — Site Settings', 'aranya' ); ?></h1>
		<p class="description">
			<?php esc_html_e( 'Facts used across the site. Page content — every heading, paragraph, image and list — is edited in Elementor (Pages → Home → Edit with Elementor). The header and footer are edited under Templates → Saved Templates.', 'aranya' ); ?>
		</p>
		<nav class="nav-tab-wrapper">
			<?php foreach ( $schema as $tab => $fields ) : ?>
				<a href="#aranya-tab-<?php echo esc_attr( $tab ); ?>" class="nav-tab" data-tab="<?php echo esc_attr( $tab ); ?>"><?php echo esc_html( $fields['_title'] ); ?></a>
			<?php endforeach; ?>
		</nav>
		<form method="post" action="options.php">
			<?php settings_fields( 'aranya_settings_group' ); ?>
			<?php foreach ( $schema as $tab => $fields ) : ?>
				<div class="aranya-tab" id="aranya-tab-<?php echo esc_attr( $tab ); ?>">
					<table class="form-table" role="presentation">
						<?php
						foreach ( $fields as $key => $field ) :
							if ( '_title' === $key ) {
								continue;
							}
							[ $label, $type ] = $field;
							$help             = $field[3] ?? '';
							$name             = ARANYA_SETTINGS_OPTION . '[' . $key . ']';
							$value            = $settings[ $key ];
							$id               = 'aranya-' . $key;
							?>
							<tr>
								<th scope="row"><label for="<?php echo esc_attr( $id ); ?>"><?php echo wp_kses_post( $label ); ?></label></th>
								<td>
									<?php
									switch ( $type ) {
										case 'textarea':
											printf( '<textarea id="%s" name="%s" rows="3" class="large-text">%s</textarea>', esc_attr( $id ), esc_attr( $name ), esc_textarea( $value ) );
											break;
										case 'code':
											printf( '<textarea id="%s" name="%s" rows="6" class="large-text code">%s</textarea>', esc_attr( $id ), esc_attr( $name ), esc_textarea( $value ) );
											break;
										case 'checkbox':
											printf( '<input type="hidden" name="%2$s" value="0"><label><input type="checkbox" id="%1$s" name="%2$s" value="1" %3$s> %4$s</label>', esc_attr( $id ), esc_attr( $name ), checked( '1', $value, false ), esc_html__( 'Enabled', 'aranya' ) );
											break;
										case 'number':
											printf( '<input type="number" min="0" id="%s" name="%s" value="%s" class="small-text">', esc_attr( $id ), esc_attr( $name ), esc_attr( $value ) );
											break;
										case 'select':
											printf( '<select id="%s" name="%s">', esc_attr( $id ), esc_attr( $name ) );
											foreach ( $field[4] as $opt => $opt_label ) {
												printf( '<option value="%s" %s>%s</option>', esc_attr( $opt ), selected( $value, $opt, false ), esc_html( $opt_label ) );
											}
											echo '</select>';
											break;
										case 'image':
											$preview = is_numeric( $value ) ? wp_get_attachment_image_url( (int) $value, 'medium' ) : aranya_asset_url( (string) $value );
											printf(
												'<div class="aranya-media-field"><input type="hidden" id="%1$s" name="%2$s" value="%3$s"><img src="%4$s" alt="" style="max-width:120px;max-height:120px;display:block;margin-bottom:8px;background:#0a1c15;padding:4px"><button type="button" class="button aranya-media-pick">%5$s</button></div>',
												esc_attr( $id ),
												esc_attr( $name ),
												esc_attr( $value ),
												esc_url( (string) $preview ),
												esc_html__( 'Choose image', 'aranya' )
											);
											break;
										default:
											printf( '<input type="%s" id="%s" name="%s" value="%s" class="regular-text">', 'url' === $type ? 'url' : 'text', esc_attr( $id ), esc_attr( $name ), esc_attr( $value ) );
									}
									if ( $help ) {
										printf( '<p class="description">%s</p>', esc_html( $help ) );
									}
									?>
								</td>
							</tr>
						<?php endforeach; ?>
					</table>
				</div>
			<?php endforeach; ?>
			<?php submit_button(); ?>
		</form>
	</div>
	<style>.aranya-settings .aranya-tab{display:none}.aranya-settings .aranya-tab.is-active{display:block}</style>
	<script>
	(function () {
		var tabs = document.querySelectorAll('.aranya-settings .nav-tab');
		function show(name) {
			tabs.forEach(function (t) { t.classList.toggle('nav-tab-active', t.dataset.tab === name); });
			document.querySelectorAll('.aranya-settings .aranya-tab').forEach(function (p) {
				p.classList.toggle('is-active', p.id === 'aranya-tab-' + name);
			});
		}
		tabs.forEach(function (t) {
			t.addEventListener('click', function (e) { e.preventDefault(); show(t.dataset.tab); history.replaceState(null, '', t.getAttribute('href')); });
		});
		show((location.hash || '#aranya-tab-project').replace('#aranya-tab-', ''));
		document.querySelectorAll('.aranya-media-pick').forEach(function (btn) {
			btn.addEventListener('click', function () {
				var wrap = btn.closest('.aranya-media-field');
				var frame = wp.media({ multiple: false, library: { type: 'image' } });
				frame.on('select', function () {
					var a = frame.state().get('selection').first().toJSON();
					wrap.querySelector('input').value = a.id;
					wrap.querySelector('img').src = (a.sizes && a.sizes.medium ? a.sizes.medium.url : a.url);
				});
				frame.open();
			});
		});
	})();
	</script>
	<?php
}
