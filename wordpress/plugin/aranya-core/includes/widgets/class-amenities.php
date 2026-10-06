<?php
/**
 * Aranya Amenities — sections/Amenities.tsx ("Life Beyond Four Walls").
 *
 * Every amenity on show, grouped by level (ground: four to a row; terraces and
 * towers: three to a row on the widest screens). A card outlines in gold on
 * hover; a click opens its photograph in the lightbox.
 *
 * @package Aranya
 */

namespace Aranya\Widgets;

defined( 'ABSPATH' ) || exit;

class Amenities extends Widget_Base {

	/** Group layout from Amenities.tsx: column span and srcset sizes per level. */
	private const GROUPS = array(
		'ground'   => array( 'xl:col-span-3', '(min-width:1280px) 23vw, (min-width:640px) 50vw, 100vw' ),
		'terrace'  => array( 'xl:col-span-4', '(min-width:1280px) 31vw, (min-width:640px) 50vw, 100vw' ),
		'building' => array( 'xl:col-span-4', '(min-width:1280px) 31vw, (min-width:640px) 50vw, 100vw' ),
	);

	public function get_name() {
		return 'aranya-amenities';
	}

	public function get_title() {
		return __( 'Aranya Amenities', 'aranya' );
	}

	public function get_icon() {
		return 'eicon-gallery-grid';
	}

	protected function register_controls() {
		$this->section( 'heading', __( 'Heading', 'aranya' ) );
		$this->text( 'eyebrow', __( 'Eyebrow', 'aranya' ), 'Wellness & Recreation' );
		$this->text( 'title_line1', __( 'Title — first line', 'aranya' ), 'Life Beyond' );
		$this->text( 'title_line2', __( 'Title — second line (gold)', 'aranya' ), 'Four Walls' );
		$this->tag( 'title_tag', __( 'Title HTML tag', 'aranya' ), 'h2' );
		$this->textarea( 'intro', __( 'Introduction', 'aranya' ), 'Fourteen thoughtfully curated spaces across the ground level and rooftop terraces — from sunrise yoga to pickleball and serene evenings under the gazebo. Select any space to see it in full.' );
		$this->text( 'note_line1', __( 'Handwritten note — first line', 'aranya' ), 'Spaces for' );
		$this->text( 'note_line2', __( 'Handwritten note — second line', 'aranya' ), 'a balanced life' );
		$this->end_section();

		$this->section( 'groups', __( 'Groups', 'aranya' ) );
		$this->text( 'group_ground', __( 'Ground level heading', 'aranya' ), 'Ground Level' );
		$this->text( 'group_terrace', __( 'Terraces heading', 'aranya' ), 'Rooftop Terraces' );
		$this->text( 'group_building', __( 'Within the towers heading', 'aranya' ), 'Within the Towers' );
		$this->end_section();

		$this->section( 'items', __( 'Amenities', 'aranya' ) );
		$this->repeater(
			'amenities',
			__( 'Amenities', 'aranya' ),
			function ( $r ) {
				$this->text( 'name', __( 'Name', 'aranya' ), 'Amenity', array(), $r );
				$this->select(
					'group',
					__( 'Group', 'aranya' ),
					array(
						'ground'   => __( 'Ground level', 'aranya' ),
						'terrace'  => __( 'Rooftop terraces', 'aranya' ),
						'building' => __( 'Within the towers', 'aranya' ),
					),
					'ground',
					array(),
					$r
				);
				$this->select( 'icon', __( 'Icon', 'aranya' ), aranya_icon_options(), 'trophy', array(), $r );
				$this->media( 'image', __( 'Image', 'aranya' ), '', array(), $r );
				$this->text( 'badge', __( 'Line under the name', 'aranya' ), '', array(), $r );
				$this->text( 'category_label', __( 'Lightbox label', 'aranya' ), '', array(), $r );
				$this->text( 'tagline', __( 'Lightbox tagline', 'aranya' ), '', array(), $r );
				$this->textarea( 'description', __( 'Lightbox description', 'aranya' ), '', array( 'rows' => 3 ), $r );
			},
			self::media_rows(
				array_map(
					static function ( $a ) {
						unset( $a['amenity_id'] );
						return $a;
					},
					aranya_defaults( 'amenities' )
				),
				array( 'image' )
			),
			'{{{ name }}}'
		);
		$this->end_section();

		$this->section( 'section_settings', __( 'Section', 'aranya' ) );
		$this->anchor( 'amenities' );
		$this->end_section();
	}

