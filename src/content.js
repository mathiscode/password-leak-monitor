import browser from 'webextension-polyfill'

import checkPassword from './utils/password-check'

let isCompromised = false

const passwordFields = document.querySelectorAll('input[type=password]')
console.log('[password-leak-monitor] password fields found:', passwordFields.length)

browser.storage.local.get(null).then(store => {
  store.options = store.options || {}

  let compromisedMessage = browser.i18n.getMessage('passwordFieldTitlePasswordCompromised')
  compromisedMessage = compromisedMessage === '' ? 'Password has been detected in data breaches!' : compromisedMessage

  passwordFields.forEach(field => {
    let typingTimer
    const doneTypingInterval = store.options.delayAutocheckOnIdle || 1500

    const doneTyping = (e, trigger) => {
      checkPassword(e.target.value).then(found => {
        isCompromised = found

        if (
          (trigger === 'idle' && !store.options.disableAutocheckOnIdle) ||
          (trigger === 'blur' && !store.options.disableAutocheckOnBlur)
        ) {
          e.target.style.backgroundColor = found ? '#c00' : ''
          found ? e.target.setAttribute('title', compromisedMessage) : e.target.removeAttribute('title')
          browser.runtime.sendMessage(found ? { type: 'password-alert', password: e.target.value } : { type: 'all-clear' })
        }
      })
    }

    field.addEventListener('keyup', e => {
      clearTimeout(typingTimer)
      if (field.value.length >= 4) { // TODO: Add option for minimum amount of characters before autocheckonidle
        typingTimer = setTimeout(() => doneTyping(e, 'idle'), doneTypingInterval)
      }
    })

    // A lot of issues with blur, removing until fixed
    // field.addEventListener('blur', e => {
    //   clearTimeout(typingTimer)
    //   if (!store.options.disableAutocheckOnBlur) doneTyping(e, 'blur')
    // })
  })
})

browser.runtime.onConnect.addListener(port => {
  port.onMessage.addListener(msg => {
    switch (msg.action) {
      case 'is-compromised':
        port.postMessage({ action: 'is-compromised', result: isCompromised })
        break
    }
  })
})
