const lang = process.env.BROWSER_LANG || 'en'

module.exports = {
  verbose: false,
  sourceDir: './extension',
  build: {
    overwriteDest: true
  },
  run: {
    browserConsole: true,
    startUrl: [
      'about:debugging'
    ],
    pref: [
      `intl.locale.requested=${lang}`
    ]
  }
}
