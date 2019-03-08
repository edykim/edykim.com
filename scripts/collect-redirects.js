/**
 * Collect _redirects file for Netlify
 */
const fs = require('fs')
const glob = require('glob')
const path = require('path')

exports.collectRedirects = (
  currentWorkingDirectory = process.cwd(),
  publicDirName = `public`,
  staticDirName = `static`,
  redirectsFileName = `_redirects`
) => {
  glob(
    path.join(currentWorkingDirectory, publicDirName, '**', redirectsFileName),
    {},
    (err, files) => {
      if (err) {
        throw new Error(err)
      }

      let redirects = []
      files.forEach(file => {
        redirects.push(`# ${file}\n` + fs.readFileSync(file).toString())
        fs.unlinkSync(file)
      })
      const globalRedirects = fs.readFileSync(
        path.join(currentWorkingDirectory, staticDirName, redirectsFileName)
      )
      redirects.unshift(
        `# ${staticDirName}${redirectsFileName}\n` + globalRedirects.toString()
      )

      const rules = [
        ...new Set(
          redirects
            .join(`\n`)
            .split(`\n`)
            .filter(v => v)
        ),
      ]

      fs.writeFileSync(
        path.join(currentWorkingDirectory, publicDirName, redirectsFileName),
        rules.join(`\n`) + `\n`
      )
      const ruleCount = rules.filter(v => v.indexOf('#') !== 0).length
      console.log(
        `${ruleCount} line${
          ruleCount !== 1 ? 's' : ''
        } of redirect rule applied.`
      )
    }
  )
}
