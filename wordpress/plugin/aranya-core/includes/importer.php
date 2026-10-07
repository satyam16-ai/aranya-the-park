<?php
/**
 * Aranya → Install Content.
 *
 * Builds the finished site on a fresh WordPress + Elementor install:
 *  1. Media — copies the React site's optimised images and films into
 *     uploads/aranya/ and registers each as an attachment. An image's smaller
 *     WebP variants become its sizes, so WordPress prints the same srcset the
 *     React site does (no regeneration, no quality change).
 *  2. Elementor — default colours/fonts off (the design brings its own),
 *     Google Fonts off (self-hosted), brand colours and font as Global
 *     Colors/Fonts for any native widget the team adds.
 *  3. Templates — "Aranya Header" (navbar) and "Aranya Footer" (footer,
 *     contact closet, enquiry pop-up), printed by the theme on every page.
 *  4. Home — one container per section, in the React page order, each
 *     widget holding the React content with images linked to the Media
 *     Library; set as the front page.
 *  5. SEO — Rank Math / Yoast fields for Home pre-filled from index.html.
 *
 * Media come from wp-content/uploads/aranya-import/ (the aranya-media.zip
 * extracted there, same layout as public/assets/) or, failing that, from a
 * "media source" URL — any deployment of the React site.
 *
 * Re-running is safe: existing attachments are reused; pages and templates
 * are updated in place.
 *
 * @package Aranya
 */

defined( 'ABSPATH' ) || exit;

add_action(
	'admin_menu',
	static function () {
		add_submenu_page( 'aranya', __( 'Install Content', 'aranya' ), __( 'Install Content', 'aranya' ), 'manage_options', 'aranya-install', 'aranya_importer_page' );
	},
	20
);

add_action( 'wp_ajax_aranya_import', 'aranya_importer_ajax' );
add_action( 'admin_post_aranya_media_upload', 'aranya_media_upload' );

/** Sections of the Home page, in App.tsx order: [widget, anchor]. */
function aranya_home_sections(): array {
	return array(
		'aranya-hero',
		'aranya-story-greens',
		'aranya-residences',
		'aranya-amenities',
		'aranya-location',
		'aranya-specifications',
		'aranya-floor-plans',
		'aranya-gallery',
		'aranya-developer',
		'aranya-enquiry-cta',
	);
}

/* ─── Media ────────────────────────────────────────────────────────────── */

/**
 * Where media are read from: the local import folder, else the source URL.
 */
function aranya_import_source(): array {
	$uploads = wp_get_upload_dir();
	$local   = trailingslashit( $uploads['basedir'] ) . 'aranya-import/';
	if ( is_dir( $local . 'opt' ) ) {
		return array( 'local', $local );
	}
	$remote = (string) get_option( 'aranya_media_source', '' );
	return '' !== $remote ? array( 'remote', trailingslashit( $remote ) . 'assets/' ) : array( 'none', '' );
}

/**
 * Every media path the site uses: widget defaults, settings defaults and
 * extras (share image, video posters…), as paths under public/assets.
 */
function aranya_import_media_list(): array {
	$paths = array();
	foreach ( aranya_widget_default_settings() as $settings ) {
		array_walk_recursive(
			$settings,
			static function ( $value, $key ) use ( &$paths ) {
				if ( 'url' === $key && is_string( $value ) ) {
					$path = aranya_asset_path_from_url( $value );
					if ( null !== $path ) {
						$paths[] = $path;
					}
				}
			}
		);
	}
	foreach ( array( 'rera-qr.png', 'aranya-e-brochure.pdf', 'og-image.jpg', 'branding/aranya-crest-48.png', 'branding/aranya-crest-144.png', 'branding/aranya-wordmark-light-160.png', 'branding/aranya-wordmark-light-480.png', 'branding/aranya-wordmark-light.png', 'branding/botanical-pattern.jpg' ) as $extra ) {
		$paths[] = $extra;
	}
	return array_values( array_unique( $paths ) );
}

/** Files to copy for one path: the path plus its srcset ladder. */
function aranya_import_files_for( string $path ): array {
	$entry = aranya_media_manifest()[ basename( $path ) ] ?? null;
	if ( ! $entry ) {
		return array( $path );
	}
	$dir = dirname( $path );
	return array_map( static fn( $step ) => ( '.' === $dir ? '' : $dir . '/' ) . $step[0], $entry['ladder'] );
}

/**
 * True when a file is real media. A site that answers every unknown path with
 * its home page (a single-page app on Vercel does, with status 200) would
 * otherwise leave HTML saved under an image's name.
 */
function aranya_import_file_ok( string $file ): bool {
	if ( ! is_file( $file ) || 0 === filesize( $file ) ) {
		return false;
	}
	$ext = strtolower( pathinfo( $file, PATHINFO_EXTENSION ) );
	if ( in_array( $ext, array( 'jpg', 'jpeg', 'png', 'gif', 'webp', 'avif' ), true ) ) {
		return false !== wp_get_image_mime( $file );
	}
	return 1 !== preg_match( '/^\s*</', (string) file_get_contents( $file, false, null, 0, 64 ) ); // phpcs:ignore WordPress.WP.AlternativeFunctions
}

