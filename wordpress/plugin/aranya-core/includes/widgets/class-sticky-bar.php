<?php
/**
 * Aranya Contact Closet — layout/StickyActionBar.tsx.
 *
 * The floating contact trigger (bottom right): Call, WhatsApp and Enquire fold
 * out of it. Lives in the "Aranya Footer" template.
 *
 * @package Aranya
 */

namespace Aranya\Widgets;

defined( 'ABSPATH' ) || exit;

class Sticky_Bar extends Widget_Base {

	public function get_name() {
		return 'aranya-sticky-bar';
	}

	public function get_title() {
		return __( 'Aranya Contact Closet', 'aranya' );
	}

	public function get_icon() {
		return 'eicon-call-to-action';
	}

	protected function register_controls() {
		$this->section( 'content', __( 'Contact closet', 'aranya' ) );
		$this->text( 'call_label', __( 'Call label', 'aranya' ), 'Call' );
		$this->text( 'whatsapp_label', __( 'WhatsApp label', 'aranya' ), 'WhatsApp' );
		$this->textarea( 'whatsapp_message', __( 'WhatsApp message', 'aranya' ), 'Hello, I would like to arrange a site visit to Aranya The Park, Malad West.', array( 'rows' => 2 ) );
		$this->text( 'enquire_label', __( 'Enquire label', 'aranya' ), 'Enquire' );
		$this->text( 'mobile_purpose', __( 'Enquiry purpose (mobile)', 'aranya' ), 'Mobile Quick Action' );
		$this->text( 'desktop_purpose', __( 'Enquiry purpose (desktop)', 'aranya' ), 'Desktop Floating Widget' );
		$this->note( __( 'Phone and WhatsApp numbers come from Aranya → Site Settings.', 'aranya' ) );
		$this->end_section();
	}

