<?php
/**
 * Aranya Gallery — sections/Gallery.tsx.
 *
 * Category pills and the image grid; a card opens the gallery's own lightbox
 * with previous/next through the current filter.
 *
 * @package Aranya
 */

namespace Aranya\Widgets;

defined( 'ABSPATH' ) || exit;

class Gallery extends Widget_Base {

	public function get_name() {
		return 'aranya-gallery';
	}

	public function get_title() {
		return __( 'Aranya Gallery', 'aranya' );
	}

	public function get_icon() {
		return 'eicon-gallery-masonry';
	}

	private static function categories(): array {
		return array(
			'exterior'     => __( 'Exterior', 'aranya' ),
			'interior'     => __( 'Interior', 'aranya' ),
			'amenities'    => __( 'Amenities', 'aranya' ),
			'lifestyle'    => __( 'Lifestyle', 'aranya' ),
			'architecture' => __( 'Architecture', 'aranya' ),
		);
	}

	protected function register_controls() {
		$this->section( 'heading', __( 'Heading', 'aranya' ) );
		$this->heading_controls( 'Gallery', 'A Closer Look', 'The architecture, the homes, the amenities and the gardens, in pictures.' );
		$this->end_section();

		$this->section( 'tabs_section', __( 'Filter tabs', 'aranya' ) );
		$this->repeater(
			'tabs',
			__( 'Tabs', 'aranya' ),
			function ( $r ) {
				$this->select( 'value', __( 'Shows', 'aranya' ), array_merge( array( 'all' => __( 'All', 'aranya' ) ), self::categories() ), 'all', array(), $r );
				$this->text( 'label', __( 'Label', 'aranya' ), '', array(), $r );
			},
			array(
				array( 'value' => 'all', 'label' => 'All' ),
				array( 'value' => 'exterior', 'label' => 'Exterior' ),
				array( 'value' => 'interior', 'label' => 'Interior' ),
				array( 'value' => 'amenities', 'label' => 'Amenities' ),
				array( 'value' => 'lifestyle', 'label' => 'Lifestyle' ),
				array( 'value' => 'architecture', 'label' => 'Architecture' ),
			),
			'{{{ label }}}'
		);
		$this->end_section();

		$this->section( 'items_section', __( 'Images', 'aranya' ) );
		$this->repeater(
			'items',
			__( 'Images', 'aranya' ),
			function ( $r ) {
				$this->media( 'image', __( 'Image', 'aranya' ), '', array(), $r );
				$this->text( 'title', __( 'Title', 'aranya' ), '', array(), $r );
				$this->select( 'category', __( 'Category', 'aranya' ), self::categories(), 'exterior', array(), $r );
				$this->text( 'extra_categories', __( 'Also show under (comma-separated)', 'aranya' ), '', array( 'description' => __( 'exterior, interior, amenities, lifestyle, architecture', 'aranya' ) ), $r );
				$this->text( 'category_label', __( 'Label on the card', 'aranya' ), '', array(), $r );
				$this->textarea( 'caption', __( 'Lightbox caption', 'aranya' ), '', array( 'rows' => 2 ), $r );
				$this->text( 'focus', __( 'Crop focus (optional)', 'aranya' ), '', array( 'description' => __( 'CSS object-position, e.g. "center 28%" keeps a tall render\'s crown in the card.', 'aranya' ) ), $r );
				$this->alt( 'image_alt', $r );
			},
			self::media_rows(
				array_map(
					static function ( $g ) {
						unset( $g['item_id'] );
						return $g;
					},
					aranya_defaults( 'gallery' )
				),
				array( 'image' )
			),
			'{{{ title }}}'
		);
		$this->end_section();

		$this->section( 'section_settings', __( 'Section', 'aranya' ) );
		$this->anchor( 'gallery' );
		$this->end_section();
	}

