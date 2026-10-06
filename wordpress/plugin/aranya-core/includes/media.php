<?php
/**
 * Images and video: the WordPress side of src/components/common/Img.tsx and
 * ImageCredit.tsx.
 *
 * An image can reach a widget two ways:
 *  - an attachment picked in Elementor (id > 0) — WordPress supplies the srcset.
 *    Attachments made by the importer carry the React site's pre-optimised WebP
 *    ladder as their sizes, so the srcset lists the very same files;
 *  - a default path (a widget default, before or without the import) — the
 *    srcset comes from includes/media-manifest.php, generated from the React
 *    manifests.
 * Either way aranya_img() prints src, srcset, sizes, width, height and alt the
 * way <Img> does.
 *
 * Media files live in uploads/aranya/ (same sub-folders as public/assets/ on
 * the React site: opt/, branding/, video/ …). Until the importer has copied
 * them, uploads/aranya-import/ is used, then the "media source" URL.
 *
 * @package Aranya
 */

defined( 'ABSPATH' ) || exit;

/**
 * The React manifest: file => [ w, h, kind, credit, ladder ].
 */
function aranya_media_manifest(): array {
	static $manifest = null;
	if ( null === $manifest ) {
		$manifest = require ARANYA_DIR . 'includes/media-manifest.php';
	}
	return $manifest;
}

/**
 * URL for a bundled asset, given its path under public/assets on the React site
 * ("opt/life-garden-walk-2000.webp", "/assets/branding/aranya-logo.png"…).
 */
function aranya_asset_url( string $path ): string {
	if ( '' === $path || preg_match( '#^(https?:)?//#', $path ) ) {
		return $path;
	}
	$path    = ltrim( preg_replace( '#^/?assets/#', '', $path ), '/' );
	$uploads = wp_get_upload_dir();
	foreach ( array( 'aranya', 'aranya-import' ) as $dir ) {
		if ( file_exists( trailingslashit( $uploads['basedir'] ) . $dir . '/' . $path ) ) {
			return aranya_media_versioned( trailingslashit( $uploads['baseurl'] ) . $dir . '/' . $path );
		}
	}
	$source = (string) get_option( 'aranya_media_source', '' );
	if ( '' !== $source ) {
		return trailingslashit( $source ) . 'assets/' . $path;
	}
	return trailingslashit( $uploads['baseurl'] ) . 'aranya/' . $path;
}

/**
 * The inverse of aranya_asset_url(): "opt/x-2000.webp" for a URL that points at
 * a bundled asset (in uploads/aranya, uploads/aranya-import or the media
 * source), else null.
 */
function aranya_asset_path_from_url( string $url ): ?string {
	$url      = (string) preg_replace( '/\?.*$/', '', $url ); // Drop the media version.
	$base     = trailingslashit( wp_get_upload_dir()['baseurl'] );
	$prefixes = array( $base . 'aranya/', $base . 'aranya-import/' );
	$source   = (string) get_option( 'aranya_media_source', '' );
	if ( '' !== $source ) {
		$prefixes[] = trailingslashit( $source ) . 'assets/';
	}
	foreach ( $prefixes as $prefix ) {
		if ( str_starts_with( $url, $prefix ) ) {
			return substr( $url, strlen( $prefix ) );
		}
	}
	return null;
}

/**
 * Normalises an image reference (Elementor media array, attachment id or path)
 * to [ id, url ].
 */
function aranya_media_ref( $media ): array {
	if ( is_array( $media ) ) {
		$id  = (int) ( $media['id'] ?? 0 );
		$url = (string) ( $media['url'] ?? '' );
		return array( $id, $id > 0 ? '' : aranya_asset_url( $url ) );
	}
	if ( is_numeric( $media ) ) {
		return array( (int) $media, '' );
	}
	return array( 0, aranya_asset_url( (string) $media ) );
}

/**
 * Everything the <img> needs: src, srcset, width, height, alt, credit label.
 */
function aranya_image_info( $media ): array {
	[ $id, $url ] = aranya_media_ref( $media );
	$info         = array(
		'src'    => '',
		'srcset' => '',
		'w'      => 0,
		'h'      => 0,
		'alt'    => '',
		'credit' => '',
	);

	if ( $id > 0 && wp_attachment_is_image( $id ) ) {
		$meta           = wp_get_attachment_metadata( $id );
		$info['src']    = (string) wp_get_attachment_image_url( $id, 'full' );
		$info['srcset'] = (string) wp_get_attachment_image_srcset( $id, 'full', $meta );
		$info['w']      = (int) ( $meta['width'] ?? 0 );
		$info['h']      = (int) ( $meta['height'] ?? 0 );
		$info['alt']    = (string) get_post_meta( $id, '_wp_attachment_image_alt', true );
		$info['credit'] = (string) get_post_meta( $id, '_aranya_credit_label', true );
		return $info;
	}

	$info['src'] = $url;
	// Default images carry the React site's alt text until they are imported.
	$path        = aranya_asset_path_from_url( $url );
	$info['alt'] = null !== $path && function_exists( 'aranya_import_alt' ) ? aranya_import_alt( $path ) : '';
	$entry       = aranya_media_manifest()[ basename( (string) wp_parse_url( $url, PHP_URL_PATH ) ) ] ?? null;
	if ( $entry ) {
		$base           = substr( $url, 0, strrpos( $url, '/' ) + 1 );
		$info['srcset'] = implode(
			', ',
			array_map( static fn( $step ) => aranya_media_versioned( $base . $step[0] ) . ' ' . $step[1] . 'w', $entry['ladder'] )
		);
		$info['w']      = (int) $entry['w'];
		$info['h']      = (int) $entry['h'];
		$info['credit'] = 'representative' === $entry['credit'] ? __( 'Representational image', 'aranya' ) : '';
	}
	return $info;
}

