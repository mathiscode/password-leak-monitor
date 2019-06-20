export default (password) => {
  return new Promise((resolve, reject) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
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

          resolve(found)
        })
    })
  })
}