	protected function render() {
		$s      = $this->get_settings_for_display();
		$tag    = aranya_tag( $s['title_tag'] );
		$groups = array();
		foreach ( array( 'ground', 'terrace', 'building' ) as $level ) {
			$items = array_values( array_filter( (array) $s['amenities'], static fn( $a ) => $level === $a['group'] ) );
			if ( $items ) {
				$groups[ $level ] = $items;
			}
		}
		$label_class = 'text-[length:clamp(11.5px,0.68vw,13px)] font-semibold uppercase tracking-[0.24em] text-champagne-300';
		?>
		<section ar-data id="<?php echo esc_attr( $s['anchor'] ); ?>" style="scroll-margin-top: 0px;" class="relative isolate overflow-hidden bg-dark-950 text-ivory [--gap:clamp(12px,1vw,20px)]">
			<?php $this->print_backdrop(); ?>

			<div class="relative mx-auto flex w-full max-w-[1920px] flex-col px-5 pt-[88px] pb-14 sm:px-8 sm:pt-24 lg:px-[3.9vw] lg:pt-[clamp(92px,13.6vh,140px)] lg:pb-18">
				<header class="relative grid grid-cols-1 gap-x-(--gap) gap-y-5 lg:grid-cols-3">
					<div>
						<p class="<?php echo esc_attr( 'flex items-center gap-5 ' . $label_class ); ?>">
							<?php echo esc_html( $s['eyebrow'] ); ?>
							<span aria-hidden="true" class="h-px w-14 bg-champagne-400/70"></span>
						</p>
						<<?php echo $tag; ?> class="mt-[clamp(10px,1.8vh,18px)] font-serif text-[length:clamp(2.6rem,min(5.4vw,calc(20vh_-_80px)),6.5rem)] font-semibold leading-[0.9] tracking-[-0.015em]">
							<span class="block text-ivory"><?php echo esc_html( $s['title_line1'] ); ?></span>
							<span class="block bg-[linear-gradient(180deg,#E6D2A6_0%,#C8A96B_100%)] bg-clip-text pb-[0.08em] text-transparent"><?php echo esc_html( $s['title_line2'] ); ?></span>
						</<?php echo $tag; ?>>
					</div>

					<div class="flex items-center lg:col-span-2 lg:pt-[clamp(28px,4.4vh,44px)]">
						<span aria-hidden="true" class="hidden w-px self-stretch bg-white/[0.12] lg:block"></span>
						<p class="min-w-0 max-w-[29rem] lg:shrink-0 text-[length:clamp(1rem,0.95vw,1.16rem)] leading-[1.55] text-ivory/85 lg:pl-[clamp(28px,2.8vw,56px)]"><?php echo aranya_inline( $s['intro'] ); ?></p>

						<?php if ( '' !== trim( $s['note_line1'] . $s['note_line2'] ) ) : ?>
							<p aria-hidden="true" class="pointer-events-none mx-auto hidden shrink-0 translate-y-[22%] -rotate-[13deg] whitespace-nowrap pl-6 font-serif text-[length:clamp(1.75rem,2.3vw,2.9rem)] font-medium italic leading-[1.05] text-champagne-400/70 xl:block">
								<span class="block"><?php echo esc_html( $s['note_line1'] ); ?><svg viewBox="0 0 24 24" class="ml-[0.2em] inline-block h-[0.8em] w-[0.8em] -translate-y-[0.55em] rotate-[8deg] text-champagne-300"><path d="M11.5 22C11 14 13.5 7.5 21 2.5c.6 8.4-2.6 15-9.5 19.5z" fill="currentColor"></path><path d="M10.5 22C9.6 17 6.6 13.7 2.5 12.6c.4 4.8 3.4 8.3 8 9.4z" fill="currentColor" opacity="0.75"></path></svg></span>
								<span class="ml-[0.9em] block"><?php echo esc_html( $s['note_line2'] ); ?></span>
							</p>
						<?php endif; ?>
					</div>
				</header>

				<div class="mt-[clamp(32px,5.2vh,56px)] flex flex-col gap-[clamp(36px,5vh,56px)]">
					<?php
					foreach ( $groups as $level => $items ) :
						[ $span, $sizes ] = self::GROUPS[ $level ];
						$heading_id       = 'amenities-' . $level . '-' . $this->get_id();
						?>
						<div>
							<div class="flex items-center gap-4">
								<h3 id="<?php echo esc_attr( $heading_id ); ?>" class="<?php echo esc_attr( $label_class ); ?>"><?php echo esc_html( $s[ 'group_' . $level ] ); ?></h3>
								<span aria-hidden="true" class="text-[length:clamp(11.5px,0.68vw,13px)] font-semibold tracking-[0.18em] text-champagne-400/60"><?php echo esc_html( aranya_pad2( count( $items ) ) ); ?></span>
								<span aria-hidden="true" class="h-px flex-1 bg-white/[0.1]"></span>
							</div>

							<ul aria-labelledby="<?php echo esc_attr( $heading_id ); ?>" class="mt-[clamp(14px,2vh,20px)] grid grid-cols-1 gap-(--gap) sm:grid-cols-2 xl:grid-cols-12">
								<?php foreach ( $items as $amenity ) : ?>
									<li class="<?php echo esc_attr( $span ); ?>">
										<article class="group relative isolate h-[170px] overflow-hidden rounded-[14px] border border-white/[0.1] transition-[border-color,box-shadow] duration-300 hover:border-champagne-300 hover:shadow-[0_0_0_1px_rgba(216,189,140,0.8),0_0_28px_rgba(200,169,107,0.35)] sm:h-[210px] lg:h-[240px] xl:h-[clamp(200px,26vh,260px)]">
											<?php
											echo aranya_img(
												$amenity['image'],
												array(
													'alt'      => '',
													'sizes'    => $sizes,
													'loading'  => 'lazy',
													'decoding' => 'async',
													'class'    => 'absolute inset-0 -z-10 h-full w-full object-cover',
												)
											);
											?>
											<span aria-hidden="true" class="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(6,19,13,0.92)_0%,rgba(6,19,13,0.6)_38%,rgba(6,19,13,0)_70%)]"></span>

											<div class="absolute inset-x-0 bottom-0 flex items-end gap-3 p-[clamp(14px,2vh,20px)]">
												<div class="min-w-0 flex-1">
													<span class="hidden h-[clamp(36px,4.6vh,44px)] w-[clamp(36px,4.6vh,44px)] items-center justify-center rounded-full border border-champagne-400/60 bg-dark-950/40 text-champagne-300 backdrop-blur-sm sm:inline-flex">
														<?php echo aranya_icon( $amenity['icon'], 24, array( 'stroke' => 1.5, 'class' => 'h-[46%] w-[46%]' ) ); ?>
													</span>
													<h4 class="font-serif text-[length:clamp(1.05rem,1.15vw,1.45rem)] font-semibold leading-tight tracking-[-0.005em] text-ivory [text-shadow:0_1px_12px_rgba(0,0,0,0.45)] sm:mt-[clamp(8px,1.2vh,12px)]"><?php echo esc_html( $amenity['name'] ); ?></h4>
													<?php if ( '' !== trim( (string) $amenity['badge'] ) ) : ?>
														<p class="mt-1 text-[11px] uppercase tracking-[0.18em] text-ivory/80"><?php echo esc_html( $amenity['badge'] ); ?></p>
													<?php endif; ?>
												</div>

												<span aria-hidden="true" class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-champagne-400/70 bg-dark-950/55 text-ivory backdrop-blur-sm transition-colors duration-300 group-hover:border-champagne-300 group-hover:bg-dark-950/75 xl:h-10 xl:w-10">
													<?php echo aranya_icon( 'arrow-right', 17, array( 'stroke' => 1.6, 'class' => 'transition-transform duration-300 group-hover:translate-x-0.5' ) ); ?>
												</span>
											</div>

											<?php echo aranya_image_credit( $amenity['image'], 'absolute right-3 top-3' ); ?>

											<button
												type="button"
												ar-on:click="<?php echo esc_attr( self::lightbox_js( $amenity['image'], $amenity['name'], $amenity['tagline'] . ' — ' . $amenity['description'], $amenity['category_label'] ) ); ?>"
												aria-label="<?php echo esc_attr( $amenity['name'] . ': view image' ); ?>"
												class="absolute inset-0 z-10 cursor-pointer rounded-[14px] focus-visible:outline-offset-[-2px]"
											></button>
										</article>
									</li>
								<?php endforeach; ?>
							</ul>
						</div>
					<?php endforeach; ?>
				</div>
			</div>
		</section>
		<?php
	}
}
