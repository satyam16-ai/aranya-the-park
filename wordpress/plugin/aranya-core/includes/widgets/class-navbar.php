<?php
/**
 * Aranya Navbar — layout/Navbar.tsx.
 *
 * The floating glass pill (morphs on scroll) and the full-screen mobile drawer.
 * Lives in the "Aranya Header" template (Templates → Saved Templates), which
 * the theme prints on every page.
 *
 * @package Aranya
 */

namespace Aranya\Widgets;

use Elementor\Controls_Manager;

defined( 'ABSPATH' ) || exit;

class Navbar extends Widget_Base {

	public function get_name() {
		return 'aranya-navbar';
	}

	public function get_title() {
		return __( 'Aranya Navbar', 'aranya' );
	}

	public function get_icon() {
		return 'eicon-nav-menu';
	}

	protected function register_controls() {
		$this->section( 'brand', __( 'Brand', 'aranya' ) );
		$this->media( 'crest', __( 'Crest', 'aranya' ), 'branding/aranya-crest-96.png' );
		$this->media( 'wordmark', __( 'Wordmark', 'aranya' ), 'branding/aranya-wordmark-light-320.png' );
		$this->text( 'wordmark_alt', __( 'Wordmark alt text', 'aranya' ), 'Aranya The Park' );
		$this->end_section();

		$this->section( 'links_section', __( 'Menu links', 'aranya' ) );
		$this->repeater(
			'links',
			__( 'Links', 'aranya' ),
			function ( $r ) {
				$this->text( 'label', __( 'Label', 'aranya' ), 'LINK', array(), $r );
				$this->text( 'href', __( 'Link (#section-id or URL)', 'aranya' ), '#', array(), $r );
				$this->select(
					'action',
					__( 'On click', 'aranya' ),
					array(
						'link'       => __( 'Go to the link', 'aranya' ),
						'floorplans' => __( 'Open the Floor Plans pop-up', 'aranya' ),
						'location'   => __( 'Open the Location pop-up', 'aranya' ),
						'enquire'    => __( 'Open the enquiry form', 'aranya' ),
					),
					'link',
					array(),
					$r
				);
			},
			array(
				array( 'label' => 'OVERVIEW', 'href' => '#overview', 'action' => 'link' ),
				array( 'label' => 'RESIDENCES', 'href' => '#residences', 'action' => 'link' ),
				array( 'label' => 'AMENITIES', 'href' => '#amenities', 'action' => 'link' ),
				array( 'label' => 'FLOOR PLANS', 'href' => '#floor-plans', 'action' => 'floorplans' ),
				array( 'label' => 'LOCATION', 'href' => '#location', 'action' => 'location' ),
			),
			'{{{ label }}}'
		);
		$this->end_section();

		$this->section( 'cta', __( 'Enquire buttons', 'aranya' ) );
		$this->text( 'cta_label', __( 'Desktop button', 'aranya' ), 'ENQUIRE' );
		$this->text( 'cta_purpose', __( 'Desktop enquiry purpose', 'aranya' ), 'Navbar Inquiry', array( 'description' => __( 'Recorded with the lead.', 'aranya' ) ) );
		$this->text( 'mobile_cta_label', __( 'Mobile menu button', 'aranya' ), 'ENQUIRE NOW' );
		$this->text( 'mobile_cta_purpose', __( 'Mobile enquiry purpose', 'aranya' ), 'Mobile Navigation Inquiry' );
		$this->text( 'mobile_tagline', __( 'Mobile menu footnote', 'aranya' ), 'MALAD WEST · MUMBAI' );
		$this->end_section();
	}

	/** The crest/wordmark: the bundled ladders keep React's 1x/2x/3x srcset. */
	private function logo( array $media, string $alt, array $ladder, int $w, int $h, string $class, bool $eager ): string {
		// The original logo (bundled or imported) keeps React's 1x/2x/3x density ladder.
		$url = aranya_image_url( $media );
		if ( basename( (string) wp_parse_url( $url, PHP_URL_PATH ) ) === $ladder[1] ) {
			$base   = substr( $url, 0, strrpos( $url, '/' ) + 1 );
			$srcset = aranya_media_versioned( $base . $ladder[0] ) . ' 1x, ' . aranya_media_versioned( $base . $ladder[1] ) . ' 2x, ' . aranya_media_versioned( $base . $ladder[2] ) . ' 3x';
			return '<img' . aranya_attrs(
				array(
					'src'     => $url,
					'srcset'  => $srcset,
					'alt'     => $alt,
					'width'   => $w,
					'height'  => $h,
					'loading' => $eager ? 'eager' : null,
					'class'   => $class,
				)
			) . '>';
		}
		return aranya_img(
			$media,
			array(
				'alt'     => $alt,
				'plain'   => true,
				'class'   => $class,
				'loading' => $eager ? 'eager' : null,
				'attrs'   => array(
					'width'  => $w,
					'height' => $h,
				),
			)
		);
	}

