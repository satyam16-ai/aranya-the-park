<?php
/**
 * Shown only when the "Aranya Footer" template is missing.
 *
 * @package Aranya
 */

defined( 'ABSPATH' ) || exit;
?>
<footer class="bg-dark-950 text-ivory-muted py-10 font-sans text-xs border-t border-white/[0.08] text-center">
	© <?php echo esc_html( gmdate( 'Y' ) ); ?> <?php bloginfo( 'name' ); ?>
</footer>
