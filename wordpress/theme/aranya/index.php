<?php
/**
 * Blog index, archives and search results.
 *
 * @package Aranya
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>
<main id="content" class="section-spacing pt-32 sm:pt-36 relative isolate overflow-hidden">
	<div class="mx-auto w-full px-5 sm:px-8 lg:px-12 max-w-6xl">
		<div class="mb-7 sm:mb-9 max-w-2xl">
			<span class="eyebrow block mb-2"><?php echo esc_html( is_search() ? __( 'Search', 'aranya' ) : __( 'Journal', 'aranya' ) ); ?></span>
			<h1 class="heading-serif uppercase text-ivory">
				<?php
				if ( is_search() ) {
					/* translators: %s: search query */
					printf( esc_html__( 'Results for “%s”', 'aranya' ), esc_html( get_search_query() ) );
				} elseif ( is_archive() ) {
					echo esc_html( wp_strip_all_tags( get_the_archive_title() ) );
				} else {
					echo esc_html( get_the_title( (int) get_option( 'page_for_posts' ) ) ?: __( 'News & Updates', 'aranya' ) );
				}
				?>
			</h1>
		</div>

		<?php if ( have_posts() ) : ?>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
				<?php
				while ( have_posts() ) :
					the_post();
					?>
					<article <?php post_class( 'group glass-panel rounded-[6px] overflow-hidden flex flex-col' ); ?>>
						<a href="<?php the_permalink(); ?>" class="block">
							<?php if ( has_post_thumbnail() ) : ?>
								<div class="aspect-[4/3] overflow-hidden bg-dark-900">
									<?php the_post_thumbnail( 'large', array( 'class' => 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out' ) ); ?>
								</div>
							<?php endif; ?>
							<div class="p-5 sm:p-6 space-y-2">
								<span class="text-[10px] font-sans uppercase tracking-[0.25em] text-champagne-300 block"><?php echo esc_html( get_the_date() ); ?></span>
								<h2 class="font-serif text-lg sm:text-xl text-ivory font-light group-hover:text-champagne-200 transition-colors"><?php the_title(); ?></h2>
								<p class="prose-editorial text-ivory-muted"><?php echo esc_html( wp_trim_words( get_the_excerpt(), 26 ) ); ?></p>
							</div>
						</a>
					</article>
				<?php endwhile; ?>
			</div>
			<nav class="mt-10 flex items-center justify-between text-xs font-sans uppercase tracking-[0.16em] text-champagne-300" aria-label="<?php esc_attr_e( 'Posts', 'aranya' ); ?>">
				<span><?php previous_posts_link( __( '← Newer', 'aranya' ) ); ?></span>
				<span><?php next_posts_link( __( 'Older →', 'aranya' ) ); ?></span>
			</nav>
		<?php else : ?>
			<p class="prose-editorial text-ivory-muted"><?php esc_html_e( 'Nothing here yet.', 'aranya' ); ?></p>
		<?php endif; ?>
	</div>
</main>
<?php
get_footer();
