<?php
/**
 * Aranya theme — setup.
 *
 * The theme is deliberately thin. Everything that makes the site look and work
 * like the approved design is in the Aranya Core plugin; the theme provides the
 * document shell (the same wrapper the React app renders into), prints the
 * header/footer Elementor templates, and styles blog posts and plain pages.
 *
 * @package Aranya
 */

defined( 'ABSPATH' ) || exit;

add_action(
	'after_setup_theme',
	static function () {
		add_theme_support( 'title-tag' ); // The SEO plugin controls <title>.
		add_theme_support( 'post-thumbnails' );
		add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
		add_theme_support( 'responsive-embeds' );
		add_theme_support( 'automatic-feed-links' );
		load_theme_textdomain( 'aranya', get_template_directory() . '/languages' );
	}
);

/**
 * Elementor Pro Theme Builder: header/footer templates made there take over.
 */
add_action(
	'elementor/theme/register_locations',
	static function ( $manager ) {
		$manager->register_core_location( 'header' );
		$manager->register_core_location( 'footer' );
	}
);

/**
 * The React index.html body classes.
 */
add_filter(
	'body_class',
	static function ( $classes ) {
		return array_merge( $classes, array( 'bg-[#080908]', 'text-[#F4F0E8]', 'font-sans', 'antialiased', 'selection:bg-[#C8A96B]', 'selection:text-[#080908]' ) );
	}
);

add_action(
	'wp_enqueue_scripts',
	static function () {
		wp_enqueue_style( 'aranya-theme', get_stylesheet_uri(), array(), wp_get_theme()->get( 'Version' ) );
	},
	5
);

/**
 * Prints an Aranya header/footer template (Templates → Saved Templates).
 *
 * @param string $slot 'header' | 'footer'.
 */
function aranya_theme_template( string $slot ): void {
	if ( function_exists( 'elementor_theme_do_location' ) && elementor_theme_do_location( $slot ) ) {
		return; // Elementor Pro Theme Builder handled it.
	}
	$ids = (array) get_option( 'aranya_templates', array() );
	$id  = (int) ( $ids[ $slot ] ?? 0 );
	if ( $id && 'publish' === get_post_status( $id ) && class_exists( '\\Elementor\\Plugin' ) ) {
		// Lets widgets know they are part of the page chrome, not the page being edited.
		$GLOBALS['aranya_in_theme_template'] = true;
		echo \Elementor\Plugin::instance()->frontend->get_builder_content_for_display( $id, true ); // phpcs:ignore WordPress.Security.EscapeOutput -- Elementor output.
		$GLOBALS['aranya_in_theme_template'] = false;
		return;
	}
	get_template_part( 'template-parts/fallback', $slot );
}

/**
 * True when the current singular item is built with Elementor.
 */
function aranya_theme_is_elementor(): bool {
	if ( ! is_singular() || ! class_exists( '\\Elementor\\Plugin' ) ) {
		return false;
	}
	$doc = \Elementor\Plugin::instance()->documents->get( get_the_ID() );
	return $doc && $doc->is_built_with_elementor();
}
