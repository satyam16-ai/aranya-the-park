<?php
/**
 * Aranya Developers — sections/DeveloperTrust.tsx.
 *
 * The skyline + champagne brand spread, the PROJECT BY partner logos, the
 * MahaRERA card and the project team.
 *
 * @package Aranya
 */

namespace Aranya\Widgets;

defined( 'ABSPATH' ) || exit;

class Developer extends Widget_Base {

	public function get_name() {
		return 'aranya-developer';
	}

	public function get_title() {
		return __( 'Aranya Developers', 'aranya' );
	}

	public function get_icon() {
		return 'eicon-person';
	}

	protected function register_controls() {
		$this->section( 'heading', __( 'Heading', 'aranya' ) );
		$this->text( 'eyebrow', __( 'Eyebrow', 'aranya' ), 'THE DEVELOPERS' );
		$this->text( 'title', __( 'Title', 'aranya' ), 'The Partnership Behind Aranya' );
		$this->tag( 'title_tag', __( 'Title HTML tag', 'aranya' ), 'h2' );
		$this->end_section();

		$this->section( 'spread', __( 'Brand spread', 'aranya' ) );
		$this->media( 'skyline', __( 'Photograph', 'aranya' ), 'opt/life-skyline-night-2000.webp' );
		$this->alt( 'skyline_alt' );
		$this->text( 'skyline_lightbox_title', __( 'Lightbox title', 'aranya' ), 'Aranya The Park — Skyline Perspective' );
		$this->text( 'skyline_lightbox_label', __( 'Lightbox label', 'aranya' ), 'Developer Partnership' );
		$this->textarea( 'skyline_lightbox_text', __( 'Lightbox text', 'aranya' ), (string) aranya_defaults( 'developer_narrative' ) );
		$this->text( 'badge', __( 'Photo badge', 'aranya' ), 'JOINT VENTURE' );
		$this->media( 'caption_logo', __( 'Joint venture logo', 'aranya' ), 'branding/project-by-zaveri-bkm-light.png', array( 'description' => __( 'Shown at the bottom of the photo. Remove it to show the caption as text.', 'aranya' ) ) );
		$this->text( 'photo_caption', __( 'Photo caption', 'aranya' ), 'Zaveri Realty × BKM Mindspace', array( 'description' => __( 'Alt text of the logo, or the caption itself when there is no logo.', 'aranya' ) ) );
		$this->text( 'photo_subcaption', __( 'Photo sub-caption', 'aranya' ), 'Presenting The Lushury Life at Malad West' );
		$this->media( 'logo', __( 'Logo on the card', 'aranya' ), 'branding/aranya-logo.png' );
		$this->text( 'logo_alt', __( 'Logo alt text', 'aranya' ), 'Aranya The Park Official Logo' );
		$this->media( 'pattern', __( 'Card texture', 'aranya' ), 'branding/botanical-pattern.jpg' );
		$this->text( 'card_headline_1', __( 'Card headline — line 1', 'aranya' ), 'A legacy of trust,' );
		$this->text( 'card_headline_2', __( 'Card headline — line 2 (bold)', 'aranya' ), 'Excellence & commitment.' );
		$this->textarea( 'card_text', __( 'Card text', 'aranya' ), 'Zaveri Realty and BKM Mindspace bring together their collective expertise to present <strong class="font-semibold text-[#181612]">The Lushury Life</strong>, a landmark development built on the pillars of trust, vision, and excellence. This partnership reflects a commitment to upholding the highest standards of design, construction, and reliability, offering an impeccable investment for residents today and for generations to come.', array( 'rows' => 6, 'description' => __( '<strong> and <br> are allowed.', 'aranya' ) ) );
		$this->text( 'entity_label', __( 'Entity label', 'aranya' ), 'DEVELOPER ENTITY' );
		$this->text( 'card_button', __( 'Card button', 'aranya' ), 'Connect with Developer Desk' );
		$this->note( __( 'The developer entity name comes from Aranya → Site Settings.', 'aranya' ) );
		$this->end_section();

		$this->section( 'partners', __( 'Project by', 'aranya' ) );
		$this->text( 'project_by', __( 'Label', 'aranya' ), 'PROJECT BY' );
		$this->media( 'zaveri_logo', __( 'Zaveri Realty logo', 'aranya' ), 'branding/zaveri-realty-logo.png' );
		$this->media( 'bkm_logo', __( 'BKM Mindspace logo', 'aranya' ), 'branding/bkm-mindspace-logo.png' );
		$this->text( 'jv_before', __( 'Sentence — before the link', 'aranya' ), 'A joint venture of' );
		$this->text( 'jv_link', __( 'Sentence — linked name', 'aranya' ), 'Zaveri Realty' );
		$this->text( 'jv_after', __( 'Sentence — after the link', 'aranya' ), 'and BKM Mindspace, developed by Anuradha Real Estate Developers Private Limited.' );
		$this->end_section();

		$this->section( 'rera', __( 'MahaRERA card', 'aranya' ) );
		$this->text( 'rera_eyebrow', __( 'Eyebrow', 'aranya' ), 'STATUTORY REGISTRATION' );
		$this->text( 'rera_title', __( 'Title', 'aranya' ), 'MAHARERA REGISTERED' );
		$this->textarea( 'rera_text', __( 'Text', 'aranya' ), 'Registered with the Maharashtra Real Estate Regulatory Authority. Verify the project and its approvals on the official portal.', array( 'rows' => 3 ) );
		$this->text( 'rera_number_label', __( 'Registration number label', 'aranya' ), 'MahaRERA No.' );
		$this->text( 'rera_button', __( 'Button', 'aranya' ), 'VERIFY ON OFFICIAL MAHARERA PORTAL' );
		$this->note( __( 'The QR code and registration number come from Aranya → Site Settings.', 'aranya' ) );
		$this->end_section();

		$this->section( 'team', __( 'Project team', 'aranya' ) );
		$this->text( 'team_eyebrow', __( 'Eyebrow', 'aranya' ), 'TRUSTED PARTNERS' );
		$this->text( 'team_aside', __( 'Right label', 'aranya' ), 'THE PROJECT TEAM' );
		$this->repeater(
			'consultants',
			__( 'Consultants (first 6 shown)', 'aranya' ),
			function ( $r ) {
				$this->text( 'role', __( 'Role', 'aranya' ), '', array(), $r );
				$this->text( 'name', __( 'Name', 'aranya' ), '', array(), $r );
			},
			aranya_defaults( 'consultants' ),
			'{{{ role }}}: {{{ name }}}'
		);
		$this->textarea( 'team_note', __( 'Footnote', 'aranya' ), 'Architecture, structure, landscape, interiors and legal counsel, each entrusted to a dedicated specialist.', array( 'rows' => 2 ) );
		$this->end_section();

		$this->section( 'section_settings', __( 'Section', 'aranya' ) );
		$this->anchor( 'developer' );
		$this->end_section();
	}

