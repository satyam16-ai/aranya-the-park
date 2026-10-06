<?php
/**
 * Pages. A page built with Elementor prints its sections edge to edge, exactly
 * as the React site does; a plain page gets the site's reading layout.
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
	get_template_part( 'template-parts/content', 'page' );
endif;

get_footer();
