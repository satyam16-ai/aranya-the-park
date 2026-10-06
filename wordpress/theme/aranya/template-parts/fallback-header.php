<?php
/**
 * Shown only when the "Aranya Header" template is missing (e.g. before the
 * content installer has run, or with Elementor deactivated).
 *
 * @package Aranya
 */

defined( 'ABSPATH' ) || exit;
?>
<header class="fixed inset-x-0 top-4 z-50 flex justify-center px-3.5 sm:px-6">
	<div class="w-full max-w-6xl rounded-full flex items-center justify-between px-4 sm:px-7 py-3 border bg-dark-950/65 backdrop-blur-xl border-champagne-400/15">
		<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="font-serif uppercase tracking-[0.2em] text-champagne-300 text-sm"><?php bloginfo( 'name' ); ?></a>
	</div>
</header>
