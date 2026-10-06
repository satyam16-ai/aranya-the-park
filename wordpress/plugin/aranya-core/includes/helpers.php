<?php
/**
 * Small rendering helpers shared by every widget and the theme.
 *
 * @package Aranya
 */

defined( 'ABSPATH' ) || exit;

/**
 * Prints the same <svg> lucide-react renders for an icon.
 *
 * lucide-react output: xmlns, width, height, viewBox, fill, stroke, stroke-width,
 * stroke-linecap, stroke-linejoin, class="lucide lucide-{name} {className}",
 * aria-hidden="true". The inner paths come from includes/icons.php, generated
 * from the installed lucide-react by build/extract-icons.mjs.
 *
 * @param string    $name   Icon key, kebab-case (e.g. 'maximize-2', 'phone').
 * @param int|float $size   Width/height attribute (lucide default 24).
 * @param array     $args   { stroke: stroke width (default 2), class: extra classes,
 *                            attrs: extra attributes (e.g. Alpine bindings) }.
 */
function aranya_icon( string $name, $size = 24, array $args = array() ): string {
	static $icons = null;
	if ( null === $icons ) {
		$icons = require ARANYA_DIR . 'includes/icons.php';
	}
	if ( ! isset( $icons[ $name ] ) ) {
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			trigger_error( esc_html( "aranya_icon(): unknown icon '$name'" ), E_USER_NOTICE ); // phpcs:ignore
		}
		return '';
	}
	[ , $base_class, $inner ] = $icons[ $name ];
	$stroke = $args['stroke'] ?? 2;
	$class  = trim( $base_class . ' ' . ( $args['class'] ?? '' ) );

	return sprintf(
		'<svg xmlns="http://www.w3.org/2000/svg" width="%1$s" height="%1$s" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="%2$s" stroke-linecap="round" stroke-linejoin="round" class="%3$s" aria-hidden="true"%5$s>%4$s</svg>',
		esc_attr( (string) $size ),
		esc_attr( (string) $stroke ),
		esc_attr( $class ),
		$inner, // Trusted: generated at build time from lucide-react.
		isset( $args['attrs'] ) ? aranya_attrs( $args['attrs'] ) : ''
	);
}

/**
 * Icon choices for Elementor SELECT controls: key => readable name.
 */
function aranya_icon_options(): array {
	$icons   = require ARANYA_DIR . 'includes/icons.php';
	$options = array();
	foreach ( $icons as $key => $icon ) {
		$options[ $key ] = ucwords( str_replace( '-', ' ', $key ) );
	}
	return $options;
}

/**
 * Joins class fragments, skipping empties.
 */
function aranya_cx( ...$parts ): string {
	return trim( implode( ' ', array_filter( array_map( 'trim', array_map( 'strval', $parts ) ) ) ) );
}

/**
 * Builds an HTML attribute string from an array. `true` prints a bare attribute,
 * `false`/`null` drops it.
 */
function aranya_attrs( array $attrs ): string {
	$out = '';
	foreach ( $attrs as $key => $value ) {
		if ( null === $value || false === $value ) {
			continue;
		}
		if ( true === $value ) {
			$out .= ' ' . $key;
			continue;
		}
		$out .= sprintf( ' %s="%s"', $key, esc_attr( (string) $value ) );
	}
	return $out;
}

/**
 * Inline copy that may carry a little markup: line breaks, emphasis, links.
 * Headings and short paragraphs in the widgets use this, so editors can add a
 * <br> or <strong> the way the design does, but not arbitrary HTML.
 */
function aranya_inline( ?string $text ): string {
	return wp_kses(
		(string) $text,
		array(
			'br'     => array(),
			'strong' => array( 'class' => true ),
			'b'      => array( 'class' => true ),
			'em'     => array( 'class' => true ),
			'i'      => array( 'class' => true ),
			'span'   => array( 'class' => true ),
			'a'      => array(
				'href'   => true,
				'target' => true,
				'rel'    => true,
				'class'  => true,
			),
		)
	);
}

/**
 * Whitelists a heading tag chosen in an Elementor control (SEO teams pick the
 * level; the look never changes because the styling is class-based).
 */
function aranya_tag( ?string $tag, string $fallback = 'h2' ): string {
	$allowed = array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div', 'span' );
	return in_array( $tag, $allowed, true ) ? $tag : $fallback;
}

/**
 * Heading-tag options for Elementor SELECT controls.
 */
function aranya_tag_options(): array {
	return array(
		'h1'   => 'H1',
		'h2'   => 'H2',
		'h3'   => 'H3',
		'h4'   => 'H4',
		'h5'   => 'H5',
		'h6'   => 'H6',
		'p'    => 'p',
		'div'  => 'div',
		'span' => 'span',
	);
}

/**
 * encodeURIComponent() — the React code builds WhatsApp links with it, so the
 * WordPress links are encoded the same way.
 */
function aranya_encode_uri_component( string $value ): string {
	return strtr(
		rawurlencode( $value ),
		array(
			'%21' => '!',
			'%2A' => '*',
			'%27' => "'",
			'%28' => '(',
			'%29' => ')',
		)
	);
}

/**
 * A wa.me link for the project's WhatsApp number, optionally with a message.
 */
