const fs = require("fs")
const path = require("path")

// for fixing translate services
exports.onPreBootstrap = ({ store }) => {
  const { program } = store.getState()
  const filePath = path.join(program.directory, ".cache", "production-app.js")

  const code = fs.readFileSync(filePath, {
    encoding: `utf-8`,
  })

  const newCode = code.replace(
    `const { pagePath, location: browserLoc } = window`,
    `const { pagePath } = window
    let { location: browserLoc } = window

    if (window.parent.location !== browserLoc) {
      browserLoc = {
        pathname: pagePath
      }
    }
  `
  )

  fs.writeFileSync(filePath, newCode, `utf-8`)
}

