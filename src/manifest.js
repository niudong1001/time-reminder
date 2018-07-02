/**
 * @see {@link https://developer.chrome.com/extensions/manifest}
 */
module.exports = {
  name: 'time-reminder',
  description: 'A Chrome extension project with Vue.js',
  author: 'Niudong-mac <1619249966@qq.com>',
  version: '1.0.0',
  icons: {
    '16': 'icons/16.png',
    '128': 'icons/128.png'
  },
  /**
   * @see {@link https://developer.chrome.com/extensions/declare_permissions}
   */
  permissions: [
    '<all_urls>',
    '*://*/*',
    'activeTab',
    'tabs',
    'background',
    'unlimitedStorage',
    'storage',
    "webRequest",
    "webRequestBlocking",
    "notifications",
    "alarms"
  ],
  browser_action: {
    default_title: 'TimeReminder',
    // default_popup: 'pages/popup.html'
  },
  background: {
    persistent: true,
    page: 'pages/background.html'
  },
  options_page: 'pages/options.html',
  content_scripts: [{
    js: [
      'js/manifest.js',
      'js/vendor.js',
      'js/content.js'
    ],
    run_at: 'document_end',
    matches: ['<all_urls>'],
    all_frames: true
  }],
  manifest_version: 2,
  content_security_policy: "script-src 'self'; object-src 'self'",
  web_accessible_resources: [
    'js/content.js'
  ]
}
