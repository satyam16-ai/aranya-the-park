<?php
/**
 * Elementor integration: the "Aranya The Park" widget category, the widgets,
 * and the editor-only styles that make fixed/hidden pieces (navbar, sticky bar,
 * modals) selectable while editing.
 *
 * @package Aranya
 */

defined( 'ABSPATH' ) || exit;

/**
 * Widget classes, in the order they appear in the panel.
 */
function aranya_widget_classes(): array {
	return array(
		'navbar'         => 'Navbar',
		'hero'           => 'Hero',
		'story-greens'   => 'Story_Greens',
		'residences'     => 'Residences',
		'amenities'      => 'Amenities',
		'location'       => 'Location',
		'specifications' => 'Specifications',
		'floor-plans'    => 'Floor_Plans',
		'gallery'        => 'Gallery',
		'developer'      => 'Developer',
		'enquiry-cta'    => 'Enquiry_CTA',
		'footer'         => 'Footer',
		'sticky-bar'     => 'Sticky_Bar',
		'enquiry-modal'  => 'Enquiry_Modal',
		'section-heading' => 'Section_Heading',
	);
}

/**
 * Default widget content generated from the React data (includes/defaults.php).
 */
function aranya_defaults( string $key ) {
	static $defaults = null;
	if ( null === $defaults ) {
		$defaults = require ARANYA_DIR . 'includes/defaults.php';
	}
	return $defaults[ $key ] ?? array();
}

add_action(
	'elementor/elements/categories_registered',
	static function ( $elements_manager ) {
		$elements_manager->add_category(
			'aranya',
			array(
				'title' => __( 'Aranya The Park', 'aranya' ),
				'icon'  => 'eicon-home',
			)
		);
	}
);

add_action(
	'elementor/widgets/register',
	static function ( $widgets_manager ) {
		require_once ARANYA_DIR . 'includes/widgets/class-widget-base.php';
		foreach ( aranya_widget_classes() as $file => $class ) {
			$path = ARANYA_DIR . 'includes/widgets/class-' . $file . '.php';
			if ( ! file_exists( $path ) ) {
				continue;
			}
			require_once $path;
			$fqcn = '\\Aranya\\Widgets\\' . $class;
			$widgets_manager->register( new $fqcn() );
		}
	}
);

/**
 * Editor-only: fixed and hidden widgets get a visible, clickable stand-in so
 * they can be selected and edited on the canvas.
 */
add_action(
	'elementor/preview/enqueue_styles',
	static function () {
		wp_add_inline_style(
			'aranya',
			'.aranya-editor-note{display:flex;align-items:center;gap:.6rem;padding:.9rem 1.2rem;margin:.5rem;border:1px dashed rgba(200,169,107,.5);border-radius:6px;background:rgba(10,28,21,.92);color:#D8BD8C;font:600 12px/1.4 "Source Serif 4",Georgia,serif;letter-spacing:.08em;text-transform:uppercase}'
		);
	}
);
