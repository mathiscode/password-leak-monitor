import browser from 'webextension-polyfill'

import checkPassword from './utils/password-check'

let isCompromised = false

const passwordFields = document.querySelectorAll('input[type=password]')
console.log('[password-leak-monitor] password fields found:', passwordFields.length)

browser.storage.local.get(null).then(store => {
  store.options = store.options || {}

  passwordFields.forEach(field => {
    let typingTimer
    const doneTypingInterval = store.options.delayAutocheckOnIdle || 1500

    const doneTyping = (e) => {
      checkPassword(e.target.value).then(found => {
        if (found) {
          if (!store.options.disableAutocheckOnIdle) {
            e.target.style.backgroundColor = '#c00'
            e.target.setAttribute('title', 'Password has been detected in data breaches!')
          }

          if (!store.options.disableNotifications) browser.runtime.sendMessage({ type: 'password-alert', password: e.target.value })
          isCompromised = true
        } else {
          if (!store.options.disableAutocheckOnIdle) {
            e.target.style.backgroundColor = ''
            e.target.removeAttribute('title')
          }

          if (!store.options.disableNotifications) browser.runtime.sendMessage({ type: 'all-clear' })
          isCompromised = false
        }
      })
    }

    field.addEventListener('keyup', e => {
      clearTimeout(typingTimer)
      if (field.value.length >= 4) { // TODO: Add option for minimum amount of characters before autocheckonidle
        typingTimer = setTimeout(() => doneTyping(e), doneTypingInterval)
      }
    })

    field.addEventListener('blur', e => {
      clearTimeout(typingTimer)
      if (!store.options.disableAutocheckOnBlur) doneTyping(e)
    })
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