/**
 * Copies one file into uploads/aranya/. Returns 'kept' when a good copy was
 * already there, 'copied' after a fresh copy, or false on failure.
 *
 * @return string|false
 */
function aranya_import_copy( string $path ) {
	$uploads         = wp_get_upload_dir();
	$dest            = trailingslashit( $uploads['basedir'] ) . 'aranya/' . $path;
	[ $mode, $base ] = aranya_import_source();
	// A newer media pack may carry a changed file under the same name (a
	// re-rendered plan): a different size means copy it again.
	$newer = 'local' === $mode && is_file( $base . $path ) && is_file( $dest ) && filesize( $base . $path ) !== filesize( $dest );
	if ( ! $newer && aranya_import_file_ok( $dest ) ) {
		return 'kept';
	}
	if ( file_exists( $dest ) ) {
		wp_delete_file( $dest ); // A bad earlier download, or an older version.
	}
	wp_mkdir_p( dirname( $dest ) );
	$ok              = false;
	if ( 'local' === $mode ) {
		$ok = file_exists( $base . $path ) && copy( $base . $path, $dest );
	} elseif ( 'remote' === $mode ) {
		$res = wp_remote_get(
			$base . $path,
			array(
				'timeout'  => 60,
				'stream'   => true,
				'filename' => $dest,
			)
		);
		$ok  = ! is_wp_error( $res ) && 200 === wp_remote_retrieve_response_code( $res );
	}
	if ( ! $ok || ! aranya_import_file_ok( $dest ) ) {
		if ( file_exists( $dest ) ) {
			wp_delete_file( $dest );
		}
		return false;
	}
	return 'copied';
}

/**
 * Copies a path and its srcset ladder. Returns [all copied, any copied fresh].
 */
function aranya_import_copy_all( string $path ): array {
	$ok    = true;
	$fresh = false;
	foreach ( aranya_import_files_for( $path ) as $file ) {
		$result = aranya_import_copy( $file );
		$ok     = false !== $result && $ok;
		$fresh  = 'copied' === $result || $fresh;
	}
	return array( $ok, $fresh );
}

/**
 * Alt text the React site gives the main images; other images get their
 * card title, and the SEO team can edit any of them in the Media Library.
 */
function aranya_import_alt( string $path ): string {
	$map = array(
		'opt/life-garden-walk-2000.webp'         => 'A resident walking barefoot along a flowering garden path at Aranya The Park',
		'story-arrival-aerial.jpg'               => 'Aranya The Park — twin towers rising from a secluded green canopy beside the 18.3-metre boulevard',
		'opt/render-fitness-club-2600.webp'      => 'The clubhouse, lawns and children’s play area at Aranya The Park',
		'opt/life-skyline-night-2000.webp'       => 'Aranya The Park — Skyline Perspective & Developer Partnership',
		'opt/location-map-cropped-2800.webp'     => 'Aranya The Park — Regional Location Map',
		'branding/project-by-zaveri-bkm-light.png' => 'Project by Zaveri Realty & BKM Mindspace',
		'branding/aranya-logo.png'               => 'Aranya The Park Official Logo',
		'branding/zaveri-realty-logo.png'        => 'Zaveri Realty',
		'branding/bkm-mindspace-logo.png'        => 'BKM Mindspace',
		'rera-qr.png'                            => 'Scan to verify this project on the MahaRERA portal',
	);
	if ( isset( $map[ $path ] ) ) {
		return $map[ $path ];
	}
	foreach ( aranya_defaults( 'gallery' ) as $g ) {
		if ( $g['image'] === $path ) {
			return $g['title'];
		}
	}
	foreach ( aranya_defaults( 'floor_plans' ) as $p ) {
		if ( $p['image'] === $path ) {
			return $p['title'];
		}
	}
	foreach ( aranya_defaults( 'residences' ) as $u ) {
		if ( $u['image'] === $path ) {
			return $u['title'] . ' — ' . $u['type'] . ' Residence';
		}
	}
	foreach ( aranya_defaults( 'amenities' ) as $a ) {
		if ( $a['image'] === $path ) {
			return $a['name'] . ' at Aranya The Park';
		}
	}
	return '';
}

/**
 * Registers a copied file as an attachment (or returns the existing one).
 *
 * @param bool $refresh Rewrite an existing attachment's metadata (its file was just replaced).
 */
