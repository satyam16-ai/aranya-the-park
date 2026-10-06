<?php
/**
 * Aranya Location — sections/LocationConnectivity.tsx + LocationModal.tsx.
 *
 * The section (arterials, transit times, the drone film, the approach panel,
 * the Google map) and the full-screen location pop-up with its transit
 * schematic. Each place carries its position on the schematic, so places can
 * be added or moved in Elementor.
 *
 * @package Aranya
 */

namespace Aranya\Widgets;

defined( 'ABSPATH' ) || exit;

class Location extends Widget_Base {

	/** LocationModal.tsx CATEGORY_TONE — marker colours per category. */
	private const TONE = array(
		'connectivity'  => '#7DD3FC',
		'education'     => '#6EE7B7',
		'healthcare'    => '#FDA4AF',
		'entertainment' => '#FCD34D',
	);

	/** LocationModal.tsx getCategoryColor — list dots. */
	private const DOT = array(
		'connectivity'  => 'bg-sky-400',
		'education'     => 'bg-emerald-400',
		'healthcare'    => 'bg-rose-400',
		'entertainment' => 'bg-amber-400',
	);

	public function get_name() {
		return 'aranya-location';
	}

	public function get_title() {
		return __( 'Aranya Location', 'aranya' );
	}

	public function get_icon() {
		return 'eicon-google-maps';
	}

	private static function categories(): array {
		return array(
			'connectivity'  => __( 'Transit & highways', 'aranya' ),
			'education'     => __( 'Schools', 'aranya' ),
			'healthcare'    => __( 'Hospitals', 'aranya' ),
			'entertainment' => __( 'Retail & leisure', 'aranya' ),
		);
	}

