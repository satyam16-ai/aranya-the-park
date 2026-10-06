<?php
/**
 * Page-wide overlays: the lightbox (common/Lightbox.tsx) and, when the footer
 * template has no Aranya Enquiry Pop-up widget, a default enquiry modal — so
 * every "Enquire" button works on every page.
 *
 * Overlays are teleported to the end of <body> in the same order the React
 * App renders them (enquiry modal, then lightbox), so they stack the same way.
 *
 * @package Aranya
 */

defined( 'ABSPATH' ) || exit;

add_action( 'wp_footer', 'aranya_print_overlays', 5 );
add_action( 'wp_body_open', 'aranya_print_site_loader', 1 );

/**
 * The site loader: on a page with the Aranya Hero, covers the page from the
 * first paint until the hero's first frame has loaded (the same markup and
 * gate as the React index.html). Never in the Elementor editor.
 */
function aranya_print_site_loader() {
	if ( is_admin() || aranya_is_editor() || is_customize_preview() || ! aranya_first_hero_slide() ) {
		return;
	}
	$gate = (string) file_get_contents( ARANYA_DIR . 'assets/js/site-loader-gate.js' ); // phpcs:ignore WordPress.WP.AlternativeFunctions
	// The navbar's 1x/2x/3x files, so the loader and the navbar pick the same one.
	$density = static fn( string $name, array $steps ) => implode(
		', ',
		array_map( static fn( $i, $step ) => esc_url( aranya_asset_url( 'branding/' . $name . '-' . $step . '.png' ) ) . ' ' . ( $i + 1 ) . 'x', array_keys( $steps ), $steps )
	);
	?>
	<div id="site-loader" class="site-loader" aria-hidden="true">
		<img class="site-loader__crest" src="<?php echo esc_url( aranya_asset_url( 'branding/aranya-crest-96.png' ) ); ?>" srcset="<?php echo $density( 'aranya-crest', array( 48, 96, 144 ) ); // phpcs:ignore WordPress.Security.EscapeOutput -- escaped above. ?>" width="48" height="48" alt="">
		<img class="site-loader__wordmark" src="<?php echo esc_url( aranya_asset_url( 'branding/aranya-wordmark-light-320.png' ) ); ?>" srcset="<?php echo $density( 'aranya-wordmark-light', array( 160, 320, 480 ) ); // phpcs:ignore WordPress.Security.EscapeOutput -- escaped above. ?>" width="160" height="45" alt="">
		<span class="site-loader__line"></span>
	</div>
	<noscript><style>.site-loader { display: none; }</style></noscript>
	<script><?php echo $gate; // phpcs:ignore WordPress.Security.EscapeOutput -- The plugin's own file. ?></script>
	<?php
}

function aranya_print_overlays() {
	if ( is_admin() ) {
		return;
	}
	if ( empty( $GLOBALS['aranya_lead_modal_printed'] ) && class_exists( '\\Elementor\\Widget_Base' ) ) {
		require_once ARANYA_DIR . 'includes/widgets/class-widget-base.php';
		require_once ARANYA_DIR . 'includes/widgets/class-enquiry-modal.php';
		echo \Aranya\Widgets\Enquiry_Modal::markup( \Aranya\Widgets\Enquiry_Modal::D ); // Escaped inside.
	}
	echo '<div ar-data="lightbox"><template ar-teleport="body">' . aranya_lightbox_markup() . '</template></div>'; // Escaped inside.
}

/**
 * Lightbox markup. The Alpine scope provides: isOpen, item {url, title,
 * description, category, credit}, hasCounter, index, total, hasPrev, hasNext,
 * prev(), next(), close() plus the zoom/pan/fullscreen members of lightboxCore.
 */
