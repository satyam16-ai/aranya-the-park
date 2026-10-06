<?php
/**
 * Aranya Enquiry — sections/EnquiryCTA.tsx ("Begin Your Lushury Life").
 *
 * The invitation, direct call / WhatsApp touchpoints and the inline site-visit
 * form (mobile verification, then submission to Aranya → Enquiries).
 *
 * @package Aranya
 */

namespace Aranya\Widgets;

defined( 'ABSPATH' ) || exit;

class Enquiry_CTA extends Widget_Base {

	public function get_name() {
		return 'aranya-enquiry-cta';
	}

	public function get_title() {
		return __( 'Aranya Site Visit Form', 'aranya' );
	}

	public function get_icon() {
		return 'eicon-form-horizontal';
	}

	protected function register_controls() {
		$this->section( 'invite', __( 'Invitation', 'aranya' ) );
		$this->text( 'eyebrow', __( 'Eyebrow', 'aranya' ), 'ARRANGE A SITE VISIT' );
		$this->textarea( 'title', __( 'Title', 'aranya' ), 'Begin Your<br />Lushury Life', array( 'rows' => 2, 'description' => __( '<br> starts a new line.', 'aranya' ) ) );
		$this->tag( 'title_tag', __( 'Title HTML tag', 'aranya' ), 'h2' );
		$this->textarea( 'text', __( 'Text', 'aranya' ), 'Visit Aranya The Park with our sales team. Walk the site, go through the floor plans and receive current pricing, at a time that suits you.' );
		$this->text( 'call_label', __( 'Call label', 'aranya' ), 'Direct Sales Desk' );
		$this->text( 'chat_label', __( 'WhatsApp label', 'aranya' ), 'Instant Chat' );
		$this->text( 'chat_text', __( 'WhatsApp link text', 'aranya' ), 'Chat on WhatsApp' );
		$this->note( __( 'Phone and WhatsApp numbers come from Aranya → Site Settings.', 'aranya' ) );
		$this->end_section();

		$this->section( 'form', __( 'Form', 'aranya' ) );
		$this->text( 'form_title', __( 'Form title', 'aranya' ), 'Arrange a Site Visit' );
		$this->text( 'form_text', __( 'Form text', 'aranya' ), "Speak directly with the developer's sales team." );
		$this->text( 'name_label', __( 'Name label', 'aranya' ), 'Full Name *' );
		$this->text( 'name_placeholder', __( 'Name placeholder', 'aranya' ), 'e.g. Aditya Singhania' );
		$this->text( 'phone_label', __( 'Mobile label', 'aranya' ), 'Mobile Number *' );
		$this->text( 'phone_placeholder', __( 'Mobile placeholder', 'aranya' ), '10-digit mobile' );
		$this->text( 'email_label', __( 'Email label', 'aranya' ), 'Email Address' );
		$this->textarea( 'consent', __( 'Consent text', 'aranya' ), "I agree to receive project details by call, WhatsApp or email from the developer's team.", array( 'rows' => 2 ) );
		$this->text( 'submit_verify', __( 'Button before verification', 'aranya' ), 'VERIFY YOUR NUMBER TO CONTINUE' );
		$this->text( 'submit_ready', __( 'Button', 'aranya' ), 'ARRANGE A SITE VISIT' );
		$this->text( 'submit_busy', __( 'Button while sending', 'aranya' ), 'Sending…' );
		$this->text( 'purpose', __( 'Enquiry purpose', 'aranya' ), 'Begin Your Lushury Life (Site Visit Form)' );
		$this->end_section();

		$this->section( 'success', __( 'Thank-you message', 'aranya' ) );
		$this->text( 'success_title', __( 'Title', 'aranya' ), 'Site Visit Requested' );
		$this->textarea( 'success_text', __( 'Text ({name}, {ref})', 'aranya' ), 'Thank you, {name}. Reference: {ref}. Our sales team will be in touch shortly to arrange your visit.', array( 'rows' => 2 ) );
		$this->text( 'success_whatsapp', __( 'WhatsApp button', 'aranya' ), 'Connect on WhatsApp' );
		$this->text( 'success_again', __( 'Reset button', 'aranya' ), 'Submit Another Enquiry' );
		$this->end_section();

		$this->section( 'section_settings', __( 'Section', 'aranya' ) );
		$this->anchor( 'enquiry' );
		$this->end_section();
	}