	protected function render() {
		$s      = $this->get_settings_for_display();
		$tag    = aranya_tag( $s['title_tag'] );
		$zaveri = esc_url( (string) aranya_setting( 'zaveri_url' ) );
		?>
		<section ar-data id="<?php echo esc_attr( $s['anchor'] ); ?>" class="section-spacing bg-dark-900 relative isolate overflow-hidden border-t border-white/[0.06]">
			<?php $this->print_backdrop(); ?>

			<div class="<?php echo esc_attr( self::container_class( 'showcase', 'relative z-10' ) ); ?>">
				<div class="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
					<span class="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-champagne-300 font-medium block mb-3"><?php echo esc_html( $s['eyebrow'] ); ?></span>
					<<?php echo $tag; ?> class="font-serif text-2xl sm:text-3xl lg:text-4xl text-ivory font-light tracking-tight"><?php echo aranya_inline( $s['title'] ); ?></<?php echo $tag; ?>>
				</div>

				<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 rounded-2xl overflow-hidden border border-white/[0.1] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] mb-10 sm:mb-12">
					<div class="lg:col-span-7 relative min-h-[420px] sm:min-h-[540px] lg:min-h-[720px] bg-dark-950 overflow-hidden flex flex-col justify-between group/img cursor-zoom-in" ar-on:click="<?php echo esc_attr( self::lightbox_js( $s['skyline'], $s['skyline_lightbox_title'], $s['skyline_lightbox_text'], $s['skyline_lightbox_label'] ) ); ?>">
						<?php
						echo aranya_img(
							$s['skyline'],
							array(
								'alt'     => '' !== $s['skyline_alt'] ? $s['skyline_alt'] : null,
								'sizes'   => '(min-width: 1024px) 58vw, 100vw',
								'loading' => 'lazy',
								'class'   => 'absolute inset-0 w-full h-full object-cover object-center scale-[1.01] group-hover/img:scale-105 transition-transform duration-1000 ease-out',
							)
						);
						?>
						<div class="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-dark-950/30"></div>
						<?php echo aranya_image_credit( $s['skyline'], 'absolute top-6 right-6 sm:top-8 sm:right-8 z-10' ); ?>

