<?php
/**
 * Footer template, the close of the app wrapper, and wp_footer (which also
 * prints the page-wide overlays from the Aranya Core plugin).
 *
 * @package Aranya
 */

defined( 'ABSPATH' ) || exit;
?>
	<?php aranya_theme_template( 'footer' ); ?>
</div>
<?php wp_footer(); ?>
</body>
</html>
