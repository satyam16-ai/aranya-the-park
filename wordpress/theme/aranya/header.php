<?php
/**
 * Document head and the opening of the app wrapper — the same wrapper
 * (App.tsx's root div) the React site renders every section into.
 *
 * @package Aranya
 */

defined( 'ABSPATH' ) || exit;
?><!doctype html>
<html <?php language_attributes(); ?> class="scroll-smooth">
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<div id="aranya-app" class="min-h-screen bg-dark-950 text-ivory selection:bg-champagne-400 selection:text-dark-950 font-sans antialiased overflow-x-hidden">
	<a class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:px-4 focus:py-2 focus:rounded-full focus:bg-champagne-400 focus:text-dark-950" href="#content"><?php esc_html_e( 'Skip to content', 'aranya' ); ?></a>
	<?php aranya_theme_template( 'header' ); ?>