	protected function render() {
		$s       = $this->get_settings_for_display();
		$tag     = aranya_tag( $s['title_tag'] );
		$field   = 'w-full bg-white/[0.04] border border-white/[0.12] rounded-[3px] px-4 py-3 text-sm text-ivory placeholder:text-ivory-muted/30 focus:border-champagne-400/80 focus:bg-white/[0.06] focus:outline-none transition-all';
		$label   = 'font-sans text-[11px] uppercase tracking-wider text-ivory-muted/80 block mb-1.5';
		$uid     = $this->get_id();
		$opts    = array(
			'purpose'  => $s['purpose'],
			'whatsapp' => preg_replace( '/\D+/', '', (string) aranya_setting( 'whatsapp_number' ) ),
		);
		$on      = 'bg-champagne-400 border-champagne-300 text-dark-950 font-semibold shadow-[0_2px_10px_rgba(200,169,107,0.3)]';
		$off     = 'bg-white/[0.03] border-white/[0.08] text-ivory-muted hover:text-ivory hover:bg-white/[0.06]';
		$success = strtr(
			esc_html( $s['success_text'] ),
			array(
				'{name}' => '<span ar-text="fullName"></span>',
				'{ref}'  => '<strong class="text-champagne-300 font-medium" ar-text="leadId"></strong>',
			)
		);
		?>
		<section id="<?php echo esc_attr( $s['anchor'] ); ?>" class="section-spacing bg-dark-950 relative isolate overflow-hidden border-t border-white/[0.06]">
			<?php $this->print_backdrop(); ?>

			<div class="<?php echo esc_attr( self::container_class() ); ?>">
				<div class="relative z-10 glass-panel p-8 sm:p-14 lg:p-16 rounded-[4px] border border-white/[0.08]">
					<div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
						<div class="lg:col-span-6 space-y-8">
							<div>
								<span class="font-sans text-[11px] uppercase tracking-[0.3em] text-champagne-300 font-medium block mb-3"><?php echo esc_html( $s['eyebrow'] ); ?></span>
								<<?php echo $tag; ?> class="font-serif text-2xl sm:text-3xl lg:text-4xl text-ivory font-light tracking-tight leading-[1.1]"><?php echo aranya_inline( $s['title'] ); ?></<?php echo $tag; ?>>
							</div>

							<p class="font-sans text-sm sm:text-base text-ivory-muted font-light leading-relaxed"><?php echo aranya_inline( $s['text'] ); ?></p>

							<div class="space-y-4 pt-2 border-t border-white/[0.08]">
								<a href="<?php echo esc_attr( aranya_tel_url() ); ?>" class="flex items-center gap-4 group">
									<div class="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-champagne-300 group-hover:bg-champagne-400 group-hover:text-dark-950 transition-all duration-300">
										<?php echo aranya_icon( 'phone', 15 ); ?>
									</div>
									<div>
										<span class="text-[10px] font-sans uppercase tracking-widest text-ivory-muted/70 block"><?php echo esc_html( $s['call_label'] ); ?></span>
										<span class="text-sm text-ivory font-medium group-hover:text-champagne-300 transition-colors"><?php echo esc_html( aranya_setting( 'phone' ) ); ?></span>
									</div>
								</a>

								<a href="<?php echo esc_url( aranya_whatsapp_url() ); ?>" target="_blank" rel="noopener noreferrer" class="flex items-center gap-4 group">
									<div class="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-all duration-300">
										<?php echo aranya_icon( 'message-square', 15 ); ?>
									</div>
									<div>
										<span class="text-[10px] font-sans uppercase tracking-widest text-ivory-muted/70 block"><?php echo esc_html( $s['chat_label'] ); ?></span>
										<span class="text-sm text-ivory font-medium group-hover:text-[#25D366] transition-colors"><?php echo esc_html( $s['chat_text'] ); ?></span>
									</div>
								</a>
							</div>
						</div>

						<div class="lg:col-span-6 bg-dark-950/80 border border-white/[0.08] p-6 sm:p-10 rounded-[4px] shadow-[0_15px_40px_rgba(0,0,0,0.5)]" ar-data="enquiryCta(<?php echo esc_attr( aranya_json( $opts ) ); ?>)">
							<div ar-show="isSubmitted" style="display: none;" class="text-center py-10 space-y-5">
								<div class="w-16 h-16 mx-auto rounded-full bg-champagne-400/10 border border-champagne-400/30 flex items-center justify-center text-champagne-300">
									<?php echo aranya_icon( 'check-circle-2', 32 ); ?>
								</div>
								<h4 class="font-serif text-2xl text-ivory font-light"><?php echo esc_html( $s['success_title'] ); ?></h4>
								<p class="font-sans text-sm text-ivory-muted font-light leading-relaxed"><?php echo $success; ?></p>
								<div class="pt-4 flex flex-col gap-3">
									<a ar-bind:href="whatsappAfter()" href="<?php echo esc_url( aranya_whatsapp_url() ); ?>" target="_blank" rel="noopener noreferrer" class="btn-lux py-3 px-4 bg-[#25D366] text-white font-sans text-xs uppercase tracking-widest font-bold inline-flex items-center justify-center gap-2 hover:brightness-110 transition-all rounded-[3px]"><?php echo esc_html( $s['success_whatsapp'] ); ?></a>
									<button ar-on:click="reset()" class="<?php echo esc_attr( self::button_class( 'outline-gold', 'sm' ) ); ?>"><?php echo self::button_inner( esc_html( $s['success_again'] ) ); ?></button>
								</div>
							</div>

							<form ar-show="!isSubmitted" ar-on:submit.prevent="submit()" class="space-y-5">
								<input type="text" name="website" ar-model="website" tabindex="-1" autocomplete="off" aria-hidden="true" class="hidden">
								<div class="mb-6">
									<h3 class="font-serif text-xl sm:text-2xl text-ivory font-light"><?php echo esc_html( $s['form_title'] ); ?></h3>
									<p class="text-xs text-ivory-muted/70 mt-1 font-sans"><?php echo esc_html( $s['form_text'] ); ?></p>
								</div>

								<div>
									<label class="<?php echo esc_attr( $label ); ?>" for="cta-name-<?php echo esc_attr( $uid ); ?>"><?php echo esc_html( $s['name_label'] ); ?></label>
									<input id="cta-name-<?php echo esc_attr( $uid ); ?>" type="text" required ar-model="fullName" placeholder="<?php echo esc_attr( $s['name_placeholder'] ); ?>" class="<?php echo esc_attr( $field ); ?>">
								</div>

								<div>
									<label class="<?php echo esc_attr( $label ); ?>" for="cta-mobile-<?php echo esc_attr( $uid ); ?>"><?php echo esc_html( $s['phone_label'] ); ?></label>
									<div class="relative flex items-center">
										<span class="absolute left-4 text-ivory-muted/50 text-xs tabular-nums font-semibold">+91</span>
										<input id="cta-mobile-<?php echo esc_attr( $uid ); ?>" type="tel" required pattern="[0-9]{10}" maxlength="10" ar-bind:value="phoneNumber" ar-on:input="onPhoneInput($event)" placeholder="<?php echo esc_attr( $s['phone_placeholder'] ); ?>" class="w-full bg-white/[0.04] border border-white/[0.12] rounded-[3px] pl-12 pr-[104px] py-3 text-sm text-ivory placeholder:text-ivory-muted/30 focus:border-champagne-400/80 focus:bg-white/[0.06] focus:outline-none transition-all">
										<span ar-show="otpStage === 'verified'" style="display: none;" class="absolute right-3 flex items-center gap-1 text-[10px] uppercase tracking-wider text-champagne-300">
											<?php echo aranya_icon( 'check', 12 ); ?>
											Verified
										</span>
										<button ar-show="otpStage !== 'verified'" type="button" ar-on:click="sendOtp()" ar-bind:disabled="!phoneIsComplete || otpBusy" disabled class="absolute right-2 h-8 px-3 rounded-[3px] bg-champagne-400/90 hover:bg-champagne-300 disabled:bg-white/[0.06] disabled:text-ivory-muted/40 text-dark-950 text-[10px] uppercase tracking-wider font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed" ar-text="otpStage === 'sent' ? 'Resend' : 'Send OTP'">Send OTP</button>
									</div>

									<div ar-show="otpStage === 'sent'" style="display: none;" class="flex gap-2 mt-2">
										<input type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" ar-bind:value="otpCode" ar-on:input="onOtpInput($event)" placeholder="6-digit code" aria-label="Verification code" class="flex-1 bg-white/[0.04] border border-white/[0.12] rounded-[3px] px-4 py-3 text-sm text-ivory tracking-[0.4em] placeholder:tracking-normal placeholder:text-ivory-muted/30 focus:border-champagne-400/80 focus:outline-none transition-all">
										<button type="button" ar-on:click="verifyOtp()" ar-bind:disabled="otpCode.length !== 6 || otpBusy" class="shrink-0 px-5 rounded-[3px] border border-champagne-400/50 hover:border-champagne-300 text-champagne-300 disabled:opacity-40 text-[11px] uppercase tracking-wider font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed">Verify</button>
									</div>

									<p ar-show="(otpNotice || otpError) && otpStage !== 'verified'" style="display: none;" class="mt-1.5 text-[10px]" ar-bind:class="{ 'text-red-300': otpError, 'text-ivory-muted/70': !otpError }" ar-text="otpError || otpNotice"></p>
								</div>

								<div>
									<label class="<?php echo esc_attr( $label ); ?>" for="cta-email-<?php echo esc_attr( $uid ); ?>"><?php echo esc_html( $s['email_label'] ); ?></label>
									<input id="cta-email-<?php echo esc_attr( $uid ); ?>" type="email" ar-model="email" placeholder="name@domain.com" class="<?php echo esc_attr( $field ); ?>">
								</div>

								<div class="pt-1 flex items-start gap-2.5 text-[11px] text-ivory-muted/60 font-sans">
									<input type="checkbox" id="cta-consent-<?php echo esc_attr( $uid ); ?>" ar-model="consentAgreed" checked class="mt-0.5 accent-[#C8A96B] cursor-pointer" required>
									<label for="cta-consent-<?php echo esc_attr( $uid ); ?>" class="cursor-pointer leading-relaxed"><?php echo esc_html( $s['consent'] ); ?></label>
								</div>

								<p ar-show="submitError" style="display: none;" class="text-[10px] text-red-300" ar-text="submitError"></p>

								<div class="pt-2">
									<button type="submit" ar-bind:disabled="isSubmitting || !consentAgreed || otpStage !== 'verified'" disabled class="<?php echo esc_attr( self::button_class( 'gold', 'lg', 'w-full justify-center tracking-widest uppercase font-semibold text-xs' ) ); ?>">
										<span class="relative z-10" ar-text="isSubmitting ? <?php echo esc_attr( wp_json_encode( $s['submit_busy'] ) ); ?> : (otpStage !== 'verified' ? <?php echo esc_attr( wp_json_encode( $s['submit_verify'] ) ); ?> : <?php echo esc_attr( wp_json_encode( $s['submit_ready'] ) ); ?>)"><?php echo esc_html( $s['submit_verify'] ); ?></span>
										<span class="btn-icon-right shrink-0 -mr-0.5"><?php echo aranya_icon( 'arrow-right', 15 ); ?></span>
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</section>
		<?php
	}
}
