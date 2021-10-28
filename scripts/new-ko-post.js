const path = require("path")
const { writeFileSync, mkdirSync } = require("fs")

const categories = require("../config/taxonomy").mappedUrls

const d = new Date()
const np = n => String(n).padStart(2, "0")
const y = d.getFullYear()
const m = d.getMonth() + 1

let title = process.argv.slice(2).join(" ")
if (title.trim() === "") title = "Untitled"

const slug = title.replace(/\ /gi, "-").toLowerCase()

const stamp = `${y}-${np(m)}-${np(d.getDate())}-${slug}`

const filename = `${stamp}.md`
const p = path.join(__dirname, "..", "content", "ko", "posts")
const cat = categories.map(v => `#  - ${v.key}`).join("\n")

mkdirSync(p, { recursive: true })
writeFileSync(
  path.join(p, filename),
  `---
title: "${title}"
author: haruair
type: post
date: "${d.toISOString()}"
lang: ko
# headline:
#  - sample headline
tags:
${cat}
draft: true
slug: "${slug}"
---

-
`
)

console.log(filename)