function aranya_import_attachment( string $path, bool $refresh = false ): int {
	$existing = get_posts(
		array(
			'post_type'   => 'attachment',
			'post_status' => 'inherit',
			'meta_key'    => '_aranya_source',
			'meta_value'  => $path,
			'fields'      => 'ids',
			'numberposts' => 1,
		)
	);
	if ( $existing && ! $refresh ) {
		return (int) $existing[0];
	}

	$uploads  = wp_get_upload_dir();
	$relative = 'aranya/' . $path;
	$file     = trailingslashit( $uploads['basedir'] ) . $relative;
	if ( ! file_exists( $file ) ) {
		return 0;
	}
	$type = wp_check_filetype( $file );
	if ( $existing ) {
		$id = (int) $existing[0];
	} else {
		$title = ucwords( trim( preg_replace( '/[-_]+/', ' ', preg_replace( '/-\d+$/', '', pathinfo( $path, PATHINFO_FILENAME ) ) ) ) );
		$id    = wp_insert_attachment(
			array(
				'post_title'     => $title,
				'post_mime_type' => $type['type'],
				'post_status'    => 'inherit',
				'guid'           => trailingslashit( $uploads['baseurl'] ) . $relative,
			),
			$file,
			0,
			true
		);
		if ( is_wp_error( $id ) ) {
			return 0;
		}
		update_post_meta( $id, '_aranya_source', $path );
	}

	if ( str_starts_with( (string) $type['type'], 'image/' ) ) {
		$entry = aranya_media_manifest()[ basename( $path ) ] ?? null;
		if ( $entry ) {
			$w     = (int) $entry['w'];
			$h     = (int) $entry['h'];
			$sizes = array();
			foreach ( $entry['ladder'] as [ $f, $step_w ] ) {
				if ( $f === basename( $path ) ) {
					continue;
				}
				$sizes[ 'aranya-' . $step_w ] = array(
					'file'      => $f,
					'width'     => (int) $step_w,
					'height'    => (int) round( $h * $step_w / $w ),
					'mime-type' => $type['type'],
				);
			}
		} else {
			$dims  = wp_getimagesize( $file );
			$w     = (int) ( $dims[0] ?? 0 );
			$h     = (int) ( $dims[1] ?? 0 );
			$sizes = array();
		}
		wp_update_attachment_metadata(
			$id,
			array(
				'width'      => $w,
				'height'     => $h,
				'file'       => $relative,
				'filesize'   => filesize( $file ),
				'sizes'      => $sizes,
				'image_meta' => array(),
			)
		);
		if ( ! $existing ) { // A refresh keeps the alt text and credit the team may have edited.
			update_post_meta( $id, '_wp_attachment_image_alt', aranya_import_alt( $path ) );
			if ( $entry && 'representative' === $entry['credit'] ) {
				update_post_meta( $id, '_aranya_credit_label', 'Representational image' );
			}
		}
	} else {
		wp_update_attachment_metadata(
			$id,
			array(
				'filesize'  => filesize( $file ),
				'mime_type' => $type['type'],
			)
		);
	}
	return (int) $id;
}

/** path => attachment id for everything imported so far. */
function aranya_import_attachment_map(): array {
	$map = array();
	$ids = get_posts(
		array(
			'post_type'   => 'attachment',
			'post_status' => 'inherit',
			'meta_key'    => '_aranya_source',
			'fields'      => 'ids',
			'numberposts' => -1,
		)
	);
	foreach ( $ids as $id ) {
		$map[ (string) get_post_meta( $id, '_aranya_source', true ) ] = (int) $id;
	}
	return $map;
}

/* ─── Elementor data ───────────────────────────────────────────────────── */

/**
 * Each Aranya widget's control defaults — the content a fresh widget shows.
 */
function aranya_widget_default_settings(): array {
	if ( ! did_action( 'elementor/loaded' ) ) {
		return array();
	}
	$out = array();
	foreach ( \Elementor\Plugin::instance()->widgets_manager->get_widget_types() as $name => $widget ) {
		if ( ! str_starts_with( $name, 'aranya-' ) ) {
			continue;
		}
		$settings = array();
		foreach ( $widget->get_controls() as $id => $control ) {
			if ( array_key_exists( 'default', $control ) && ! str_starts_with( $id, '_' ) && ! in_array( $control['type'], array( 'section', 'tab', 'tabs', 'raw_html', 'heading' ), true ) ) {
				$settings[ $id ] = $control['default'];
			}
		}
		$out[ $name ] = $settings;
	}
	return $out;
}

/**
 * Swaps default image URLs for Media Library references, and gives repeater
 * rows the _id Elementor expects.
 */
function aranya_link_media( $value, array $attachments ) {
	if ( is_array( $value ) ) {
		if ( array_key_exists( 'url', $value ) && array_key_exists( 'id', $value ) && is_string( $value['url'] ) ) {
			$path = aranya_asset_path_from_url( $value['url'] );
			if ( null !== $path && isset( $attachments[ $path ] ) ) {
				$id = $attachments[ $path ];
				return array(
					'url'    => (string) wp_get_attachment_url( $id ),
					'id'     => $id,
					'alt'    => '',
					'source' => 'library',
				);
			}
			return $value;
		}
		$is_list = array_is_list( $value );
		foreach ( $value as $k => $v ) {
			$value[ $k ] = aranya_link_media( $v, $attachments );
			if ( $is_list && is_array( $value[ $k ] ) && ! array_is_list( $value[ $k ] ) && ! isset( $value[ $k ]['_id'] ) && ! isset( $value[ $k ]['url'] ) ) {
				$value[ $k ]['_id'] = substr( md5( wp_json_encode( $v ) . $k ), 0, 7 );
			}
		}
	}
	return $value;
}

