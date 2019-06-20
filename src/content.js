import browser from 'webextension-polyfill'

import checkPassword from './utils/password-check'

let isCompromised = false

const passwordFields = document.querySelectorAll('input[type=password]')
console.log('[password-leak-monitor] password fields found:', passwordFields.length)

passwordFields.forEach(field => {
  let typingTimer
  const doneTypingInterval = 1500

  const doneTyping = (e) => {
    checkPassword(e.target.value).then(found => {
      if (found) {
        e.target.style.backgroundColor = '#c00'
        e.target.setAttribute('title', 'Password has been detected in data breaches!')
        browser.runtime.sendMessage({ type: 'password-alert', password: e.target.value })
        isCompromised = true
      } else {
        e.target.style.backgroundColor = ''
        e.target.removeAttribute('title')
        browser.runtime.sendMessage({ type: 'all-clear' })
        isCompromised = false
      }
    })
  }

  field.addEventListener('keyup', e => {
    clearTimeout(typingTimer)
    if (field.value.length >= 4) {
      typingTimer = setTimeout(() => doneTyping(e), doneTypingInterval)
    }
  })

  field.addEventListener('blur', e => {
    clearTimeout(typingTimer)
    doneTyping(e)
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
