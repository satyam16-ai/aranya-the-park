<?php
/**
 * SEO support.
 *
 * The SEO plugin (Rank Math recommended, Yoast supported) owns titles, meta
 * descriptions, Open Graph, canonical, robots and sitemaps. This file only:
 *  - prints the React site's title/description/OG tags as a fallback when no
 *    SEO plugin is active, so the site is never without them;
 *  - outputs ApartmentComplex JSON-LD built from Site Settings (toggleable);
 *  - prints the tracking code fields (GTM, GA4, Pixel…) from Site Settings.
 *
 * @package Aranya
 */

defined( 'ABSPATH' ) || exit;

/**
 * True when a dedicated SEO plugin is handling meta tags.
 */
function aranya_seo_plugin_active(): bool {
	return defined( 'RANK_MATH_VERSION' ) || defined( 'WPSEO_VERSION' ) || defined( 'AIOSEO_VERSION' ) || defined( 'SEOPRESS_VERSION' );
}

add_filter(
	'pre_get_document_title',
	static function ( $title ) {
		if ( aranya_seo_plugin_active() || ! is_front_page() ) {
			return $title;
		}
		$fallback = (string) aranya_setting( 'home_title' );
		return '' !== $fallback ? $fallback : $title;
	},
	20
);

add_action( 'wp_head', 'aranya_fallback_meta', 2 );

function aranya_fallback_meta() {
	if ( aranya_seo_plugin_active() ) {
		return;
	}
	if ( is_front_page() ) {
		$description = (string) aranya_setting( 'meta_description' );
	} elseif ( is_singular() ) {
		$description = wp_strip_all_tags( get_the_excerpt() );
	} else {
		$description = get_bloginfo( 'description' );
	}
	$title = wp_get_document_title();
	$image = aranya_image_url( aranya_setting_media( 'og_image' ) );

	$tags = array(
		array( 'name', 'description', $description ),
		array( 'property', 'og:type', is_front_page() ? 'website' : 'article' ),
		array( 'property', 'og:title', $title ),
		array( 'property', 'og:description', $description ),
		array( 'property', 'og:url', is_singular() ? get_permalink() : home_url( '/' ) ),
		array( 'property', 'og:image', $image ),
		array( 'property', 'og:site_name', aranya_setting( 'project_name' ) ),
		array( 'name', 'twitter:card', 'summary_large_image' ),
	);
	foreach ( $tags as [ $attr, $key, $value ] ) {
		if ( '' !== (string) $value ) {
			printf( '<meta %s="%s" content="%s" />' . "\n", esc_attr( $attr ), esc_attr( $key ), esc_attr( (string) $value ) );
		}
	}
}

add_action( 'wp_head', 'aranya_schema', 30 );

/**
 * ApartmentComplex + the developer, on the home page.
 */
function aranya_schema() {
	if ( '1' !== aranya_setting( 'schema_enabled' ) || ! is_front_page() ) {
		return;
	}
	$sameas = array_values( array_filter( array_column( aranya_socials(), 'url' ) ) );
	$data   = array(
		'@context'    => 'https://schema.org',
		'@type'       => 'ApartmentComplex',
		'name'        => aranya_setting( 'project_name' ),
		'description' => aranya_setting( 'meta_description' ),
		'url'         => home_url( '/' ),
		'image'       => aranya_image_url( aranya_setting_media( 'og_image' ) ),
		'telephone'   => aranya_setting( 'phone' ),
		'address'     => array(
			'@type'           => 'PostalAddress',
			'streetAddress'   => aranya_setting( 'address' ),
			'addressLocality' => 'Malad West, Mumbai',
			'addressRegion'   => 'Maharashtra',
			'postalCode'      => '400064',
			'addressCountry'  => 'IN',
		),
		'amenityFeature' => array_map(
			static fn( $name ) => array(
				'@type' => 'LocationFeatureSpecification',
				'name'  => $name,
				'value' => true,
			),
			array( 'Pickleball court', 'Fitness centre', 'Banquet hall', 'Rooftop yoga deck', 'Kids play area', 'EV charging', 'Automated parking' )
		),
		'containedInPlace' => array(
			'@type' => 'Place',
			'name'  => 'Malad West, Mumbai',
		),
		'provider'    => array(
			'@type'  => 'Organization',
			'name'   => aranya_setting( 'developer' ),
			'sameAs' => $sameas,
		),
	);
	printf(
		'<script type="application/ld+json">%s</script>' . "\n",
		wp_json_encode( apply_filters( 'aranya_schema', $data ), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE )
	);
}

/* ─── Tracking code (entered by administrators in Site Settings) ──────── */

add_action(
	'wp_head',
	static function () {
		echo aranya_setting( 'code_head' ); // phpcs:ignore WordPress.Security.EscapeOutput -- admin-entered tracking code.
	},
	99
);

add_action(
	'wp_body_open',
	static function () {
		echo aranya_setting( 'code_body' ); // phpcs:ignore WordPress.Security.EscapeOutput
	},
	1
);

add_action(
	'wp_footer',
	static function () {
		echo aranya_setting( 'code_footer' ); // phpcs:ignore WordPress.Security.EscapeOutput
	},
	99
);
