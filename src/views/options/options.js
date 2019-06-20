import browser from 'webextension-polyfill'

import { LocalizeHtml } from '../../utils/i18n'
import './options.scss'

// Localize the options page
LocalizeHtml()

// Display the options with currently saved values
browser.storage.local.get().then(store => {
  document.querySelector('[name=dummyOption]').checked = store.options.dummyOption
})

// Handle saving the options
document.querySelector('#options-form').addEventListener('submit', e => {
  e.preventDefault()
  const form = e.srcElement

  const options = {
    dummyOption: form.querySelector('[name=dummyOption]').checked
  }

  browser.storage.local.set({ options })
    .then(() => {
      console.log('Options updated')
      browser.storage.local.get(null).then(store => console.log(store))
    })
    .catch(err => {
      console.error(err)
      window.alert('There was an error saving the options')
    })
})