						<div class="relative z-10 p-6 sm:p-8">
							<span class="inline-block px-3.5 py-1.5 rounded-full bg-dark-950/75 backdrop-blur-md border border-white/10 text-[10px] font-sans font-medium tracking-[0.22em] text-champagne-300 uppercase"><?php echo esc_html( $s['badge'] ); ?></span>
						</div>

						<div class="relative z-10 p-6 sm:p-8 backdrop-blur-sm bg-gradient-to-t from-dark-950/90 to-transparent">
							<?php if ( '' !== aranya_image_url( $s['caption_logo'] ) ) : ?>
								<?php echo aranya_img( $s['caption_logo'], array( 'alt' => $s['photo_caption'], 'plain' => true, 'loading' => 'lazy', 'class' => 'h-11 sm:h-14 w-auto object-contain' ) ); ?>
							<?php else : ?>
								<span class="font-serif text-sm sm:text-base text-ivory/90 font-light block"><?php echo esc_html( $s['photo_caption'] ); ?></span>
							<?php endif; ?>
							<span class="text-[10px] font-sans tracking-[0.25em] text-ivory-muted uppercase block mt-2"><?php echo esc_html( $s['photo_subcaption'] ); ?></span>
						</div>
					</div>

					<div class="lg:col-span-5 relative bg-[#BFA370] text-[#1D1B16] p-6 sm:p-9 lg:p-12 flex flex-col justify-between overflow-hidden">
						<div class="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply bg-repeat" style="background-image: url('<?php echo esc_url( aranya_image_url( $s['pattern'] ) ); ?>'); background-size: 400px auto;"></div>

						<div class="relative z-10 space-y-6 sm:space-y-8">
							<div class="flex flex-col items-start gap-4 pb-2 border-b border-[#1D1B16]/15">
								<?php echo aranya_img( $s['logo'], array( 'alt' => $s['logo_alt'], 'plain' => true, 'loading' => 'lazy', 'class' => 'h-28 sm:h-32 w-auto object-contain drop-shadow-sm brightness-[0.25] contrast-[1.4]' ) ); ?>
							</div>

							<div class="space-y-2">
								<h3 class="font-serif text-2xl sm:text-3xl text-[#1B3636] font-normal tracking-tight leading-snug">
									<?php echo esc_html( $s['card_headline_1'] ); ?><br>
									<span class="text-[#1D1B16] font-semibold"><?php echo esc_html( $s['card_headline_2'] ); ?></span>
								</h3>
							</div>

							<p class="font-serif text-sm sm:text-base text-[#2C2820] leading-relaxed sm:leading-loose font-normal"><?php echo aranya_inline( $s['card_text'] ); ?></p>

							<div class="pt-2">
								<span class="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-[#3D372B] font-semibold block mb-1"><?php echo esc_html( $s['entity_label'] ); ?></span>
								<p class="font-serif text-sm sm:text-base text-[#181612] font-medium"><?php echo esc_html( aranya_setting( 'developer' ) ); ?></p>
							</div>
						</div>

