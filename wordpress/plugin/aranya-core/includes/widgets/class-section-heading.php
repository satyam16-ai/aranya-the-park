<?php
/**
 * Aranya Section Heading — common/SectionHeading.tsx as a building block.
 *
 * For new sections and landing pages made from native Elementor widgets: the
 * site's eyebrow / uppercase serif title / subtitle unit, at the same sizes.
 *
 * @package Aranya
 */

namespace Aranya\Widgets;

defined( 'ABSPATH' ) || exit;

class Section_Heading extends Widget_Base {

	public function get_name() {
		return 'aranya-section-heading';
	}

	public function get_title() {
		return __( 'Aranya Section Heading', 'aranya' );
	}

	public function get_icon() {
		return 'eicon-heading';
	}

	public function get_keywords() {
		return array( 'aranya', 'heading', 'title' );
	}

	protected function register_controls() {
		$this->section( 'content', __( 'Heading', 'aranya' ) );
		$this->heading_controls( 'Eyebrow', 'Section Title', '' );
		$this->select(
			'align',
			__( 'Alignment', 'aranya' ),
			array(
				'left'   => __( 'Left (house style)', 'aranya' ),
				'center' => __( 'Centre', 'aranya' ),
			),
			'left'
		);
		$this->select(
			'theme',
			__( 'Background', 'aranya' ),
			array(
				'dark'  => __( 'On dark', 'aranya' ),
				'light' => __( 'On light', 'aranya' ),
			),
			'dark'
		);
		$this->end_section();
	}

	protected function render() {
		$s = $this->get_settings_for_display();
		$this->print_section_heading( $s, '', $s['align'], $s['theme'] );
	}
}
