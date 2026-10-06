<?php
/**
 * Blog posts (and any single item not built with Elementor).
 *
 * @package Aranya
 */

defined( 'ABSPATH' ) || exit;

get_header();

if ( aranya_theme_is_elementor() ) :
	?>
	<main id="content">
		<?php
		while ( have_posts() ) :
			the_post();
			the_content();
		endwhile;
		?>
	</main>
	<?php
else :
	get_template_part( 'template-parts/content', 'single' );
endif;

get_footer();
