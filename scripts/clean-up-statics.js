const fs = require('fs-extra')
const path = require('path')
const glob = require('glob')
const { ripGrep } = require('ripgrep-js')
const rg = ripGrep

const TARGET_DIR = './content'

glob('./static/wp-content/**/*', { nodir: true }, (err, files) => {
  if (err) {
    throw new Error(err)
  }

  files.forEach((filePath) => {
    const filename = filePath.replace('./static', '')
    ;(async () => {
      const results = await rg(TARGET_DIR, filename)
      const containedFiles = Array.from(
        new Set(results.map((v) => v.path.text))
      )

      if (containedFiles.length > 2) {
        console.log(filename, `found ${containedFiles.length} places`)
        containedFiles.forEach((v) => {
          console.log(' - ', v)
        })
      } else if (containedFiles.length === 0) {
        fs.removeSync(filePath)
      } else {
        const docFile = path.join(TARGET_DIR, containedFiles[0])
        const newPath = docFile.replace('.md', '')
        if (!fs.existsSync(newPath)) {
          fs.mkdirSync(newPath)
          fs.renameSync(docFile, path.join(newPath, 'index.md'))
        }
        fs.renameSync(filePath, path.join(newPath, path.basename(filePath)))
        console.log(docFile, 'moved with', path.basename(filePath))
      }
    })()
  })
})