	protected function register_controls() {
		$this->section( 'heading', __( 'Heading', 'aranya' ) );
		$this->heading_controls( 'Location', 'A Neighbourhood of Quick Access', 'Behind Evershine Mall in Mindspace, Malad West, a few minutes from the metro, schools, hospitals and malls.' );
		$this->end_section();

		$this->section( 'arterials_section', __( 'Arterial cards', 'aranya' ) );
		$this->repeater(
			'arterials',
			__( 'Cards', 'aranya' ),
			function ( $r ) {
				$this->text( 'label', __( 'Label', 'aranya' ), '', array(), $r );
				$this->text( 'detail', __( 'Detail', 'aranya' ), '', array(), $r );
				$this->text( 'note', __( 'Note', 'aranya' ), '', array(), $r );
			},
			array(
				array( 'label' => 'MALAD WEST', 'detail' => 'Mumbai 400064', 'note' => 'Mindspace Neighbourhood' ),
				array( 'label' => 'NEW LINK ROAD', 'detail' => '18.3 m Access Road', 'note' => 'Behind Evershine Mall' ),
				array( 'label' => 'WESTERN EXPRESS', 'detail' => '14 Minutes', 'note' => 'North–South Highway' ),
			),
			'{{{ label }}}'
		);
		$this->end_section();

		$this->section( 'transit_section', __( 'Transit cards', 'aranya' ) );
		$this->repeater(
			'transit',
			__( 'Cards', 'aranya' ),
			function ( $r ) {
				$this->select( 'icon', __( 'Icon', 'aranya' ), aranya_icon_options(), 'train', array(), $r );
				$this->text( 'time', __( 'Time', 'aranya' ), '', array(), $r );
				$this->text( 'label', __( 'Label', 'aranya' ), '', array(), $r );
				$this->text( 'note', __( 'Note', 'aranya' ), '', array(), $r );
			},
			array(
				array( 'icon' => 'train', 'time' => '3 min', 'label' => 'Metro 2A', 'note' => 'Malad West Station' ),
				array( 'icon' => 'shopping-bag', 'time' => '4 min', 'label' => 'Inorbit Mall', 'note' => 'Retail & Dining' ),
				array( 'icon' => 'map-pin', 'time' => '9 min', 'label' => 'Malad Station', 'note' => 'Western Railway' ),
			),
			'{{{ time }}} — {{{ label }}}'
		);
		$this->end_section();

		$this->section( 'film', __( 'Route film', 'aranya' ) );
		$this->media( 'film_large', __( 'Video (desktop, 1920 px)', 'aranya' ), 'video/location-route-1920.mp4', array( 'media_types' => array( 'video' ) ) );
		$this->media( 'film_small', __( 'Video (phones, 960 px)', 'aranya' ), 'video/location-route-960.mp4', array( 'media_types' => array( 'video' ) ) );
		$this->media( 'film_poster', __( 'Poster image', 'aranya' ), 'video/location-route-poster.webp' );
		$this->text( 'film_label', __( 'Accessible description', 'aranya' ), 'Drone film of the route from Malad Station to Aranya The Park, via S. V. Road' );
		$this->text( 'film_route', __( 'Caption — route label', 'aranya' ), 'Route 01' );
		$this->text( 'film_caption', __( 'Caption', 'aranya' ), 'Malad Station to the site, via S. V. Road' );
		$this->end_section();

		$this->section( 'approach', __( 'Approach panel', 'aranya' ) );
		$this->text( 'approach_eyebrow', __( 'Eyebrow', 'aranya' ), 'The Approach' );
		$this->text( 'approach_title', __( 'Title', 'aranya' ), 'Straight onto New Link Road' );
		$this->textarea( 'approach_text', __( 'Text', 'aranya' ), 'An 18.3-metre-wide access road leads from Aranya straight onto New Link Road. Metro Line 2A already runs close by, and the Coastal Road northern extension, the GMLR tunnel and Metro Line 6 will bring more of the city within reach.' );
		$this->repeater(
			'links',
			__( 'Pop-up links', 'aranya' ),
			function ( $r ) {
				$this->select( 'category', __( 'Opens the map at', 'aranya' ), array_merge( array( 'all' => __( 'All destinations', 'aranya' ) ), self::categories() ), 'all', array(), $r );
				$this->text( 'label', __( 'Label', 'aranya' ), '', array(), $r );
				$this->text( 'sub', __( 'Second line', 'aranya' ), '', array(), $r );
			},
			array(
				// React passes 'transit' here, which matched no place; 'connectivity' is the category it means.
				array( 'category' => 'connectivity', 'label' => 'Transit & Highways', 'sub' => 'Metro 2A, Malad Station, WEH' ),
				array( 'category' => 'education', 'label' => 'Schools', 'sub' => 'Kothari Starz, Vibgyor Rise, Ryan Intl., Witty Intl.' ),
				array( 'category' => 'healthcare', 'label' => 'Hospitals', 'sub' => 'CritiCare Asia, Cloudnine, Lifeline Medicare' ),
			),
			'{{{ label }}}'
		);
		$this->text( 'map_button', __( 'Full map button', 'aranya' ), 'VIEW FULL MAP' );
		$this->text( 'directions_button', __( 'Directions button', 'aranya' ), 'GET DIRECTIONS' );
		$this->end_section();

		$this->section( 'map', __( 'Google map', 'aranya' ) );
		$this->text( 'map_eyebrow', __( 'Eyebrow', 'aranya' ), 'On the Map' );
		$this->text( 'map_title', __( 'Title', 'aranya' ), 'Behind Evershine Mall, Malad West' );
		$this->text( 'map_query', __( 'Map search (when no embed URL is set)', 'aranya' ), 'Aranya The Park, Behind Evershine Mall, Mindspace, Malad West, Mumbai 400064', array( 'description' => __( 'Paste the pin\'s embed URL in Aranya → Site Settings → Contact to show the exact pin.', 'aranya' ) ) );
		$this->text( 'map_iframe_title', __( 'Map title (accessibility)', 'aranya' ), 'Aranya The Park on Google Maps' );
		$this->end_section();

		$this->section( 'modal_head', __( 'Pop-up — header & intro', 'aranya' ) );
		$this->text( 'm_eyebrow', __( 'Eyebrow', 'aranya' ), 'PRIME PIN CODE 400064 · MALAD WEST, MUMBAI' );
		$this->text( 'm_badge', __( 'Badge', 'aranya' ), '+16.7% Appreciation (3 Yrs)' );
		$this->text( 'm_title', __( 'Title', 'aranya' ), 'A Neighbourhood of Quick Access' );
		$this->text( 'm_maps_query', __( 'Google Maps search', 'aranya' ), 'Aranya The Park Malad West Behind Evershine Mall Mumbai' );
		$this->text( 'm_maps_label', __( 'Google Maps button', 'aranya' ), 'Google Maps' );
		$this->text( 'm_visit_label', __( 'Site visit button', 'aranya' ), 'Schedule Site Visit' );
		$this->textarea( 'm_intro', __( 'Intro', 'aranya' ), 'Behind Evershine Mall in Mindspace, Malad West, with an 18.3-metre-wide access road straight onto New Link Road. Malad West Metro is 3 minutes away, the Western Express Highway 14.' );
		$this->text( 'm_growth_label', __( 'Growth label', 'aranya' ), 'Malad West Capital Growth:' );
		$this->text( 'm_growth_1', __( 'Growth figure 1', 'aranya' ), '+10.5% (1 Yr)' );
		$this->text( 'm_growth_2', __( 'Growth figure 2', 'aranya' ), '+16.7% (3 Yrs)' );
		$this->end_section();

		$this->section( 'modal_map', __( 'Pop-up — map', 'aranya' ) );
		$this->text( 'm_schematic_label', __( 'Schematic tab', 'aranya' ), 'Transit Schematic' );
		$this->text( 'm_regional_label', __( 'Regional map tab', 'aranya' ), 'Regional Map' );
		$this->media( 'm_regional_image', __( 'Regional map image', 'aranya' ), 'opt/location-map-cropped-2800.webp' );
		$this->text( 'm_regional_caveat', __( 'Regional map note', 'aranya' ), 'Map not to scale. Times and distances may vary during peak hours, with traffic, and with time spent travelling between locations.' );
		$this->text( 'm_tip_desktop', __( 'Tip (desktop)', 'aranya' ), 'Select a marker to trace the route · numbers are minutes' );
		$this->text( 'm_tip_mobile', __( 'Tip (phones)', 'aranya' ), 'Swipe the map · tap a marker for details' );
		$this->text( 'm_all_label', __( 'All destinations tab', 'aranya' ), 'All Destinations' );
		$this->text( 'm_cat_connectivity', __( 'Transit tab / legend', 'aranya' ), 'Transit & Highways' );
		$this->text( 'm_cat_education', __( 'Schools tab / legend', 'aranya' ), 'Schools' );
		$this->text( 'm_cat_healthcare', __( 'Hospitals tab / legend', 'aranya' ), 'Hospitals' );
		$this->text( 'm_cat_entertainment', __( 'Retail tab / legend', 'aranya' ), 'Retail & Leisure' );
		$this->end_section();

		$this->section( 'modal_places', __( 'Pop-up — places', 'aranya' ) );
		$this->note( __( 'Map X/Y are positions on the schematic (1120 × 560). Leave empty to list a place without a marker.', 'aranya' ) );
		$this->repeater(
			'places',
			__( 'Places', 'aranya' ),
			function ( $r ) {
				$this->text( 'place_id', __( 'ID (no spaces)', 'aranya' ), 'place', array(), $r );
				$this->text( 'name', __( 'Name', 'aranya' ), '', array(), $r );
				$this->select( 'category', __( 'Category', 'aranya' ), self::categories(), 'connectivity', array(), $r );
				$this->text( 'time', __( 'Time (e.g. "3 Mins")', 'aranya' ), '', array(), $r );
				$this->text( 'distance_note', __( 'Description', 'aranya' ), '', array(), $r );
				$this->text( 'route_note', __( 'Route note', 'aranya' ), '', array(), $r );
				$this->text( 'map_x', __( 'Map X', 'aranya' ), '', array(), $r );
				$this->text( 'map_y', __( 'Map Y', 'aranya' ), '', array(), $r );
				$this->text( 'map_label', __( 'Map label', 'aranya' ), '', array(), $r );
				$this->select(
					'label_side',
					__( 'Label side', 'aranya' ),
					array(
						'n' => __( 'Above', 'aranya' ),
						's' => __( 'Below', 'aranya' ),
						'e' => __( 'Right', 'aranya' ),
						'w' => __( 'Left', 'aranya' ),
					),
					'e',
					array(),
					$r
				);
			},
			array_map(
				static function ( $p ) {
					$p['map_x'] = (string) $p['map_x'];
					$p['map_y'] = (string) $p['map_y'];
					return $p;
				},
				aranya_defaults( 'places' )
			),
			'{{{ name }}}'
		);
		$this->end_section();

		$this->section( 'modal_details', __( 'Pop-up — details & infrastructure', 'aranya' ) );
		$this->text( 'm_details_label', __( 'Details card eyebrow', 'aranya' ), 'Destination Details' );
		$this->text( 'm_category_label', __( 'Category label', 'aranya' ), 'Category' );
		$this->text( 'm_time_label', __( 'Time label', 'aranya' ), 'Commute Time' );
		$this->text( 'm_infra_heading', __( 'Infrastructure heading', 'aranya' ), 'Infrastructure Shaping Malad West' );
		$this->repeater(
			'infrastructure',
			__( 'Infrastructure', 'aranya' ),
			function ( $r ) {
				$this->text( 'status', __( 'Status', 'aranya' ), '', array(), $r );
				$this->text( 'name', __( 'Name', 'aranya' ), '', array(), $r );
				$this->textarea( 'description', __( 'Description', 'aranya' ), '', array( 'rows' => 2 ), $r );
				$this->text( 'benefit', __( 'Benefit', 'aranya' ), '', array(), $r );
			},
			aranya_defaults( 'infrastructure' ),
			'{{{ name }}}'
		);
		$this->text( 'm_book_label', __( 'Book visit button', 'aranya' ), 'Book Site Visit' );
		$this->text( 'm_directions_label', __( 'Directions button', 'aranya' ), 'Driving Directions' );
		$this->end_section();

		$this->section( 'section_settings', __( 'Section', 'aranya' ) );
		$this->anchor( 'location' );
		$this->end_section();
	}

