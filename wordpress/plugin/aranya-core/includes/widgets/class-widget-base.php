<?php
/**
 * Base class for every Aranya widget.
 *
 * Each widget prints the same markup, with the same Tailwind classes, as its
 * React component; the controls only feed it content. The helpers here keep
 * the control definitions short and consistent across widgets:
 * every heading has an HTML-tag control for the SEO team, every section an
 * anchor ID, every image an optional alt override.
 *
 * @package Aranya
 */

namespace Aranya\Widgets;

use Elementor\Controls_Manager;
use Elementor\Repeater;
use Elementor\Widget_Base as Elementor_Widget_Base;

defined( 'ABSPATH' ) || exit;

abstract class Widget_Base extends Elementor_Widget_Base {

	public function get_categories() {
		return array( 'aranya' );
	}

	public function get_keywords() {
		return array( 'aranya', 'park', 'section' );
	}

	/** The wrapper class `aranya-w` scopes the Elementor-compat CSS layer. */
	protected function get_html_wrapper_class() {
		return parent::get_html_wrapper_class() . ' aranya-w';
	}

	/** No inner .elementor-widget-container div: the section is the widget. */
	public function has_widget_inner_wrapper(): bool {
		return false;
	}

	/**
	 * Not cached by Elementor's element cache: widgets read Site Settings (phone,
	 * RERA number…), and a cached render would keep showing the old values.
	 */
	protected function is_dynamic_content(): bool {
		return true;
	}

	/* ─── Control helpers ─────────────────────────────────────────────── */

	protected function section( string $id, string $label, string $tab = Controls_Manager::TAB_CONTENT ): void {
		$this->start_controls_section(
			$id,
			array(
				'label' => $label,
				'tab'   => $tab,
			)
		);
	}

	protected function end_section(): void {
		$this->end_controls_section();
	}

	protected function text( string $id, string $label, string $default = '', array $extra = array(), $target = null ): void {
		( $target ?? $this )->add_control(
			$id,
			array_merge(
				array(
					'label'       => $label,
					'type'        => Controls_Manager::TEXT,
					'default'     => $default,
					'label_block' => true,
				),
				$extra
			)
		);
	}

	protected function textarea( string $id, string $label, string $default = '', array $extra = array(), $target = null ): void {
		( $target ?? $this )->add_control(
			$id,
			array_merge(
				array(
					'label'   => $label,
					'type'    => Controls_Manager::TEXTAREA,
					'default' => $default,
					'rows'    => 4,
				),
				$extra
			)
		);
	}

	/**
	 * An image control whose default is one of the site's bundled images.
	 *
	 * @param string $default Path under uploads/aranya (e.g. 'opt/x-2000.webp').
	 */
	protected function media( string $id, string $label, string $default = '', array $extra = array(), $target = null ): void {
		( $target ?? $this )->add_control(
			$id,
			array_merge(
				array(
					'label'   => $label,
					'type'    => Controls_Manager::MEDIA,
					'default' => array(
						'url' => $default ? aranya_asset_url( $default ) : '',
						'id'  => '',
					),
				),
				$extra
			)
		);
	}

	/** Alt text override; empty uses the Media Library alt text. */
	protected function alt( string $id, $target = null ): void {
		$this->text(
			$id,
			__( 'Alt text (optional)', 'aranya' ),
			'',
			array(
				'placeholder' => __( 'Uses the Media Library alt text', 'aranya' ),
				'description' => __( 'For SEO/accessibility. Leave empty to use the alt text set in the Media Library.', 'aranya' ),
			),
			$target
		);
	}

	protected function tag( string $id, string $label, string $default = 'h2' ): void {
		$this->add_control(
			$id,
			array(
				'label'       => $label,
				'type'        => Controls_Manager::SELECT,
				'default'     => $default,
				'options'     => aranya_tag_options(),
				'description' => __( 'Heading level for SEO. The look does not change.', 'aranya' ),
			)
		);
	}

	protected function select( string $id, string $label, array $options, string $default, array $extra = array(), $target = null ): void {
		( $target ?? $this )->add_control(
			$id,
			array_merge(
				array(
					'label'   => $label,
					'type'    => Controls_Manager::SELECT,
					'options' => $options,
					'default' => $default,
				),
				$extra
			)
		);
	}

	protected function switcher( string $id, string $label, bool $default = true, array $extra = array() ): void {
		$this->add_control(
			$id,
			array_merge(
				array(
					'label'        => $label,
					'type'         => Controls_Manager::SWITCHER,
					'return_value' => 'yes',
					'default'      => $default ? 'yes' : '',
				),
				$extra
			)
		);
	}

