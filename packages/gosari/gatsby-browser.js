/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */
// Load saved theme
;(() => {
  const current = localStorage.getItem("theme")
    ? localStorage.getItem("theme")
    : null

  if (current) {
    document.documentElement.setAttribute("data-theme", current)
  } else {
    const isDarkMode = window.matchMedia
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false
    const theme = isDarkMode ? "dark" : "light"

    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme)
  }
})()