	protected function render() {
		$s          = $this->get_settings_for_display();
		$arterials  = array_values( (array) $s['arterials'] );
		$embed      = (string) aranya_setting( 'map_embed_url' );
		$embed      = '' !== $embed ? $embed : 'https://maps.google.com/maps?q=' . aranya_encode_uri_component( (string) $s['map_query'] ) . '&z=16&output=embed';
		$film       = array(
			'large' => aranya_video_url( $s['film_large'] ),
			'small' => aranya_video_url( $s['film_small'] ),
		);
		$poster     = aranya_image_url( $s['film_poster'] );
		$muted_link = 'btn-lux py-3.5 px-6 text-xs font-sans font-semibold tracking-[0.16em] uppercase text-ivory-muted hover:text-ivory border border-white/[0.12] hover:border-champagne-400/50 rounded-[3px] glass-panel-subtle transition-all duration-300 cursor-pointer inline-flex items-center gap-2';
		?>
		<section ar-data id="<?php echo esc_attr( $s['anchor'] ); ?>" class="section-spacing bg-dark-900 text-ivory relative isolate overflow-hidden">
			<?php $this->print_backdrop(); ?>

			<div class="<?php echo esc_attr( self::container_class( 'showcase' ) ); ?>">
				<?php $this->print_section_heading( $s ); ?>

				<div class="grid grid-cols-2 md:grid-cols-3 gap-3 mb-14">
					<?php
					foreach ( $arterials as $i => $a ) :
						$span = ( count( $arterials ) - 1 === $i && count( $arterials ) % 2 ) ? 'col-span-2 md:col-span-1' : '';
						?>
						<div class="<?php echo esc_attr( 'glass-panel p-4 rounded-[4px] text-center space-y-1 hover:border-champagne-400/30 transition-colors ' . $span ); ?>">
							<span class="font-sans text-xs uppercase tracking-[0.2em] text-champagne-300 font-bold block"><?php echo esc_html( $a['label'] ); ?></span>
							<span class="font-serif text-sm text-ivory font-light block"><?php echo esc_html( $a['detail'] ); ?></span>
							<span class="font-sans text-[10px] text-ivory-muted/60 block"><?php echo esc_html( $a['note'] ); ?></span>
						</div>
					<?php endforeach; ?>
				</div>

				<div class="grid grid-cols-3 gap-2.5 sm:gap-4 mb-16">
					<?php foreach ( (array) $s['transit'] as $t ) : ?>
						<div class="text-center space-y-2.5 p-3 sm:p-5 glass-panel-subtle rounded-[4px] hover:border-champagne-400/30 transition-all cursor-default">
							<div class="w-10 h-10 mx-auto rounded-full glass-control flex items-center justify-center text-champagne-400">
								<?php echo aranya_icon( $t['icon'], 17 ); ?>
							</div>
							<div>
								<span class="block font-serif text-2xl font-light text-champagne-300"><?php echo esc_html( $t['time'] ); ?></span>
								<span class="block text-xs font-sans text-ivory font-medium mt-0.5"><?php echo esc_html( $t['label'] ); ?></span>
								<span class="block text-[10px] font-sans text-ivory-muted/60 mt-0.5"><?php echo esc_html( $t['note'] ); ?></span>
							</div>
						</div>
					<?php endforeach; ?>
				</div>

				<?php if ( '' !== $film['large'] ) : ?>
					<figure class="mb-16">
						<div class="relative aspect-[20/9] bg-black rounded-[6px] overflow-hidden border border-white/[0.08] shadow-[0_25px_60px_rgba(0,0,0,0.7)]">
							<video
								ar-data="routeFilm(<?php echo esc_attr( aranya_json( $film ) ); ?>)"
								ar-on:play="onPlay()"
								ar-on:pause="onPause()"
								poster="<?php echo esc_url( $poster ); ?>"
								muted
								loop
								playsinline
								controls
								preload="none"
								class="absolute inset-0 w-full h-full object-cover"
								aria-label="<?php echo esc_attr( $s['film_label'] ); ?>"
							></video>
						</div>
						<figcaption class="mt-3 font-sans text-[11px] uppercase tracking-[0.2em] text-ivory-muted/70">
							<span class="text-champagne-300"><?php echo esc_html( $s['film_route'] ); ?></span> · <?php echo esc_html( $s['film_caption'] ); ?>
						</figcaption>
					</figure>
				<?php endif; ?>

				<div class="glass-panel p-6 sm:p-10 lg:p-12 rounded-[6px] shadow-[0_25px_60px_rgba(0,0,0,0.7)]">
					<div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
						<div class="lg:col-span-12 space-y-6">
							<div>
								<span class="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-champagne-400 font-semibold mb-2 block"><?php echo esc_html( $s['approach_eyebrow'] ); ?></span>
								<h3 class="font-serif text-2xl sm:text-3xl text-ivory font-light"><?php echo esc_html( $s['approach_title'] ); ?></h3>
							</div>

							<p class="font-sans text-sm text-ivory-muted leading-relaxed font-light"><?php echo aranya_inline( $s['approach_text'] ); ?></p>

							<div class="space-y-2.5 pt-2">
								<?php foreach ( (array) $s['links'] as $link ) : ?>
									<button ar-on:click="<?php echo esc_attr( 'Aranya.openLocation(' . wp_json_encode( $link['category'] ) . ')' ); ?>" class="w-full p-3.5 glass-control hover:border-champagne-400/40 transition-all cursor-pointer flex items-center justify-between group/item rounded-[4px]">
										<div class="text-left">
											<span class="text-xs font-semibold text-ivory group-hover/item:text-champagne-300 transition-colors uppercase tracking-wider block"><?php echo esc_html( $link['label'] ); ?></span>
											<span class="text-[11px] text-ivory-muted/70 font-light block"><?php echo esc_html( $link['sub'] ); ?></span>
										</div>
										<?php echo aranya_icon( 'arrow-right', 14, array( 'class' => 'text-champagne-400/50 group-hover/item:text-champagne-400 group-hover/item:translate-x-1 transition-all shrink-0' ) ); ?>
									</button>
								<?php endforeach; ?>
							</div>

							<div class="pt-2 flex flex-wrap items-center gap-3">
								<button ar-on:click="Aranya.openLocation('all')" class="<?php echo esc_attr( self::button_class( 'gold', 'md' ) ); ?>"><?php echo self::button_inner( esc_html( $s['map_button'] ), aranya_icon( 'maximize-2', 15 ) ); ?></button>
								<a href="<?php echo esc_url( aranya_directions_url() ); ?>" target="_blank" rel="noopener noreferrer" class="<?php echo esc_attr( $muted_link ); ?>">
									<?php echo aranya_icon( 'navigation', 14 ); ?>
									<?php echo esc_html( $s['directions_button'] ); ?>
								</a>
							</div>
						</div>
					</div>
				</div>

				<div class="mt-16">
					<div class="mb-5">
						<span class="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-champagne-400 font-semibold mb-2 block"><?php echo esc_html( $s['map_eyebrow'] ); ?></span>
						<h3 class="font-serif text-2xl sm:text-3xl text-ivory font-light"><?php echo esc_html( $s['map_title'] ); ?></h3>
					</div>
					<div class="relative h-[360px] sm:h-[460px] rounded-[6px] overflow-hidden border border-white/[0.08] shadow-[0_25px_60px_rgba(0,0,0,0.7)] bg-dark-950">
						<iframe src="<?php echo esc_url( $embed ); ?>" title="<?php echo esc_attr( $s['map_iframe_title'] ); ?>" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen class="absolute inset-0 w-full h-full border-0"></iframe>
					</div>
					<p class="mt-3 flex items-start gap-2 font-sans text-xs text-ivory-muted">
						<?php echo aranya_icon( 'map-pin', 14, array( 'class' => 'text-champagne-400 shrink-0 mt-px' ) ); ?>
						<span><?php echo esc_html( aranya_setting( 'address' ) ); ?></span>
					</p>
				</div>
			</div>
		</section>
		<?php
		$this->render_modal( $s );
	}

