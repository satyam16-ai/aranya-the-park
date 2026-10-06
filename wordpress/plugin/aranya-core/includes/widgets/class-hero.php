<?php
/**
 * Aranya Hero — sections/Hero.tsx ("The Arrival").
 *
 * The positioning line sets itself one letter at a time over its address;
 * behind it the frames cross-fade on a timer (paused off-screen / in a hidden
 * tab; held on the first frame for reduced motion). A frame can carry its own
 * statement, which hands over from the positioning line.
 *
 * @package Aranya
 */

namespace Aranya\Widgets;

defined( 'ABSPATH' ) || exit;

class Hero extends Widget_Base {

	private const LETTER_START = 0.45;
	private const LETTER_STEP  = 0.055;

	public function get_name() {
		return 'aranya-hero';
	}

	public function get_title() {
		return __( 'Aranya Hero', 'aranya' );
	}

	public function get_icon() {
		return 'eicon-slider-full-screen';
	}

	protected function register_controls() {
		$this->section( 'statement', __( 'Statement', 'aranya' ) );
		$this->text( 'headline', __( 'Headline', 'aranya' ), 'The Lushury Life', array( 'description' => __( 'Sets itself letter by letter.', 'aranya' ) ) );
		$this->text( 'headline_prefix', __( 'Headline for search engines & screen readers (prefix)', 'aranya' ), 'Aranya The Park', array( 'description' => __( 'Read as "prefix — headline". Not shown on screen.', 'aranya' ) ) );
		$this->tag( 'headline_tag', __( 'Headline HTML tag', 'aranya' ), 'h1' );
		$this->text( 'address', __( 'Address line', 'aranya' ), 'Behind Evershine Mall · Malad West, Mumbai' );
		$this->end_section();

		$this->section( 'frames', __( 'Frames', 'aranya' ) );
		$this->repeater(
			'slides',
			__( 'Frames', 'aranya' ),
			function ( $r ) {
				$this->media( 'image', __( 'Image', 'aranya' ), '', array(), $r );
				$this->media( 'mobile_image', __( 'Image on phones & tablets (optional)', 'aranya' ), '', array( 'description' => __( 'Used below 1024 px wide.', 'aranya' ) ), $r );
				$this->alt( 'alt', $r );
				$this->text( 'position', __( 'Crop position', 'aranya' ), 'center', array( 'description' => __( 'CSS object-position, e.g. "center", "34% center", "center 40%".', 'aranya' ) ), $r );
				$this->text( 'position_sm', __( 'Crop position from 640 px (optional)', 'aranya' ), '', array(), $r );
				$this->text( 'position_lg', __( 'Crop position from 1024 px (optional)', 'aranya' ), '', array(), $r );
				$r->add_control(
					'framed',
					array(
						'label'        => __( 'Framed on desktop', 'aranya' ),
						'type'         => \Elementor\Controls_Manager::SWITCHER,
						'return_value' => 'yes',
						'default'      => '',
						'description'  => __( 'Shrinks a tall image into a window over a blurred copy of itself.', 'aranya' ),
					)
				);
				$this->text( 'copy_title', __( 'Frame statement (optional)', 'aranya' ), '', array(), $r );
				$this->textarea( 'copy_body', __( 'Frame text (optional)', 'aranya' ), '', array( 'rows' => 2 ), $r );
			},
			array(
				array(
					'image'        => array( 'url' => aranya_asset_url( 'opt/life-garden-walk-2000.webp' ), 'id' => '' ),
					'mobile_image' => array( 'url' => '', 'id' => '' ),
					'alt'          => '',
					'position'     => '34% center',
					'position_sm'  => '',
					'position_lg'  => 'center',
					'framed'       => '',
					'copy_title'   => '',
					'copy_body'    => '',
				),
				array(
					'image'        => array( 'url' => aranya_asset_url( 'story-arrival-aerial.jpg' ), 'id' => '' ),
					'mobile_image' => array( 'url' => aranya_asset_url( 'story-arrival-aerial-mobile.jpg' ), 'id' => '' ),
					'alt'          => '',
					'position'     => 'top',
					'position_sm'  => 'center',
					'position_lg'  => 'center 40%',
					'framed'       => 'yes',
					'copy_title'   => 'Where Space, Air & Light Reclaim Their True Meaning',
					'copy_body'    => "A sanctuary secluded from city cacophony, rising tall on Malad West's most prestigious boulevard.",
				),
			),
			'{{{ copy_title || "Frame" }}}'
		);
		$this->add_control(
			'slide_ms',
			array(
				'label'   => __( 'Time on each frame (ms)', 'aranya' ),
				'type'    => \Elementor\Controls_Manager::NUMBER,
				'default' => 6000,
				'min'     => 2000,
			)
		);
		$this->add_control(
			'fade_ms',
			array(
				'label'   => __( 'Cross-fade (ms)', 'aranya' ),
				'type'    => \Elementor\Controls_Manager::NUMBER,
				'default' => 1400,
				'min'     => 500,
			)
		);
		$this->end_section();

		$this->section( 'extras', __( 'Partner logo & scroll cue', 'aranya' ) );
		$this->media( 'partner_logo', __( 'Partner logo', 'aranya' ), 'branding/project-by-zaveri-bkm-light.png' );
		$this->text( 'partner_alt', __( 'Partner logo alt text', 'aranya' ), 'Project by Zaveri Realty & BKM Mindspace' );
		$this->text( 'cue_label', __( 'Scroll cue', 'aranya' ), 'Scroll to Explore' );
		$this->text( 'cue_target', __( 'Scroll cue target', 'aranya' ), '#story-greens' );
		$this->end_section();

		$this->section( 'section_settings', __( 'Section', 'aranya' ) );
		$this->anchor( 'overview' );
		$this->end_section();
	}

