const path = require("path")
const { getTimestamp } = require("./utils")

const {
  existsSync,
  writeFileSync,
  readFileSync,
} = require("fs")

let content = process.argv.slice(2).join(" ")
if (content.trim() === "") {
  console.error("Your memo is missing.")
  return
}

const d = new Date()
const y = d.getFullYear()
const p = path.join(
  __dirname,
  "..",
  "content",
  "ko",
  "pages",
  "memo",
  `${y}.md`
)
if (!existsSync(p)) {
  writeFileSync(
    path.join(p),
    `---
title: 부스러기
author: haruair
headline:
  - 삶의 작은 조각들 모음
type: page
date: "${d.toISOString()}"
lang: ko
url: /memo/${y}/
---
  `
  )
}

const data = readFileSync(p)

const ds = data.toString().split("<!-- -->")
const newItem = getTimestamp(d, content)

writeFileSync(path.join(p), [ds[0], "<!-- -->\n", newItem, ds[1]].join(""))

console.log(p)
