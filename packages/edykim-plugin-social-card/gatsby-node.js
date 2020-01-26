const grayMatter = require(`gray-matter`)
const _ = require(`lodash`)
const { createFileNodeFromBuffer } = require(`gatsby-source-filesystem`)
const { defaultOptions, QueueProcess } = require(`./internals`)

const { setupPuppeteer } = require('./browser')
const { initBrowsers, closeBrowsers, openPage, returnPage } = setupPuppeteer()

const { setupTracker } = require('./job-tracker')
const { initProgress, jobStart, jobEnd } = setupTracker()

let queueProcess = null

const isInTargetNode = (node, { targetNodeFilter }) => {
  return targetNodeFilter(node)
}

exports.onPreBootstrap = async (
  {
    actions,
    getNodesByType,
    reporter,
  },
  pluginOptions,
) => {
  const { touchNode } = actions
  const options = {
    ...defaultOptions,
    ...pluginOptions,
  }

  const socialCardNodes = getNodesByType('SocialCard')
  socialCardNodes.forEach(n => {
    touchNode({ nodeId: n.file___NODE })
  })

  queueProcess = new QueueProcess(options.puppeteerQueueSize)
  await initProgress({ reporter })
  await initBrowsers({
    size: options.puppeteerQueueSize,
    options: options.puppeteerOptions
  })
}

exports.onPostBootstrap = async () => {
  // Keep instance alive in dev mode
  if (process.env.NODE_ENV === 'production') {
    await closeBrowsers()
  }
}

const createSocialCardNode = async (
  {
    frontmatter,
    node,
    createNode,
    createNodeId,
    createContentDigest,
    store,
    cache,
  },
  { viewport, createCardHtml, targetElement }
) => {
  const page = await openPage()
  await page.reload({
    waitUntil: 'domcontentloaded',
  })
  await page.setViewport(viewport)
  await page.setContent(createCardHtml({ frontmatter }), {
    waitUntil: 'networkidle0',
  })
  await page.waitFor(targetElement)

  const section = await page.$(targetElement)
  const buffer = await section.screenshot()
  await returnPage(page)

  const fileNode = await createFileNodeFromBuffer({
    buffer,
    store,
    cache,
    createNode,
    createNodeId,
    name: `social-card-${node.id}`,
  })

  const socialCardNode = {
    id: createNodeId(`${node.id} >>> SocialCard`),
    parent: node.id,
    children: [],
    internal: {
      type: 'SocialCard',
    },
    file___NODE: fileNode.id,
  }
  socialCardNode.internal.contentDigest = createContentDigest(socialCardNode)
  createNode(socialCardNode)

  return socialCardNode
}

exports.onCreateNode = async (
  {
    actions: {
      createNode,
      createNodeField,
    },
    node,
    createNodeId,
    createContentDigest,
    loadNodeContent,
    basePath,
    store,
    cache,
  },
  pluginOptions
) => {
  const options = {
    ...defaultOptions,
    ...pluginOptions,
  }

  if (
    node.internal.mediaType !== `text/markdown` &&
    node.internal.mediaType !== `text/x-markdown`
  ) {
    return
  }

  let frontmatter = null
  const content = await loadNodeContent(node)

  try {
    const { data } = grayMatter(content, pluginOptions)
    if (data) {
      frontmatter = _.mapValues(data, value => {
        if (_.isDate(value)) {
          return value.toJSON()
        }
        return value
      })
    }
  } catch (err) {
    reporter.panicOnBuild(
      `Error processing Markdown ${
        node.absolutePath ? `file ${node.absolutePath}` : `in node ${node.id}`
      }:\n
      ${err.message}`
    )
    return
  }

  if (!frontmatter) {
    return
  }

  if (!isInTargetNode({ frontmatter }, options)) {
    return
  }

  jobStart()
  return queueProcess.queue(async () => {
    await createSocialCardNode(
      {
        frontmatter,
        node,
        createNode,
        createNodeField,
        createContentDigest,
        store,
        cache,
        createNodeId,
        basePath,
      },
      options,
    )
    jobEnd()
  })
}
