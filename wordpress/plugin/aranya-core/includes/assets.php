<?php
/**
 * Front-end assets: the self-hosted font, the compiled design system and the
 * site script (with its bundled Alpine.js); plus the <head> hints that keep the first paint as fast
 * as the React build (hero LCP preload, font preload).
 *
 * @package Aranya
 */

defined( 'ABSPATH' ) || exit;

add_action( 'wp_enqueue_scripts', 'aranya_enqueue_assets', 20 );
add_action( 'wp_head', 'aranya_head_hints', 1 );

function aranya_asset_version( string $relative ): string {
	$file = ARANYA_DIR . $relative;
	return file_exists( $file ) ? ARANYA_VERSION . '.' . filemtime( $file ) : ARANYA_VERSION;
}

function aranya_enqueue_assets() {
	wp_enqueue_style( 'aranya-fonts', ARANYA_URL . 'assets/fonts/fonts.css', array(), aranya_asset_version( 'assets/fonts/fonts.css' ) );
	wp_enqueue_style( 'aranya', ARANYA_URL . 'assets/css/aranya.css', array( 'aranya-fonts' ), aranya_asset_version( 'assets/css/aranya.css' ) );

	// One deferred file: the site's Alpine components with their own private
	// copy of Alpine.js (see build/build-js.mjs).
	wp_register_script(
		'aranya',
		ARANYA_URL . 'assets/js/aranya.js',
		array(),
		aranya_asset_version( 'assets/js/aranya.js' ),
		array(
			'in_footer' => true,
			'strategy'  => 'defer',
		)
	);

	wp_localize_script(
		'aranya',
		'AranyaConfig',
		array(
			'rest'         => esc_url_raw( rest_url( 'aranya/v1/' ) ),
			'nonce'        => is_user_logged_in() ? wp_create_nonce( 'wp_rest' ) : '',
			'home'         => esc_url_raw( home_url( '/' ) ),
			'popupEnabled' => '1' === aranya_setting( 'popup_enabled' ),
			'popupDelay'   => max( 0, (int) aranya_setting( 'popup_delay' ) ) * 1000,
			'brochure'     => esc_url_raw( aranya_brochure_url() ),
			'editor'       => aranya_is_editor(),
		)
	);
	wp_enqueue_script( 'aranya' );

	// Pages built with Elementor use none of WordPress's block styles, and their
	// unlayered rules would outrank the Tailwind layers. Blog posts keep them.
	if ( aranya_is_elementor_page() ) {
		wp_dequeue_style( 'wp-block-library' );
		wp_dequeue_style( 'wp-block-library-theme' );
		wp_dequeue_style( 'classic-theme-styles' );
		wp_dequeue_style( 'global-styles' );
	}
}

/**
 * True on a singular page whose content is built with Elementor.
 */
function aranya_is_elementor_page(): bool {
	if ( ! is_singular() || ! did_action( 'elementor/loaded' ) ) {
		return false;
	}
	return \Elementor\Plugin::instance()->documents->get( get_queried_object_id() )?->is_built_with_elementor() ?? false;
}

/**
 * Preloads the latin text cut of the font and, on a page with the Aranya Hero,
 * the hero's first frame — the LCP image — exactly as index.html does.
 */
function aranya_head_hints() {
	printf(
		'<link rel="preload" href="%s" as="font" type="font/woff2" crossorigin>' . "\n",
		esc_url( ARANYA_URL . 'assets/fonts/source-serif-4-normal-latin.woff2' )
	);

	$slide = aranya_first_hero_slide();
	if ( ! $slide ) {
		return;
	}
	$info = aranya_image_info( $slide );
	if ( '' === $info['src'] ) {
		return;
	}
	printf(
		'<link rel="preload" as="image" href="%s"%s imagesizes="100vw" fetchpriority="high">' . "\n",
		esc_url( $info['src'] ),
		'' !== $info['srcset'] ? ' imagesrcset="' . esc_attr( $info['srcset'] ) . '"' : ''
	);
}

/**
 * The first slide image of the first Aranya Hero on the current page, read from
 * the Elementor data so the preload follows whatever the editor chose.
 */
function aranya_first_hero_slide() {
	if ( ! is_singular() ) {
		return null;
	}
	$raw = get_post_meta( get_queried_object_id(), '_elementor_data', true );
	if ( ! $raw ) {
		return null;
	}
	$data = is_array( $raw ) ? $raw : json_decode( $raw, true );
	$find = static function ( $elements ) use ( &$find ) {
		foreach ( (array) $elements as $el ) {
			if ( 'widget' === ( $el['elType'] ?? '' ) && 'aranya-hero' === ( $el['widgetType'] ?? '' ) ) {
				return $el['settings']['slides'][0]['image'] ?? null;
			}
			$found = $find( $el['elements'] ?? array() );
			if ( $found ) {
				return $found;
			}
		}
		return null;
	};
	$image = $find( $data );
	// Widget defaults are not stored in the page data; fall back to the default first frame.
	return $image ?? ( is_array( $data ) && str_contains( (string) wp_json_encode( $data ), '"aranya-hero"' ) ? 'opt/life-garden-walk-2000.webp' : null );
}