	/** LocationModal.tsx platePosition(): hangs a label plate off a marker. */
	private static function plate( string $side, float $w ): array {
		$h = 15;
		switch ( $side ) {
			case 'n':
				return array( -$w / 2, -17 - $h, 0, -17 - $h + 10.5 );
			case 's':
				return array( -$w / 2, 17, 0, 27.5 );
			case 'e':
				return array( 16, -$h / 2, 16 + $w / 2, 3 );
			default:
				return array( -16 - $w, -$h / 2, -16 - $w / 2, 3 );
		}
	}

	/** Numbers printed the way React prints them in SVG attributes. */
	private static function n( float $v ): string {
		$s = rtrim( rtrim( number_format( $v, 4, '.', '' ), '0' ), '.' );
		return '-0' === $s ? '0' : $s;
	}

	private function render_modal( array $s ): void {
		$places = array_values( (array) $s['places'] );
		$nodes  = array();
		foreach ( $places as $p ) {
			$nodes[] = array(
				'id'       => $p['place_id'],
				'name'     => $p['name'],
				'category' => $p['category'],
				'time'     => $p['time'],
				'distance' => $p['distance_note'],
				'routeNote' => $p['route_note'],
				'x'        => is_numeric( $p['map_x'] ) ? (float) $p['map_x'] : '',
				'y'        => is_numeric( $p['map_y'] ) ? (float) $p['map_y'] : '',
			);
		}
		$first  = $places[0] ?? null;
		$uid    = $this->get_id();
		$maps   = 'https://www.google.com/maps/search/?api=1&query=' . aranya_encode_uri_component( (string) $s['m_maps_query'] );
		$cats   = array(
			'all'           => $s['m_all_label'],
			'connectivity'  => $s['m_cat_connectivity'],
			'education'     => $s['m_cat_education'],
			'healthcare'    => $s['m_cat_healthcare'],
			'entertainment' => $s['m_cat_entertainment'],
		);
		$j      = static fn( $v ) => esc_attr( wp_json_encode( $v ) );
		$tab_on = 'bg-champagne-400 text-dark-950 font-semibold shadow-sm';
		$tab_off = 'text-ivory-muted hover:text-ivory';
		?>
		<div ar-data="locationModal(<?php echo esc_attr( aranya_json( array( 'nodes' => $nodes ) ) ); ?>)" data-aranya-modal="location">
			<template ar-teleport="body">
				<div ar-show="isOpen" style="display: none;" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6" role="dialog" aria-modal="true" aria-label="Location and connectivity">
					<div class="absolute inset-0 bg-dark-950/90 backdrop-blur-xl animate-fade-in" ar-on:click="close()"></div>

					<div class="relative w-full max-w-7xl h-[94vh] max-h-[94vh] bg-dark-900 border border-white/[0.12] shadow-[0_25px_70px_rgba(0,0,0,0.85)] rounded-[4px] flex flex-col overflow-hidden animate-scale-in">
						<div class="px-4 sm:px-6 py-3.5 bg-dark-950/90 border-b border-white/[0.08] flex items-center justify-between gap-3 shrink-0">
							<div class="min-w-0">
								<div class="flex items-center gap-2">
									<span class="text-champagne-300 text-[10px] tracking-[0.3em] uppercase font-sans font-semibold"><?php echo esc_html( $s['m_eyebrow'] ); ?></span>
									<?php if ( '' !== trim( $s['m_badge'] ) ) : ?>
										<span class="hidden md:inline-flex items-center gap-1 text-[10px] text-ivory-muted/70 font-sans border-l border-white/[0.1] pl-2">
											<?php echo aranya_icon( 'sparkles', 11, array( 'class' => 'text-champagne-400' ) ); ?>
											<?php echo esc_html( $s['m_badge'] ); ?>
										</span>
									<?php endif; ?>
								</div>
								<h2 class="font-serif text-base sm:text-xl text-ivory font-light truncate"><?php echo esc_html( $s['m_title'] ); ?></h2>
							</div>

							<div class="flex items-center gap-2 shrink-0">
								<a href="<?php echo esc_url( $maps ); ?>" target="_blank" rel="noopener noreferrer" class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] border border-white/[0.1] text-ivory hover:text-champagne-300 text-xs font-sans uppercase tracking-wider transition-colors rounded-[3px]">
									<?php echo aranya_icon( 'navigation', 12 ); ?>
									<span><?php echo esc_html( $s['m_maps_label'] ); ?></span>
									<?php echo aranya_icon( 'external-link', 10 ); ?>
								</a>
								<button ar-on:click="Aranya.openLead('Arrange a Site Visit')" class="<?php echo esc_attr( self::button_class( 'outline-gold', 'sm', 'hidden md:inline-flex' ) ); ?>"><?php echo self::button_inner( esc_html( $s['m_visit_label'] ) ); ?></button>
								<button ar-on:click="close()" class="p-2 min-h-[38px] min-w-[38px] flex items-center justify-center text-ivory-muted hover:text-ivory hover:bg-white/[0.06] rounded-full transition-colors cursor-pointer ml-1" aria-label="Close Pop-up Window" title="Close (ESC)">
									<?php echo aranya_icon( 'x', 18, array( 'stroke' => 1.5 ) ); ?>
								</button>
							</div>
						</div>