/**
 * The <img> tag, as common/Img.tsx prints it.
 *
 * @param mixed $media Elementor media value, attachment id or asset path.
 * @param array $args {
 *   alt: string = exactly this alt (even ''); null = the attachment's alt, else default_alt.
 *   default_alt, class, sizes (default 100vw), loading, decoding, fetchpriority,
 *   draggable, plain (true = no srcset/size attributes, like a plain <img>),
 *   attrs: extra attributes.
 * }
 */
function aranya_img( $media, array $args = array() ): string {
	$args = array_merge(
		array(
			'alt'           => null,
			'default_alt'   => '',
			'class'         => '',
			'sizes'         => '100vw',
			'loading'       => null,
			'decoding'      => null,
			'fetchpriority' => null,
			'draggable'     => null,
			'plain'         => false,
			'attrs'         => array(),
		),
		$args
	);
	$info = aranya_image_info( $media );
	if ( '' === $info['src'] ) {
		return '';
	}

	if ( null !== $args['alt'] ) {
		$alt = (string) $args['alt'];
	} else {
		$alt = '' !== $info['alt'] ? $info['alt'] : (string) $args['default_alt'];
	}

	$has_srcset = ! $args['plain'] && '' !== $info['srcset'];
	$attrs      = array(
		'src'           => $info['src'],
		'srcset'        => $has_srcset ? $info['srcset'] : null,
		'sizes'         => $has_srcset ? $args['sizes'] : null,
		'width'         => ! $args['plain'] && $info['w'] ? $info['w'] : null,
		'height'        => ! $args['plain'] && $info['h'] ? $info['h'] : null,
		'alt'           => $alt,
		'loading'       => $args['loading'],
		'decoding'      => $args['decoding'],
		'fetchpriority' => $args['fetchpriority'],
		'draggable'     => null === $args['draggable'] ? null : ( $args['draggable'] ? 'true' : 'false' ),
		'class'         => '' !== $args['class'] ? $args['class'] : null,
	);
	return '<img' . aranya_attrs( array_merge( $attrs, $args['attrs'] ) ) . '>';
}

/**
 * Just the URL of an image reference (for lightboxes, posters, downloads).
 */
function aranya_image_url( $media ): string {
	return aranya_image_info( $media )['src'];
}

/**
 * The "Representational image" chip (common/ImageCredit.tsx). Prints nothing
 * when the image has no credit label — project renders, plans and logos.
 */
function aranya_image_credit( $media, string $class = '' ): string {
	$label = aranya_image_info( $media )['credit'];
	if ( '' === $label ) {
		return '';
	}
	return sprintf(
		'<span class="%s">%s</span>',
		esc_attr( aranya_cx( 'pointer-events-none select-none inline-block rounded-full bg-black/55 backdrop-blur-sm px-2.5 py-1 font-sans text-[9px] sm:text-[10px] font-medium uppercase leading-none tracking-[0.16em] text-ivory/90', $class ) ),
		esc_html( $label )
	);
}

/**
 * URL of a video reference (Elementor media value or asset path).
 */
function aranya_video_url( $media ): string {
	[ $id, $url ] = aranya_media_ref( $media );
	return $id > 0 ? (string) wp_get_attachment_url( $id ) : $url;
}

/* ─── Media Library integration ─────────────────────────────────────────── */

/**
 * "Credit label" on every image in the Media Library, so a new stock photo can
 * carry "Representational image" like the React site's lifestyle shots.
 */
add_filter(
	'attachment_fields_to_edit',
	static function ( $fields, $post ) {
		if ( wp_attachment_is_image( $post ) ) {
			$fields['aranya_credit_label'] = array(
				'label' => __( 'Credit label', 'aranya' ),
				'input' => 'text',
				'value' => (string) get_post_meta( $post->ID, '_aranya_credit_label', true ),
				'helps' => __( 'Small print shown on the image, e.g. "Representational image" for stock photography. Leave empty for project renders.', 'aranya' ),
			);
		}
		return $fields;
	},
	10,
	2
);

add_filter(
	'attachment_fields_to_save',
	static function ( $post, $attachment ) {
		if ( isset( $attachment['aranya_credit_label'] ) ) {
			update_post_meta( $post['ID'], '_aranya_credit_label', sanitize_text_field( $attachment['aranya_credit_label'] ) );
		}
		return $post;
	},
	10,
	2
);

// The React ladders go up to 2800 px; let srcset list them (WordPress stops at 2048 by default).
add_filter( 'max_srcset_image_width', static fn() => 2800 );

/**
 * Tags a URL under uploads/aranya/ with the media version (?v=…). Install
 * Content bumps the version, so a CDN that cached a bad copy of a file (as
 * Hostinger's did during a failed import) fetches it afresh.
 */
function aranya_media_versioned( string $url ): string {
	if ( '' === $url || str_contains( $url, '?' ) || ! str_contains( $url, '/uploads/aranya/' ) ) {
		return $url;
	}
	return $url . '?v=' . rawurlencode( (string) get_option( 'aranya_media_version', '1' ) );
}

add_filter( 'wp_get_attachment_url', static fn( $url ) => is_string( $url ) ? aranya_media_versioned( $url ) : $url, 20 );

add_filter(
	'wp_calculate_image_srcset',
	static function ( $sources ) {
		foreach ( (array) $sources as $w => $source ) {
			$sources[ $w ]['url'] = aranya_media_versioned( (string) $source['url'] );
		}
		return $sources;
	},
	20
);
