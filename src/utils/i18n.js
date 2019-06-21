import browser from 'webextension-polyfill'

// This will allow you to localize your html files
export const LocalizeHtml = () => {
  const tags = document.querySelectorAll('[data-localize]')

  for (const i in tags) {
    if (tags.hasOwnProperty(i)) {
      const tag = tags[i].getAttribute('data-localize').toString()
      const msg = tag.replace(/__MSG_(\w+)__/g, (match, msgKey) => {
        try {
          return msgKey ? browser.i18n.getMessage(msgKey) : ''
        } catch (err) {
          console.error(err)
        }
      })

      if (msg !== tag && msg !== '') tags[i].innerHTML = msg
    }
  }
}