						<div class="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
							<div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-[4px] bg-white/[0.02] border border-white/[0.08] text-xs">
								<div class="max-w-2xl text-ivory-muted leading-relaxed font-light"><?php echo aranya_inline( $s['m_intro'] ); ?></div>
								<div class="inline-flex flex-wrap items-center gap-3 text-[11px] text-ivory-muted bg-white/[0.03] border border-white/[0.08] px-3.5 py-1.5 rounded-[3px] shrink-0">
									<span class="text-champagne-300 font-medium flex items-center gap-1">
										<?php echo aranya_icon( 'sparkles', 11, array( 'class' => 'text-champagne-400' ) ); ?> <?php echo esc_html( $s['m_growth_label'] ); ?>
									</span>
									<span class="text-ivory font-medium"><?php echo esc_html( $s['m_growth_1'] ); ?></span>
									<span class="text-white/[0.2]">•</span>
									<span class="text-ivory font-medium"><?php echo esc_html( $s['m_growth_2'] ); ?></span>
								</div>
							</div>

							<div class="bg-dark-950 border border-white/[0.08] rounded-[4px] shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
								<div class="px-4 sm:px-5 py-3 bg-dark-900/90 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
									<div class="flex items-center gap-2">
										<span class="w-2 h-2 rounded-full bg-champagne-400 animate-pulse"></span>
										<span class="font-sans text-xs font-semibold uppercase tracking-wider text-champagne-300" ar-text="<?php echo esc_attr( "mapMode === 'schematic' ? " . wp_json_encode( $s['m_schematic_label'] ) . ' : ' . wp_json_encode( $s['m_regional_label'] ) ); ?>"><?php echo esc_html( $s['m_schematic_label'] ); ?></span>
									</div>
									<div class="inline-flex p-0.5 bg-white/[0.03] border border-white/[0.08] rounded-[3px] text-xs">
										<button ar-on:click="mapMode = 'schematic'" class="<?php echo esc_attr( 'px-3 py-1 font-sans text-[11px] uppercase tracking-wider transition-all rounded-[2px] cursor-pointer ' . $tab_on ); ?>" ar-bind:class="<?php echo esc_attr( "{ '$tab_on': mapMode === 'schematic', '$tab_off': mapMode !== 'schematic' }" ); ?>"><?php echo esc_html( $s['m_schematic_label'] ); ?></button>
										<button ar-on:click="mapMode = 'brochure'" class="<?php echo esc_attr( 'px-3 py-1 font-sans text-[11px] uppercase tracking-wider transition-all rounded-[2px] cursor-pointer ' . $tab_off ); ?>" ar-bind:class="<?php echo esc_attr( "{ '$tab_on': mapMode === 'brochure', '$tab_off': mapMode !== 'brochure' }" ); ?>"><?php echo esc_html( $s['m_regional_label'] ); ?></button>
									</div>
								</div>

								<div ar-show="mapMode === 'schematic'">
									<div class="relative w-full bg-[#0c0d0c] select-none overflow-x-auto overflow-y-hidden">
										<div class="relative min-w-[900px] aspect-[2/1]">
											<?php $this->print_schematic( $places, $first, $uid ); ?>
										</div>
									</div>
									<div class="px-4 sm:px-5 py-2.5 bg-dark-900/90 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[10px]">
										<div class="flex flex-wrap items-center gap-x-4 gap-y-1.5">
											<?php foreach ( self::TONE as $cat => $tone ) : ?>
												<span class="inline-flex items-center gap-1.5 text-ivory-muted">
													<span class="w-2 h-2 rounded-full shrink-0" style="background-color: <?php echo esc_attr( $tone ); ?>;"></span>
													<span class="whitespace-nowrap"><?php echo esc_html( $cats[ $cat ] ); ?></span>
												</span>
											<?php endforeach; ?>
											<span class="inline-flex items-center gap-1.5 text-ivory-muted">
												<span class="w-3 h-[3px] bg-[#EAB308] shrink-0"></span>
												<span class="whitespace-nowrap">Metro Line 2A</span>
											</span>
											<span class="inline-flex items-center gap-1.5 text-ivory-muted">
												<span class="w-3 h-[3px] bg-[#C8A96B] shrink-0"></span>
												<span class="whitespace-nowrap">18.3 m Access Road</span>
											</span>
										</div>
										<span class="text-ivory-muted/80 hidden sm:inline"><?php echo esc_html( $s['m_tip_desktop'] ); ?></span>
										<span class="text-ivory-muted/80 sm:hidden"><?php echo esc_html( $s['m_tip_mobile'] ); ?></span>
									</div>
								</div>

								<div ar-show="mapMode === 'brochure'" style="display: none;">
									<div class="relative w-full aspect-square sm:aspect-[4/3] lg:aspect-[16/10] bg-dark-950 overflow-hidden">
										<div class="w-full h-full flex items-center justify-center p-2 transition-transform duration-500 cursor-zoom-in scale-100" ar-bind:class="{ 'scale-150 cursor-zoom-out': isBrochureZoomed, 'scale-100': !isBrochureZoomed }" ar-on:click="isBrochureZoomed = !isBrochureZoomed">
											<?php
											echo aranya_img(
												$s['m_regional_image'],
												array(
													'sizes'   => '(min-width: 1280px) 1150px, 100vw',
													'loading' => 'lazy',
													'class'   => 'max-h-full max-w-full object-contain filter contrast-[1.1] brightness-[0.95]',
												)
											);
											?>
										</div>
										<div class="absolute bottom-3 left-3 z-10">
											<button ar-on:click="isBrochureZoomed = !isBrochureZoomed" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-dark-900/90 border border-white/[0.12] text-champagne-300 hover:text-white text-[11px] font-sans uppercase tracking-wider backdrop-blur-md cursor-pointer rounded-[3px]">
												<?php echo aranya_icon( 'maximize-2', 12 ); ?>
												<span ar-text="isBrochureZoomed ? 'Reset View' : 'Zoom In'">Zoom In</span>
											</button>
										</div>
									</div>
									<p class="px-4 sm:px-5 py-2.5 bg-dark-900/90 border-t border-white/[0.08] font-sans text-[11px] text-ivory-muted/80"><?php echo esc_html( $s['m_regional_caveat'] ); ?></p>
								</div>
							</div>