	/** JS number → string the way `${n}s` prints it (0.5 → "0.5", 1 → "1"). */
	private static function num( float $n ): string {
		$s = number_format( round( $n, 3 ), 3, '.', '' );
		return rtrim( rtrim( $s, '0' ), '.' );
	}

	private static function position_style( array $slide ): string {
		$p0 = trim( (string) $slide['position'] ) ?: 'center';
		$p1 = trim( (string) $slide['position_sm'] ) ?: $p0;
		$p2 = trim( (string) $slide['position_lg'] ) ?: $p1;
		return sprintf( '--p0:%s;--p1:%s;--p2:%s', $p0, $p1, $p2 );
	}

	protected function render() {
		$s      = $this->get_settings_for_display();
		$slides = array_values( array_filter( (array) $s['slides'], static fn( $sl ) => '' !== aranya_image_url( $sl['image'] ?? array() ) ) );
		$count  = count( $slides );
		$fade   = max( 500, (int) $s['fade_ms'] );
		$tag    = aranya_tag( $s['headline_tag'], 'h1' );

		// The letter schedule, fixed at render time like the React module constant.
		$i     = 0;
		$words = array();
		foreach ( preg_split( '/ /', (string) $s['headline'] ) as $word ) {
			$letters = array();
			foreach ( mb_str_split( $word ) as $char ) {
				$letters[] = array( $char, self::num( self::LETTER_START + $i++ * self::LETTER_STEP ) );
			}
			$words[] = $letters;
		}
		$address_delay = self::num( self::LETTER_START + $i * self::LETTER_STEP + 0.25 );

		$has_copy = array_map( static fn( $sl ) => '' !== trim( (string) $sl['copy_title'] ), $slides );
		$x_data   = aranya_json(
			array(
				'count'   => $count,
				'slideMs' => max( 2000, (int) $s['slide_ms'] ),
				'fadeMs'  => $fade,
			)
		);
		$text_on  = sprintf( 'transition-duration: %dms; transition-delay: 450ms;', $fade - 450 );
		$text_off = 'transition-duration: 450ms;';

		$img_for = function ( array $slide, int $index, bool $backdrop ) {
			// Only the frame on show carries its alt text (Hero.tsx).
			$alt = '' !== trim( (string) $slide['alt'] ) ? $slide['alt'] : aranya_image_info( $slide['image'] )['alt'];
			$img = aranya_img(
				$slide['image'],
				array(
					'alt'           => $backdrop || 0 !== $index ? '' : $alt,
					'sizes'         => '100vw',
					'fetchpriority' => $backdrop ? 'low' : ( 0 === $index ? 'high' : 'low' ),
					'class'         => $backdrop ? 'w-full h-full object-cover scale-110 blur-2xl brightness-[0.6] animate-none!' : 'w-full h-full object-cover transform-gpu object-[var(--p0)] sm:object-[var(--p1)] lg:object-[var(--p2)]',
					'attrs'         => $backdrop ? array() : array(
						'style'           => self::position_style( $slide ),
						'ar-bind:alt'     => 'active === ' . $index . ' ? ' . wp_json_encode( $alt ) . " : ''",
						// The site loader waits for the first frame (assets/js/site-loader-gate.js).
						'data-aranya-lcp' => 0 === $index ? '' : null,
					),
				)
			);
			$mobile = aranya_image_url( $slide['mobile_image'] ?? array() );
			if ( '' !== $mobile ) {
				return '<picture><source media="(max-width: 1023px)" srcset="' . esc_url( $mobile ) . '">' . $img . '</picture>';
			}
			return $img;
		};

		$frame = function ( array $slide, int $index ) use ( $img_for, $fade ) {
			ob_start();
			?>
			<div
				class="<?php echo esc_attr( 'absolute inset-0 transition-opacity ease-out ' . ( 0 === $index ? 'opacity-100 hero-slide-active' : 'opacity-0' ) ); ?>"
				ar-bind:class="{ 'opacity-100 hero-slide-active': active === <?php echo (int) $index; ?>, 'opacity-0': active !== <?php echo (int) $index; ?> }"
				style="transition-duration: <?php echo (int) $fade; ?>ms;"
			>
				<?php if ( 'yes' === $slide['framed'] ) : ?>
					<div aria-hidden="true" class="hidden lg:block absolute inset-0"><?php echo $img_for( $slide, $index, true ); ?></div>
					<div class="absolute inset-0 lg:inset-x-[9%] lg:[mask-image:linear-gradient(to_right,transparent,#000_9%,#000_91%,transparent)]"><?php echo $img_for( $slide, $index, false ); ?></div>
				<?php else : ?>
					<?php echo $img_for( $slide, $index, false ); ?>
				<?php endif; ?>
			</div>
			<?php
			return (string) ob_get_clean();
		};
		?>
		<section id="<?php echo esc_attr( $s['anchor'] ); ?>" data-aranya-hero ar-data="hero(<?php echo esc_attr( $x_data ); ?>)" class="relative h-[100dvh] min-h-[100svh] sm:h-screen w-full overflow-hidden flex flex-col bg-dark-950 text-ivory select-none">
			<div data-hero-frames class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
				<?php
				foreach ( $slides as $index => $slide ) {
					if ( 0 === $index ) {
						echo $frame( $slide, 0 );
					} else {
						// Frames past the first stay unmounted until the hero has settled.
						echo '<template ar-if="preloadRest">' . $frame( $slide, $index ) . '</template>';
					}
				}
				?>
				<div class="hidden lg:block absolute inset-0 bg-[radial-gradient(ellipse_56%_38%_at_50%_50%,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.38)_50%,transparent_84%)]"></div>
				<div class="absolute inset-0 lg:hidden bg-gradient-to-b from-black/45 via-black/32 to-black/55"></div>
				<div class="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/55 to-transparent"></div>
				<div class="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-dark-950 to-transparent"></div>
			</div>

			<?php if ( '' !== aranya_image_url( $s['partner_logo'] ) ) : ?>
				<div class="hidden lg:block absolute right-8 xl:right-12 top-[14%] z-20">
					<?php echo aranya_img( $s['partner_logo'], array( 'alt' => $s['partner_alt'], 'plain' => true, 'class' => 'h-10 xl:h-12 w-auto object-contain opacity-90 hero-animate-aside' ) ); ?>
				</div>
			<?php endif; ?>

			<div class="relative z-20 pt-[4.5rem] sm:pt-28 lg:pt-[clamp(5.5rem,9vh,8rem)] shrink-0"></div>

			<div class="relative z-20 flex-1 flex items-center px-5 sm:px-8 py-4 lg:py-0">
				<div class="w-full max-w-5xl mx-auto text-center grid place-items-center">
					<div
						class="<?php echo esc_attr( '[grid-area:1/1] w-full transition-opacity ease-out ' . ( $has_copy[0] ?? false ? 'opacity-0' : 'opacity-100' ) ); ?>"
						ar-bind:class="{ 'opacity-0': <?php echo esc_attr( wp_json_encode( $has_copy ) ); ?>[active], 'opacity-100': !<?php echo esc_attr( wp_json_encode( $has_copy ) ); ?>[active] }"
						style="<?php echo esc_attr( ( $has_copy[0] ?? false ) ? $text_off : $text_on ); ?>"
						ar-bind:style="textFade(!<?php echo esc_attr( wp_json_encode( $has_copy ) ); ?>[active])"
					>
						<<?php echo $tag; ?> class="m-0 font-serif uppercase text-champagne-400 leading-[1.06] tracking-[0.08em] sm:tracking-[0.12em] text-[clamp(1.875rem,7vw,4.5rem)] drop-shadow-[0_4px_26px_rgba(0,0,0,0.8)]">
							<span class="sr-only"><?php echo esc_html( trim( $s['headline_prefix'] ) ? $s['headline_prefix'] . ' — ' . $s['headline'] : $s['headline'] ); ?></span>
							<span aria-hidden="true"><?php
							foreach ( $words as $w => $letters ) {
								if ( $w > 0 ) {
									echo ' ';
								}
								echo '<span class="inline-block">';
								foreach ( $letters as [ $char, $delay ] ) {
									printf( '<span class="hero-letter inline-block" style="animation-delay: %ss;">%s</span>', esc_attr( $delay ), esc_html( $char ) );
								}
								echo '</span>';
							}
							?></span>
						</<?php echo $tag; ?>>

						<div class="hero-animate-subtitle mt-5 sm:mt-7 flex items-center justify-center gap-4 sm:gap-5" style="animation-delay: <?php echo esc_attr( $address_delay ); ?>s;">
							<span class="hidden sm:block w-10 lg:w-16 h-px bg-champagne-400/60 shrink-0"></span>
							<p class="font-sans uppercase text-champagne-300 font-medium leading-relaxed tracking-[0.14em] sm:tracking-[0.24em] text-[11px] sm:text-sm lg:text-base drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]"><?php echo esc_html( $s['address'] ); ?></p>
							<span class="hidden sm:block w-10 lg:w-16 h-px bg-champagne-400/60 shrink-0"></span>
						</div>
					</div>

					<?php foreach ( $slides as $index => $slide ) : ?>
						<?php if ( $has_copy[ $index ] ) : ?>
							<div
								aria-hidden="<?php echo 0 === $index ? 'false' : 'true'; ?>"
								ar-bind:aria-hidden="active !== <?php echo (int) $index; ?> ? 'true' : 'false'"
								class="<?php echo esc_attr( '[grid-area:1/1] w-full max-w-4xl transition-opacity ease-out ' . ( 0 === $index ? 'opacity-100' : 'opacity-0' ) ); ?>"
								ar-bind:class="{ 'opacity-100': active === <?php echo (int) $index; ?>, 'opacity-0': active !== <?php echo (int) $index; ?> }"
								style="<?php echo esc_attr( 0 === $index ? $text_on : $text_off ); ?>"
								ar-bind:style="textFade(active === <?php echo (int) $index; ?>)"
							>
								<h2 class="m-0 font-serif uppercase text-champagne-400 leading-[1.12] tracking-[0.06em] sm:tracking-[0.08em] text-[clamp(1.5rem,4.2vw,3.25rem)] text-balance drop-shadow-[0_4px_26px_rgba(0,0,0,0.8)]"><?php echo esc_html( $slide['copy_title'] ); ?></h2>
								<?php if ( '' !== trim( (string) $slide['copy_body'] ) ) : ?>
									<p class="mt-4 sm:mt-6 max-w-2xl mx-auto font-sans text-ivory/90 font-medium leading-relaxed text-xs sm:text-base drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]"><?php echo esc_html( $slide['copy_body'] ); ?></p>
								<?php endif; ?>
							</div>
						<?php endif; ?>
					<?php endforeach; ?>
				</div>
			</div>

			<div class="relative z-20 shrink-0 pb-16 sm:pb-20 lg:pb-[clamp(1.25rem,2.5vh,2.25rem)]">
				<div class="flex flex-col items-center gap-4 lg:gap-3.5 hero-animate-cue">
					<div class="flex items-center gap-2" aria-label="Hero frames">
						<?php foreach ( $slides as $index => $slide ) : ?>
							<button
								type="button"
								ar-on:click="goTo(<?php echo (int) $index; ?>)"
								aria-label="<?php echo esc_attr( sprintf( 'Show frame %d of %d', $index + 1, $count ) ); ?>"
								aria-current="<?php echo 0 === $index ? 'true' : 'false'; ?>"
								ar-bind:aria-current="active === <?php echo (int) $index; ?> ? 'true' : 'false'"
								class="<?php echo esc_attr( 'h-1.5 rounded-full transition-all duration-500 cursor-pointer ' . ( 0 === $index ? 'w-7 bg-champagne-400' : 'w-1.5 bg-ivory/35 hover:bg-ivory/70' ) ); ?>"
								ar-bind:class="{ 'w-7 bg-champagne-400': active === <?php echo (int) $index; ?>, 'w-1.5 bg-ivory/35 hover:bg-ivory/70': active !== <?php echo (int) $index; ?> }"
							></button>
						<?php endforeach; ?>
					</div>

					<?php if ( '' !== aranya_image_url( $s['partner_logo'] ) ) : ?>
						<?php echo aranya_img( $s['partner_logo'], array( 'alt' => $s['partner_alt'], 'plain' => true, 'class' => 'lg:hidden h-8 w-auto object-contain opacity-85' ) ); ?>
					<?php endif; ?>
					<a href="<?php echo esc_attr( $s['cue_target'] ); ?>" class="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-ivory-muted/70 hover:text-champagne-300 transition-colors duration-300 cursor-pointer"><?php echo esc_html( $s['cue_label'] ); ?></a>
				</div>
			</div>
		</section>
		<?php
	}
}