function aranya_whatsapp_url( string $message = '' ): string {
	$number = preg_replace( '/\D+/', '', (string) aranya_setting( 'whatsapp_number' ) );
	$url    = 'https://wa.me/' . $number;
	return '' === $message ? $url : $url . '?text=' . aranya_encode_uri_component( $message );
}

/**
 * The "Get Directions" link: the Google Business Profile when set, otherwise a
 * maps search for the project's name and address (as the React site does).
 */
function aranya_directions_url(): string {
	$business = (string) aranya_setting( 'google_business_url' );
	if ( '' !== $business ) {
		return $business;
	}
	return 'https://www.google.com/maps/search/?api=1&query=' . aranya_encode_uri_component(
		aranya_setting( 'project_name' ) . ', ' . aranya_setting( 'address' )
	);
}

/**
 * Reads a URL control value ( [ url, is_external, nofollow ] ) into attributes.
 */
function aranya_link_attrs( $link, array $extra = array() ): string {
	$url  = is_array( $link ) ? ( $link['url'] ?? '' ) : (string) $link;
	$attr = array( 'href' => $url );
	if ( is_array( $link ) && ! empty( $link['is_external'] ) ) {
		$attr['target'] = '_blank';
		$attr['rel']    = 'noopener noreferrer';
	}
	if ( is_array( $link ) && ! empty( $link['nofollow'] ) ) {
		$attr['rel'] = trim( ( $attr['rel'] ?? '' ) . ' nofollow' );
	}
	return aranya_attrs( array_merge( $attr, $extra ) );
}

/**
 * Splits a textarea into trimmed, non-empty lines (feature lists, highlights).
 */
function aranya_lines( ?string $text ): array {
	return array_values( array_filter( array_map( 'trim', preg_split( '/\r\n|\r|\n/', (string) $text ) ), 'strlen' ) );
}

/**
 * Two-digit counter ("01 / 05"), as the React components format them.
 */
function aranya_pad2( int $n ): string {
	return str_pad( (string) $n, 2, '0', STR_PAD_LEFT );
}

/**
 * True inside the Elementor editor preview (widgets show overlays inline there).
 */
function aranya_is_editor(): bool {
	if ( ! did_action( 'elementor/loaded' ) ) {
		return false;
	}
	$plugin = \Elementor\Plugin::instance();
	return ( $plugin->editor && $plugin->editor->is_edit_mode() ) || ( $plugin->preview && $plugin->preview->is_preview_mode() );
}

/**
 * common/SocialLinks.tsx — the social channels from Site Settings as round
 * icon links. Channels without a URL stay hidden. $links (label => url) and
 * $owner (prefixed to the labels) show another account, e.g. a partner's.
 */
function aranya_social_links( string $class = '', ?array $links = null, string $owner = '' ): string {
	$paths = array(
		// Simple Icons, drawn on 0-24: scaled into 2-22 below to match the others.
		'Instagram' => 'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z',
		'Facebook'  => 'M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z',
		'YouTube'   => 'M21.58 7.19a2.5 2.5 0 0 0-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42a2.5 2.5 0 0 0-1.77 1.77A26.1 26.1 0 0 0 2 12a26.1 26.1 0 0 0 .42 4.81 2.5 2.5 0 0 0 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42a2.5 2.5 0 0 0 1.77-1.77A26.1 26.1 0 0 0 22 12a26.1 26.1 0 0 0-.42-4.81ZM10 15.02V8.98L15.2 12 10 15.02Z',
		'LinkedIn'  => 'M6.94 5.5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.25 8.9h3.4V21h-3.4V8.9Zm5.53 0h3.26v1.65h.05c.45-.86 1.56-1.77 3.22-1.77 3.44 0 4.08 2.27 4.08 5.21V21h-3.4v-5.33c0-1.27-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.81V21h-3.4V8.9Z',
	);
	$transform = array( 'Instagram' => 'translate(2 2) scale(0.8333)' );
	if ( null === $links ) {
		$links = aranya_socials();
	} else {
		$links = array_map( static fn( $label, $url ) => array( 'label' => $label, 'url' => (string) $url ), array_keys( $links ), $links );
		$links = array_filter( $links, static fn( $link ) => '' !== $link['url'] && isset( $paths[ $link['label'] ] ) );
	}
	if ( ! $links ) {
		return '';
	}
	$out = '<div class="' . esc_attr( aranya_cx( 'flex items-center gap-2.5', $class ) ) . '">';
	foreach ( $links as $link ) {
		$out .= sprintf(
			'<a href="%s" target="_blank" rel="noopener noreferrer" aria-label="%s" title="%s" class="h-9 w-9 inline-flex items-center justify-center rounded-full border border-white/[0.12] text-ivory-muted hover:text-champagne-300 hover:border-champagne-400/50 transition-colors"><svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="%s"%s></path></svg></a>',
			esc_url( $link['url'] ),
			esc_attr( trim( $owner . ' ' . $link['label'] ) . ' (opens in a new tab)' ),
			esc_attr( trim( $owner . ' ' . $link['label'] ) ),
			esc_attr( $paths[ $link['label'] ] ),
			isset( $transform[ $link['label'] ] ) ? ' transform="' . esc_attr( $transform[ $link['label'] ] ) . '"' : ''
		);
	}
	return $out . '</div>';
}

/**
 * A json_encode for Alpine ar-data attributes (escaped by esc_attr when printed).
 */
function aranya_json( $data ): string {
	return (string) wp_json_encode( $data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE );
}
