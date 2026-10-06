<?php
/**
 * Aranya Residences — sections/Residences.tsx.
 *
 * The configuration selector (2/3/5 BHK) and the showcase panel: image on the
 * left, details, features and the two calls to action on the right. Every
 * configuration's content is in the page (only the selected one is shown), so
 * all of it is readable by search engines.
 *
 * @package Aranya
 */

namespace Aranya\Widgets;

defined( 'ABSPATH' ) || exit;

class Residences extends Widget_Base {

	public function get_name() {
		return 'aranya-residences';
	}

	public function get_title() {
		return __( 'Aranya Residences', 'aranya' );
	}

	public function get_icon() {
		return 'eicon-tabs';
	}

	protected function register_controls() {
		$this->section( 'heading', __( 'Heading', 'aranya' ) );
		$this->heading_controls( 'The Residences', 'Room to Breathe', 'Spacious, Vastu-compliant 2, 3 & 5 BHK homes with French windows and ceiling heights of up to 11 ft.' );
		$this->end_section();

		$this->section( 'units_section', __( 'Configurations', 'aranya' ) );
		$units = array_map(
			static function ( $u ) {
				$u['note'] = '5bhk' === $u['unit_id'] ? '* 5 BHK availability and floor options on request.' : '';
				unset( $u['floor_plan_image'] );
				return $u;
			},
			aranya_defaults( 'residences' )
		);
		$this->repeater(
			'units',
			__( 'Configurations', 'aranya' ),
			function ( $r ) {
				$this->text( 'unit_id', __( 'ID (no spaces)', 'aranya' ), 'unit', array(), $r );
				$this->text( 'type', __( 'Type (tab label)', 'aranya' ), '2 BHK', array(), $r );
				$this->text( 'carpet_area', __( 'RERA carpet area', 'aranya' ), '', array(), $r );
				$this->text( 'title', __( 'Name', 'aranya' ), '', array(), $r );
				$this->text( 'tag', __( 'Image tag', 'aranya' ), '', array(), $r );
				$this->text( 'deck', __( 'Second chip', 'aranya' ), '', array( 'description' => __( 'e.g. Private Sundeck. Leave empty to show no second chip.', 'aranya' ) ), $r );
				$this->textarea( 'description', __( 'Description', 'aranya' ), '', array(), $r );
				$this->textarea( 'features', __( 'Features (one per line, first 4 shown)', 'aranya' ), '', array( 'rows' => 5 ), $r );
				$this->media( 'image', __( 'Image', 'aranya' ), '', array(), $r );
				$this->alt( 'image_alt', $r );
				$this->select(
					'plans_tab',
					__( '"View floor plans" opens', 'aranya' ),
					array(
						'tower-a' => 'Tower A',
						'tower-b' => 'Tower B',
						'master'  => 'Master Layout',
					),
					'tower-a',
					array(),
					$r
				);
				$this->text( 'note', __( 'Footnote (optional)', 'aranya' ), '', array(), $r );
			},
			self::media_rows( $units, array( 'image' ) ),
			'{{{ type }}} — {{{ title }}}'
		);
		$this->end_section();

		$this->section( 'labels', __( 'Labels & buttons', 'aranya' ) );
		$this->text( 'eyebrow_detail', __( 'Detail eyebrow', 'aranya' ), 'The Residence' );
		$this->text( 'type_suffix', __( 'After the type', 'aranya' ), 'Residence' );
		$this->text( 'carpet_prefix', __( 'Carpet chip prefix', 'aranya' ), 'RERA Carpet:' );
		$this->text( 'plans_label', __( 'Floor plans button', 'aranya' ), 'VIEW FLOOR PLANS' );
		$this->text( 'price_label', __( 'Price button', 'aranya' ), 'REQUEST PRICE' );
		$this->text( 'price_purpose', __( 'Price enquiry purpose', 'aranya' ), 'Enquire — {type}', array( 'description' => __( '{type} becomes the configuration.', 'aranya' ) ) );
		$this->end_section();

		$this->section( 'section_settings', __( 'Section', 'aranya' ) );
		$this->anchor( 'residences' );
		$this->end_section();
	}

