<?php
/**
 * Aranya Footer — layout/Footer.tsx.
 *
 * Lives in the "Aranya Footer" template. Project facts (address, phone, RERA
 * number and QR, developer, social links) come from Aranya → Site Settings
 * unless a field here overrides them.
 *
 * @package Aranya
 */

namespace Aranya\Widgets;

defined( 'ABSPATH' ) || exit;

class Footer extends Widget_Base {

	public function get_name() {
		return 'aranya-footer';
	}

	public function get_title() {
		return __( 'Aranya Footer', 'aranya' );
	}

	public function get_icon() {
		return 'eicon-footer';
	}

	protected function register_controls() {
		$this->section( 'brand', __( 'Brand & statement', 'aranya' ) );
		$this->media( 'crest', __( 'Crest', 'aranya' ), 'branding/aranya-crest.png' );
		$this->text( 'crest_alt', __( 'Crest alt text', 'aranya' ), 'Aranya Logo' );
		$this->media( 'wordmark', __( 'Wordmark', 'aranya' ), 'branding/aranya-wordmark-light.png' );
		$this->text( 'wordmark_alt', __( 'Wordmark alt text', 'aranya' ), 'Aranya The Park' );
		$this->textarea( 'quote', __( 'Statement', 'aranya' ), '"A serene metropolitan address, where life is lush with open greens and generous with space."', array( 'rows' => 3 ) );
		$this->text( 'follow_label', __( 'Social label', 'aranya' ), '', array( 'placeholder' => 'Follow Aranya The Park', 'description' => __( 'Empty = "Follow" + project name. Social links are set in Site Settings.', 'aranya' ) ) );
		// The e-brochure, given after the enquiry form (client, 7 Oct). The PDF is set in Site Settings.
		$this->text( 'brochure_label', __( 'E-brochure button', 'aranya' ), 'Download E-Brochure', array( 'description' => __( 'Empty = no button.', 'aranya' ) ) );
		$this->end_section();

		$this->section( 'rera', __( 'MahaRERA column', 'aranya' ) );
		$this->text( 'rera_heading', __( 'Heading', 'aranya' ), 'MahaRERA Registration' );
		$this->textarea( 'rera_text', __( 'Text', 'aranya' ), 'Aranya The Park is a MahaRERA-registered project. Scan the code to view its registration.', array( 'rows' => 2 ) );
		$this->text( 'rera_badge', __( 'Badge', 'aranya' ), 'MahaRERA Registered' );
		$this->text( 'rera_link_label', __( 'Link label', 'aranya' ), 'Scan or verify on the MahaRERA portal' );
		$this->note( __( 'The QR code, registration number and portal link are set in Aranya → Site Settings.', 'aranya' ) );
		$this->end_section();

		$this->section( 'address', __( 'Address column', 'aranya' ) );
		$this->text( 'address_heading', __( 'Heading', 'aranya' ), 'Site Address' );
		$this->text( 'jv_prefix', __( 'Joint venture line', 'aranya' ), 'Joint Venture:' );
		// The partners as their logos, each linked (client, 30 Sep). Links: Aranya →
		// Site Settings (Zaveri Realty website, BKM Mindspace link).
		$this->media( 'jv_zaveri_logo', __( 'Zaveri Realty logo', 'aranya' ), 'branding/zaveri-realty-logo.png' );
		$this->media( 'jv_bkm_logo', __( 'BKM Mindspace logo', 'aranya' ), 'branding/bkm-mindspace-logo.png' );
		$this->text( 'whatsapp_label', __( 'WhatsApp link label', 'aranya' ), 'WhatsApp', array( 'description' => __( 'Shown beside the phone number; opens a WhatsApp chat.', 'aranya' ) ) );
		$this->note( __( 'Address, phone and developer name come from Aranya → Site Settings.', 'aranya' ) );
		$this->end_section();

		$this->section( 'legal', __( 'Disclaimer & bottom bar', 'aranya' ) );
		$this->textarea( 'disclaimer', __( 'Disclaimer', 'aranya' ), 'Disclaimer: The images, specifications, floor plans, dimensions, elevations, and features shown are conceptual and indicative only. Final layout and specifications are subject to approvals by competent planning authorities.', array( 'rows' => 5 ) );
		$this->text( 'rera_line', __( 'Registration line', 'aranya' ), 'MahaRERA Registration No.:' );
		$this->text( 'copyright', __( 'Copyright', 'aranya' ), '© {year} Aranya The Park. All Rights Reserved.', array( 'description' => __( '{year} becomes the current year.', 'aranya' ) ) );
		$this->repeater(
			'links',
			__( 'Bottom links', 'aranya' ),
			function ( $r ) {
				$this->text( 'label', __( 'Label', 'aranya' ), 'Link', array(), $r );
				$this->text( 'href', __( 'URL', 'aranya' ), '#', array(), $r );
				$this->select(
					'tone',
					__( 'Hover colour', 'aranya' ),
					array(
						'ivory' => __( 'Ivory', 'aranya' ),
						'gold'  => __( 'Gold', 'aranya' ),
					),
					'ivory',
					array(),
					$r
				);
			},
			array(
				array( 'label' => 'Privacy Policy', 'href' => '#overview', 'tone' => 'ivory' ),
				array( 'label' => 'Terms of Use', 'href' => '#overview', 'tone' => 'ivory' ),
				array( 'label' => 'Enquire', 'href' => '#enquiry', 'tone' => 'gold' ),
			),
			'{{{ label }}}'
		);
		$this->end_section();
	}