							<div class="flex items-center gap-2 overflow-x-auto pb-1">
								<?php
								foreach ( $cats as $cat => $label ) :
									$on  = 'bg-champagne-400 text-dark-950 border-champagne-300 font-semibold';
									$off = 'border-white/[0.08] text-ivory-muted hover:text-ivory hover:border-white/[0.2]';
									?>
									<button ar-on:click="applyCategoryFilter(<?php echo $j( $cat ); ?>)" class="<?php echo esc_attr( 'px-3.5 py-1.5 text-xs font-sans uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer rounded-full border ' . ( 'all' === $cat ? $on : $off ) ); ?>" ar-bind:class="<?php echo esc_attr( "{ '$on': activeCategoryFilter === " . wp_json_encode( $cat ) . ", '$off': activeCategoryFilter !== " . wp_json_encode( $cat ) . ' }' ); ?>"><?php echo esc_html( $label ); ?></button>
								<?php endforeach; ?>
							</div>

							<div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
								<div class="lg:col-span-5 p-5 bg-white/[0.02] border border-white/[0.1] rounded-[4px] space-y-4">
									<div class="flex items-center justify-between">
										<span class="text-[10px] uppercase tracking-widest text-champagne-300 font-semibold"><?php echo esc_html( $s['m_details_label'] ); ?></span>
										<span class="inline-flex items-center gap-1 text-xs text-ivory font-semibold bg-white/[0.04] border border-white/[0.08] px-2.5 py-0.5 rounded-[3px]">
											<?php echo aranya_icon( 'clock', 12, array( 'class' => 'text-champagne-400' ) ); ?>
											<span ar-text="selected.time"><?php echo esc_html( $first['time'] ?? '' ); ?></span>
										</span>
									</div>
									<div>
										<h3 class="font-serif text-lg sm:text-xl text-ivory font-medium" ar-text="selected.name"><?php echo esc_html( $first['name'] ?? '' ); ?></h3>
										<p class="text-xs text-ivory-muted leading-relaxed font-light mt-1" ar-text="selected.distance"><?php echo esc_html( $first['distance_note'] ?? '' ); ?></p>
									</div>
									<div class="grid grid-cols-2 gap-3 pt-2 border-t border-white/[0.08] text-xs">
										<div>
											<span class="text-[10px] uppercase text-ivory-muted/70 block"><?php echo esc_html( $s['m_category_label'] ); ?></span>
											<span class="text-champagne-300 font-medium capitalize" ar-text="selected.category"><?php echo esc_html( $first['category'] ?? '' ); ?></span>
										</div>
										<div>
											<span class="text-[10px] uppercase text-ivory-muted/70 block"><?php echo esc_html( $s['m_time_label'] ); ?></span>
											<span class="text-ivory font-medium" ar-text="selected.time"><?php echo esc_html( $first['time'] ?? '' ); ?></span>
										</div>
									</div>
									<div ar-show="selected.routeNote" class="p-2.5 bg-white/[0.02] border border-white/[0.06] rounded-[3px] text-[11px] text-ivory-muted flex items-start gap-2">
										<?php echo aranya_icon( 'info', 13, array( 'class' => 'text-champagne-400 shrink-0 mt-0.5' ) ); ?>
										<span ar-text="selected.routeNote"><?php echo esc_html( $first['route_note'] ?? '' ); ?></span>
									</div>
								</div>

								<div class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
									<?php
									foreach ( $places as $i => $p ) :
										$pid = $j( $p['place_id'] );
										$on  = 'bg-white/[0.08] border-champagne-400 text-ivory shadow-md';
										$off = 'bg-white/[0.02] border-white/[0.06] text-ivory-muted hover:text-ivory hover:border-white/[0.15]';
										?>
										<button ar-show="inFilter(<?php echo $pid; ?>)" ar-on:click="selectedNodeId = <?php echo $pid; ?>" class="<?php echo esc_attr( 'p-3 text-left transition-all cursor-pointer rounded-[4px] border flex items-center justify-between gap-3 ' . ( 0 === $i ? $on : $off ) ); ?>" ar-bind:class="<?php echo esc_attr( "{ '$on': isSel(" . wp_json_encode( $p['place_id'] ) . "), '$off': !isSel(" . wp_json_encode( $p['place_id'] ) . ') }' ); ?>">
											<div class="min-w-0">
												<div class="flex items-center gap-1.5 mb-0.5">
													<span class="<?php echo esc_attr( 'w-1.5 h-1.5 rounded-full ' . ( self::DOT[ $p['category'] ] ?? 'bg-champagne-300' ) ); ?>"></span>
													<span class="text-[10px] uppercase tracking-wider text-ivory-muted/70"><?php echo esc_html( $p['category'] ); ?></span>
												</div>
												<div class="text-xs font-medium truncate text-ivory"><?php echo esc_html( $p['name'] ); ?></div>
											</div>
											<div class="shrink-0 text-right">
												<span class="text-xs font-semibold text-champagne-300"><?php echo esc_html( $p['time'] ); ?></span>
											</div>
										</button>
									<?php endforeach; ?>
								</div>
							</div>

							<div class="pt-4 border-t border-white/[0.08]">
								<h4 class="font-serif text-sm uppercase tracking-[0.2em] text-champagne-300 font-semibold mb-4"><?php echo esc_html( $s['m_infra_heading'] ); ?></h4>
								<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
									<?php foreach ( (array) $s['infrastructure'] as $proj ) : ?>
										<div class="p-4 bg-white/[0.02] border border-white/[0.06] rounded-[4px] space-y-2">
											<div class="flex items-center justify-between">
												<span class="text-[10px] font-sans uppercase tracking-wider text-champagne-300 font-semibold"><?php echo esc_html( $proj['status'] ); ?></span>
											</div>
											<h5 class="font-sans text-xs font-semibold text-ivory"><?php echo esc_html( $proj['name'] ); ?></h5>
											<p class="text-[11px] text-ivory-muted leading-relaxed font-light"><?php echo esc_html( $proj['description'] ); ?></p>
											<p class="text-[10px] text-champagne-300/80 font-sans pt-1 border-t border-white/[0.06]"><?php echo esc_html( $proj['benefit'] ); ?></p>
										</div>
									<?php endforeach; ?>
								</div>
							</div>
						</div>

						<div class="px-4 sm:px-6 py-3 bg-dark-950/95 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 shrink-0">
							<div class="flex items-center gap-2 text-xs text-ivory-muted">
								<?php echo aranya_icon( 'map-pin', 14, array( 'class' => 'text-champagne-400' ) ); ?>
								<span class="line-clamp-1"><?php echo esc_html( aranya_setting( 'address' ) ); ?></span>
							</div>
							<div class="flex items-center gap-2.5">
								<button ar-on:click="close(); Aranya.openLead('Book a Site Visit')" class="<?php echo esc_attr( self::button_class( 'gold', 'sm' ) ); ?>"><?php echo self::button_inner( esc_html( $s['m_book_label'] ) ); ?></button>
								<a href="<?php echo esc_url( $maps ); ?>" target="_blank" rel="noopener noreferrer" class="<?php echo esc_attr( self::button_class( 'outline', 'sm' ) ); ?>"><?php echo self::button_inner( esc_html( $s['m_directions_label'] ), aranya_icon( 'navigation', 13 ) ); ?></a>
							</div>
						</div>
					</div>
				</div>
			</template>
		</div>
		<?php
	}

	/**
	 * The transit schematic (LocationModal.tsx). The corridors are fixed art;
	 * the markers and labels come from the places.
	 */
	private function print_schematic( array $places, ?array $first, string $uid ): void {
		$grid  = 'modalMapGrid-' . $uid;
		$water = 'modalWaterGrad-' . $uid;
		$pulse = 'modalAranyaPulse-' . $uid;
		$j     = static fn( $v ) => esc_attr( wp_json_encode( $v ) );
		$fx    = is_numeric( $first['map_x'] ?? '' ) ? self::n( (float) $first['map_x'] ) : '300';
		$fy    = is_numeric( $first['map_y'] ?? '' ) ? self::n( (float) $first['map_y'] ) : '440';
		?>
		<svg viewBox="0 0 1120 560" class="w-full h-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Schematic map of Aranya The Park, just west of New Link Road in Mindspace, with its 18.3 metre access road and the transit, schools, hospitals and retail around it">
			<defs>
				<pattern id="<?php echo esc_attr( $grid ); ?>" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"></path></pattern>
				<linearGradient id="<?php echo esc_attr( $water ); ?>" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#081014" stop-opacity="0.85"></stop><stop offset="100%" stop-color="#0c0d0c" stop-opacity="0"></stop></linearGradient>
				<radialGradient id="<?php echo esc_attr( $pulse ); ?>" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#C8A96B" stop-opacity="0.45"></stop><stop offset="60%" stop-color="#C8A96B" stop-opacity="0.10"></stop><stop offset="100%" stop-color="#C8A96B" stop-opacity="0"></stop></radialGradient>
			</defs>
			<rect width="1120" height="560" fill="#0c0d0c"></rect>
			<rect width="1120" height="560" fill="url(#<?php echo esc_attr( $grid ); ?>)"></rect>
			<path d="M 0,0 L 75,0 Q 115,280 65,560 L 0,560 Z" fill="url(#<?php echo esc_attr( $water ); ?>)"></path>
			<text x="28" y="300" fill="rgba(200,169,107,0.22)" font-size="11" letter-spacing="4" transform="rotate(-90, 28, 300)" font-family="sans-serif">MALAD CREEK</text>
			<line x1="412" y1="0" x2="412" y2="560" stroke="#1f201f" stroke-width="22"></line>
			<line x1="412" y1="44" x2="412" y2="560" stroke="#EAB308" stroke-width="3" stroke-dasharray="7 5" opacity="0.85"></line>
			<text x="412" y="26" fill="#F4F0E8" font-size="10" letter-spacing="2" text-anchor="middle" font-weight="bold" font-family="sans-serif">NEW LINK ROAD</text>
			<text x="432" y="196" fill="#EAB308" font-size="8.5" letter-spacing="1.4" transform="rotate(-90, 432, 196)" font-family="sans-serif">METRO LINE 2A</text>
			<line x1="730" y1="0" x2="730" y2="560" stroke="#1a1b1a" stroke-width="15"></line>
			<text x="730" y="26" fill="rgba(244,240,232,0.5)" font-size="9" letter-spacing="2" text-anchor="middle" font-family="sans-serif">S. V. ROAD</text>
			<line x1="840" y1="0" x2="840" y2="560" stroke="#1c1d1c" stroke-width="16"></line>
			<line x1="835" y1="0" x2="835" y2="560" stroke="#94A3B8" stroke-width="1.4" stroke-dasharray="6 4" opacity="0.45"></line>
			<line x1="845" y1="0" x2="845" y2="560" stroke="#94A3B8" stroke-width="1.4" stroke-dasharray="6 4" opacity="0.45"></line>
			<text x="840" y="26" fill="#CBD5E1" font-size="10" letter-spacing="2" text-anchor="middle" font-weight="bold" font-family="sans-serif">WESTERN RAILWAY</text>
			<line x1="1010" y1="0" x2="1010" y2="560" stroke="#222322" stroke-width="24"></line>
			<line x1="1010" y1="0" x2="1010" y2="560" stroke="rgba(255,255,255,0.28)" stroke-width="1.5" stroke-dasharray="14 10"></line>
			<text x="1010" y="26" fill="#F4F0E8" font-size="10" letter-spacing="2" text-anchor="middle" font-weight="bold" font-family="sans-serif">W. E. HIGHWAY</text>
			<path d="M 423,144 L 760,130 L 840,128 L 1010,100" stroke="#2c2d2c" stroke-width="7" stroke-linecap="round" fill="none"></path>
			<path d="M 423,512 L 600,512 L 730,510 L 840,516 L 925,522 L 1010,482 L 1120,470" stroke="#2c2d2c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"></path>
			<text x="905" y="506" fill="#8d887e" font-size="7.5" text-anchor="middle" letter-spacing="0.6" font-family="sans-serif">GOREGAON–MULUND LINK ROAD</text>
			<rect x="110" y="398" width="124" height="82" rx="3" fill="rgba(255,255,255,0.016)" stroke="rgba(255,255,255,0.11)" stroke-width="1.4" stroke-dasharray="5 4"></rect>
			<text x="172" y="437" fill="#B9B3A8" font-size="9.5" font-weight="600" text-anchor="middle" letter-spacing="1.6" font-family="sans-serif">MINDSPACE</text>
			<text x="172" y="450" fill="rgba(255,255,255,0.28)" font-size="7.5" text-anchor="middle" font-family="sans-serif">MALAD WEST</text>

			<line x1="300" y1="440" x2="<?php echo esc_attr( $fx ); ?>" y2="<?php echo esc_attr( $fy ); ?>" ar-bind:x2="route ? route.x : 300" ar-bind:y2="route ? route.y : 440" ar-show="route" stroke="#C8A96B" stroke-width="1.5" stroke-dasharray="7 7" opacity="0.45" class="pointer-events-none"></line>

			<rect x="350" y="378" width="48" height="28" rx="2" fill="#1b1c1b" stroke="rgba(200,169,107,0.35)" stroke-width="1"></rect>
			<text x="374" y="390" fill="#F4F0E8" font-size="6.5" text-anchor="middle" font-weight="bold" font-family="sans-serif">EVERSHINE</text>
			<text x="374" y="400" fill="#C8A96B" font-size="6" text-anchor="middle" font-family="sans-serif">MALL</text>
			<line x1="355" y1="452" x2="401" y2="452" stroke="#C8A96B" stroke-width="9" stroke-linecap="round"></line>
			<line x1="355" y1="452" x2="401" y2="452" stroke="#0c0d0c" stroke-width="1.6" stroke-dasharray="5 4"></line>
			<circle cx="401" cy="452" r="5.5" fill="#C8A96B" stroke="#080908" stroke-width="2"></circle>
			<rect x="302" y="474" width="94" height="15" rx="2" fill="#080908" stroke="rgba(200,169,107,0.5)" stroke-width="0.8"></rect>
			<text x="349" y="484.5" fill="#F4F0E8" font-size="7.5" font-weight="bold" text-anchor="middle" letter-spacing="0.4" font-family="sans-serif">18.3 M ACCESS ROAD</text>
			<circle cx="300" cy="440" r="56" fill="url(#<?php echo esc_attr( $pulse ); ?>)"></circle>
			<rect x="245" y="412" width="110" height="56" rx="3" fill="rgba(200,169,107,0.09)" stroke="#C8A96B" stroke-width="1.6"></rect>
			<image href="<?php echo esc_url( aranya_asset_url( 'branding/aranya-wordmark-light.png' ) ); ?>" x="255" y="418" width="90" height="26" preserveAspectRatio="xMidYMid meet"><title>Aranya The Park</title></image>
			<text x="300" y="459" fill="rgba(244,240,232,0.55)" font-size="7" text-anchor="middle" letter-spacing="1.4" font-family="sans-serif">THE SITE</text>

			<?php
			// Markers.
			foreach ( $places as $i => $p ) :
				if ( ! is_numeric( $p['map_x'] ) || ! is_numeric( $p['map_y'] ) ) {
					continue;
				}
				$id      = $p['place_id'];
				$tone    = self::TONE[ $p['category'] ] ?? '#C8A96B';
				$sel     = 0 === $i;
				$minutes = preg_match( '/\d+/', (string) $p['time'], $m ) ? $m[0] : '·';
				$jid     = wp_json_encode( $id );
				?>
				<g transform="translate(<?php echo esc_attr( self::n( (float) $p['map_x'] ) . ', ' . self::n( (float) $p['map_y'] ) ); ?>)" opacity="1" ar-bind:opacity="inFilter(<?php echo $j( $id ); ?>) ? 1 : 0.15" style="pointer-events: auto;" ar-bind:style="<?php echo esc_attr( "{ pointerEvents: inFilter($jid) ? 'auto' : 'none' }" ); ?>" class="cursor-pointer focus:outline-none" role="button" tabindex="0" ar-bind:tabindex="inFilter(<?php echo $j( $id ); ?>) ? 0 : -1" aria-label="<?php echo esc_attr( $p['name'] . ', ' . $p['time'] ); ?>" ar-on:click="selectedNodeId = <?php echo $j( $id ); ?>" ar-on:mouseenter="hoveredNodeId = <?php echo $j( $id ); ?>" ar-on:mouseleave="hoveredNodeId = null" ar-on:focus="hoveredNodeId = <?php echo $j( $id ); ?>" ar-on:blur="hoveredNodeId = null" ar-on:keydown="keySelect($event, <?php echo $j( $id ); ?>)">
					<circle r="20" fill="<?php echo esc_attr( $tone ); ?>" opacity="<?php echo $sel ? '0.2' : '0.12'; ?>" ar-show="isHot(<?php echo $j( $id ); ?>)" ar-bind:opacity="isSel(<?php echo $j( $id ); ?>) ? 0.2 : 0.12"<?php echo $sel ? '' : ' style="display: none;"'; ?>></circle>
					<circle r="<?php echo $sel ? '12.5' : '9.5'; ?>" ar-bind:r="<?php echo esc_attr( "isSel($jid) ? 12.5 : (hoveredNodeId === $jid ? 11 : 9.5)" ); ?>" fill="<?php echo esc_attr( $sel ? $tone : '#12130f' ); ?>" ar-bind:fill="<?php echo esc_attr( "isSel($jid) ? '$tone' : '#12130f'" ); ?>" stroke="<?php echo esc_attr( $tone ); ?>" stroke-width="<?php echo $sel ? '2' : '1.4'; ?>" ar-bind:stroke-width="isSel(<?php echo $j( $id ); ?>) ? 2 : 1.4" class="transition-all duration-200"></circle>
					<text y="3" fill="<?php echo esc_attr( $sel ? '#080908' : $tone ); ?>" ar-bind:fill="<?php echo esc_attr( "isSel($jid) ? '#080908' : '$tone'" ); ?>" font-size="7.5" font-weight="bold" text-anchor="middle" font-family="sans-serif" class="pointer-events-none"><?php echo esc_html( $minutes ); ?></text>
				</g>
			<?php endforeach; ?>

			<?php
			// Labels, painted last so they never sit under a marker.
			foreach ( $places as $i => $p ) :
				if ( ! is_numeric( $p['map_x'] ) || ! is_numeric( $p['map_y'] ) ) {
					continue;
				}
				$id                     = $p['place_id'];
				$jid                    = wp_json_encode( $id );
				$tone                   = self::TONE[ $p['category'] ] ?? '#C8A96B';
				$sel                    = 0 === $i;
				$text                   = trim( $p['map_label'] ) . ' · ' . $p['time'];
				$w                      = mb_strlen( $text ) * 4.75 + 18;
				[ $px, $py, $tx, $ty ] = self::plate( (string) $p['label_side'], $w );
				?>
				<g transform="translate(<?php echo esc_attr( self::n( (float) $p['map_x'] ) . ', ' . self::n( (float) $p['map_y'] ) ); ?>)" class="pointer-events-none" ar-show="inFilter(<?php echo $j( $id ); ?>)">
					<rect x="<?php echo esc_attr( self::n( $px ) ); ?>" y="<?php echo esc_attr( self::n( $py ) ); ?>" width="<?php echo esc_attr( self::n( $w ) ); ?>" height="15" rx="2" fill="#080908" stroke="<?php echo esc_attr( $sel ? $tone : 'rgba(255,255,255,0.14)' ); ?>" ar-bind:stroke="<?php echo esc_attr( "isHot($jid) ? '$tone' : 'rgba(255,255,255,0.14)'" ); ?>" stroke-width="<?php echo $sel ? '1.2' : '0.8'; ?>" ar-bind:stroke-width="isSel(<?php echo $j( $id ); ?>) ? 1.2 : 0.8" opacity="0.96"></rect>
					<text x="<?php echo esc_attr( self::n( $tx ) ); ?>" y="<?php echo esc_attr( self::n( $ty ) ); ?>" fill="<?php echo $sel ? '#FFFFFF' : '#D9D4CA'; ?>" ar-bind:fill="<?php echo esc_attr( "isHot($jid) ? '#FFFFFF' : '#D9D4CA'" ); ?>" font-size="8.5" font-weight="<?php echo $sel ? '700' : '600'; ?>" ar-bind:font-weight="isSel(<?php echo $j( $id ); ?>) ? 700 : 600" text-anchor="middle" font-family="sans-serif"><?php echo esc_html( $text ); ?></text>
				</g>
			<?php endforeach; ?>
		</svg>
		<?php
	}
}
