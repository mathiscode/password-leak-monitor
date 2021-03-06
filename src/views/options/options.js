import browser from 'webextension-polyfill'

import { localizeHtml, getLocalizedString } from '../../utils/i18n'
import 'bootstrap/dist/js/bootstrap.js'
import './options.scss'

// Localize the options page
localizeHtml()

// Display the options with currently saved values
browser.storage.local.get().then(store => {
  store.options = store.options || {}

  const loadOptions = {
    disableNotifications: el => { el.checked = store.options.disableNotifications || false },
    // disableAutocheckOnBlur: el => { el.checked = store.options.disableAutocheckOnBlur || false },
    disableAutocheckOnIdle: el => { el.checked = store.options.disableAutocheckOnIdle || false },
    delayAutocheckOnIdle: el => { el.value = store.options.delayAutocheckOnIdle || 1500 }
  }

  for (const key in loadOptions) {
    const loader = loadOptions[key]
    loader(document.querySelector(`[name=${key}]`))
  }
})

// Handle saving the options
document.querySelector('#options-form').addEventListener('submit', e => {
  e.preventDefault()
  const form = e.srcElement

  const options = {
    disableNotifications: form.querySelector('[name=disableNotifications]').checked,
    // disableAutocheckOnBlur: form.querySelector('[name=disableAutocheckOnBlur').checked,
    disableAutocheckOnIdle: form.querySelector('[name=disableAutocheckOnIdle]').checked,
    delayAutocheckOnIdle: form.querySelector('[name=delayAutocheckOnIdle]').value
  }

  const saveButton = form.querySelector('button')
  const saveStatus = document.createElement('h3')
  saveStatus.style.marginTop = '20px'

  browser.storage.local.set({ options })
    .then(() => {
      browser.storage.local.get(null).then(store => {
        saveStatus.classList.add('alert', 'alert-success')
        saveStatus.appendChild(document.createTextNode(getLocalizedString('optionsSaved', 'Options saved!')))
        saveButton.parentNode.insertBefore(saveStatus, saveButton.nextSibling)
        setTimeout(() => saveStatus.parentNode.removeChild(saveStatus), 4000)
      })
    })
    .catch(err => {
      console.error(err)
      saveStatus.classList.add('alert', 'alert-danger')
      saveStatus.appendChild(document.createTextNode(getLocalizedString('optionsSaveError', 'There was an error saving the options')))
      saveButton.parentNode.insertBefore(saveStatus, saveButton.nextSibling)
    })
})
