const fs = require('fs-extra')
const path = require('path')

const staticDir = path.join(process.cwd(), 'static')

if (fs.existsSync(staticDir)) {
  try {
    fs.copySync(staticDir, path.join(process.cwd(), 'public'), {
      overwrite: false,
    })
    console.log(`Files copied to public from static.`)
  } catch (err) {
    console.error(err)
  }
}
