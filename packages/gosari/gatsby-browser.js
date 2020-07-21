/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

require("./content/assets/_global.css")
require("./src/styles/highlight.css")

// Load saved theme
;(() => {
  const current = localStorage.getItem("theme")
    ? localStorage.getItem("theme")
    : null

  if (current) {
    document.documentElement.setAttribute("data-theme", current)
  }
})()