/** The name a section's container shows in Elementor's Navigator / Structure panel. */
function aranya_section_title( string $widget ): string {
	$titles = array(
		'aranya-navbar' => 'Navbar',
		'aranya-hero' => 'Hero — The Lushury Life',
		'aranya-story-greens' => 'Luxury, Made Lush',
		'aranya-residences' => 'Residences',
		'aranya-amenities' => 'Amenities',
		'aranya-location' => 'Location',
		'aranya-specifications' => 'Specifications',
		'aranya-floor-plans' => 'Floor Plans',
		'aranya-gallery' => 'Gallery',
		'aranya-developer' => 'Developers',
		'aranya-enquiry-cta' => 'Site Visit Form',
		'aranya-footer' => 'Footer',
		'aranya-sticky-bar' => 'Contact Closet',
		'aranya-enquiry-modal' => 'Enquiry Pop-up',
	);
	return $titles[ $widget ] ?? $widget;
}

/** A full-width, zero-padding container holding one widget. */
function aranya_container( string $widget, array $settings, string $seed ): array {
	return array(
		'id'       => substr( md5( 'c-' . $seed ), 0, 7 ),
		'elType'   => 'container',
		'isInner'  => false,
		'settings' => array(
			'_title'        => aranya_section_title( $widget ),
			'content_width' => 'full',
			'flex_gap'      => array(
				'column'   => '0',
				'row'      => '0',
				'isLinked' => true,
				'unit'     => 'px',
				'size'     => 0,
			),
			'padding'       => array(
				'unit'     => 'px',
				'top'      => '0',
				'right'    => '0',
				'bottom'   => '0',
				'left'     => '0',
				'isLinked' => true,
			),
		),
		'elements' => array(
			array(
				'id'         => substr( md5( 'w-' . $seed ), 0, 7 ),
				'elType'     => 'widget',
				'widgetType' => $widget,
				'settings'   => $settings,
				'elements'   => array(),
			),
		),
	);
}

/**
 * Saves Elementor data into a post (page or library template), then reads it
 * back. Returns null on success, or why the data did not stick.
 */
function aranya_save_elementor( int $post_id, array $elements, string $template_type = 'wp-page' ): ?string {
	global $wpdb;
	$json = wp_json_encode( $elements );
	if ( false === $json ) {
		return sprintf( '%s: the section data could not be encoded (%s).', get_the_title( $post_id ), json_last_error_msg() );
	}
	update_post_meta( $post_id, '_elementor_edit_mode', 'builder' );
	update_post_meta( $post_id, '_elementor_template_type', $template_type );
	update_post_meta( $post_id, '_elementor_version', defined( 'ELEMENTOR_VERSION' ) ? ELEMENTOR_VERSION : '' );
	update_post_meta( $post_id, '_elementor_data', wp_slash( $json ) );
	update_post_meta( $post_id, '_elementor_page_settings', array() );
	delete_post_meta( $post_id, '_elementor_css' );
	delete_post_meta( $post_id, '_elementor_element_cache' );
	delete_post_meta( $post_id, '_elementor_page_assets' );

	// Some hosts' meta filters unslash the value a second time, which breaks
	// the JSON (Hostinger's temporary-domain helper does, for any value holding
	// the temporary address). Then write the row directly.
	if ( ! aranya_elementor_data_ok( $post_id, count( $elements ) ) ) {
		$wpdb->last_error = '';
		$row              = array(
			'post_id'  => $post_id,
			'meta_key' => '_elementor_data', // phpcs:ignore WordPress.DB.SlowDBQuery
		);
		$wpdb->get_var( $wpdb->prepare( "SELECT meta_id FROM {$wpdb->postmeta} WHERE post_id = %d AND meta_key = '_elementor_data' LIMIT 1", $post_id ) )
			? $wpdb->update( $wpdb->postmeta, array( 'meta_value' => $json ), $row ) // phpcs:ignore WordPress.DB.SlowDBQuery
			: $wpdb->insert( $wpdb->postmeta, $row + array( 'meta_value' => $json ) ); // phpcs:ignore WordPress.DB.SlowDBQuery
		wp_cache_delete( $post_id, 'post_meta' );
		if ( ! aranya_elementor_data_ok( $post_id, count( $elements ) ) ) {
			return sprintf(
				/* translators: 1: post title, 2: database error */
				__( '%1$s: the section data did not save. %2$s', 'aranya' ),
				get_the_title( $post_id ),
				'' !== $wpdb->last_error ? $wpdb->last_error : __( 'The host changed the data as it was written.', 'aranya' )
			);
		}
	}
	return null;
}

/**
 * True when the stored Elementor data (read from the database, not the cache)
 * decodes to the expected number of top-level elements.
 */
function aranya_elementor_data_ok( int $post_id, int $expected ): bool {
	global $wpdb;
	$raw   = $wpdb->get_var( $wpdb->prepare( "SELECT meta_value FROM {$wpdb->postmeta} WHERE post_id = %d AND meta_key = '_elementor_data' ORDER BY meta_id DESC LIMIT 1", $post_id ) );
	$saved = json_decode( (string) $raw, true );
	return is_array( $saved ) && count( $saved ) === $expected;
}

/**
 * Finds or creates a post by our marker meta.
 */
