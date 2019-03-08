const fs = require('fs-extra')
const path = require('path')

exports.copyStatic = (
  currentWorkingDirectory = process.cwd(),
  staticDirectoryName = 'static',
  publicDirectoryName = 'public'
) => {
  const staticDir = path.join(currentWorkingDirectory, staticDirectoryName)

  if (fs.existsSync(staticDir)) {
    try {
      fs.copySync(
        staticDir,
        path.join(currentWorkingDirectory, publicDirectoryName),
        {
          overwrite: false,
        }
      )
      console.log(`Files copied to public from static.`)
    } catch (err) {
      console.error(err)
    }
  }
}
