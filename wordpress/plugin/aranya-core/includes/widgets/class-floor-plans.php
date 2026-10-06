<?php
/**
 * Aranya Floor Plans — sections/FloorPlans.tsx + FloorPlansModal.tsx.
 *
 * Tower tabs and floor pills, the zoom/pan plan canvas (tower plates blurred
 * until the visitor sends an enquiry; the master plan never locks), and the
 * Floor Plans pop-up opened from the menu and the Residences. The pop-up shows
 * the section's own viewer in a window (client, 2 Oct: its separate viewer
 * clipped tall plans and had no fullscreen).
 *
 * @package Aranya
 */

namespace Aranya\Widgets;

defined( 'ABSPATH' ) || exit;

class Floor_Plans extends Widget_Base {

	public function get_name() {
		return 'aranya-floor-plans';
	}

	public function get_title() {
		return __( 'Aranya Floor Plans', 'aranya' );
	}

	public function get_icon() {
		return 'eicon-image-hotspot';
	}

	private static function towers(): array {
		return array(
			'tower-a' => 'Tower A',
			'tower-b' => 'Tower B',
			'master'  => 'Master Layout',
		);
	}

	protected function register_controls() {
		$this->section( 'heading', __( 'Heading', 'aranya' ) );
		$this->heading_controls( 'Floor Plans', 'Find Your Space', 'The master layout and every floor of Tower A and Tower B. Zoom in to study each plan.' );
		$this->text( 'tab_a', __( 'Tower A tab', 'aranya' ), 'A TOWER' );
		$this->text( 'tab_b', __( 'Tower B tab', 'aranya' ), 'B TOWER' );
		$this->text( 'tab_master', __( 'Master plan tab', 'aranya' ), 'MASTER PLAN' );
		$this->select( 'initial_tower', __( 'Tab shown first', 'aranya' ), self::towers(), 'tower-b' );
		$this->end_section();

		$this->section( 'plans_section', __( 'Plans', 'aranya' ) );
		$this->note( __( 'Tower A and Tower B plans are blurred until the visitor sends an enquiry. Master Layout plans are always visible.', 'aranya' ) );
		$this->repeater(
			'plans',
			__( 'Plans', 'aranya' ),
			function ( $r ) {
				$this->text( 'plan_id', __( 'ID (no spaces)', 'aranya' ), 'plan', array(), $r );
				$this->select( 'tower', __( 'Tower', 'aranya' ), self::towers(), 'tower-a', array(), $r );
				$this->text( 'floor_label', __( 'Floor pill label', 'aranya' ), '', array(), $r );
				$this->text( 'title', __( 'Title', 'aranya' ), '', array(), $r );
				$this->media( 'image', __( 'Plan image', 'aranya' ), '', array(), $r );
				$this->textarea( 'description', __( 'Description', 'aranya' ), '', array( 'rows' => 3 ), $r );
				$this->textarea( 'highlights', __( 'Highlights (one per line, first 3 shown under the plan)', 'aranya' ), '', array( 'rows' => 3 ), $r );
			},
			self::media_rows( aranya_defaults( 'floor_plans' ), array( 'image' ) ),
			'{{{ title }}}'
		);
		$this->end_section();

		$this->section( 'labels', __( 'Canvas labels', 'aranya' ) );
		$this->text( 'lock_title', __( 'Lock title', 'aranya' ), 'Floor plans available on request' );
		$this->textarea( 'lock_text', __( 'Lock text', 'aranya' ), 'Share your details and our sales team will unlock the detailed Tower A & Tower B plans, along with current pricing.', array( 'rows' => 2 ) );
		$this->text( 'unlock_label', __( 'Unlock button', 'aranya' ), 'UNLOCK FLOOR PLANS' );
		$this->text( 'fullscreen_label', __( 'Fullscreen button', 'aranya' ), 'Fullscreen' );
		$this->text( 'pdf_label', __( 'PDF request link', 'aranya' ), 'Request Floor Plan PDF' );
		$this->text( 'pdf_purpose', __( 'PDF request purpose', 'aranya' ), 'Request the Floor Plan PDF' );
		$this->text( 'lightbox_note', __( 'Fullscreen caption', 'aranya' ), 'Indicative floor plan, subject to approvals.' );
		// One disclaimer for every plan, set under the viewers (client, 30 Sep): the
		// plan images no longer carry it.
		$this->textarea( 'plan_disclaimer', __( 'Plan disclaimer', 'aranya' ), 'Disclaimer: The designs, plans, elevation, specifications, facilities, images etc. are only indicative and subject to the approval of the respective authorities. The owner / developer reserves the right to change the specifications or features. This does not constitute an offer and / or contract of any such type between the owner / developer and the recipient.', array( 'rows' => 4, 'description' => __( 'Shown with an asterisk under the plan viewer, the pop-up and the fullscreen view.', 'aranya' ) ) );
		$this->end_section();

		$this->section( 'modal', __( 'Pop-up', 'aranya' ) );
		$this->note( __( 'The pop-up shows the same viewer as the section, with the tabs and labels set above.', 'aranya' ) );
		$this->text( 'm_eyebrow', __( 'Eyebrow', 'aranya' ), 'FLOOR PLANS' );
		$this->text( 'm_title', __( 'Title', 'aranya' ), 'Explore the Floor Plans' );
		$this->end_section();

		$this->section( 'section_settings', __( 'Section', 'aranya' ) );
		$this->anchor( 'floor-plans' );
		$this->end_section();
	}