function aranya_upsert_post( string $marker, array $postarr ): int {
	$found = get_posts(
		array(
			'post_type'   => $postarr['post_type'],
			'post_status' => 'any',
			'meta_key'    => '_aranya_marker',
			'meta_value'  => $marker,
			'fields'      => 'ids',
			'numberposts' => 1,
		)
	);
	if ( $found ) {
		return (int) $found[0];
	}
	$id = wp_insert_post( array_merge( array( 'post_status' => 'publish' ), $postarr ) );
	update_post_meta( $id, '_aranya_marker', $marker );
	return (int) $id;
}

/**
 * Elementor options, kit globals, templates, the Home page and SEO fields.
 */
function aranya_import_setup(): array {
	if ( ! did_action( 'elementor/loaded' ) ) {
		return array( 'error' => __( 'Elementor is not active.', 'aranya' ) );
	}
	// New image addresses (?v=…), so no CDN keeps serving an old copy of a file.
	update_option( 'aranya_media_version', (string) time() );
	$attachments = aranya_import_attachment_map();
	$defaults    = aranya_widget_default_settings();
	$widget      = static fn( string $name ) => aranya_link_media( $defaults[ $name ] ?? array(), $attachments );

	// Elementor: the design brings its own colours and type.
	update_option( 'elementor_disable_color_schemes', 'yes' );
	update_option( 'elementor_disable_typography_schemes', 'yes' );
	update_option( 'elementor_google_font', '0' );
	update_option( 'elementor_font_display', 'swap' );
	update_option( 'elementor_load_fa4_shim', '' );
	update_option( 'elementor_cpt_support', array( 'page', 'post' ) );
	aranya_import_kit();

	// Site basics.
	update_option( 'blogname', 'Aranya The Park' );
	update_option( 'blogdescription', 'A Serene Metropolitan Address' );
	if ( '' === (string) get_option( 'permalink_structure' ) ) {
		update_option( 'permalink_structure', '/%postname%/' );
	}

	// Header & footer templates.
	$header = aranya_upsert_post(
		'template-header',
		array(
			'post_type'  => 'elementor_library',
			'post_title' => 'Aranya Header',
		)
	);
	$errors   = array();
	$errors[] = aranya_save_elementor( $header, array( aranya_container( 'aranya-navbar', $widget( 'aranya-navbar' ), 'header' ) ), 'section' );
	wp_set_object_terms( $header, 'section', 'elementor_library_type' );

	$footer = aranya_upsert_post(
		'template-footer',
		array(
			'post_type'  => 'elementor_library',
			'post_title' => 'Aranya Footer',
		)
	);
	$errors[] = aranya_save_elementor(
		$footer,
		array(
			aranya_container( 'aranya-footer', $widget( 'aranya-footer' ), 'footer' ),
			aranya_container( 'aranya-sticky-bar', $widget( 'aranya-sticky-bar' ), 'sticky' ),
			aranya_container( 'aranya-enquiry-modal', $widget( 'aranya-enquiry-modal' ), 'modal' ),
		),
		'section'
	);
	wp_set_object_terms( $footer, 'section', 'elementor_library_type' );
	update_option(
		'aranya_templates',
		array(
			'header' => $header,
			'footer' => $footer,
		)
	);

	// Home.
	$home = aranya_upsert_post(
		'page-home',
		array(
			'post_type'  => 'page',
			'post_title' => 'Home',
			'post_name'  => 'home',
		)
	);
	$sections = array();
	foreach ( aranya_home_sections() as $i => $name ) {
		if ( isset( $defaults[ $name ] ) ) {
			$sections[] = aranya_container( $name, $widget( $name ), 'home-' . $i );
		}
	}
	$errors[] = aranya_save_elementor( $home, $sections );
	update_post_meta( $home, '_wp_page_template', 'default' );
	update_option( 'show_on_front', 'page' );
	update_option( 'page_on_front', $home );

	aranya_import_seo( $home, $attachments );

	flush_rewrite_rules();
	if ( class_exists( '\\Elementor\\Plugin' ) ) {
		\Elementor\Plugin::instance()->files_manager->clear_cache();
	}

	$errors = array_filter( $errors );
	if ( $errors ) {
		return array( 'error' => implode( ' ', $errors ) );
	}

	return array(
		'home'   => $home,
		'header' => $header,
		'footer' => $footer,
		'url'    => home_url( '/' ),
	);
}

/**
 * Brand colours and the font as Elementor Global Colors / Fonts, and a kit
 * layout that adds no padding or gaps around the sections.
 */