						<?php if ( '' !== trim( $s['card_button'] ) ) : ?>
							<div class="relative z-10 pt-8 mt-6 border-t border-[#1D1B16]/15 flex items-center justify-between">
								<button ar-on:click="<?php echo esc_attr( self::lead_js( $s['card_button'], 'Developer Trust' ) ); ?>" class="btn-lux px-6 py-3 rounded-full bg-[#181612] hover:bg-[#2B271F] text-[#F4EFE6] font-sans text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 shadow-md cursor-pointer select-none"><?php echo esc_html( $s['card_button'] ); ?></button>
							</div>
						<?php endif; ?>
					</div>
				</div>

				<div class="glass-panel p-6 sm:p-9 rounded-2xl border border-white/[0.08] mb-10 sm:mb-12 text-center space-y-8">
					<div class="max-w-xl mx-auto space-y-2">
						<span class="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-champagne-300 font-semibold block"><?php echo esc_html( $s['project_by'] ); ?></span>
						<div class="w-16 h-[1px] bg-champagne-400/40 mx-auto"></div>
					</div>

					<div class="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-14 lg:gap-20 py-4">
						<div class="flex flex-col items-center gap-3 w-full max-w-[320px]">
							<a href="<?php echo $zaveri; ?>" target="_blank" rel="noopener noreferrer" aria-label="Zaveri Realty website (opens in a new tab)" class="flex items-center justify-center p-4 sm:p-5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-champagne-400/40 transition-all duration-300 w-full">
								<?php echo aranya_img( $s['zaveri_logo'], array( 'alt' => 'Zaveri Realty', 'plain' => true, 'loading' => 'lazy', 'class' => 'h-12 sm:h-14 w-auto object-contain brightness-0 invert opacity-90 hover:opacity-100 transition-opacity' ) ); ?>
							</a>
							<?php
							echo aranya_social_links(
								'justify-center',
								array(
									'Instagram' => aranya_setting( 'zaveri_instagram' ),
									'Facebook'  => aranya_setting( 'zaveri_facebook' ),
								),
								'Zaveri Realty'
							);
							?>
						</div>
						<?php // Lifted half the icon row (h-9 + gap-3) so it lines up with the logos, not the columns. ?>
						<div class="font-serif text-xl sm:text-2xl text-champagne-300/60 font-light select-none md:-translate-y-6">×</div>
						<div class="flex flex-col items-center gap-3 w-full max-w-[320px]">
							<?php $bkm = esc_url( (string) aranya_setting( 'bkm_url' ) ); ?>
							<<?php echo $bkm ? 'a href="' . $bkm . '" target="_blank" rel="noopener noreferrer" aria-label="BKM Mindspace (opens in a new tab)"' : 'div'; ?> class="flex items-center justify-center p-4 sm:p-5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-champagne-400/40 transition-all duration-300 w-full">
								<?php echo aranya_img( $s['bkm_logo'], array( 'alt' => 'BKM Mindspace', 'plain' => true, 'loading' => 'lazy', 'class' => 'h-10 sm:h-12 w-auto object-contain brightness-0 invert opacity-90 hover:opacity-100 transition-opacity' ) ); ?>
							</<?php echo $bkm ? 'a' : 'div'; ?>>
							<?php
							echo aranya_social_links(
								'justify-center',
								array(
									'Instagram' => aranya_setting( 'bkm_instagram' ),
									'Facebook'  => aranya_setting( 'bkm_facebook' ),
								),
								'BKM Mindspace'
							);
							?>
						</div>
					</div>

					<p class="font-serif text-xs sm:text-sm text-ivory-muted/75 font-light tracking-wide max-w-2xl mx-auto">
						<?php echo esc_html( $s['jv_before'] ); ?> <a href="<?php echo $zaveri; ?>" target="_blank" rel="noopener noreferrer" class="text-champagne-300 hover:text-champagne-200 underline underline-offset-2 transition-colors"><?php echo esc_html( $s['jv_link'] ); ?></a> <?php echo esc_html( $s['jv_after'] ); ?>
					</p>
				</div>