	protected function render() {
		$s     = $this->get_settings_for_display();
		$items = array();
		foreach ( array_values( (array) $s['items'] ) as $i => $g ) {
			$info    = aranya_image_info( $g['image'] );
			$items[] = array(
				'id'          => 'g' . $i,
				'cat'         => $g['category'],
				'cats'        => array_values( array_filter( array_map( 'trim', explode( ',', (string) $g['extra_categories'] ) ) ) ),
				'url'         => $info['src'],
				'title'       => $g['title'],
				'description' => $g['caption'],
				'category'    => $g['category_label'],
				'credit'      => $info['credit'],
			);
		}
		$on  = 'bg-champagne-400 border-champagne-300 text-dark-950 font-semibold shadow-[0_4px_20px_rgba(200,169,107,0.25)]';
		$off = 'bg-white/[0.03] border-white/[0.08] text-ivory-muted hover:text-ivory hover:bg-white/[0.08]';
		?>
		<section id="<?php echo esc_attr( $s['anchor'] ); ?>" ar-data="gallery(<?php echo esc_attr( aranya_json( array( 'items' => $items ) ) ); ?>)" class="section-spacing bg-dark-950 relative isolate overflow-hidden border-t border-white/[0.06]">
			<?php $this->print_backdrop(); ?>

			<div class="<?php echo esc_attr( self::container_class( 'showcase', 'relative z-10' ) ); ?>">
				<?php $this->print_section_heading( $s ); ?>

				<div class="flex items-center justify-start gap-2 sm:gap-3 overflow-x-auto overflow-touch pb-3 sm:pb-0 px-1 sm:px-0 mb-6 sm:mb-7">
					<?php
					foreach ( (array) $s['tabs'] as $i => $tab ) :
						$jv = wp_json_encode( $tab['value'] );
						?>
						<button ar-on:click="setTab(<?php echo esc_attr( $jv ); ?>)" class="<?php echo esc_attr( 'px-5 py-2.5 font-sans text-xs tracking-wider uppercase whitespace-nowrap shrink-0 transition-all duration-300 cursor-pointer rounded-full border ' . ( 'all' === $tab['value'] ? $on : $off ) ); ?>" ar-bind:class="<?php echo esc_attr( "{ '$on': activeTab === $jv, '$off': activeTab !== $jv }" ); ?>"><?php echo esc_html( $tab['label'] ); ?></button>
					<?php endforeach; ?>
				</div>

				<div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
					<?php
					foreach ( array_values( (array) $s['items'] ) as $i => $g ) :
						$focus = trim( (string) $g['focus'] );
						?>
						<div ar-show="inTab('g<?php echo (int) $i; ?>')" ar-on:click="openItem('g<?php echo (int) $i; ?>')" class="relative overflow-hidden cursor-pointer group rounded-[4px] border border-white/[0.08] bg-dark-900 transition-all duration-500 hover:border-champagne-400/40 shadow-[0_15px_35px_rgba(0,0,0,0.6)] aspect-[4/3]">
							<?php
							echo aranya_img(
								$g['image'],
								array(
									'alt'     => '' !== $g['image_alt'] ? $g['image_alt'] : null,
									'default_alt' => $g['title'],
									'sizes'   => '(min-width: 1024px) 490px, (min-width: 640px) 50vw, 100vw',
									'loading' => 'lazy',
									'class'   => 'w-full h-full object-cover ' . ( '' === $focus ? 'object-center ' : '' ) . 'group-hover:scale-105 transition-transform duration-700 ease-out brightness-[0.88] group-hover:brightness-100',
									'attrs'   => '' === $focus ? array() : array( 'style' => 'object-position: ' . $focus ),
								)
							);
							echo aranya_image_credit( $g['image'], 'absolute top-3 right-3 z-10' );
							?>
							<div class="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-dark-950/20 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-300"></div>
							<div class="absolute bottom-0 inset-x-0 p-5 sm:p-6 flex items-end justify-between gap-3">
								<div>
									<span class="text-[10px] font-sans uppercase tracking-[0.25em] text-champagne-300 block mb-1"><?php echo esc_html( $g['category_label'] ); ?></span>
									<h3 class="font-serif text-lg sm:text-xl text-ivory font-light group-hover:text-champagne-200 transition-colors"><?php echo esc_html( $g['title'] ); ?></h3>
								</div>
								<div class="w-9 h-9 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/[0.12] flex items-center justify-center text-champagne-300 group-hover:bg-champagne-400 group-hover:text-dark-950 transition-all duration-300 shrink-0">
									<?php echo aranya_icon( 'maximize-2', 14 ); ?>
								</div>
							</div>
						</div>
					<?php endforeach; ?>
				</div>
			</div>

			<?php // The gallery's own lightbox, moved to <body> so the fixed navbar cannot cover its close button. ?>
			<template ar-teleport="body"><?php echo aranya_lightbox_markup(); ?></template>
		</section>
		<?php
	}
}