	protected function render() {
		$s     = $this->get_settings_for_display();
		$plans = array();
		foreach ( (array) $s['plans'] as $p ) {
			$info    = aranya_image_info( $p['image'] );
			$plans[] = array(
				'id'         => $p['plan_id'],
				'tower'      => $p['tower'],
				'label'      => $p['floor_label'],
				'title'      => $p['title'],
				'desc'       => $p['description'],
				'highlights' => array_slice( aranya_lines( $p['highlights'] ), 0, 3 ),
				'src'        => $info['src'],
				'srcset'     => $info['srcset'],
				'w'          => $info['w'],
				'h'          => $info['h'],
			);
		}
		if ( ! $plans ) {
			return;
		}
		$initial_tower = $s['initial_tower'];
		$config        = array(
			'plans'        => $plans,
			'initialTower' => $initial_tower,
			'lightboxNote' => $s['lightbox_note'],
			'disclaimer'   => $s['plan_disclaimer'],
		);
		?>
		<section id="<?php echo esc_attr( $s['anchor'] ); ?>" ar-data="floorPlans(<?php echo esc_attr( aranya_json( $config ) ); ?>)" class="section-spacing bg-dark-900 text-ivory relative isolate overflow-hidden">
			<?php $this->print_backdrop(); ?>

			<div class="<?php echo esc_attr( self::container_class( 'showcase' ) ); ?>">
				<?php
				// The tower selector sits on the heading's row (SectionHeading aside).
				$this->print_section_heading( $s, $this->tower_tabs( $s, $initial_tower ) );
				$this->print_viewer( $s, $plans, $initial_tower, 'h-[420px] sm:h-[520px] lg:h-[600px]' );
				?>
			</div>
		</section>
		<?php
		$config['initialTower'] = 'master';
		$this->render_modal( $s, $plans, $config );
	}

	/** The A TOWER / B TOWER / MASTER PLAN switch, in the section heading and the pop-up header. */
	private function tower_tabs( array $s, string $initial_tower ): string {
		$tab_on   = 'bg-champagne-400 text-dark-950 shadow-md';
		$tab_off  = 'text-ivory-muted hover:text-ivory';
		$tab_base = 'py-2 sm:py-2.5 px-3.5 sm:px-5 text-center font-sans text-[11px] sm:text-xs uppercase tracking-[0.12em] sm:tracking-[0.18em] font-semibold transition-all duration-300 cursor-pointer rounded-full whitespace-nowrap ';
		$out      = '<div class="inline-flex p-1 sm:p-1.5 glass-panel rounded-full gap-1 sm:gap-1.5">';
		foreach ( array( 'tower-a' => $s['tab_a'], 'tower-b' => $s['tab_b'], 'master' => $s['tab_master'] ) as $tower => $label ) {
			$jt   = wp_json_encode( $tower );
			$out .= sprintf(
				'<button ar-on:click="%s" class="%s" ar-bind:class="%s">%s</button>',
				esc_attr( "handleTowerChange($jt)" ),
				esc_attr( $tab_base . ( $tower === $initial_tower ? $tab_on : $tab_off ) ),
				esc_attr( "{ '$tab_on': selectedTower === $jt, '$tab_off': selectedTower !== $jt }" ),
				esc_html( $label )
			);
		}
		return $out . '</div>';
	}