	protected function render() {
		$s       = $this->get_settings_for_display();
		$socials = aranya_socials();
		$rera    = esc_url( (string) aranya_setting( 'rera_url' ) );
		$follow  = '' !== $s['follow_label'] ? $s['follow_label'] : 'Follow ' . aranya_setting( 'project_name' );
		?>
		<footer class="bg-dark-950 text-ivory-muted pt-20 pb-28 lg:pb-16 font-sans text-xs border-t border-white/[0.08]">
			<div class="<?php echo esc_attr( self::container_class() ); ?>">
				<div class="pb-14 border-b border-white/[0.08] flex flex-col md:flex-row md:items-end justify-between gap-6">
					<div class="flex items-center gap-4">
						<?php echo aranya_img( $s['crest'], array( 'alt' => $s['crest_alt'], 'plain' => true, 'loading' => 'lazy', 'class' => 'h-12 w-12 object-contain shrink-0' ) ); ?>
						<div>
							<?php
							echo aranya_img(
								$s['wordmark'],
								array(
									'alt'     => $s['wordmark_alt'],
									'plain'   => true,
									'loading' => 'lazy',
									'class'   => 'h-12 sm:h-14 w-auto max-w-full object-contain block',
									'attrs'   => array(
										'width'  => 2393,
										'height' => 678,
									),
								)
							);
							?>
						</div>
					</div>
					<div class="space-y-4 max-w-md md:text-right">
						<p class="font-serif text-lg sm:text-xl text-ivory/80 italic font-light"><?php echo aranya_inline( $s['quote'] ); ?></p>
						<?php if ( $socials ) : ?>
							<div class="flex items-center gap-3 md:justify-end">
								<span class="text-[11px] uppercase tracking-[0.2em] text-ivory-muted/70"><?php echo esc_html( $follow ); ?></span>
								<?php echo aranya_social_links(); ?>
							</div>
						<?php endif; ?>
						<?php if ( '' !== trim( (string) $s['brochure_label'] ) ) : ?>
							<button type="button" ar-data ar-on:click="Aranya.openBrochure()" class="<?php echo esc_attr( self::button_class( 'outline-gold', 'sm', 'rounded-full' ) ); ?>">
								<?php echo self::button_inner( esc_html( $s['brochure_label'] ), aranya_icon( 'download', 14 ), 'left' ); ?>
							</button>
						<?php endif; ?>
					</div>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 py-14">
					<div class="space-y-4">
						<h4 class="font-sans text-[11px] uppercase tracking-[0.25em] text-ivory font-semibold"><?php echo esc_html( $s['rera_heading'] ); ?></h4>
						<p class="text-ivory-muted text-xs leading-relaxed font-light"><?php echo aranya_inline( $s['rera_text'] ); ?></p>
						<div class="p-3.5 rounded-[3px] bg-white/[0.03] border border-white/[0.08] flex items-start gap-4">
							<a href="<?php echo $rera; ?>" target="_blank" rel="noopener noreferrer" class="shrink-0 rounded-[3px] bg-white p-1.5 transition-opacity hover:opacity-80">
								<?php
								echo aranya_img(
									aranya_setting_media( 'rera_qr' ),
									array(
										'alt'     => 'Scan to verify this project on the MahaRERA portal',
										'plain'   => true,
										'loading' => 'lazy',
										'class'   => 'h-16 w-16',
										'attrs'   => array(
											'width'  => 360,
											'height' => 360,
										),
									)
								);
								?>
							</a>
							<div class="space-y-2 min-w-0">
								<div class="flex items-center gap-2 text-champagne-300 text-xs font-medium">
									<?php echo aranya_icon( 'shield-check', 14, array( 'class' => 'text-champagne-400 shrink-0' ) ); ?>
									<span><?php echo esc_html( $s['rera_badge'] ); ?></span>
								</div>
								<a href="<?php echo $rera; ?>" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-[10px] text-champagne-300 hover:text-champagne-200 transition-colors">
									<span><?php echo esc_html( $s['rera_link_label'] ); ?></span>
									<?php echo aranya_icon( 'external-link', 10 ); ?>
								</a>
							</div>
						</div>
					</div>

					<div class="space-y-4">
						<h4 class="font-sans text-[11px] uppercase tracking-[0.25em] text-ivory font-semibold"><?php echo esc_html( $s['address_heading'] ); ?></h4>
						<div class="space-y-3.5 text-xs">
							<div class="flex items-start gap-2.5">
								<?php echo aranya_icon( 'map-pin', 15, array( 'class' => 'text-champagne-400 shrink-0 mt-0.5' ) ); ?>
								<span class="text-ivory-muted leading-relaxed font-light"><?php echo esc_html( aranya_setting( 'address' ) ); ?></span>
							</div>
							<div class="flex items-center gap-2.5">
								<?php echo aranya_icon( 'phone', 14, array( 'class' => 'text-champagne-400 shrink-0' ) ); ?>
								<a href="<?php echo esc_attr( aranya_tel_url() ); ?>" class="text-ivory hover:text-champagne-300 transition-colors font-medium"><?php echo esc_html( aranya_setting( 'phone' ) ); ?></a>
								<a href="<?php echo esc_url( aranya_whatsapp_url() ); ?>" target="_blank" rel="noopener noreferrer" aria-label="<?php echo esc_attr__( 'Chat on WhatsApp', 'aranya' ); ?>" class="ml-1.5 inline-flex items-center gap-1.5 rounded-full border border-[#25D366]/40 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#25D366] hover:bg-[#25D366]/10 transition-colors">
									<?php echo aranya_icon( 'message-square', 13 ); ?>
									<span><?php echo esc_html( $s['whatsapp_label'] ); ?></span>
								</a>
							</div>
						</div>
						<div class="pt-2 text-[11px] text-ivory-muted/70 leading-relaxed font-light">
							<span><?php echo esc_html( aranya_setting( 'developer' ) ); ?></span>
							<br>
							<span class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
								<span><?php echo esc_html( $s['jv_prefix'] ); ?></span>
								<?php
								$partners = array(
									array( $s['jv_zaveri_logo'], 'Zaveri Realty', (string) aranya_setting( 'zaveri_url' ), 'h-7' ),
									array( $s['jv_bkm_logo'], 'BKM Mindspace', (string) aranya_setting( 'bkm_url' ), 'h-6' ),
								);
								foreach ( $partners as [ $logo, $name, $href, $height ] ) {
									$img = aranya_img( $logo, array( 'alt' => $name, 'plain' => true, 'loading' => 'lazy', 'class' => $height . ' w-auto object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity' ) );
									echo '' !== $href
										? '<a href="' . esc_url( $href ) . '" target="_blank" rel="noopener noreferrer" aria-label="' . esc_attr( $name . ' (opens in a new tab)' ) . '">' . $img . '</a>' // phpcs:ignore WordPress.Security.EscapeOutput -- aranya_img() escapes.
										: $img; // phpcs:ignore WordPress.Security.EscapeOutput
								}
								?>
							</span>
						</div>
					</div>
				</div>

				<div class="py-6 text-[10px] text-ivory-muted/50 leading-relaxed border-t border-white/[0.08]">
					<p>
						<?php echo aranya_inline( $s['disclaimer'] ); ?>
						<?php echo esc_html( $s['rera_line'] ); ?> <strong class="text-champagne-300/80"><?php echo esc_html( aranya_setting( 'maharera' ) ); ?></strong>, available on the official MahaRERA website (<a href="<?php echo $rera; ?>" target="_blank" rel="noreferrer" class="text-champagne-400/70 hover:text-champagne-300 underline underline-offset-2 transition-colors"><?php echo esc_html( preg_replace( '#^https?://#', '', rtrim( (string) aranya_setting( 'rera_url' ), '/' ) ) ); ?></a>).
					</p>
				</div>

				<div class="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-ivory-muted/60">
					<span><?php echo esc_html( str_replace( '{year}', gmdate( 'Y' ), $s['copyright'] ) ); ?></span>
					<div class="flex items-center gap-4">
						<?php foreach ( (array) $s['links'] as $i => $link ) : ?>
							<?php if ( $i > 0 ) : ?>
								<span>•</span>
							<?php endif; ?>
							<a href="<?php echo esc_url( $link['href'] ); ?>" class="<?php echo esc_attr( 'gold' === $link['tone'] ? 'hover:text-champagne-300 transition-colors' : 'hover:text-ivory transition-colors' ); ?>"><?php echo esc_html( $link['label'] ); ?></a>
						<?php endforeach; ?>
					</div>
				</div>
			</div>
		</footer>
		<?php
	}
}
