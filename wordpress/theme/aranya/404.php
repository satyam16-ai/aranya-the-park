<?php
/**
 * Not found.
 *
 * @package Aranya
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>
<main id="content" class="min-h-[80vh] flex items-center relative isolate overflow-hidden">
	<div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 overflow-hidden"><div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_45%_30%,#0e2a1f_0%,rgba(7,21,16,0)_72%)]"></div></div>
	<div class="mx-auto w-full px-5 sm:px-8 lg:px-12 max-w-3xl text-center pt-28">
		<span class="eyebrow block mb-2">404</span>
		<h1 class="heading-serif uppercase text-ivory"><?php esc_html_e( 'This page has moved on', 'aranya' ); ?></h1>
		<p class="prose-editorial text-ivory-muted mt-2.5 max-w-xl mx-auto"><?php esc_html_e( 'The page you were looking for is not here. The residences, amenities and floor plans are all on the home page.', 'aranya' ); ?></p>
		<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="mt-8 inline-flex items-center justify-center gap-2.5 font-sans font-semibold uppercase tracking-[0.14em] rounded-[3px] btn-lux cursor-pointer select-none text-[0.6875rem] px-6 sm:px-8 py-3 sm:py-3.5 min-h-[46px] bg-gradient-to-b from-champagne-300 to-champagne-400 text-forest-800 shadow-[0_4px_14px_rgba(200,169,107,0.22)] hover:from-champagne-200 hover:to-champagne-300 hover:shadow-[0_10px_30px_rgba(200,169,107,0.45)]"><span class="relative z-10"><?php esc_html_e( 'Back to Aranya The Park', 'aranya' ); ?></span></a>
	</div>
</main>
<?php
get_footer();
