import browser from 'webextension-polyfill'

// This will allow you to localize your html files
export const localizeHtml = () => {
  const tags = document.querySelectorAll('[data-localize]')

  for (const i in tags) {
    if (tags.hasOwnProperty(i)) {
      const defaultString = tags[1].innerHTML
      const tag = tags[i].getAttribute('data-localize').toString()
      const msg = tag.replace(/__MSG_(\w+)__/g, (match, msgKey) => {
        try {
          return msgKey ? getLocalizedString(msgKey, defaultString) : defaultString
        } catch (err) {
          console.error(err)
        }
      })

      if (msg !== tag && msg !== '') tags[i].innerHTML = msg
    }
  }
}

// This will provide either the localized string or a default
export const getLocalizedString = (key, defaultString) => {
  const message = browser.i18n.getMessage(key)
  return (message === '' && defaultString) ? defaultString : (message === '' ? '' : message)
}