	private static function href( string $href ): string {
		if ( str_starts_with( $href, '#' ) && ! is_front_page() && ! aranya_is_editor() ) {
			return home_url( '/' ) . $href;
		}
		return $href;
	}

	protected function render() {
		$s        = $this->get_settings_for_display();
		$crest    = array( 'aranya-crest-48.png', 'aranya-crest-96.png', 'aranya-crest-144.png' );
		$wordmark = array( 'aranya-wordmark-light-160.png', 'aranya-wordmark-light-320.png', 'aranya-wordmark-light-480.png' );
		$links    = (array) $s['links'];
		$home     = is_front_page() ? '#' : home_url( '/' );

		$link_click = static function ( array $link, bool $mobile ): string {
			$action = $link['action'] ?? 'link';
			if ( 'enquire' === $action ) {
				return '$event.preventDefault(); ' . ( $mobile ? 'isMobileOpen = false; ' : '' ) . 'Aranya.openLead(' . wp_json_encode( 'Navbar Inquiry' ) . ')';
			}
			return 'navClick($event, ' . wp_json_encode( $action ) . ', ' . ( $mobile ? 'true' : 'false' ) . ')';
		};
		echo self::editor_note( __( 'Navbar — fixed to the top of the page', 'aranya' ) );
		?>
		<div ar-data="navbar">
			<header class="fixed inset-x-0 top-[max(0.75rem,env(safe-area-inset-top,0.75rem))] sm:top-4 z-50 flex justify-center px-3.5 sm:px-6 pointer-events-none" role="banner">
				<div
					class="pointer-events-auto w-full max-w-6xl rounded-full transition-all duration-500 ease-out flex items-center justify-between px-4 sm:px-7 py-2 sm:py-2.5 border bg-dark-950/65 backdrop-blur-xl border-champagne-400/15 shadow-[inset_0_1px_0_rgba(200,169,107,0.12),0_8px_30px_rgba(0,0,0,0.4)]"
					ar-bind:class="{ 'bg-dark-900/85 backdrop-blur-2xl border-champagne-400/20 shadow-[inset_0_1px_0_rgba(200,169,107,0.15),0_12px_40px_-8px_rgba(0,0,0,0.7)]': isScrolled, 'bg-dark-950/65 backdrop-blur-xl border-champagne-400/15 shadow-[inset_0_1px_0_rgba(200,169,107,0.12),0_8px_30px_rgba(0,0,0,0.4)]': !isScrolled }"
				>
					<a href="<?php echo esc_url( $home ); ?>" class="flex items-center gap-2.5 sm:gap-3 group select-none cursor-pointer" aria-label="<?php echo esc_attr( $s['wordmark_alt'] . ' — Home' ); ?>">
						<?php
						echo $this->logo( $s['crest'], '', $crest, 48, 48, 'h-10 w-10 sm:h-11 sm:w-11 object-contain shrink-0 transition-transform duration-500 ease-out group-hover:rotate-[8deg]', true );
						echo $this->logo( $s['wordmark'], $s['wordmark_alt'], $wordmark, 160, 45, 'h-10 sm:h-11 w-auto object-contain shrink-0 transition-opacity duration-300 group-hover:opacity-85', true );
						?>
					</a>

					<nav class="hidden lg:flex items-center gap-7 xl:gap-9" aria-label="Primary navigation">
						<?php foreach ( $links as $link ) : ?>
							<a href="<?php echo esc_url( self::href( $link['href'] ) ); ?>" ar-on:click="<?php echo esc_attr( $link_click( $link, false ) ); ?>" class="relative text-[11px] font-sans font-medium tracking-[0.2em] uppercase text-ivory/85 hover:text-champagne-200 transition-colors duration-300 py-1 group">
								<?php echo esc_html( $link['label'] ); ?>
								<span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-champagne-400 transition-all duration-300 group-hover:w-full"></span>
							</a>
						<?php endforeach; ?>
					</nav>

					<div class="hidden lg:flex items-center">
						<button ar-on:click="<?php echo esc_attr( self::lead_js( $s['cta_purpose'] ) ); ?>" class="btn-lux px-5 py-2 text-[10px] font-sans font-semibold tracking-[0.22em] uppercase text-champagne-300 hover:text-dark-950 hover:bg-champagne-400 border border-champagne-400/40 hover:border-champagne-400 rounded-full transition-all duration-300 cursor-pointer select-none"><?php echo esc_html( $s['cta_label'] ); ?></button>
					</div>

					<button ar-on:click="isMobileOpen = !isMobileOpen" class="lg:hidden p-2 text-ivory hover:text-champagne-300 transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center -mr-1" aria-label="Open navigation menu" ar-bind:aria-label="isMobileOpen ? 'Close navigation menu' : 'Open navigation menu'" aria-expanded="false" ar-bind:aria-expanded="isMobileOpen ? 'true' : 'false'">
						<?php
						echo aranya_icon( 'x', 20, array( 'stroke' => 1.5, 'attrs' => array( 'ar-show' => 'isMobileOpen', 'style' => 'display: none;' ) ) );
						echo aranya_icon( 'menu', 20, array( 'stroke' => 1.5, 'attrs' => array( 'ar-show' => '!isMobileOpen' ) ) );
						?>
					</button>
				</div>
			</header>

			<div
				class="fixed inset-0 z-50 lg:hidden transition-all duration-500 invisible opacity-0 pointer-events-none"
				ar-bind:class="{ 'visible opacity-100': isMobileOpen, 'invisible opacity-0 pointer-events-none': !isMobileOpen }"
				aria-hidden="true"
				ar-bind:aria-hidden="isMobileOpen ? 'false' : 'true'"
			>
				<div class="absolute inset-0 bg-dark-950/98 backdrop-blur-2xl transition-opacity duration-500" ar-on:click="isMobileOpen = false"></div>

				<div class="relative z-20 flex items-center justify-between px-6 pt-[max(1.25rem,env(safe-area-inset-top,0px))] pb-4 border-b border-white/[0.08]">
					<div class="flex items-center gap-3">
						<?php echo $this->logo( $s['crest'], '', $crest, 48, 48, 'h-12 w-12 object-contain shrink-0', false ); ?>
						<div class="flex flex-col items-start gap-1">
							<?php echo $this->logo( $s['wordmark'], $s['wordmark_alt'], $wordmark, 160, 45, 'h-11 w-auto object-contain', false ); ?>
						</div>
					</div>
					<button ar-on:click="isMobileOpen = false" class="p-2 text-ivory-muted hover:text-ivory transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer -mr-2" aria-label="Close menu">
						<?php echo aranya_icon( 'x', 22, array( 'stroke' => 1.5 ) ); ?>
					</button>
				</div>

				<div class="relative z-10 flex flex-col justify-between h-[calc(100%-80px)] px-7 py-8 overflow-y-auto overflow-touch pb-safe">
					<nav class="flex flex-col space-y-3 pt-2">
						<?php foreach ( $links as $idx => $link ) : ?>
							<a href="<?php echo esc_url( self::href( $link['href'] ) ); ?>" ar-on:click="<?php echo esc_attr( $link_click( $link, true ) ); ?>" style="transition-delay: <?php echo (int) $idx * 40; ?>ms;" class="group flex items-center justify-between py-3.5 px-2 min-h-[48px] rounded-[4px] font-serif text-2xl sm:text-3xl text-ivory/90 hover:text-champagne-300 tracking-[0.12em] transition-all uppercase font-light active:bg-white/[0.03]">
								<span><?php echo esc_html( $link['label'] ); ?></span>
								<span class="text-xs font-sans text-champagne-400/40 group-hover:text-champagne-300 group-hover:translate-x-1 transition-all">0<?php echo (int) $idx + 1; ?></span>
							</a>
						<?php endforeach; ?>
					</nav>

					<div class="pt-8 pb-4 space-y-3">
						<button ar-on:click="isMobileOpen = false; <?php echo esc_attr( self::lead_js( $s['mobile_cta_purpose'] ) ); ?>" class="btn-lux w-full py-4 min-h-[52px] text-xs font-sans font-semibold tracking-[0.2em] uppercase text-dark-950 bg-champagne-400 hover:bg-champagne-300 active:scale-[0.99] rounded-full transition-all duration-300 cursor-pointer text-center shadow-[0_8px_25px_rgba(200,169,107,0.3)]"><?php echo esc_html( $s['mobile_cta_label'] ); ?></button>
						<div class="text-center">
							<span class="text-[10px] font-sans uppercase tracking-[0.3em] text-ivory-muted/50"><?php echo esc_html( $s['mobile_tagline'] ); ?></span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<?php
	}
}