	protected function url( string $id, string $label, string $default = '', bool $external = false ): void {
		$this->add_control(
			$id,
			array(
				'label'       => $label,
				'type'        => Controls_Manager::URL,
				'default'     => array(
					'url'         => $default,
					'is_external' => $external,
					'nofollow'    => false,
				),
				'label_block' => true,
			)
		);
	}

	protected function note( string $html ): void {
		static $n = 0;
		$this->add_control(
			'note_' . ( ++$n ),
			array(
				'type'            => Controls_Manager::RAW_HTML,
				'raw'             => $html,
				'content_classes' => 'elementor-descriptor',
			)
		);
	}

	/** The section's id — the target of the menu's #anchor links. */
	protected function anchor( string $default ): void {
		$this->text(
			'anchor',
			__( 'Section ID (anchor)', 'aranya' ),
			$default,
			array( 'description' => __( 'Menu links point here as #id. Change only together with the menu.', 'aranya' ) )
		);
	}

	/** Eyebrow / title / title tag / subtitle — the SectionHeading unit. */
	protected function heading_controls( string $eyebrow, string $title, string $subtitle = '', string $tag = 'h2' ): void {
		$this->text( 'eyebrow', __( 'Eyebrow', 'aranya' ), $eyebrow );
		$this->textarea( 'title', __( 'Title', 'aranya' ), $title, array( 'rows' => 2 ) );
		$this->tag( 'title_tag', __( 'Title HTML tag', 'aranya' ), $tag );
		$this->textarea( 'subtitle', __( 'Subtitle', 'aranya' ), $subtitle, array( 'rows' => 3 ) );
	}

	/**
	 * A repeater. $fields receives a fresh Repeater to add controls to.
	 */
	protected function repeater( string $id, string $label, callable $fields, array $default, string $title_field ): void {
		$repeater = new Repeater();
		$fields( $repeater );
		$this->add_control(
			$id,
			array(
				'label'       => $label,
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $repeater->get_controls(),
				'default'     => $default,
				'title_field' => $title_field,
			)
		);
	}

	/**
	 * Converts default image paths in generated data rows to media values.
	 */
	protected static function media_rows( array $rows, array $image_keys ): array {
		foreach ( $rows as &$row ) {
			foreach ( $image_keys as $key ) {
				if ( isset( $row[ $key ] ) && is_string( $row[ $key ] ) ) {
					$row[ $key ] = array(
						'url' => aranya_asset_url( $row[ $key ] ),
						'id'  => '',
					);
				}
			}
		}
		return $rows;
	}

	/* ─── Render helpers ──────────────────────────────────────────────── */

	/**
	 * SectionHeading.tsx: eyebrow, uppercase serif title, subtitle, and an
	 * optional aside (the section's own controls) on the same row.
	 */
	protected function print_section_heading( array $s, string $aside = '', string $align = 'left', string $theme = 'dark' ): void {
		$dark     = 'dark' === $theme;
		$centered = 'center' === $align;
		$tag      = aranya_tag( $s['title_tag'] ?? 'h2' );
		?>
		<div class="<?php echo esc_attr( aranya_cx( 'mb-7 sm:mb-9 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-10', $centered ? 'lg:flex-col lg:items-center' : '' ) ); ?>">
			<div class="<?php echo esc_attr( $centered ? 'max-w-2xl mx-auto text-center' : 'max-w-2xl' ); ?>">
				<?php if ( ! empty( $s['eyebrow'] ) ) : ?>
					<span class="eyebrow block mb-2"><?php echo aranya_inline( $s['eyebrow'] ); ?></span>
				<?php endif; ?>
				<<?php echo $tag; ?> class="<?php echo esc_attr( 'heading-serif uppercase ' . ( $dark ? 'text-ivory' : 'text-stone-900' ) ); ?>"><?php echo aranya_inline( $s['title'] ?? '' ); ?></<?php echo $tag; ?>>
				<?php if ( ! empty( $s['subtitle'] ) ) : ?>
					<p class="<?php echo esc_attr( aranya_cx( 'prose-editorial mt-2.5 max-w-xl', $dark ? 'text-ivory-muted' : 'text-stone-600', $centered ? 'mx-auto' : '' ) ); ?>"><?php echo aranya_inline( $s['subtitle'] ); ?></p>
				<?php endif; ?>
			</div>
			<?php if ( '' !== $aside ) : ?>
				<div class="shrink-0 lg:pb-1"><?php echo $aside; // Built by the widget from escaped parts. ?></div>
			<?php endif; ?>
		</div>
		<?php
	}

	/** SectionBackdrop.tsx — the soft green glow behind every section. */
	protected function print_backdrop(): void {
		echo '<div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 overflow-hidden"><div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_45%_30%,#0e2a1f_0%,rgba(7,21,16,0)_72%)]"></div></div>';
	}