	/**
	 * The plan viewer: floor pills, the plan card (title, zoom/rotate/reset,
	 * fullscreen, the zoom/pan canvas, description and highlights) and the
	 * disclaimer. The section and the pop-up print this same viewer; only the
	 * canvas height differs ($stage) and, in the pop-up, the card fills the
	 * window ($card).
	 */
	private function print_viewer( array $s, array $plans, string $initial_tower, string $stage, string $card = '' ): void {
		$first    = current( array_filter( $plans, static fn( $p ) => $p['tower'] === $initial_tower ) ) ?: $plans[0];
		$pill_on  = 'border border-champagne-400/80 bg-champagne-400/20 text-champagne-300 font-semibold shadow-sm';
		$pill_off = 'text-ivory-muted/80 hover:text-ivory bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12]';
		$ctrl     = 'w-8 h-8 rounded-full glass-control flex items-center justify-center text-ivory-muted hover:text-ivory cursor-pointer';
		?>
		<div class="flex items-center justify-start gap-2 overflow-x-auto overflow-touch pb-3 mb-6 px-4 sm:px-0 shrink-0">
			<?php
			foreach ( $plans as $p ) :
				$jid = wp_json_encode( $p['id'] );
				$jt  = wp_json_encode( $p['tower'] );
				$vis = $p['tower'] === $initial_tower;
				?>
				<button ar-show="selectedTower === <?php echo esc_attr( $jt ); ?>"<?php echo $vis ? '' : ' style="display: none;"'; ?> ar-on:click="pick(<?php echo esc_attr( $jid ); ?>)" class="<?php echo esc_attr( 'px-3.5 sm:px-4 py-2 text-[11px] font-sans uppercase tracking-[0.12em] whitespace-nowrap shrink-0 rounded-full transition-all duration-300 cursor-pointer ' . ( $p['id'] === $first['id'] ? $pill_on : $pill_off ) ); ?>" ar-bind:class="<?php echo esc_attr( "{ '$pill_on': current.id === $jid, '$pill_off': current.id !== $jid }" ); ?>"><?php echo esc_html( $p['label'] ); ?></button>
			<?php endforeach; ?>
		</div>

		<div class="<?php echo esc_attr( aranya_cx( 'glass-panel rounded-[6px] shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-white/[0.08] overflow-hidden', $card ) ); ?>">
			<div class="px-6 py-3.5 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
				<div class="flex items-center gap-3">
					<span class="font-serif text-lg text-ivory font-light" ar-text="current.title"><?php echo esc_html( $first['title'] ); ?></span>
				</div>
				<div class="flex items-center gap-2">
					<button ar-on:click="zoomIn()" aria-label="Zoom in" class="<?php echo esc_attr( $ctrl ); ?>"><?php echo aranya_icon( 'zoom-in', 14 ); ?></button>
					<button ar-on:click="zoomOut()" aria-label="Zoom out" class="<?php echo esc_attr( $ctrl ); ?>"><?php echo aranya_icon( 'zoom-out', 14 ); ?></button>
					<button ar-on:click="rotate()" aria-label="Rotate plan" title="Rotate" class="<?php echo esc_attr( $ctrl ); ?>"><?php echo aranya_icon( 'rotate-cw', 13 ); ?></button>
					<button ar-on:click="zoomReset()" aria-label="Reset view" title="Reset view" class="<?php echo esc_attr( $ctrl ); ?>"><?php echo aranya_icon( 'scan', 13 ); ?></button>
					<span class="w-px h-5 bg-white/[0.1] mx-1"></span>
					<button ar-on:click="fullscreen()" aria-label="Fullscreen view" class="px-3.5 py-1.5 rounded-full glass-control flex items-center gap-1.5 text-xs text-champagne-300 hover:text-white cursor-pointer">
						<?php echo aranya_icon( 'maximize-2', 13 ); ?>
						<span class="hidden sm:inline font-sans text-[11px] uppercase tracking-wider"><?php echo esc_html( $s['fullscreen_label'] ); ?></span>
					</button>
				</div>
			</div>

			<div
				ar-ref="stage"
				ar-on:pointerdown="panDown($event)"
				ar-on:pointermove="panMove($event)"
				ar-on:pointerup="panEnd()"
				ar-on:pointercancel="panEnd()"
				ar-on:dragstart.prevent
				ar-on:contextmenu.prevent
				style="touch-action: pan-y;"
				ar-bind:style="{ touchAction: canPan ? 'none' : 'pan-y' }"
				class="<?php echo esc_attr( aranya_cx( 'relative bg-black/40 overflow-hidden flex items-center justify-center p-6 sm:p-10 select-none', $stage ) ); ?>"
				ar-bind:class="{ 'cursor-grabbing': dragging, 'cursor-grab': !dragging && canPan }"
			>
				<div class="ease-out origin-center flex items-center justify-center w-full h-full transition-transform duration-300" ar-bind:class="{ 'transition-transform duration-300': !dragging }" style="transform: translate(0px, 0px) scale(1);" ar-bind:style="{ transform: panTransform }">
					<img
						src="<?php echo esc_url( $first['src'] ); ?>"
						ar-bind:src="current.src"
						<?php if ( $first['srcset'] ) : ?>
							srcset="<?php echo esc_attr( $first['srcset'] ); ?>"
						<?php endif; ?>
						ar-bind:srcset="current.srcset || null"
						sizes="(min-width: 1024px) 1400px, 100vw"
						width="<?php echo (int) $first['w']; ?>"
						height="<?php echo (int) $first['h']; ?>"
						ar-bind:width="current.w || null"
						ar-bind:height="current.h || null"
						alt="<?php echo esc_attr( $first['title'] ); ?>"
						ar-bind:alt="current.title"
						draggable="false"
						class="<?php echo esc_attr( 'max-h-full max-w-full object-contain filter drop-shadow-2xl transition-[filter] duration-500 [-webkit-touch-callout:none]' . ( 'master' !== $first['tower'] ? ' blur-[14px] scale-[1.02]' : '' ) ); ?>"
						ar-bind:class="{ 'blur-[14px] scale-[1.02]': isLocked }"
					>
				</div>

				<div ar-show="isLocked"<?php echo 'master' === $first['tower'] ? ' style="display: none;"' : ''; ?> class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-dark-950/55 backdrop-blur-[2px] px-6 text-center">
					<span class="inline-flex items-center justify-center h-12 w-12 rounded-full border border-champagne-400/40 text-champagne-300"><?php echo aranya_icon( 'lock', 20 ); ?></span>
					<div class="space-y-1.5 max-w-sm">
						<h4 class="font-serif text-xl sm:text-2xl text-ivory"><?php echo esc_html( $s['lock_title'] ); ?></h4>
						<p class="text-xs text-ivory-muted leading-relaxed"><?php echo esc_html( $s['lock_text'] ); ?></p>
					</div>
					<button ar-on:click="Aranya.openLead('Floor Plan Access')" class="<?php echo esc_attr( self::button_class( 'gold', 'md' ) ); ?>"><?php echo self::button_inner( esc_html( $s['unlock_label'] ), aranya_icon( 'eye', 15 ) ); ?></button>
				</div>

				<div class="absolute bottom-4 left-4 text-[10px] font-sans tracking-widest uppercase text-ivory-muted/50 glass-panel-subtle px-2.5 py-1 rounded-full" ar-text="'Scale: ' + Math.round(zoom * 100) + '%'">Scale: 100%</div>
			</div>

			<div class="px-6 py-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
				<div class="min-w-0 space-y-2">
					<p class="text-xs font-sans text-ivory-muted/70 font-light" ar-text="current.desc"><?php echo esc_html( $first['desc'] ); ?></p>
					<div ar-show="current.highlights && current.highlights.length" class="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-sans font-medium text-ivory-muted">
						<template ar-for="hl in current.highlights" ar-bind:key="hl">
							<span class="inline-flex items-center gap-1.5">
								<?php echo aranya_icon( 'check', 12, array( 'class' => 'text-champagne-400 shrink-0' ) ); ?>
								<span ar-text="hl"></span>
							</span>
						</template>
					</div>
				</div>
				<div class="flex items-center gap-4 shrink-0">
					<button ar-on:click="<?php echo esc_attr( self::lead_js( $s['pdf_purpose'] ) ); ?>" class="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.16em] text-champagne-300 hover:text-white transition-colors cursor-pointer">
						<?php echo aranya_icon( 'file-down', 14 ); ?>
						<span><?php echo esc_html( $s['pdf_label'] ); ?></span>
					</button>
				</div>
			</div>
		</div>
		<?php if ( '' !== trim( (string) $s['plan_disclaimer'] ) ) : ?>
			<p class="mt-3 text-[11px] leading-relaxed font-sans font-medium text-ivory-muted/60">* <?php echo esc_html( $s['plan_disclaimer'] ); ?></p>
		<?php endif; ?>
		<?php
	}

