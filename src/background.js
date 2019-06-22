import browser from 'webextension-polyfill'

import { getLocalizedString } from './utils/i18n'

let currentNotificationID
let clearPasswordMapInterval
let passwordMap = {}
const clearPasswordMap = () => { passwordMap = {} }

const sendNotification = (password) => {
  browser.tabs.query({ active: true, currentWindow: true })
    .then(tabs => {
      if (currentNotificationID) {
        browser.notifications.clear(currentNotificationID)
        currentNotificationID = null
      }

      browser.storage.local.get().then(store => {
        store.options = store.options || {}

        if (!store.options.disableNotifications) {
          browser.notifications.create({
            type: 'basic',
            iconUrl: '../icons/alert.png',
            title: getLocalizedString('notificationPasswordCompromisedTitle', 'Password Compromised!'),
            message: getLocalizedString('notificationPasswordCompromisedText', 'Warning! This password has been included in data breaches.\n\nClick to see the unmasked password.')
          }).then(id => {
            // For security, clear the password map frequently so unauthorized users can't click the notification later to see it (on Chrome/Win10 for example)
            clearInterval(clearPasswordMapInterval)
            clearPasswordMapInterval = setInterval(clearPasswordMap, 15000)

            passwordMap[id] = password
            currentNotificationID = id
          })
        }

        browser.browserAction.setBadgeText({
          text: '!',
          tabId: tabs[0].id
        })

        browser.browserAction.setBadgeBackgroundColor({
          color: 'red'
        })

        browser.browserAction.setTitle({
          title: getLocalizedString('toolbarIconPasswordCompromisedTitle', 'Password Compromised!'),
          tabId: tabs[0].id
        })
      })
    })
}

const allClear = () => {
  passwordMap = {}

  browser.tabs.query({ active: true, currentWindow: true })
    .then(tabs => {
      if (currentNotificationID) {
        browser.notifications.clear(currentNotificationID)
        currentNotificationID = null
      }

      browser.browserAction.setBadgeText({
        text: '',
        tabId: tabs[0].id
      })

      browser.browserAction.setTitle({
        title: '',
        tabId: tabs[0].id
      })
    })
}

// Show password on notification click
browser.notifications.onClicked.addListener(id => {
  browser.notifications.clear(id).then((cleared) => {
    browser.notifications.create({
      type: 'basic',
      iconUrl: '../icons/alert.png',
      title: getLocalizedString('notificationPasswordCompromisedTitle', 'Password Compromised!'),
      message: passwordMap[id]
        ? `${getLocalizedString('notificationThisIsTheCompromisedPassword', 'This is the compromised password:')}\n\n${passwordMap[id]}`
        : getLocalizedString('notificationExpired', 'Notification expired')
    })
  })
})

browser.runtime.onMessage.addListener(msg => {
  switch (msg.type) {
    case 'password-alert':
      sendNotification(msg.password)
      break
    case 'all-clear':
      allClear()
      break
  }
})

// Setup context menus
browser.contextMenus.create({
  id: 'root-menu',
  title: getLocalizedString('extensionName'),
  contexts: ['all']
})

browser.contextMenus.create({
  id: 'options',
  parentId: 'root-menu',
  title: getLocalizedString('contextMenuOptionsTitle', 'Options'),
  contexts: ['all']
})

// Listen for context menu clicks
browser.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case 'options':
      browser.runtime.openOptionsPage()
      break
  }
})

// Handle changes to options
browser.storage.onChanged.addListener(changes => {
  console.log(changes.options.newValue)
})
