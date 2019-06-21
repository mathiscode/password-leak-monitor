const fs = require('fs')
const path = require('path')

const Package = require(path.resolve(process.cwd(), 'package.json'))
const Manifest = require(path.resolve(process.cwd(), 'extension/manifest.json'))

if (Package.version !== Manifest.version) {
  Manifest.version = Package.version
  fs.writeFileSync(path.resolve(process.cwd(), 'extension/manifest.json'), JSON.stringify(Manifest, null, 2))
  console.log(`Updated manifest to ${Manifest.version}`)
}
