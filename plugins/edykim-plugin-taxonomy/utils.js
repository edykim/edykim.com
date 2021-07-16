const sanitizeUrl = (taxonomy, { mappedUrls }) => {
  const map = mappedUrls.find(({ key }) => key === taxonomy)
  const _taxonomy = map && map.url ? map.url : taxonomy

  return _taxonomy
    .replace(/\./gi, "dot")
    .replace(/ /gi, "-")
    .replace(/#/gi, "sharp")
    .toLowerCase()
}

module.exports = { sanitizeUrl }