function aranya_import_kit(): void {
	$kit_id = \Elementor\Plugin::instance()->kits_manager->get_active_id();
	if ( ! $kit_id ) {
		return;
	}
	$settings = (array) get_post_meta( $kit_id, '_elementor_page_settings', true );
	$font     = static fn( $id, $title, $weight ) => array(
		'_id'                    => $id,
		'title'                  => $title,
		'typography_typography'  => 'custom',
		'typography_font_family' => 'Source Serif 4',
		'typography_font_weight' => $weight,
	);
	$settings = array_merge(
		$settings,
		array(
			'system_colors'         => array(
				array( '_id' => 'primary', 'title' => 'Champagne', 'color' => '#C8A96B' ),
				array( '_id' => 'secondary', 'title' => 'Forest', 'color' => '#071510' ),
				array( '_id' => 'text', 'title' => 'Ivory Muted', 'color' => '#B9B3A8' ),
				array( '_id' => 'accent', 'title' => 'Ivory', 'color' => '#F4F0E8' ),
			),
			'custom_colors'         => array(
				array( '_id' => 'aranya_forest_900', 'title' => 'Forest 900', 'color' => '#0A1C15' ),
				array( '_id' => 'aranya_forest_800', 'title' => 'Forest 800', 'color' => '#132E24' ),
				array( '_id' => 'aranya_gold_soft', 'title' => 'Antique Gold', 'color' => '#D8BD8C' ),
				array( '_id' => 'aranya_gold_pale', 'title' => 'Pale Gold', 'color' => '#EADBBA' ),
				array( '_id' => 'aranya_bronze', 'title' => 'Bronze', 'color' => '#8C7A5E' ),
			),
			'system_typography'     => array(
				$font( 'primary', 'Headings', '600' ),
				$font( 'secondary', 'Sub-headings', '600' ),
				$font( 'text', 'Body', '500' ),
				$font( 'accent', 'Labels', '700' ),
			),
			'container_width'       => array(
				'unit' => 'px',
				'size' => 1320,
			),
			'space_between_widgets' => array(
				'column'   => '0',
				'row'      => '0',
				'isLinked' => true,
				'unit'     => 'px',
				'size'     => 0,
			),
			'container_padding'     => array(
				'unit'     => 'px',
				'top'      => '0',
				'right'    => '0',
				'bottom'   => '0',
				'left'     => '0',
				'isLinked' => true,
			),
		)
	);
	update_post_meta( $kit_id, '_elementor_page_settings', $settings );
	delete_post_meta( $kit_id, '_elementor_css' );
}

/**
 * Home's SEO fields, from the React index.html. Written for both Rank Math and
 * Yoast so whichever the SEO team installs starts from the live values.
 */
function aranya_import_seo( int $home, array $attachments ): void {
	$title       = 'Aranya The Park, Malad West | Luxury 2, 3 & 5 BHK Residences in Mumbai';
	$description = 'Aranya The Park, Malad West, Mumbai. Spacious, Vastu-compliant 2, 3 & 5 BHK residences, 40% open green spaces, rooftop amenities and an 18.3 m access road to New Link Road.';
	$og_title    = 'Aranya The Park | The Lushury Life at Malad West, Mumbai';
	$og_desc     = 'A serene metropolitan address behind Evershine Mall, Malad West. 2, 3 & 5 BHK residences with 40% open green spaces.';
	$og_id       = $attachments['og-image.jpg'] ?? 0;
	$og_url      = $og_id ? (string) wp_get_attachment_url( $og_id ) : '';

	$meta = array(
		'rank_math_title'                 => $title,
		'rank_math_description'           => $description,
		'rank_math_focus_keyword'         => 'Aranya The Park,Aranya The Park Malad West,Luxury Apartments Malad West',
		'rank_math_facebook_title'        => $og_title,
		'rank_math_facebook_description'  => $og_desc,
		'rank_math_facebook_image'        => $og_url,
		'rank_math_facebook_image_id'     => $og_id,
		'rank_math_twitter_use_facebook'  => 'on',
		'_yoast_wpseo_title'              => $title,
		'_yoast_wpseo_metadesc'           => $description,
		'_yoast_wpseo_focuskw'            => 'Aranya The Park',
		'_yoast_wpseo_opengraph-title'    => $og_title,
		'_yoast_wpseo_opengraph-description' => $og_desc,
		'_yoast_wpseo_opengraph-image'    => $og_url,
		'_yoast_wpseo_opengraph-image-id' => $og_id,
	);
	foreach ( $meta as $key => $value ) {
		$current = (string) get_post_meta( $home, $key, true );
		// Fill empty fields; also replace our own earlier text that promised every
		// home a sundeck (only the 5 BHK has one). The SEO team's edits are kept.
		if ( '' === $current || str_contains( $current, 'residences with private sundecks' ) ) {
			update_post_meta( $home, $key, $value );
		}
	}
	if ( $og_id ) {
		set_post_thumbnail( $home, $og_id );
	}
}

/* ─── Admin UI ─────────────────────────────────────────────────────────── */

