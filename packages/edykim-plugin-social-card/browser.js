const puppeteer = require('puppeteer')

exports.setupPuppeteer = () => {
  let browserPromise = null
  let _browsers = null
  let _pages = null

  const initBrowsers = async ({ size, options }) => {
    if (_pages) {
      return
    }

    if (browserPromise) {
      return browserPromise
    }

    browserPromise = new Promise(async (resolve, reject) => {
      _browsers = await Promise.all(
        [...Array(size).keys()].map(() => puppeteer.launch(options))
      )
      const pages = await Promise.all(_browsers.map(browser => browser.newPage()))
      resolve(pages)
    }).then(pages => {
      _pages = pages
    })

    return browserPromise
  }

  const closeBrowsers = () => {
    return _browsers
      ? Promise.all(_browsers.map(browser => browser.close()))
      : true
  }

  const openPage = async () => {
    const page = _pages.shift()
    return page
  }

  const returnPage = async page => {
    _pages.push(page)
  }

  return {
    initBrowsers,
    closeBrowsers,
    openPage,
    returnPage,
  }
}
