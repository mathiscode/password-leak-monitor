import browser from 'webextension-polyfill'

let currentNotificationID = null
let passwordMap = {}

// For security, clear the password map frequently so unauthorized users can't click the notification later to see it (on Chrome/Win10 for example)
setInterval(() => { passwordMap = {} }, 15000)

const sendNotification = (password) => {
  browser.tabs.query({ active: true, currentWindow: true })
    .then(tabs => {
      if (currentNotificationID !== null) {
        browser.notifications.clear(currentNotificationID)
        currentNotificationID = null
      }

      browser.storage.local.get().then(store => {
        store.options = store.options || {}

        let compromisedMessage = browser.i18n.getMessage('notificationPasswordCompromised')
        compromisedMessage = compromisedMessage === '' ? 'Warning! This password has been included in data breaches.\n\nClick to see the unmasked password.' : compromisedMessage

        if (!store.options.disableNotifications) {
          browser.notifications.create({
            type: 'basic',
            iconUrl: '../alert.png',
            title: 'Password Compromised!',
            message: compromisedMessage
          }).then(id => {
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
          title: 'Password Compromised!',
          tabId: tabs[0].id
        })
      })
    })
}

const allClear = () => {
  passwordMap = {}

  browser.tabs.query({ active: true, currentWindow: true })
    .then(tabs => {
      if (currentNotificationID !== null) {
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
    let compromisedMessage = browser.i18n.getMessage('notificationThisIsTheCompromisedPassword')
    compromisedMessage = compromisedMessage === '' ? 'This is the compromised password' : compromisedMessage

    browser.notifications.create({
      type: 'basic',
      iconUrl: '../alert.png',
      title: 'Password Compromised!',
      message: passwordMap[id] ? `${compromisedMessage}:\n\n${passwordMap[id]}` : 'Notification expired.'
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
  title: browser.i18n.getMessage('extensionName'),
  contexts: ['all']
})

browser.contextMenus.create({
  id: 'options',
  parentId: 'root-menu',
  title: 'Options',
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