function aranya_importer_ajax() {
	check_ajax_referer( 'aranya_import' );
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_send_json_error( __( 'Not allowed.', 'aranya' ) );
	}
	@set_time_limit( 300 ); // phpcs:ignore WordPress.PHP.NoSilencedErrors
	$step = sanitize_key( $_POST['step'] ?? '' );

	if ( 'source' === $step ) {
		$url = esc_url_raw( wp_unslash( $_POST['source'] ?? '' ) );
		update_option( 'aranya_media_source', untrailingslashit( $url ) );
		wp_send_json_success( array( 'total' => count( aranya_import_media_list() ) ) );
	}

	if ( 'media' === $step ) {
		[ $mode ] = aranya_import_source();
		if ( 'none' === $mode ) {
			wp_send_json_error( __( 'No media source: extract aranya-media.zip into wp-content/uploads/aranya-import/, or enter the media source URL.', 'aranya' ) );
		}
		$list   = aranya_import_media_list();
		$offset = max( 0, (int) ( $_POST['offset'] ?? 0 ) );
		$batch  = array_slice( $list, $offset, 'local' === $mode ? 25 : 6 );
		$failed = array();
		foreach ( $batch as $path ) {
			[ $ok, $fresh ] = aranya_import_copy_all( $path );
			if ( ! $ok || ! aranya_import_attachment( $path, $fresh ) ) {
				$failed[] = $path;
			}
		}
		wp_send_json_success(
			array(
				'next'   => $offset + count( $batch ),
				'total'  => count( $list ),
				'failed' => $failed,
			)
		);
	}

	if ( 'setup' === $step ) {
		$result = aranya_import_setup();
		isset( $result['error'] ) ? wp_send_json_error( $result['error'] ) : wp_send_json_success( $result );
	}

	wp_send_json_error( 'Unknown step.' );
}

/**
 * Unpacks an uploaded aranya-media.zip into uploads/aranya-import/, for hosts
 * where FTP or a file manager is not to hand. Only media files are kept.
 */
function aranya_media_upload() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'Not allowed.', 'aranya' ) );
	}
	check_admin_referer( 'aranya_media_upload' );
	$back = admin_url( 'admin.php?page=aranya-install' );
	$file = $_FILES['aranya_media_zip'] ?? null; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
	if ( ! is_array( $file ) || UPLOAD_ERR_OK !== ( $file['error'] ?? UPLOAD_ERR_NO_FILE ) || 'zip' !== strtolower( pathinfo( (string) $file['name'], PATHINFO_EXTENSION ) ) ) {
		wp_safe_redirect( add_query_arg( 'aranya_media', 'bad-upload', $back ) );
		exit;
	}
	require_once ABSPATH . 'wp-admin/includes/file.php';
	WP_Filesystem();
	$uploads = wp_get_upload_dir();
	$target  = trailingslashit( $uploads['basedir'] ) . 'aranya-import';
	$result  = unzip_file( $file['tmp_name'], $target );
	wp_delete_file( $file['tmp_name'] );
	if ( is_dir( $target ) ) {
		$files = new RecursiveIteratorIterator( new RecursiveDirectoryIterator( $target, FilesystemIterator::SKIP_DOTS ) );
		foreach ( $files as $f ) {
			// Media only (the e-brochure is a PDF); anything else, such as a script, is dropped.
			if ( $f->isFile() && ! in_array( strtolower( $f->getExtension() ), array( 'webp', 'jpg', 'jpeg', 'png', 'gif', 'avif', 'mp4', 'webm', 'pdf' ), true ) ) {
				wp_delete_file( $f->getPathname() );
			}
		}
	}
	$status = is_wp_error( $result ) ? 'unzip-failed' : ( is_dir( $target . '/opt' ) ? 'ok' : 'wrong-zip' );
	wp_safe_redirect( add_query_arg( 'aranya_media', $status, $back ) );
	exit;
}

