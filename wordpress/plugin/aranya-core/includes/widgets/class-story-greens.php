<?php
/**
 * Aranya Story Greens — sections/StoryGreens.tsx.
 *
 * Section heading, the four-figure stats bar, and the near-full-bleed
 * showcase image of the grounds (opens in the lightbox).
 *
 * @package Aranya
 */

namespace Aranya\Widgets;

defined( 'ABSPATH' ) || exit;

class Story_Greens extends Widget_Base {

	public function get_name() {
		return 'aranya-story-greens';
	}

	public function get_title() {
		return __( 'Aranya Story — Greens', 'aranya' );
	}

	public function get_icon() {
		return 'eicon-image-box';
	}

	protected function register_controls() {
		$this->section( 'heading', __( 'Heading', 'aranya' ) );
		$this->heading_controls( 'Welcome to a Forevermore Life', 'Luxury, Made Lush' );
		$this->end_section();

		$this->section( 'stats_section', __( 'Stats bar', 'aranya' ) );
		$this->repeater(
			'stats',
			__( 'Stats', 'aranya' ),
			function ( $r ) {
				$this->text( 'value', __( 'Figure', 'aranya' ), '', array(), $r );
				$this->text( 'label', __( 'Label', 'aranya' ), '', array(), $r );
				$this->text( 'sublabel', __( 'Second line', 'aranya' ), '', array(), $r );
			},
			array(
				array( 'value' => '40%+', 'label' => 'Open Green', 'sublabel' => 'Living' ),
				array( 'value' => '11 ft', 'label' => 'Ceiling Height,', 'sublabel' => 'Up To' ),
				array( 'value' => '18.3 m', 'label' => 'Private Access', 'sublabel' => 'Road' ),
				array( 'value' => '3 min', 'label' => 'To Malad West', 'sublabel' => 'Metro' ),
			),
			'{{{ value }}} {{{ label }}}'
		);
		$this->end_section();

		$this->section( 'showcase', __( 'Showcase image', 'aranya' ) );
		$this->media( 'image', __( 'Image', 'aranya' ), 'opt/render-fitness-club-2600.webp' );
		$this->alt( 'image_alt' );
		$this->text( 'lightbox_title', __( 'Lightbox title', 'aranya' ), 'Welcome to a Forevermore Life' );
		$this->textarea( 'lightbox_caption', __( 'Lightbox caption', 'aranya' ), '40% open green spaces, an aroma garden and landscaped walks.', array( 'rows' => 2 ) );
		$this->text( 'lightbox_category', __( 'Lightbox label', 'aranya' ), 'The Lushury Life' );
		$this->text( 'caption_left', __( 'Caption (left)', 'aranya' ), 'The Clubhouse & Lawns' );
		$this->text( 'caption_right', __( 'Caption (right)', 'aranya' ), 'Malad West' );
		$this->end_section();

		$this->section( 'section_settings', __( 'Section', 'aranya' ) );
		$this->anchor( 'story-greens' );
		$this->end_section();
	}

	protected function render() {
		$s = $this->get_settings_for_display();
		?>
		<section ar-data id="<?php echo esc_attr( $s['anchor'] ); ?>" class="section-spacing bg-dark-900 text-ivory relative isolate overflow-hidden">
			<?php $this->print_backdrop(); ?>

			<div class="<?php echo esc_attr( self::container_class( 'showcase' ) ); ?>">
				<?php $this->print_section_heading( $s ); ?>

				<div class="grid grid-cols-2 md:grid-cols-4 gap-px mb-10 sm:mb-12 rounded-[6px] overflow-hidden border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
					<?php foreach ( (array) $s['stats'] as $stat ) : ?>
						<div class="bg-white/[0.03] backdrop-blur-sm px-5 py-6 sm:px-7 sm:py-8 text-center flex flex-col items-center justify-center gap-1.5 hover:bg-white/[0.06] transition-colors duration-300">
							<span class="font-serif text-2xl sm:text-3xl lg:text-4xl text-champagne-300 font-light tracking-tight leading-none"><?php echo esc_html( $stat['value'] ); ?></span>
							<span class="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-ivory font-semibold leading-tight"><?php echo esc_html( $stat['label'] ); ?></span>
							<span class="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-ivory-muted/70 font-medium leading-tight"><?php echo esc_html( $stat['sublabel'] ); ?></span>
						</div>
					<?php endforeach; ?>
				</div>
			</div>

			<div class="flex justify-center px-4 sm:px-8">
				<button
					type="button"
					ar-on:click="<?php echo esc_attr( self::lightbox_js( $s['image'], $s['lightbox_title'], $s['lightbox_caption'], $s['lightbox_category'] ) ); ?>"
					aria-label="View the full image"
					class="group relative block w-full max-w-[640px] aspect-[4/3] overflow-hidden rounded-[4px] border border-white/[0.06] shadow-[0_25px_60px_rgba(0,0,0,0.8)] cursor-zoom-in
                     lg:max-w-none lg:aspect-auto lg:h-[min(86vh,1250px)]"
				>
					<?php
					echo aranya_img(
						$s['image'],
						array(
							'alt'     => '' !== $s['image_alt'] ? $s['image_alt'] : null,
							'sizes'   => '(min-width: 1024px) 100vw, 440px',
							'loading' => 'lazy',
							'class'   => 'absolute inset-0 h-full w-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.02]
                       lg:static lg:h-full lg:w-full lg:max-w-full lg:object-cover',
						)
					);
					echo aranya_image_credit( $s['image'], 'absolute bottom-4 left-4 z-10' );
					?>
					<span class="absolute bottom-4 right-4 z-10 p-2.5 rounded-full glass-panel text-ivory group-hover:text-champagne-300 group-hover:scale-110 transition-all">
						<?php echo aranya_icon( 'maximize-2', 16 ); ?>
					</span>
				</button>
			</div>

			<div class="flex items-center justify-center gap-3 mt-5 px-4 text-[11px] font-sans text-ivory-muted/70 uppercase tracking-wider text-center">
				<span><?php echo esc_html( $s['caption_left'] ); ?></span>
				<span class="w-px h-3 bg-white/[0.12]"></span>
				<span><?php echo esc_html( $s['caption_right'] ); ?></span>
			</div>
		</section>
		<?php
	}
}
