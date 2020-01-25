const { EventEmitter } = require('events')

class QueueProcess extends EventEmitter {
  que = []
  current = 0
  max = 8

  constructor(max) {
    super()
    this.max = max

    this.on('queue', this.queue)
    this.on('run', this.run)
  }

  queue = func => {
    return new Promise((resolve, reject) => {
      this.que.push([func, resolve])
      if (this.current < this.max) {
        this.emit('run')
      }
    })
  }

  run = async () => {
    if (this.que.length === 0) {
      return
    }
    this.current++
    const [func, resolve] = this.que.shift()
    await func()
    this.current--
    resolve && resolve()

    if (this.current < this.max && this.que.length > 0) {
      this.emit('run')
    }
  }
}

// Default plugin options
exports.defaultOptions = {
  targetNodeFilter: node => {
    return node && node.internal && node.internal.type === `MarkdownRemark`
  },
  puppeteerQueueSize: 5,
  puppeteerOptions: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
  },
  viewport: {
    width: 1200,
    height: 628,
    deviceScaleFactor: 2,
  },
  targetElement: 'body',
  createCardHtml: node => {
    return `<!doctype html><body>${node.frontmatter.title}</body>`
  },
}

exports.QueueProcess = QueueProcess