function aranya_importer_page() {
	[ $mode, $base ] = aranya_import_source();
	$templates        = (array) get_option( 'aranya_templates', array() );
	$notices          = array(
		'ok'           => array( 'success', __( 'Media pack unpacked. Press “Install content” to import it.', 'aranya' ) ),
		'bad-upload'   => array( 'error', __( 'Choose the aranya-media.zip file to upload.', 'aranya' ) ),
		'unzip-failed' => array( 'error', __( 'The zip could not be unpacked. Try again, or extract it into wp-content/uploads/aranya-import/ by FTP.', 'aranya' ) ),
		'wrong-zip'    => array( 'error', __( 'That zip is not the Aranya media pack (it has no opt/ folder).', 'aranya' ) ),
	);
	$notice           = $notices[ sanitize_key( wp_unslash( $_GET['aranya_media'] ?? '' ) ) ] ?? null; // phpcs:ignore WordPress.Security.NonceVerification
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Aranya — Install Content', 'aranya' ); ?></h1>
		<?php if ( $notice ) : ?>
			<div class="notice notice-<?php echo esc_attr( $notice[0] ); ?>"><p><?php echo esc_html( $notice[1] ); ?></p></div>
		<?php endif; ?>
		<p><?php esc_html_e( 'Builds the site: imports the images and films into the Media Library, creates the header and footer templates and the Home page with every section, and sets Elementor up for the design. Safe to run again — existing media are reused and pages are rebuilt from the defaults (edits made in Elementor to Home, the header and the footer are replaced).', 'aranya' ); ?></p>
		<table class="form-table" role="presentation">
			<tr>
				<th scope="row"><?php esc_html_e( 'Media source', 'aranya' ); ?></th>
				<td>
					<?php if ( 'local' === $mode ) : ?>
						<p>✔ <?php echo esc_html( sprintf( __( 'Using the media folder: %s', 'aranya' ), $base ) ); ?></p>
					<?php endif; ?>
					<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" enctype="multipart/form-data" style="margin:12px 0">
						<input type="hidden" name="action" value="aranya_media_upload">
						<?php wp_nonce_field( 'aranya_media_upload' ); ?>
						<input type="file" name="aranya_media_zip" id="aranya-media-zip" accept=".zip,application/zip">
						<button type="submit" class="button" id="aranya-media-upload"><?php esc_html_e( 'Upload media pack', 'aranya' ); ?></button>
						<p class="description">
							<?php
							'local' === $mode
								? esc_html_e( 'A newer pack (the full aranya-media.zip or an update with just the changed files) is unpacked over the folder; Install content then replaces the changed files.', 'aranya' )
								: esc_html_e( 'Upload aranya-media.zip (about 55 MB). Or extract it into wp-content/uploads/aranya-import/ by FTP and reload this page.', 'aranya' );
							?>
						</p>
					</form>
					<?php if ( 'local' !== $mode ) : ?>
						<input type="url" id="aranya-source" class="regular-text" value="<?php echo esc_attr( (string) get_option( 'aranya_media_source', '' ) ); ?>" placeholder="https://aranya-the-park.vercel.app">
						<p class="description"><?php esc_html_e( 'Or the address of a live copy of the React site to download the media from. It must be the current build: files it does not have are reported as failed.', 'aranya' ); ?></p>
					<?php endif; ?>
				</td>
			</tr>
			<tr>
				<th scope="row"><?php esc_html_e( 'Status', 'aranya' ); ?></th>
				<td id="aranya-status">
					<?php
					echo ! empty( $templates['header'] )
						? esc_html__( 'Installed. Run again to rebuild Home, header and footer from the defaults.', 'aranya' )
						: esc_html__( 'Not installed yet.', 'aranya' );
					?>
				</td>
			</tr>
		</table>
		<p>
			<button type="button" class="button button-primary button-hero" id="aranya-run"><?php esc_html_e( 'Install content', 'aranya' ); ?></button>
		</p>
		<pre id="aranya-log" style="max-height:320px;overflow:auto;background:#0a1c15;color:#EADBBA;padding:12px;display:none"></pre>
	</div>
	<script>
	(function () {
		var btn = document.getElementById('aranya-run');
		var log = document.getElementById('aranya-log');
		var status = document.getElementById('aranya-status');
		var nonce = <?php echo wp_json_encode( wp_create_nonce( 'aranya_import' ) ); ?>;
		function post(data) {
			data._ajax_nonce = nonce;
			data.action = 'aranya_import';
			return fetch(ajaxurl, { method: 'POST', credentials: 'same-origin', body: new URLSearchParams(data) }).then(function (r) { return r.json(); });
		}
		function write(line) { log.style.display = 'block'; log.textContent += line + '\n'; log.scrollTop = log.scrollHeight; }
		async function run() {
			btn.disabled = true;
			var src = document.getElementById('aranya-source');
			if (src) { await post({ step: 'source', source: src.value }); }
			var offset = 0, total = 1, failed = [];
			while (offset < total) {
				var r = await post({ step: 'media', offset: offset });
				if (!r.success) { write('✖ ' + r.data); btn.disabled = false; return; }
				offset = r.data.next; total = r.data.total; failed = failed.concat(r.data.failed);
				status.textContent = 'Media ' + offset + ' / ' + total;
				write('Media ' + offset + ' / ' + total + (r.data.failed.length ? '  (failed: ' + r.data.failed.join(', ') + ')' : ''));
			}
			write('Setting up Elementor, templates and Home…');
			var s = await post({ step: 'setup' });
			if (!s.success) { write('✖ ' + s.data); btn.disabled = false; return; }
			status.innerHTML = '✔ Done. <a href="' + s.data.url + '" target="_blank">View site</a>';
			write('✔ Done' + (failed.length ? ' — ' + failed.length + ' media failed; run again to retry.' : '.'));
			btn.disabled = false;
		}
		btn.addEventListener('click', run);
	})();
	</script>
	<?php
}

/* ─── WP-CLI ───────────────────────────────────────────────────────────── */

if ( defined( 'WP_CLI' ) && WP_CLI ) {
	/**
	 * `wp aranya install [--source=<url>]` — same as the admin button.
	 */
	WP_CLI::add_command(
		'aranya install',
		static function ( $args, $assoc ) {
			if ( ! empty( $assoc['source'] ) ) {
				update_option( 'aranya_media_source', untrailingslashit( esc_url_raw( $assoc['source'] ) ) );
			}
			$list = aranya_import_media_list();
			foreach ( $list as $i => $path ) {
				[ $ok, $fresh ] = aranya_import_copy_all( $path );
				( $ok && aranya_import_attachment( $path, $fresh ) ) || WP_CLI::warning( "Media failed: $path" );
				WP_CLI::log( sprintf( 'Media %d/%d %s', $i + 1, count( $list ), $path ) );
			}
			$result = aranya_import_setup();
			isset( $result['error'] ) ? WP_CLI::error( $result['error'] ) : WP_CLI::success( 'Installed: ' . $result['url'] );
		}
	);
}
