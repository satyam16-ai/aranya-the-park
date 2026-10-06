<?php
/**
 * A page not built with Elementor (e.g. Privacy Policy) in the reading layout.
 *
 * @package Aranya
 */

defined( 'ABSPATH' ) || exit;

while ( have_posts() ) :
	the_post();
	?>
	<main id="content" class="section-spacing pt-32 sm:pt-36 relative isolate overflow-hidden">
		<div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 overflow-hidden"><div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_45%_30%,#0e2a1f_0%,rgba(7,21,16,0)_72%)]"></div></div>
		<article <?php post_class( 'mx-auto w-full px-5 sm:px-8 lg:px-12 max-w-3xl' ); ?>>
			<h1 class="heading-serif uppercase text-ivory mb-8"><?php the_title(); ?></h1>
			<div class="aranya-prose">
				<?php the_content(); ?>
			</div>
		</article>
	</main>
	<?php
endwhile;
