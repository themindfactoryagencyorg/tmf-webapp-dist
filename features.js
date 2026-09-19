/*
 * Runtime feature overrides for Qrema ("config en caliente").
 *
 * This file is loaded by index.html as a classic blocking script, BEFORE the
 * app bundle, so whatever it sets is available synchronously to featureFlags.js.
 * Editing it flips a screen with no rebuild and no redeploy: change the file
 * that the environment serves and hard-refresh the browser.
 *
 * Shipped EMPTY on purpose. With no assignment the build-time baseline
 * (VITE_QREMA_FEATURES) decides, which is what every environment wants by
 * default. Assign only to override that baseline:
 *
 *   window.__QREMA_FLAGS__ = {
 *     'qrema-visitas': true,     // force ON  (screen parked by the build)
 *     'qrema-radar': false,      // force OFF (kill switch for a broken screen)
 *   }
 *
 * Known ids: qrema-visitas, qrema-radar, qrema-ventas. Anything else, or a
 * value that is not a real boolean, is ignored and the baseline stands.
 *
 * On the VPS this path is served from a directory OUTSIDE the deployed dist, so
 * an override survives the next deploy. See the `qrema-feature-flags` skill.
 */
