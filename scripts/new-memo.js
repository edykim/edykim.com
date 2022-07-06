const path = require("path")
const { writeFileSync, mkdirSync } = require("fs")

const d = new Date()
const np = n => String(n).padStart(2, "0")
const y = d.getFullYear()
const m = d.getMonth() + 1

const stamp = `${y}-${np(m)}-${np(d.getDate())}`
const filename = `${stamp}.md`
const p = path.join(__dirname, "..", "content", "ko", "posts")

mkdirSync(p, { recursive: true })
writeFileSync(
  path.join(p, filename),
  `---
author: haruair
type: post
date: "${d.toISOString()}"
lang: ko
tags:
  - 내 이야기
  - 부스러기
noIndex: true
slug: "${stamp}"
---

-
`
)

console.log(filename)