				<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
					<div class="lg:col-span-5 glass-panel p-8 sm:p-10 text-center flex flex-col justify-between rounded-xl border border-white/[0.08] space-y-6">
						<div class="w-14 h-14 mx-auto rounded-full bg-white/[0.04] border border-white/[0.1] flex items-center justify-center text-champagne-300">
							<?php echo aranya_icon( 'shield-check', 28 ); ?>
						</div>
						<div>
							<span class="font-sans text-[10px] uppercase tracking-[0.25em] text-champagne-300 font-medium block mb-2"><?php echo esc_html( $s['rera_eyebrow'] ); ?></span>
							<h4 class="font-serif text-2xl text-ivory font-light"><?php echo esc_html( $s['rera_title'] ); ?></h4>
							<p class="mt-3 text-xs text-ivory-muted leading-relaxed max-w-sm"><?php echo esc_html( $s['rera_text'] ); ?></p>
						</div>
						<?php if ( '' !== aranya_image_url( aranya_setting_media( 'rera_qr' ) ) ) : ?>
							<div class="flex flex-col items-center gap-3">
								<a href="<?php echo esc_url( (string) aranya_setting( 'rera_url' ) ); ?>" target="_blank" rel="noopener noreferrer" class="rounded-[4px] bg-white p-2 shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-opacity hover:opacity-90">
									<?php
									echo aranya_img(
										aranya_setting_media( 'rera_qr' ),
										array(
											'alt'     => 'Scan to verify this project on the MahaRERA portal',
											'plain'   => true,
											'loading' => 'lazy',
											'class'   => 'h-28 w-28 sm:h-32 sm:w-32',
											'attrs'   => array(
												'width'  => 360,
												'height' => 360,
											),
										)
									);
									?>
								</a>
								<?php if ( '' !== (string) aranya_setting( 'maharera' ) ) : ?>
									<p class="font-sans text-[11px] uppercase tracking-[0.2em] font-medium text-ivory-muted"><?php echo esc_html( $s['rera_number_label'] ); ?> <strong class="font-semibold text-champagne-300"><?php echo esc_html( aranya_setting( 'maharera' ) ); ?></strong></p>
								<?php endif; ?>
							</div>
						<?php endif; ?>
						<a href="<?php echo esc_url( (string) aranya_setting( 'rera_url' ) ); ?>" target="_blank" rel="noopener noreferrer" class="btn-lux w-full py-3.5 px-4 bg-champagne-400 hover:bg-champagne-300 text-dark-950 font-sans text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 rounded-full shadow-[0_4px_20px_rgba(200,169,107,0.25)] hover:shadow-[0_6px_25px_rgba(200,169,107,0.35)]">
							<?php echo aranya_icon( 'file-check', 15 ); ?>
							<span><?php echo esc_html( $s['rera_button'] ); ?></span>
							<?php echo aranya_icon( 'external-link', 13 ); ?>
						</a>
					</div>

					<div class="lg:col-span-7 glass-panel p-8 sm:p-10 rounded-xl border border-white/[0.08] flex flex-col justify-between">
						<div>
							<div class="flex items-center justify-between mb-6">
								<span class="font-sans text-[10px] uppercase tracking-[0.25em] text-champagne-300 font-medium"><?php echo esc_html( $s['team_eyebrow'] ); ?></span>
								<span class="text-[10px] text-ivory-muted/60 tracking-wider"><?php echo esc_html( $s['team_aside'] ); ?></span>
							</div>
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
								<?php foreach ( array_slice( (array) $s['consultants'], 0, 6 ) as $partner ) : ?>
									<div class="p-3.5 bg-white/[0.02] border border-white/[0.05] rounded-lg hover:border-champagne-400/30 transition-colors">
										<span class="text-[9px] font-sans uppercase tracking-widest text-champagne-300/80 block mb-0.5 font-medium"><?php echo esc_html( $partner['role'] ); ?></span>
										<p class="font-serif text-sm text-ivory font-light"><?php echo esc_html( $partner['name'] ); ?></p>
									</div>
								<?php endforeach; ?>
							</div>
						</div>
						<p class="text-[11px] font-sans text-ivory-muted/60 pt-6 mt-4 border-t border-white/[0.06] font-light leading-relaxed"><?php echo esc_html( $s['team_note'] ); ?></p>
					</div>
				</div>
			</div>
		</section>
		<?php
	}
}
