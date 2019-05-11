/* global TextEncoder, alert, fetch */

class Main {
  constructor () {
    window.addEventListener('load', this.listen)
  }

  listen () {
    const passwordFields = document.querySelectorAll('input[type=password]')
    console.log('[password-leak-monitor] password fields found:', passwordFields.length)
    passwordFields.forEach(field => {
      field.addEventListener('blur', e => {
        const encoder = new TextEncoder()
        const data = encoder.encode(e.target.value)
        const digest = window.crypto.subtle.digest('SHA-1', data)

        digest.then(buffer => {
          const byteArray = new Uint8Array(buffer)
          const hex = [...byteArray].map(value => {
            const code = value.toString(16)
            return code.padStart(2, '0')
          })

          const hexString = hex.join('').toUpperCase()
          const firstFive = hexString.substr(0, 5)

          fetch(`https://api.pwnedpasswords.com/range/${firstFive}`)
            .then(res => res.text())
            .then(text => {
              const results = text.split('\r\n')
              let found = false

              results.forEach(result => {
                const parts = result.split(':')
                if (hexString === `${firstFive}${parts[0]}`) found = true
              })

              if (found) {
                e.target.style.backgroundColor = '#c00'
                e.target.setAttribute('title', 'Password has been detected in data breaches!')
                alert('WARNING: This password has been detected in leaked databases. It is recommended to change it immediately!')
              } else {
                e.target.style.backgroundColor = ''
                e.target.removeAttribute('title')
              }
            })
        })
      })
    })
  }
}

export const main = new Main()
