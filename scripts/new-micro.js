const path = require('path')
const { writeFileSync, mkdirSync } = require('fs-extra')

const d = new Date()
const np = (n) => String(n).padStart(2, '0')
const y = d.getFullYear()
const m = d.getMonth() + 1

const stamp = `${y}-${np(m)}-${np(d.getDate())}-${np(d.getHours())}${np(
  d.getMinutes()
)}`

const filename = `${stamp}.md`
const p = path.join(
  __dirname,
  '..',
  'content',
  'ko',
  'micros',
  `${y}`,
  `${y}-${np(m)}`
)

mkdirSync(p, { recursive: true })
writeFileSync(
  path.join(p, filename),
  `---
# title:
type: micro
date: "${d.toISOString()}"
lang: ko
slug: "${stamp}"
---

-
`
)

console.log(filename)
