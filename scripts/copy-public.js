/**
 * Copy public directories to root directory from packages
 *
 * Find all Gatsby package from packages directory, copy the `public`
 * directory to `public` directory in root package. The script awares
 * `pathPrefix` in `gatsby-config.js`, so it copies sub directory if the
 * package contains the `pathPrefix` option.
 *
 * The script can run specific package only via arguments.
 *
 *   $ node copy-public.js @edykim/hello @edykim/world
 *
 * or
 *
 *   $ npm run copy-public -- @edykim/hello @edykim/world
 *
 */
const fs = require('fs-extra')
const glob = require('glob')
const path = require('path')

exports.copyPublic = (
  currentWorkingDirectory = process.cwd(),
  publicDirName = `public`,
  configFileName = `gatsby-config.js`
) => {
  const lernaConfig = require(path.join(currentWorkingDirectory, 'lerna.json'))
  const _targetDirPackages = {}

  const specificPackageNames = process.argv.slice(2)

  if (specificPackageNames.length > 0) {
    console.log(`Copy '${publicDirName}' from packages below:`)
    console.log(specificPackageNames.map(name => `- ${name}`).join('\n'))
    console.log(``)
  } else {
    console.log(`Copy '${publicDirName}' from all packages.`)
    console.log(``)
  }

  lernaConfig.packages.forEach(packagePath => {
    glob(
      path.join(currentWorkingDirectory, packagePath, 'package.json'),
      {},
      (err, files) => {
        if (err) {
          throw new Error(err)
        }

        files.forEach(packageFile => {
          const package = require(packageFile)

          if (
            specificPackageNames.length > 0 &&
            !specificPackageNames.includes(package.name)
          ) {
            return
          }

          const dir = path.dirname(packageFile)
          const file = path.join(dir, configFileName)

          // if config file does not exists, skip.
          if (!fs.existsSync(file)) {
            return
          }

          const { pathPrefix } = require(file)
          const targetDir = path.join(
            currentWorkingDirectory,
            publicDirName,
            pathPrefix || ''
          )

          if (_targetDirPackages[targetDir]) {
            console.log(
              `Unable to copy from "${
                package.name
              }". The path "${targetDir}" already uses by "${
                _targetDirPackages[targetDir]
              }" package.\n - Check \`pathPrefix\` for avoiding this issue. https://www.gatsbyjs.org/docs/path-prefix/`
            )
            return
          }

          _targetDirPackages[targetDir] = package.name

          try {
            fs.copySync(path.join(dir, publicDirName), targetDir)
            console.log(`Files copied to ${targetDir} from ${package.name}`)
          } catch (err) {
            throw new Error(err)
          }
        })

        if (
          !_targetDirPackages[path.join(currentWorkingDirectory, publicDirName)]
        ) {
          console.warn(
            `Warning: Cannot find any packages for the path "${publicDirName}".`
          )
        }
      }
    )
  })
}