function aranya_lightbox_markup(): string {
	$tool = 'w-8 h-8 rounded-full flex items-center justify-center text-ivory-muted hover:text-champagne-300 hover:bg-white/[0.06] transition-colors cursor-pointer';
	$tool_sm = 'w-8 h-8 rounded-full hidden sm:flex items-center justify-center text-ivory-muted hover:text-champagne-300 hover:bg-white/[0.06] transition-colors cursor-pointer';
	$arrow = 'z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full glass-control border border-white/[0.1] hover:border-champagne-400/50 flex items-center justify-center text-ivory hover:text-champagne-300 hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-2xl backdrop-blur-xl';
	ob_start();
	?>
	<div ar-show="isOpen" style="display: none;" ar-ref="lightboxRoot" ar-on:touchstart="lbTouchStart($event)" ar-on:touchend="lbTouchEnd($event)" class="fixed inset-0 z-[100] flex flex-col justify-between bg-[#070807]/98 backdrop-blur-2xl text-ivory select-none animate-fade-in" role="dialog" aria-modal="true" ar-bind:aria-label="(item ? item.title : '') + ' Fullscreen Gallery Viewer'">
		<div class="relative z-30 flex items-center justify-between px-4 sm:px-8 pt-[max(1rem,env(safe-area-inset-top,1rem))] pb-3 shrink-0">
			<div class="min-w-0 pr-4">
				<span ar-show="item && item.category" class="text-[10px] font-sans font-semibold uppercase tracking-[0.25em] text-champagne-400 block mb-0.5" ar-text="item ? item.category : ''"></span>
				<h3 class="font-serif text-base sm:text-xl text-ivory font-light truncate max-w-xs sm:max-w-md md:max-w-xl" ar-text="item ? item.title : ''"></h3>
			</div>

			<div class="flex items-center gap-2 sm:gap-3 shrink-0">
				<div ar-show="hasCounter" class="hidden sm:flex items-center px-3 py-1.5 glass-panel rounded-full text-xs font-sans tracking-widest text-champagne-300 border border-white/[0.08]">
					<span ar-text="pad2(index + 1)"></span>
					<span class="mx-1 text-white/30">/</span>
					<span class="text-ivory-muted/70" ar-text="pad2(total)"></span>
				</div>

				<div class="flex items-center p-1 glass-panel rounded-full border border-white/[0.08] shadow-lg">
					<button ar-on:click="zoomIn()" aria-label="Zoom in" class="<?php echo esc_attr( $tool ); ?>" title="Zoom In"><?php echo aranya_icon( 'zoom-in', 15 ); ?></button>
					<button ar-on:click="zoomOut()" aria-label="Zoom out" class="<?php echo esc_attr( $tool ); ?>" title="Zoom Out"><?php echo aranya_icon( 'zoom-out', 15 ); ?></button>
					<button ar-show="item && item.kind === 'plan'" style="display: none;" ar-on:click="rotate()" aria-label="Rotate plan" class="<?php echo esc_attr( $tool ); ?>" title="Rotate"><?php echo aranya_icon( 'rotate-cw', 14 ); ?></button>
					<button ar-on:click="zoomReset()" aria-label="Reset view" class="<?php echo esc_attr( $tool_sm ); ?>" title="Reset View"><?php echo aranya_icon( 'scan', 14 ); ?></button>
					<button ar-on:click="toggleFullscreen()" aria-label="Toggle fullscreen" class="<?php echo esc_attr( $tool_sm ); ?>" title="Toggle Fullscreen">
						<?php
						echo aranya_icon( 'minimize', 14, array( 'attrs' => array( 'ar-show' => 'isFullscreen', 'style' => 'display: none;' ) ) );
						echo aranya_icon( 'maximize', 14, array( 'attrs' => array( 'ar-show' => '!isFullscreen' ) ) );
						?>
					</button>
					<a ar-show="!(item && item.kind === 'plan')" ar-bind:href="item ? item.url : '#'" download target="_blank" rel="noreferrer" aria-label="Download image" class="<?php echo esc_attr( $tool ); ?>" title="Download Image"><?php echo aranya_icon( 'download', 14 ); ?></a>
				</div>

				<button ar-on:click="close()" aria-label="Close gallery" class="w-10 h-10 rounded-full glass-control border border-white/[0.12] hover:border-champagne-400/50 flex items-center justify-center text-ivory hover:text-champagne-300 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg ml-1" title="Close (Esc)">
					<?php echo aranya_icon( 'x', 18, array( 'stroke' => 1.75 ) ); ?>
				</button>
			</div>
		</div>

		<div
			ar-ref="stage"
			ar-on:pointerdown="panDown($event)"
			ar-on:pointermove="panMove($event)"
			ar-on:pointerup="panEnd()"
			ar-on:pointercancel="panEnd()"
			ar-on:click.self="canPan || close()"
			ar-on:contextmenu="item && item.kind === 'plan' && $event.preventDefault()"
			ar-on:dragstart.prevent
			ar-bind:style="{ touchAction: canPan ? 'none' : 'pan-y' }"
			style="touch-action: pan-y;"
			class="relative flex-1 w-full overflow-hidden flex items-center justify-center px-4 sm:px-16 py-2"
			ar-bind:class="{ 'cursor-grabbing': dragging, 'cursor-grab': !dragging && canPan }"
		>
			<button ar-show="hasPrev" style="display: none;" ar-on:click="prev()" aria-label="Previous image" class="<?php echo esc_attr( 'absolute left-3 sm:left-8 ' . $arrow ); ?>" title="Previous Image (Left Arrow)">
				<?php echo aranya_icon( 'chevron-left', 22, array( 'stroke' => 1.5 ) ); ?>
			</button>

			<div class="ease-out origin-center flex items-center justify-center max-w-full max-h-full transition-all duration-300" ar-bind:class="{ 'transition-all duration-300': !dragging }" ar-bind:style="{ transform: panTransform }">
				<template ar-for="u in (item ? [item.url] : [])" ar-bind:key="u">
					<img ar-bind:src="u" ar-bind:alt="item ? item.title : ''" draggable="false" ar-bind:class="{ '[-webkit-touch-callout:none]': item && item.kind === 'plan' }" class="max-h-[72vh] sm:max-h-[78vh] max-w-[94vw] sm:max-w-[85vw] object-contain rounded-[3px] border border-white/[0.08] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] animate-fade-in">
				</template>
			</div>

			<button ar-show="hasNext" style="display: none;" ar-on:click="next()" aria-label="Next image" class="<?php echo esc_attr( 'absolute right-3 sm:right-8 ' . $arrow ); ?>" title="Next Image (Right Arrow)">
				<?php echo aranya_icon( 'chevron-right', 22, array( 'stroke' => 1.5 ) ); ?>
			</button>
		</div>

		<div class="relative z-30 px-6 pt-2 pb-[max(1.25rem,env(safe-area-inset-bottom,1.25rem))] flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left shrink-0">
			<p ar-show="item && item.description" class="font-sans text-xs text-ivory-muted/80 font-light max-w-xl truncate" ar-text="item ? item.description : ''"></p>
			<div ar-show="!(item && item.description)"></div>

			<span ar-show="item && item.credit" class="pointer-events-none select-none inline-block rounded-full bg-black/55 backdrop-blur-sm px-2.5 py-1 font-sans text-[9px] sm:text-[10px] font-medium uppercase leading-none tracking-[0.16em] text-ivory/90" ar-text="item ? item.credit : ''"></span>

			<div ar-show="hasCounter" class="sm:hidden flex items-center px-3 py-1 glass-panel rounded-full text-[11px] font-sans tracking-wider text-champagne-300 border border-white/[0.08]">
				<span ar-text="pad2(index + 1)"></span>
				<span class="mx-1 text-white/30">/</span>
				<span class="text-ivory-muted/70" ar-text="pad2(total)"></span>
			</div>
		</div>
		<p ar-show="item && item.disclaimer" style="display: none;" class="relative z-30 -mt-2 px-6 pb-[max(1rem,env(safe-area-inset-bottom,1rem))] text-center sm:text-left font-sans text-[11px] leading-relaxed font-medium text-ivory-muted/60">* <span ar-text="item ? item.disclaimer : ''"></span></p>
	</div>
	<?php
	return (string) ob_get_clean();
}
