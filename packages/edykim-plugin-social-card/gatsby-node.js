const path = require(`path`)
const puppeteer = require('puppeteer')
const { createFileNodeFromBuffer } = require(`gatsby-source-filesystem`)
const { defaultOptions, QueueProcess } = require(`./internals`)

let queueProcess = null
let browserPromise = null
let _browsers = null
let _pages = null

const initBrowsers = async (size, options) => {
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
  _pages.push(page)
  return page
}

const isInTargetNode = (node, { targetNodeFilter }) => {
  return targetNodeFilter(node)
}

const createSocialCardField = async (
  {
    node,
    getNode,
    createNode,
    createParentChildLink,
    createNodeField,
    createContentDigest,
    touchNode,
    store,
    cache,
    createNodeId,
  },
  { viewport, createCardHtml, targetElement }
) => {
  const digest = createContentDigest(node)
  const key = `social-card-${digest}`

  const cacheData = await cache.get(key)
  let fileNode

  if (cacheData) {
    touchNode({ nodeId: cacheData.fileNodeID })
    fileNode = await getNode(cacheData.fileNodeID)
  } else {
    const page = await openPage()
    await page.reload({
      waitUntil: 'networkidle0',
    })
    await page.setViewport(viewport)
    await page.setContent(createCardHtml(node), {
      waitUntil: 'networkidle0',
    })
    await page.waitFor(targetElement)
    const section = await page.$(targetElement)
    const buffer = await section.screenshot()

    fileNode = await createFileNodeFromBuffer({
      buffer,
      store,
      cache,
      createNode,
      createNodeId,
      name: `social-card-${node.id}`,
    })
  }

  await createNodeField({
    node,
    name: 'socialCard',
    value: fileNode,
  })

  // await createParentChildLink({ parent: node, child: fileNode })
  await cache.set(key, { fileNodeID: fileNode.id })
}

exports.onCreateNode = async (
  {
    actions: {
      getNode,
      createNode,
      createNodeField,
      createParentChildLink,
      touchNode,
    },
    createContentDigest,
    basePath,
    node,
    createNodeId,
    store,
    cache,
    reporter,
  },
  pluginOptions
) => {
  const options = {
    ...defaultOptions,
    ...pluginOptions,
  }

  if (!isInTargetNode(node, options)) {
    return
  }

  queueProcess = queueProcess || new QueueProcess(options.puppeteerQueueSize)
  await initBrowsers(options.puppeteerQueueSize, options.puppeteerOptions)

  await queueProcess.queue(async () => {
    await createSocialCardField(
      {
        node,
        getNode,
        createNode,
        createNodeField,
        createParentChildLink,
        createContentDigest,
        touchNode,
        store,
        cache,
        createNodeId,
        basePath,
      },
      options
    )
  })

  reporter.success(`Social Card generated for ${node.frontmatter.title}`)
}

exports.sourceNodes = async ({ actions, getNodes }) => {
  const { touchNode } = actions
  const nodes = getNodes()

  // touch exisiting social cards
  nodes
    .filter(n => {
      return n.internal.type === 'File' && n.name.indexOf('social-card-') === 0
    })
    .forEach(n => touchNode({ nodeId: n.id }))
}

exports.onPostBootstrap = async () => {
  await closeBrowsers()
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes, createFieldExtension } = actions

  const typeDefs = `
    type MarkdownRemark implements Node {
      fields: MarkdownRemarkFields
    }

    type MarkdownRemarkFields {
      socialCard: File
    }
  `

  createTypes(typeDefs)
}
