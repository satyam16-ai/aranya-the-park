<?php
/**
 * Aranya Specifications — sections/Specifications.tsx.
 *
 * Category pills and the specification sheet for the selected category.
 * Rows are a flat list with a category field (Elementor repeaters cannot
 * nest); categories appear in the order of their first row.
 *
 * @package Aranya
 */

namespace Aranya\Widgets;

defined( 'ABSPATH' ) || exit;

class Specifications extends Widget_Base {

	public function get_name() {
		return 'aranya-specifications';
	}

	public function get_title() {
		return __( 'Aranya Specifications', 'aranya' );
	}

	public function get_icon() {
		return 'eicon-bullet-list';
	}

	protected function register_controls() {
		$this->section( 'heading', __( 'Heading', 'aranya' ) );
		$this->heading_controls( 'Specifications', 'Crafted in Every Detail', 'The fittings, finishes and engineering that go into every home at Aranya.' );
		$this->end_section();

		$this->section( 'items_section', __( 'Specifications', 'aranya' ) );
		$this->note( __( 'Rows with the same category form one tab, in the order they first appear.', 'aranya' ) );
		$this->repeater(
			'items',
			__( 'Rows', 'aranya' ),
			function ( $r ) {
				$this->text( 'category', __( 'Category (tab)', 'aranya' ), '', array(), $r );
				$this->text( 'feature', __( 'Feature', 'aranya' ), '', array(), $r );
				$this->textarea( 'detail', __( 'Detail', 'aranya' ), '', array( 'rows' => 2 ), $r );
			},
			aranya_defaults( 'specifications' ),
			'{{{ category }}} — {{{ feature }}}'
		);
		$this->end_section();

		$this->section( 'cta', __( 'Enquiry line', 'aranya' ) );
		$this->switcher( 'show_cta', __( 'Show', 'aranya' ) );
		$this->textarea( 'cta_text', __( 'Text', 'aranya' ), "Speak directly with the developer's team about materials, layouts and construction progress.", array( 'rows' => 2 ) );
		$this->text( 'cta_label', __( 'Button', 'aranya' ), 'REQUEST FULL SPECIFICATIONS' );
		$this->text( 'cta_purpose', __( 'Enquiry purpose', 'aranya' ), 'Project Specifications' );
		$this->end_section();

		$this->section( 'section_settings', __( 'Section', 'aranya' ) );
		$this->anchor( 'specifications' );
		$this->end_section();
	}

	protected function render() {
		$s          = $this->get_settings_for_display();
		$categories = array();
		foreach ( (array) $s['items'] as $item ) {
			$categories[ $item['category'] ][] = $item;
		}
		$names = array_keys( $categories );
		$count = count( $names );
		if ( ! $count ) {
			return;
		}
		$on  = 'bg-champagne-400 text-dark-950 font-semibold shadow-md';
		$off = 'text-ivory-muted hover:text-ivory bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12]';
		?>
		<section id="<?php echo esc_attr( $s['anchor'] ); ?>" ar-data="specifications" class="section-spacing bg-dark-950 text-ivory relative isolate overflow-hidden">
			<?php $this->print_backdrop(); ?>

			<div class="<?php echo esc_attr( self::container_class() ); ?>">
				<?php $this->print_section_heading( $s ); ?>

				<div class="flex flex-wrap items-center justify-start gap-2 sm:gap-3 mb-7 sm:mb-9">
					<?php foreach ( $names as $idx => $name ) : ?>
						<button ar-on:click="activeIndex = <?php echo (int) $idx; ?>" class="<?php echo esc_attr( 'px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-sans uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer ' . ( 0 === $idx ? $on : $off ) ); ?>" ar-bind:class="<?php echo esc_attr( "{ '$on': activeIndex === $idx, '$off': activeIndex !== $idx }" ); ?>"><?php echo esc_html( $name ); ?></button>
					<?php endforeach; ?>
				</div>

				<div class="max-w-4xl mx-auto">
					<div class="glass-panel p-6 sm:p-10 lg:p-12 rounded-[6px] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
						<div class="border-b border-white/[0.08] pb-4 mb-8 flex items-center justify-between">
							<span class="font-sans text-[11px] uppercase tracking-[0.25em] text-champagne-400 font-semibold" ar-text="<?php echo esc_attr( wp_json_encode( $names ) ); ?>[activeIndex]"><?php echo esc_html( $names[0] ); ?></span>
							<span class="text-[11px] text-ivory-muted/60 font-sans tracking-wider" ar-text="'0' + (activeIndex + 1) + ' / 0<?php echo (int) $count; ?>'">01 / 0<?php echo (int) $count; ?></span>
						</div>

						<?php foreach ( $names as $idx => $name ) : ?>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12" ar-show="activeIndex === <?php echo (int) $idx; ?>"<?php echo 0 === $idx ? '' : ' style="display: none;"'; ?>>
								<?php foreach ( $categories[ $name ] as $item ) : ?>
									<div class="space-y-1.5 border-b border-white/[0.04] pb-6 last:border-b-0">
										<span class="block font-sans text-[10px] uppercase tracking-[0.2em] text-champagne-300/80 font-medium"><?php echo esc_html( $item['feature'] ); ?></span>
										<p class="font-serif text-lg sm:text-xl text-ivory font-light leading-snug"><?php echo esc_html( $item['detail'] ); ?></p>
									</div>
								<?php endforeach; ?>
							</div>
						<?php endforeach; ?>

						<?php if ( 'yes' === $s['show_cta'] ) : ?>
							<div class="mt-12 pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
								<p class="font-sans text-xs text-ivory-muted font-light"><?php echo esc_html( $s['cta_text'] ); ?></p>
								<button ar-on:click="<?php echo esc_attr( 'Aranya.openLead(' . wp_json_encode( $s['cta_purpose'] ) . ', ' . wp_json_encode( $names ) . '[activeIndex])' ); ?>" class="<?php echo esc_attr( self::button_class( 'gold', 'sm', 'shrink-0' ) ); ?>"><?php echo self::button_inner( esc_html( $s['cta_label'] ), aranya_icon( 'compass', 14 ) ); ?></button>
							</div>
						<?php endif; ?>
					</div>
				</div>
			</div>
		</section>
		<?php
	}
}
