<?php
/**
 * Aranya Enquiry Pop-up — sections/LeadFormModal.tsx + common/Modal.tsx
 * (+ common/EnquiryPopup.tsx, whose timer is set in Site Settings).
 *
 * One modal serves every "Enquire" button on the site. It lives in the
 * "Aranya Footer" template; if a page has none, the plugin prints this same
 * markup with the default texts (see aranya_print_overlays()).
 *
 * @package Aranya
 */

namespace Aranya\Widgets;

defined( 'ABSPATH' ) || exit;

class Enquiry_Modal extends Widget_Base {

	/** Default texts — the React copy. Used by the controls and the fallback. */
	public const D = array(
		'general_title'      => 'Enquire About Aranya The Park',
		'subtitle'           => 'Malad West · Mumbai',
		'success_title'      => 'Enquiry Confirmed',
		'rera_strip'         => 'MahaRERA registered project',
		'desk_label'         => 'Direct Developer Desk',
		'name_label'         => 'Full Name',
		'name_placeholder'   => 'e.g. Vikram Malhotra',
		'phone_label'        => 'Mobile Number',
		'phone_placeholder'  => '10-digit number',
		'otp_label'          => 'Verification Code',
		'email_label'        => 'Email Address',
		'email_hint'         => '(optional for digital brochure)',
		'message_label'      => 'Message or Preferred Visit Date',
		'message_hint'       => '(optional)',
		'message_placeholder' => 'e.g. Preferred floor, budget or a good time to call',
		'consent'            => 'I authorise representatives of Aranya The Park (Zaveri Realty & BKM Mindspace) to contact me by call, WhatsApp or email about floor plans, pricing and site visits.',
		'submit_verify'      => 'VERIFY YOUR NUMBER TO CONTINUE',
		'submit_ready'       => 'ARRANGE A SITE VISIT',
		'submit_busy'        => 'Sending…',
		'desk_line'          => 'Direct Desk:',
		'quick_whatsapp'     => 'Quick WhatsApp',
		'quick_message'      => 'Hello Aranya The Park Team, I would like immediate project assistance.',
		'success_eyebrow'    => 'Enquiry Received',
		'success_heading'    => 'Thank You, {name}',
		'success_body'       => 'Your enquiry is with our sales team under reference {ref}.',
		'success_note'       => 'A member of our sales team will be in touch shortly with floor plans and current pricing.',
		'continue_whatsapp'  => 'Continue on WhatsApp',
		'return_label'       => 'Return to Website',
	);

	public function get_name() {
		return 'aranya-enquiry-modal';
	}

	public function get_title() {
		return __( 'Aranya Enquiry Pop-up', 'aranya' );
	}

	public function get_icon() {
		return 'eicon-form-horizontal';
	}

	protected function register_controls() {
		$d = self::D;
		$this->section( 'head', __( 'Header', 'aranya' ) );
		$this->note( __( 'Opens from every Enquire button, and on its own after a delay (Aranya → Site Settings → Enquiries). Buttons that pass their own purpose (e.g. "Floor Plan Access") show it as the title.', 'aranya' ) );
		$this->text( 'general_title', __( 'Title', 'aranya' ), $d['general_title'] );
		$this->text( 'subtitle', __( 'Subtitle', 'aranya' ), $d['subtitle'] );
		$this->text( 'rera_strip', __( 'RERA strip', 'aranya' ), $d['rera_strip'] );
		$this->text( 'desk_label', __( 'Desk chip', 'aranya' ), $d['desk_label'] );
		$this->end_section();

		$this->section( 'fields', __( 'Form fields', 'aranya' ) );
		foreach ( array( 'name_label', 'name_placeholder', 'phone_label', 'phone_placeholder', 'otp_label', 'email_label', 'email_hint' ) as $k ) {
			$this->text( $k, ucwords( str_replace( '_', ' ', $k ) ), $d[ $k ] );
		}
		// No configuration or contact-channel choice (client, 5 Oct): the sales team asks.
		foreach ( array( 'message_label', 'message_hint', 'message_placeholder' ) as $k ) {
			$this->text( $k, ucwords( str_replace( '_', ' ', $k ) ), $d[ $k ] );
		}
		$this->textarea( 'consent', __( 'Consent text', 'aranya' ), $d['consent'] );
		$this->end_section();

		$this->section( 'buttons', __( 'Buttons', 'aranya' ) );
		foreach ( array( 'submit_verify', 'submit_ready', 'submit_busy', 'desk_line', 'quick_whatsapp' ) as $k ) {
			$this->text( $k, ucwords( str_replace( '_', ' ', $k ) ), $d[ $k ] );
		}
		$this->textarea( 'quick_message', __( 'Quick WhatsApp message', 'aranya' ), $d['quick_message'], array( 'rows' => 2 ) );
		$this->end_section();

		$this->section( 'success', __( 'Thank-you screen', 'aranya' ) );
		$this->text( 'success_title', __( 'Title', 'aranya' ), $d['success_title'] );
		$this->text( 'success_eyebrow', __( 'Eyebrow', 'aranya' ), $d['success_eyebrow'] );
		$this->text( 'success_heading', __( 'Heading ({name} = visitor)', 'aranya' ), $d['success_heading'] );
		$this->textarea( 'success_body', __( 'Text ({config}, {ref})', 'aranya' ), $d['success_body'], array( 'rows' => 2 ) );
		foreach ( array( 'continue_whatsapp', 'return_label' ) as $k ) {
			$this->text( $k, ucwords( str_replace( '_', ' ', $k ) ), $d[ $k ] );
		}
		$this->textarea( 'success_note', __( 'Note', 'aranya' ), $d['success_note'], array( 'rows' => 2 ) );
		$this->end_section();
	}

