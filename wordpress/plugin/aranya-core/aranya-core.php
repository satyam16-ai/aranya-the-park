<?php
/**
 * Plugin Name:       Aranya Core
 * Plugin URI:        https://aranyathepark.com
 * Description:       The Aranya The Park website: Elementor widgets for every section, the enquiry
 *                    system (leads, OTP, notifications), site settings, SEO helpers and the content importer.
 * Version:           1.0.0
 * Requires at least: 6.5
 * Requires PHP:      8.1
 * Requires Plugins:  elementor
 * Author:            Aranya The Park
 * Text Domain:       aranya
 * License:           Proprietary
 *
 * Everything that makes the site look and behave like the approved design lives
 * in this plugin (styles, scripts, widgets), so the pages keep working if the
 * theme is ever switched. The companion "Aranya" theme is a thin shell.
 */

defined( 'ABSPATH' ) || exit;

define( 'ARANYA_VERSION', '1.0.0' );
define( 'ARANYA_FILE', __FILE__ );
define( 'ARANYA_DIR', plugin_dir_path( __FILE__ ) );
define( 'ARANYA_URL', plugin_dir_url( __FILE__ ) );

require_once ARANYA_DIR . 'includes/helpers.php';
require_once ARANYA_DIR . 'includes/settings.php';
require_once ARANYA_DIR . 'includes/media.php';
require_once ARANYA_DIR . 'includes/assets.php';
require_once ARANYA_DIR . 'includes/leads.php';
require_once ARANYA_DIR . 'includes/seo.php';
require_once ARANYA_DIR . 'includes/elementor.php';
require_once ARANYA_DIR . 'includes/overlays.php';
require_once ARANYA_DIR . 'includes/importer.php';

register_activation_hook( __FILE__, 'aranya_activate' );

/** Registers the lead post type before flushing, so its admin URLs resolve at once. */
function aranya_activate() {
	aranya_register_lead_post_type();
	flush_rewrite_rules();
}
