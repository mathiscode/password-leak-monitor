const fs = require('fs')
const Package = require('./package.json')
const Manifest = require('./extension/manifest.json')

if (Package.version !== Manifest.version) {
  Manifest.version = Package.version
  fs.writeFileSync('./extension/manifest.json', JSON.stringify(Manifest, null, 2))
  console.log(`Updated manifest to ${Manifest.version}`)
}
