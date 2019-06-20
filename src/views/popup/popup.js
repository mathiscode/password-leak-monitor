import browser from 'webextension-polyfill'

import { LocalizeHtml } from '../../utils/i18n'
import checkPassword from '../../utils/password-check'
import 'bootstrap/dist/js/bootstrap.js'
import './popup.scss'

// Localize the popup page
LocalizeHtml()

browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
  if (tabs.length > 0) {
    const port = browser.tabs.connect(tabs[0].id)
    port.postMessage({ action: 'is-compromised' })
    port.onMessage.addListener(msg => {
      switch (msg.action) {
        case 'is-compromised':
          const classes = document.querySelector('#page-compromised').classList
          msg.result ? classes.remove('d-none') : classes.add('d-none')
      }
    })
  }
})

const passwordCheckForm = document.querySelector('#password-check-form')
const password = document.querySelector('input[name=check-password]')
const status = document.querySelector('#password-compromised-status')

password.addEventListener('keyup', e => {
  status.innerHTML = '&nbsp;'
  status.classList.remove('text-danger', 'text-success')
  password.classList.remove('is-valid', 'is-invalid')
})

passwordCheckForm.addEventListener('submit', e => {
  e.preventDefault()

  status.innerHTML = '&nbsp;'
  status.classList.remove('text-danger', 'text-success')
  password.classList.remove('is-valid', 'is-invalid')
  password.setAttribute('disabled', true)
  passwordCheckForm.querySelector('button').setAttribute('disabled', true)
  passwordCheckForm.querySelector('#password-check-form-submit-text').classList.add('d-none')
  passwordCheckForm.querySelector('#password-check-form-loading').classList.remove('d-none')

  checkPassword(password.value).then(found => {
    if (found) {
      password.classList.add('is-invalid')
      status.classList.add('text-danger')
      const localeStatus = browser.i18n.getMessage('popupPagePasswordCompromised')
      status.innerHTML = localeStatus === '' ? 'Password is compromised!' : localeStatus
    } else {
      password.classList.add('is-valid')
      status.classList.add('text-success')
      const localeStatus = browser.i18n.getMessage('popupPagePasswordNotCompromised')
      status.innerHTML = localeStatus === '' ? 'Password is not compromised!' : localeStatus
    }

    password.removeAttribute('disabled')
    passwordCheckForm.querySelector('button').removeAttribute('disabled')
    passwordCheckForm.querySelector('#password-check-form-submit-text').classList.remove('d-none')
    passwordCheckForm.querySelector('#password-check-form-loading').classList.add('d-none')
  })
})
