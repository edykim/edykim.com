import React from 'react'
import Helmet from 'react-helmet'

const Head = ({ site, lang }) => (
  <Helmet
    titleTemplate={'%s - ' + site.siteMetadata.title}
    meta={[
      { name: 'description', content: site.siteMetadata.description },
      { name: 'keywords', content: site.siteMetadata.keywords },
    ]}
  >
    <html lang={lang} />
    <meta name="viewport" content="width=device-width" />

    {site.siteMetadata.prefetchedDomains.forEach(url => (
      <link rel="dns-prefetch" href={url} />
    ))}
  </Helmet>
)

export default Head