	protected function render() {
		$s     = $this->get_settings_for_display();
		$units = array_values( (array) $s['units'] );
		if ( ! $units ) {
			return;
		}
		$first = $units[0]['unit_id'];
		?>
		<section id="<?php echo esc_attr( $s['anchor'] ); ?>" ar-data="residences(<?php echo esc_attr( aranya_json( array( 'initial' => $first ) ) ); ?>)" class="section-spacing bg-dark-950 text-ivory relative isolate overflow-hidden">
			<?php $this->print_backdrop(); ?>

			<div class="<?php echo esc_attr( self::container_class( 'showcase' ) ); ?>">
				<?php $this->print_section_heading( $s ); ?>

				<div class="flex justify-center mb-8">
					<div class="inline-flex p-1.5 glass-panel rounded-full max-w-lg w-full justify-between gap-1.5">
						<?php
						foreach ( $units as $i => $unit ) :
							$id = wp_json_encode( $unit['unit_id'] );
							?>
							<button
								ar-on:click="selectedId = <?php echo esc_attr( $id ); ?>"
								class="<?php echo esc_attr( 'flex-1 py-3 px-3 sm:px-6 text-center font-sans transition-all duration-300 cursor-pointer rounded-full ' . ( 0 === $i ? 'bg-champagne-400 text-dark-950 shadow-md' : 'text-ivory-muted hover:text-ivory hover:bg-white/[0.04]' ) ); ?>"
								ar-bind:class="<?php echo esc_attr( "{ 'bg-champagne-400 text-dark-950 shadow-md': selectedId === $id, 'text-ivory-muted hover:text-ivory hover:bg-white/[0.04]': selectedId !== $id }" ); ?>"
								aria-pressed="<?php echo 0 === $i ? 'true' : 'false'; ?>"
								ar-bind:aria-pressed="<?php echo esc_attr( "selectedId === $id ? 'true' : 'false'" ); ?>"
							>
								<span class="block text-[11px] font-sans font-medium tracking-[0.2em] uppercase"><?php echo esc_html( $unit['type'] ); ?></span>
								<span class="block text-[10px] font-sans font-medium tracking-[0.12em] opacity-75 mt-0.5 normal-case"><?php echo esc_html( $unit['carpet_area'] ); ?></span>
							</button>
						<?php endforeach; ?>
					</div>
				</div>

				<div class="glass-panel p-6 sm:p-10 lg:p-14 rounded-[6px] shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
					<div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
						<?php
						foreach ( $units as $i => $unit ) :
							$id       = wp_json_encode( $unit['unit_id'] );
							$show     = esc_attr( "selectedId === $id" );
							$hidden   = 0 === $i ? '' : ' style="display: none;"';
							$features = array_slice( aranya_lines( $unit['features'] ), 0, 4 );
							$purpose  = str_replace( '{type}', $unit['type'], $s['price_purpose'] );
							$plans_js = 'Aranya.openFloorPlans(' . wp_json_encode( $unit['plans_tab'] ) . ')';
							?>
							<div class="lg:col-span-8" ar-show="<?php echo $show; ?>"<?php echo $hidden; ?>>
								<div class="relative overflow-hidden rounded-[4px] shadow-2xl bg-black border border-white/[0.06]">
									<div
										class="relative aspect-[16/10] overflow-hidden group/img cursor-zoom-in"
										ar-on:click="<?php echo esc_attr( self::lightbox_js( $unit['image'], $unit['title'] . ' — ' . $unit['type'], $unit['description'], $unit['tag'] ) ); ?>"
									>
										<?php
										echo aranya_img(
											$unit['image'],
											array(
												'alt'     => '' !== $unit['image_alt'] ? $unit['image_alt'] : null,
												'default_alt' => $unit['title'] . ' — ' . $unit['type'] . ' Residence',
												'sizes'   => '(min-width: 1024px) 891px, 100vw',
												'loading' => 0 === $i ? null : 'lazy',
												'class'   => 'w-full h-full object-cover object-center group-hover/img:scale-[1.02] transition-transform duration-700 ease-out brightness-[0.92]',
											)
										);
										echo aranya_image_credit( $unit['image'], 'absolute bottom-5 left-5 z-20' );
										?>
										<span class="absolute bottom-5 right-5 z-20 p-2.5 rounded-full glass-panel text-ivory group-hover/img:text-champagne-300 group-hover/img:scale-110 transition-all">
											<?php echo aranya_icon( 'maximize-2', 16 ); ?>
										</span>
										<div class="absolute inset-0 bg-gradient-to-t from-dark-950/70 via-transparent to-transparent"></div>
										<div class="absolute top-5 left-5 z-10">
											<span class="px-3.5 py-1.5 glass-panel text-champagne-300 text-[10px] sm:text-xs font-sans uppercase tracking-[0.2em] font-semibold rounded-full"><?php echo esc_html( $unit['tag'] ); ?></span>
										</div>
									</div>
								</div>
							</div>

							<div class="lg:col-span-4 space-y-6" ar-show="<?php echo $show; ?>"<?php echo $hidden; ?>>
								<div>
									<span class="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-champagne-400 font-semibold mb-2 block"><?php echo esc_html( $s['eyebrow_detail'] ); ?></span>
									<h3 class="font-serif text-2xl sm:text-3xl text-ivory font-light"><?php echo esc_html( $unit['title'] ); ?></h3>
									<p class="font-serif italic text-base text-champagne-300/80 mt-1"><?php echo esc_html( trim( $unit['type'] . ' ' . $s['type_suffix'] ) ); ?></p>
								</div>

								<div class="flex flex-wrap gap-2.5 text-xs font-sans">
									<span class="px-3.5 py-1.5 glass-panel-subtle text-champagne-300 rounded-full font-medium"><?php echo esc_html( trim( $s['carpet_prefix'] . ' ' . $unit['carpet_area'] ) ); ?></span>
									<?php if ( '' !== trim( (string) $unit['deck'] ) ) : ?>
										<span class="px-3.5 py-1.5 glass-panel-subtle text-champagne-300 rounded-full font-medium"><?php echo esc_html( $unit['deck'] ); ?></span>
									<?php endif; ?>
								</div>

								<p class="text-sm text-ivory-muted leading-relaxed font-light"><?php echo esc_html( $unit['description'] ); ?></p>

								<div class="space-y-2.5">
									<?php foreach ( $features as $feature ) : ?>
										<div class="flex items-start gap-2.5 text-sm text-ivory/90 font-sans">
											<?php echo aranya_icon( 'check', 14, array( 'class' => 'text-champagne-400 shrink-0 mt-0.5' ) ); ?>
											<span class="font-light"><?php echo esc_html( $feature ); ?></span>
										</div>
									<?php endforeach; ?>
								</div>

								<div class="pt-2 flex flex-col gap-3">
									<button ar-on:click="<?php echo esc_attr( $plans_js ); ?>" class="<?php echo esc_attr( self::button_class( 'gold', 'md', 'w-full' ) ); ?>"><?php echo self::button_inner( esc_html( $s['plans_label'] ), aranya_icon( 'eye', 15 ) ); ?></button>
									<button ar-on:click="<?php echo esc_attr( self::lead_js( $purpose, $unit['type'] ) ); ?>" class="btn-lux w-full py-3.5 px-6 text-xs font-sans font-semibold tracking-[0.16em] uppercase text-ivory-muted hover:text-ivory border border-white/[0.12] hover:border-champagne-400/50 rounded-[3px] glass-panel-subtle transition-all duration-300 cursor-pointer"><?php echo esc_html( $s['price_label'] ); ?></button>
								</div>

								<?php if ( '' !== trim( (string) $unit['note'] ) ) : ?>
									<p class="text-[11px] text-ivory-muted/60 font-sans font-light leading-relaxed"><?php echo esc_html( $unit['note'] ); ?></p>
								<?php endif; ?>
							</div>
						<?php endforeach; ?>
					</div>
				</div>
			</div>
		</section>
		<?php
	}
}