	protected function render() {
		$s  = $this->get_settings_for_display();
		$wa = aranya_whatsapp_url( (string) $s['whatsapp_message'] );
		$tel = aranya_tel_url();
		echo self::editor_note( __( 'Contact closet — fixed to the bottom-right corner', 'aranya' ) );
		?>
		<div ar-data="stickyBar" class="fixed z-40 right-4 bottom-4 pb-safe lg:right-8 lg:bottom-6 lg:pb-0 flex flex-col items-end gap-3 lg:flex-row lg:items-center lg:gap-3 pointer-events-none">
			<div
				id="contact-closet-mobile"
				aria-hidden="true"
				ar-bind:aria-hidden="isOpen ? 'false' : 'true'"
				class="lg:hidden flex flex-col items-end gap-2.5 transition-all duration-300 ease-out origin-bottom-right opacity-0 scale-95 pointer-events-none translate-y-3"
				ar-bind:class="{ 'opacity-100 scale-100 pointer-events-auto translate-y-0': isOpen, 'opacity-0 scale-95 pointer-events-none translate-y-3': !isOpen }"
			>
				<a href="<?php echo esc_attr( $tel ); ?>" ar-on:click="close()" ar-bind:style="delay(0)" style="transition-delay: 0ms;" class="btn-lux flex items-center gap-2.5 pl-4 pr-5 py-3 min-h-[48px] rounded-full glass-action-bar border border-white/[0.12] text-ivory transition-all duration-300">
					<?php echo aranya_icon( 'phone', 15, array( 'class' => 'text-champagne-400 shrink-0' ) ); ?>
					<span class="text-[11px] font-sans font-semibold uppercase tracking-[0.18em]"><?php echo esc_html( $s['call_label'] ); ?></span>
				</a>

				<a href="<?php echo esc_url( $wa ); ?>" target="_blank" rel="noopener noreferrer" ar-on:click="close()" ar-bind:style="delay(1)" style="transition-delay: 0ms;" class="btn-lux flex items-center gap-2.5 pl-4 pr-5 py-3 min-h-[48px] rounded-full glass-action-bar border border-white/[0.12] text-ivory transition-all duration-300">
					<?php echo aranya_icon( 'message-square', 15, array( 'class' => 'text-[#25D366] shrink-0' ) ); ?>
					<span class="text-[11px] font-sans font-semibold uppercase tracking-[0.18em]"><?php echo esc_html( $s['whatsapp_label'] ); ?></span>
				</a>

				<button ar-on:click="close(); <?php echo esc_attr( self::lead_js( $s['mobile_purpose'] ) ); ?>" ar-bind:style="delay(2)" style="transition-delay: 0ms;" class="btn-lux flex items-center gap-2.5 pl-4 pr-5 py-3 min-h-[48px] rounded-full bg-gradient-to-b from-champagne-300 to-champagne-400 text-dark-950 font-bold shadow-[0_8px_24px_rgba(200,169,107,0.35)] transition-all duration-300">
					<?php echo aranya_icon( 'calendar', 15, array( 'class' => 'shrink-0' ) ); ?>
					<span class="text-[11px] font-sans uppercase tracking-[0.18em]"><?php echo esc_html( $s['enquire_label'] ); ?></span>
				</button>
			</div>

			<div
				id="contact-closet"
				aria-hidden="true"
				ar-bind:aria-hidden="isOpen ? 'false' : 'true'"
				class="hidden lg:flex items-center gap-2 p-2 glass-action-bar rounded-full border border-white/[0.1] shadow-[0_20px_40px_rgba(0,0,0,0.8)] transition-all duration-400 ease-out origin-right opacity-0 scale-95 pointer-events-none translate-x-6"
				ar-bind:class="{ 'opacity-100 scale-100 pointer-events-auto translate-x-0': isOpen, 'opacity-0 scale-95 pointer-events-none translate-x-6': !isOpen }"
			>
				<a href="<?php echo esc_attr( $tel ); ?>" ar-bind:style="delay(0)" style="transition-delay: 0ms;" class="btn-lux flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-sans font-medium uppercase tracking-[0.16em] text-ivory hover:text-champagne-300 hover:bg-white/[0.06] transition-all duration-300">
					<?php echo aranya_icon( 'phone', 13, array( 'class' => 'text-champagne-400' ) ); ?>
					<span><?php echo esc_html( $s['call_label'] ); ?></span>
				</a>

				<span class="w-[1px] h-4 bg-white/[0.12]"></span>

				<a href="<?php echo esc_url( $wa ); ?>" target="_blank" rel="noopener noreferrer" ar-bind:style="delay(1)" style="transition-delay: 0ms;" class="btn-lux flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-sans font-medium uppercase tracking-[0.16em] text-ivory hover:text-champagne-300 hover:bg-white/[0.06] transition-all duration-300">
					<?php echo aranya_icon( 'message-square', 13, array( 'class' => 'text-[#25D366]' ) ); ?>
					<span><?php echo esc_html( $s['whatsapp_label'] ); ?></span>
				</a>

				<button ar-on:click="<?php echo esc_attr( self::lead_js( $s['desktop_purpose'] ) ); ?>" ar-bind:style="delay(2)" style="transition-delay: 0ms;" class="btn-lux flex items-center gap-2 px-6 py-2.5 text-[11px] font-sans font-semibold uppercase tracking-[0.2em] bg-gradient-to-b from-champagne-300 to-champagne-400 hover:from-champagne-200 hover:to-champagne-300 text-dark-950 rounded-full shadow-[0_6px_20px_rgba(200,169,107,0.3)] transition-all duration-300 cursor-pointer select-none">
					<?php echo aranya_icon( 'calendar', 13 ); ?>
					<span><?php echo esc_html( $s['enquire_label'] ); ?></span>
				</button>
			</div>

			<button
				ar-on:click="toggle()"
				aria-expanded="false"
				ar-bind:aria-expanded="isOpen ? 'true' : 'false'"
				aria-controls="contact-closet"
				aria-label="Open contact options"
				ar-bind:aria-label="isOpen ? 'Close contact options' : 'Open contact options'"
				class="pointer-events-auto relative shrink-0 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer select-none bg-gradient-to-b from-champagne-300 to-champagne-400 text-dark-950 shadow-[0_10px_30px_rgba(200,169,107,0.4)] hover:shadow-[0_14px_38px_rgba(200,169,107,0.55)] hover:scale-105 active:scale-95 transition-all duration-300 ease-out closet-halo"
				ar-bind:class="{ 'closet-halo': !isOpen && !hasOpened }"
			>
				<?php
				echo aranya_icon(
					'phone',
					21,
					array(
						'class' => 'absolute transition-all duration-300 ease-out opacity-100 rotate-0 scale-100',
						'attrs' => array( 'ar-bind:class' => "{ 'opacity-0 rotate-90 scale-75': isOpen, 'opacity-100 rotate-0 scale-100': !isOpen }" ),
					)
				);
				echo aranya_icon(
					'x',
					22,
					array(
						'class' => 'absolute transition-all duration-300 ease-out opacity-0 -rotate-90 scale-75',
						'attrs' => array( 'ar-bind:class' => "{ 'opacity-100 rotate-0 scale-100': isOpen, 'opacity-0 -rotate-90 scale-75': !isOpen }" ),
					)
				);
				?>
			</button>
		</div>
		<?php
	}
}