	/** Container.tsx widths. */
	protected static function container_class( string $size = 'lg', string $extra = '' ): string {
		$widths = array(
			'sm'       => 'max-w-3xl',
			'md'       => 'max-w-5xl',
			'lg'       => 'max-w-6xl',
			'xl'       => 'max-w-[1152px]',
			'wide'     => 'max-w-7xl',
			'showcase' => 'max-w-[1600px]',
			'full'     => 'max-w-none',
		);
		return aranya_cx( 'mx-auto w-full px-5 sm:px-8 lg:px-12', $widths[ $size ] ?? $widths['lg'], $extra );
	}

	/**
	 * Button.tsx — returns the class string for a variant/size, so buttons,
	 * links and Alpine-driven buttons all share the React metrics.
	 */
	protected static function button_class( string $variant = 'gold', string $size = 'md', string $extra = '' ): string {
		$base     = 'inline-flex items-center justify-center gap-2.5 font-sans font-semibold uppercase tracking-[0.14em] rounded-[3px] btn-lux cursor-pointer select-none disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne-400';
		$sizes    = array(
			'sm' => 'text-[0.625rem] px-5 sm:px-6 py-2.5 min-h-[42px]',
			'md' => 'text-[0.6875rem] px-6 sm:px-8 py-3 sm:py-3.5 min-h-[46px]',
			'lg' => 'text-xs px-8 sm:px-10 py-3.5 sm:py-4 min-h-[50px]',
		);
		$variants = array(
			'gold'         => 'bg-gradient-to-b from-champagne-300 to-champagne-400 text-forest-800 shadow-[0_4px_14px_rgba(200,169,107,0.22)] hover:from-champagne-200 hover:to-champagne-300 hover:shadow-[0_10px_30px_rgba(200,169,107,0.45)] active:from-champagne-400 active:to-champagne-500',
			'outline'      => 'border border-champagne-400/40 text-champagne-300 bg-transparent backdrop-blur-sm hover:border-champagne-400 hover:text-cream-100 hover:bg-champagne-400/[0.08] hover:shadow-[0_8px_26px_rgba(197,168,128,0.16)]',
			'outline-gold' => 'border border-champagne-400/40 text-champagne-300 bg-transparent backdrop-blur-sm hover:border-champagne-400 hover:text-dark-950 hover:bg-champagne-400 hover:shadow-[0_10px_30px_rgba(200,169,107,0.4)]',
			'dark'         => 'bg-forest-700 text-cream-200 border border-champagne-400/20 hover:bg-forest-600 hover:border-champagne-400/45 hover:text-cream-100 hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)]',
			'ghost'        => 'text-champagne-300 bg-transparent hover:text-cream-100 hover:bg-cream-100/[0.07]',
		);
		return $base . ' ' . $sizes[ $size ] . ' ' . $variants[ $variant ] . ( '' !== $extra ? ' ' . $extra : '' );
	}

	/**
	 * Button.tsx inner content: [icon-left] <span class="relative z-10">label</span> [icon-right].
	 */
	protected static function button_inner( string $label_html, string $icon_html = '', string $position = 'right' ): string {
		$out = '';
		if ( $icon_html && 'left' === $position ) {
			$out .= '<span class="btn-icon-left shrink-0 -ml-0.5">' . $icon_html . '</span>';
		}
		$out .= '<span class="relative z-10">' . $label_html . '</span>';
		if ( $icon_html && 'right' === $position ) {
			$out .= '<span class="btn-icon-right shrink-0 -mr-0.5">' . $icon_html . '</span>';
		}
		return $out;
	}

	/** Alpine expression opening the enquiry modal: Aranya.openLead(purpose, config). */
	protected static function lead_js( string $purpose, ?string $config = null ): string {
		return 'Aranya.openLead(' . wp_json_encode( $purpose ) . ( null !== $config ? ', ' . wp_json_encode( $config ) : '' ) . ')';
	}

	/** Alpine expression opening the shared lightbox with one image. */
	protected static function lightbox_js( $media, string $title, string $description = '', string $category = '' ): string {
		$info = aranya_image_info( $media );
		return 'Aranya.openLightbox(' . aranya_json(
			array(
				'url'         => $info['src'],
				'title'       => $title,
				'description' => $description,
				'category'    => $category,
				'credit'      => $info['credit'],
			)
		) . ')';
	}

	/** Visible only in the Elementor editor: labels a hidden or fixed widget. */
	protected static function editor_note( string $text ): string {
		return self::show_editor_note() ? '<div class="aranya-editor-note">' . esc_html( $text ) . '</div>' : '';
	}

	/** Only while editing the template that holds the widget, not around other pages. */
	protected static function show_editor_note(): bool {
		return aranya_is_editor() && empty( $GLOBALS['aranya_in_theme_template'] );
	}
}