	/**
	 * The Floor Plans pop-up: the section's viewer in a window. Below lg the
	 * window scrolls and the canvas keeps the section's height; from lg the
	 * canvas takes the room left in the window, so a plan always shows whole.
	 * The card's min height is fixed, not its content's: the plan picture at
	 * full size would otherwise stretch the canvas past the window.
	 */
	private function render_modal( array $s, array $plans, array $config ): void {
		?>
		<div ar-data="floorPlansModal(<?php echo esc_attr( aranya_json( $config ) ); ?>)" data-aranya-modal="floorplans">
			<template ar-teleport="body">
				<div ar-show="isOpen" style="display: none;" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6" role="dialog" aria-modal="true" aria-label="Floor plans">
					<div class="absolute inset-0 bg-dark-950/90 backdrop-blur-xl animate-fade-in" ar-on:click="close()"></div>

					<div class="relative w-full max-w-7xl h-[94vh] max-h-[94vh] bg-dark-900 text-ivory border border-white/[0.12] shadow-[0_25px_70px_rgba(0,0,0,0.85)] rounded-[4px] flex flex-col overflow-hidden animate-scale-in">
						<div class="px-4 sm:px-6 py-3.5 bg-dark-950/90 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-3 shrink-0">
							<div class="min-w-0">
								<span class="text-champagne-300 text-[10px] tracking-[0.3em] uppercase font-sans font-semibold block"><?php echo esc_html( $s['m_eyebrow'] ); ?></span>
								<h2 class="font-serif text-base sm:text-xl text-ivory font-light truncate"><?php echo esc_html( $s['m_title'] ); ?></h2>
							</div>
							<div class="order-last w-full flex justify-center lg:order-none lg:w-auto">
								<?php echo $this->tower_tabs( $s, 'master' ); // phpcs:ignore WordPress.Security.EscapeOutput -- escaped inside. ?>
							</div>
							<button ar-on:click="close()" class="p-2 min-h-[38px] min-w-[38px] flex items-center justify-center text-ivory-muted hover:text-ivory hover:bg-white/[0.06] rounded-full transition-colors cursor-pointer" aria-label="Close Pop-up Window" title="Close (ESC)">
								<?php echo aranya_icon( 'x', 18, array( 'stroke' => 1.5 ) ); ?>
							</button>
						</div>

						<div class="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3 sm:p-6 lg:flex lg:flex-col">
							<?php $this->print_viewer( $s, $plans, 'master', 'h-[420px] sm:h-[480px] lg:h-auto lg:flex-1 lg:min-h-[340px]', 'lg:flex-1 lg:min-h-[30rem] lg:flex lg:flex-col' ); ?>
						</div>
					</div>
				</div>
			</template>
		</div>
		<?php
	}
}
