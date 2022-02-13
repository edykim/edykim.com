function getTimestamp(date = new Date(), content = "") {
  const month = date.toLocaleString("default", { month: "long" })
  const y = date.getFullYear()
  const id = date.toISOString()
  const d = date.getDate()

  return `
<a class="memo-date" id="${id}" href="#${id}">${month} ${d}, ${y} #</a>

${content}

<hr class="memo-divider" />
`
}

module.exports = {
  getTimestamp,
}