	protected function render() {
		$GLOBALS['aranya_lead_modal_printed'] = true;
		if ( self::show_editor_note() ) {
			printf(
				'<div class="aranya-editor-note">%s <button type="button" onclick="Aranya.openLead()" style="margin-left:auto;padding:.35rem .8rem;border:1px solid rgba(200,169,107,.6);border-radius:99px;color:#EADBBA;cursor:pointer">%s</button></div>',
				esc_html__( 'Enquiry pop-up — hidden until an Enquire button is clicked', 'aranya' ),
				esc_html__( 'Preview', 'aranya' )
			);
		}
		echo self::markup( array_merge( self::D, array_filter( $this->get_settings_for_display(), 'is_string' ) ) ); // Escaped inside.
	}

	/**
	 * Replaces {tokens} in escaped text with markup.
	 */
	private static function tokens( string $text, array $map ): string {
		return strtr( esc_html( $text ), $map );
	}

	/**
	 * The modal markup. Static so the plugin can print it with the defaults on
	 * pages whose footer template lacks the widget.
	 */
	public static function markup( array $s ): string {
		$opts    = array(
			'generalTitle' => $s['general_title'],
			'successTitle' => $s['success_title'],
			'subtitle'     => $s['subtitle'],
			'whatsapp'     => preg_replace( '/\D+/', '', (string) aranya_setting( 'whatsapp_number' ) ),
		);
		$field   = 'w-full h-[46px] bg-white/[0.03] border border-white/[0.12] rounded-[4px] text-ivory placeholder:text-ivory-muted/30 focus:outline-none focus:border-champagne-400 focus:bg-white/[0.06] transition-all text-base sm:text-xs';
		$label   = 'text-[10px] sm:text-[11px] uppercase tracking-wider text-ivory-muted/80 font-medium block';
		$req     = ' <span class="text-champagne-400">*</span>';
		$socials = aranya_social_links( 'justify-center' );

		ob_start();
		?>
		<div ar-data="leadModal(<?php echo esc_attr( aranya_json( $opts ) ); ?>)">
			<template ar-teleport="body">
				<div ar-show="isOpen" ar-cloak style="display: none;" class="fixed inset-0 z-[100] flex items-center justify-center p-3.5 sm:p-5 md:p-6" role="dialog" aria-modal="true" ar-bind:aria-label="modalTitle || 'Dialog'">
					<div class="fixed inset-0 bg-dark-950/85 backdrop-blur-md animate-fade-in cursor-pointer" ar-on:click="close()"></div>

					<div class="relative w-full max-w-[820px] lg:max-w-[860px] bg-dark-900/95 border border-champagne-400/20 shadow-[0_25px_80px_rgba(0,0,0,0.85)] rounded-lg sm:rounded-xl animate-scale-in max-h-[85vh] overflow-y-auto overflow-touch z-10">
						<div class="flex items-center justify-between px-5 sm:px-7 py-3.5 sm:py-4 border-b border-white/[0.08] sticky top-0 bg-dark-900/95 backdrop-blur-md z-20">
							<div>
								<h3 class="font-serif text-lg sm:text-2xl text-ivory font-light tracking-wide" ar-text="modalTitle"><?php echo esc_html( $s['general_title'] ); ?></h3>
								<p class="text-[11px] sm:text-xs text-champagne-300/90 mt-0.5 font-sans font-medium tracking-wider uppercase" ar-text="modalSubtitle"><?php echo esc_html( $s['subtitle'] ); ?></p>
							</div>
							<button ar-on:click="close()" class="p-2 min-h-[38px] min-w-[38px] flex items-center justify-center text-ivory-muted hover:text-ivory hover:bg-white/[0.08] rounded-full transition-all duration-200 cursor-pointer" aria-label="Close dialog">
								<?php echo aranya_icon( 'x', 18, array( 'stroke' => 1.5 ) ); ?>
							</button>
						</div>

						<div class="p-4 sm:p-6 lg:p-7">
							<div ar-show="isSubmitted" style="display: none;" class="py-6 text-center space-y-4 animate-in fade-in duration-300">
								<div class="w-14 h-14 mx-auto rounded-full bg-champagne-400/10 border border-champagne-400/30 flex items-center justify-center text-champagne-300">
									<?php echo aranya_icon( 'check-circle-2', 28 ); ?>
								</div>
								<div class="space-y-1.5">
									<span class="text-[10px] font-sans uppercase tracking-[0.25em] text-champagne-300 font-semibold"><?php echo esc_html( $s['success_eyebrow'] ); ?></span>
									<h4 class="font-serif text-2xl text-ivory font-light"><?php echo self::tokens( $s['success_heading'], array( '{name}' => '<span ar-text="fullName"></span>' ) ); ?></h4>
									<p class="text-ivory-muted font-sans text-xs sm:text-sm leading-relaxed max-w-sm mx-auto font-light">
										<?php
										echo self::tokens(
											$s['success_body'],
											array(
												'{config}' => '<strong class="text-ivory" ar-text="configuration || \'Aranya The Park\'"></strong>',
												'{ref}'    => '<strong class="text-champagne-300" ar-text="leadId"></strong>',
											)
										);
										?>
									</p>
								</div>

								<div class="p-3 bg-white/[0.02] border border-white/[0.08] rounded-[4px] text-xs text-ivory-muted text-left space-y-1 max-w-sm mx-auto">
									<p class="text-[11px] text-ivory-muted/70 font-light"><?php echo esc_html( $s['success_note'] ); ?></p>
								</div>

								<div class="pt-2 flex flex-col gap-2 max-w-sm mx-auto">
									<a ar-bind:href="whatsappAfter()" href="<?php echo esc_url( aranya_whatsapp_url() ); ?>" target="_blank" rel="noopener noreferrer" class="btn-lux w-full py-2.5 px-4 bg-[#25D366] text-white font-sans text-xs uppercase tracking-widest font-bold inline-flex items-center justify-center gap-2 hover:brightness-105 transition-all rounded-[4px] shadow-md">
										<?php echo aranya_icon( 'message-square', 14 ); ?>
										<span><?php echo esc_html( $s['continue_whatsapp'] ); ?></span>
									</a>

									<?php if ( '' !== $socials ) : ?>
										<div class="pt-2 space-y-2">
											<p class="text-[10px] uppercase tracking-[0.2em] text-ivory-muted/60"><?php echo esc_html( 'Follow ' . aranya_setting( 'project_name' ) ); ?></p>
											<?php echo $socials; ?>
										</div>
									<?php endif; ?>

									<button ar-on:click="close()" class="py-1.5 text-ivory-muted/60 hover:text-ivory text-xs font-sans uppercase tracking-wider transition-colors cursor-pointer"><?php echo esc_html( $s['return_label'] ); ?></button>
								</div>
							</div>

							<form ar-show="!isSubmitted" ar-on:submit.prevent="submit()" class="space-y-3 sm:space-y-3.5 font-sans text-xs">
								<input type="text" name="website" ar-model="website" tabindex="-1" autocomplete="off" aria-hidden="true" class="hidden">

								<div class="flex items-center justify-between px-3 py-1.5 bg-white/[0.02] border border-white/[0.08] rounded-[4px] text-[11px] text-ivory-muted">
									<div class="flex items-center gap-1.5">
										<?php echo aranya_icon( 'shield-check', 13, array( 'class' => 'text-champagne-400' ) ); ?>
										<span><?php echo esc_html( $s['rera_strip'] ); ?></span>
									</div>
									<div class="flex items-center gap-1.5 text-champagne-300">
										<?php
										foreach ( array( 'calendar', 'download', 'clock', 'sparkles' ) as $icon ) {
											echo aranya_icon(
												$icon,
												14,
												array(
													'class' => 'text-champagne-300',
													'attrs' => array(
														'ar-show' => "purposeIcon === '" . $icon . "'",
														'style'  => 'sparkles' === $icon ? null : 'display: none;',
													),
												)
											);
										}
										?>
										<span class="text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold"><?php echo esc_html( $s['desk_label'] ); ?></span>
									</div>
								</div>

								<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
									<div class="space-y-1">
										<label class="<?php echo esc_attr( $label ); ?>"><?php echo esc_html( $s['name_label'] ) . $req; ?></label>
										<input type="text" required ar-model="fullName" placeholder="<?php echo esc_attr( $s['name_placeholder'] ); ?>" class="<?php echo esc_attr( $field . ' px-3.5' ); ?>">
									</div>

									<div class="space-y-1">
										<label class="<?php echo esc_attr( $label ); ?>"><?php echo esc_html( $s['phone_label'] ) . $req; ?></label>
										<div class="relative flex items-center">
											<span class="absolute left-3.5 text-ivory-muted/50 text-xs tabular-nums font-semibold">+91</span>
											<input type="tel" required pattern="[0-9]{10}" maxlength="10" ar-bind:value="phoneNumber" ar-on:input="onPhoneInput($event)" placeholder="<?php echo esc_attr( $s['phone_placeholder'] ); ?>" class="<?php echo esc_attr( $field . ' pl-11 pr-[104px]' ); ?>">
											<span ar-show="otpStage === 'verified'" style="display: none;" class="absolute right-3 flex items-center gap-1 text-[10px] uppercase tracking-wider text-champagne-300">
												<?php echo aranya_icon( 'check-circle-2', 12 ); ?>
												Verified
											</span>
											<button ar-show="otpStage !== 'verified'" type="button" ar-on:click="sendOtp()" ar-bind:disabled="!phoneIsComplete || otpBusy" disabled class="absolute right-2 h-8 px-3 rounded-[3px] bg-champagne-400/90 hover:bg-champagne-300 disabled:bg-white/[0.06] disabled:text-ivory-muted/40 text-dark-950 text-[10px] uppercase tracking-wider font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed">
												<?php echo aranya_icon( 'loader-2', 12, array( 'class' => 'animate-spin', 'attrs' => array( 'ar-show' => "otpBusy && otpStage === 'idle'", 'style' => 'display: none;' ) ) ); ?>
												<span ar-show="!(otpBusy && otpStage === 'idle')" ar-text="otpStage === 'sent' ? 'Resend' : 'Send OTP'">Send OTP</span>
											</button>
										</div>
									</div>
								</div>

								<div ar-show="otpStage === 'sent'" style="display: none;" class="space-y-1">
									<label class="<?php echo esc_attr( $label ); ?>"><?php echo esc_html( $s['otp_label'] ) . $req; ?></label>
									<div class="flex gap-2">
										<input type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" ar-bind:value="otpCode" ar-on:input="onOtpInput($event)" placeholder="6-digit code" class="flex-1 h-[46px] bg-white/[0.03] border border-white/[0.12] rounded-[4px] px-3.5 text-ivory tracking-[0.4em] placeholder:tracking-normal placeholder:text-ivory-muted/30 focus:outline-none focus:border-champagne-400 focus:bg-white/[0.06] transition-all text-base sm:text-sm">
										<button type="button" ar-on:click="verifyOtp()" ar-bind:disabled="otpCode.length !== 6 || otpBusy" class="shrink-0 px-5 rounded-[4px] border border-champagne-400/50 hover:border-champagne-300 text-champagne-300 hover:text-champagne-200 disabled:opacity-40 text-[11px] uppercase tracking-wider font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed">
											<?php echo aranya_icon( 'loader-2', 13, array( 'class' => 'animate-spin', 'attrs' => array( 'ar-show' => 'otpBusy', 'style' => 'display: none;' ) ) ); ?>
											<span ar-show="!otpBusy">Verify</span>
										</button>
									</div>
								</div>

								<p ar-show="(otpNotice || otpError) && otpStage !== 'verified'" style="display: none;" class="text-[10px]" ar-bind:class="{ 'text-red-300': otpError, 'text-ivory-muted/70': !otpError }" ar-text="otpError || otpNotice"></p>

								<div class="space-y-1">
									<label class="<?php echo esc_attr( $label ); ?>"><?php echo esc_html( $s['email_label'] ); ?> <span class="text-ivory-muted/50 lowercase"><?php echo esc_html( $s['email_hint'] ); ?></span></label>
									<input type="email" ar-model="email" placeholder="name@domain.com" class="<?php echo esc_attr( $field . ' px-3.5' ); ?>">
								</div>

								<div class="space-y-1">
									<label class="<?php echo esc_attr( $label ); ?>"><?php echo esc_html( $s['message_label'] ); ?> <span class="text-ivory-muted/50 lowercase"><?php echo esc_html( $s['message_hint'] ); ?></span></label>
									<textarea rows="2" ar-model="message" placeholder="<?php echo esc_attr( $s['message_placeholder'] ); ?>" class="w-full h-[76px] bg-white/[0.03] border border-white/[0.12] rounded-[4px] p-3 text-ivory placeholder:text-ivory-muted/30 focus:outline-none focus:border-champagne-400 focus:bg-white/[0.06] transition-all resize-none text-base sm:text-xs"></textarea>
								</div>

								<div class="pt-0.5 flex items-start gap-2.5">
									<input type="checkbox" id="consent-check" ar-model="consentAgreed" checked class="mt-0.5 accent-[#C8A96B] cursor-pointer shrink-0" required>
									<label for="consent-check" class="text-[10px] text-ivory-muted/65 leading-relaxed font-light cursor-pointer select-none"><?php echo esc_html( $s['consent'] ); ?></label>
								</div>

								<p ar-show="submitError" style="display: none;" class="text-[10px] text-red-300" ar-text="submitError"></p>

								<div class="pt-1">
									<button type="submit" ar-bind:disabled="isSubmitting || !consentAgreed || otpStage !== 'verified'" disabled class="<?php echo esc_attr( self::button_class( 'gold', 'md', 'w-full justify-center tracking-wider uppercase font-semibold text-xs py-3' ) ); ?>">
										<span class="relative z-10" ar-text="isSubmitting ? <?php echo esc_attr( wp_json_encode( $s['submit_busy'] ) ); ?> : (otpStage !== 'verified' ? <?php echo esc_attr( wp_json_encode( $s['submit_verify'] ) ); ?> : <?php echo esc_attr( wp_json_encode( $s['submit_ready'] ) ); ?>)"><?php echo esc_html( $s['submit_verify'] ); ?></span>
										<span class="btn-icon-right shrink-0 -mr-0.5"><?php echo aranya_icon( 'send', 13 ); ?></span>
									</button>
								</div>

								<div class="pt-1.5 border-t border-white/[0.08] flex items-center justify-between text-[10px] text-ivory-muted/65">
									<span><?php echo esc_html( $s['desk_line'] ); ?> <strong class="text-ivory"><?php echo esc_html( aranya_setting( 'phone' ) ); ?></strong></span>
									<a href="<?php echo esc_url( aranya_whatsapp_url( (string) $s['quick_message'] ) ); ?>" target="_blank" rel="noopener noreferrer" class="text-champagne-300 hover:text-champagne-200 uppercase tracking-wider flex items-center gap-1 font-medium transition-colors">
										<span><?php echo esc_html( $s['quick_whatsapp'] ); ?></span>
										<?php echo aranya_icon( 'chevron-right', 10 ); ?>
									</a>
								</div>
							</form>
						</div>
					</div>
				</div>
			</template>
		</div>
		<?php
		return (string) ob_get_clean();
	}
}
