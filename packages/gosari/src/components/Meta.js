import React from "react"
import PropTypes from "prop-types"
import Helmet from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

export const Meta = ({ description, lang, meta, keywords, title, url }) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            siteUrl
            title
            description
            author
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description
  const _meta = [
    {
      name: `description`,
      content: metaDescription,
    },
    {
      property: `og:title`,
      content: title,
    },
    {
      property: `og:description`,
      content: metaDescription,
    },
    {
      property: `og:type`,
      content: `website`,
    },
    {
      name: `twitter:card`,
      content: `summary`,
    },
    {
      name: `twitter:creator`,
      content: site.siteMetadata.author,
    },
    {
      name: `twitter:title`,
      content: title,
    },
    {
      name: `twitter:description`,
      content: metaDescription,
    },
  ]
    .concat(
      keywords.length > 0
        ? {
            name: `keywords`,
            content: keywords.join(`, `),
          }
        : []
    )
    .concat(meta)

  if (url) {
    const imagePath = `${site.siteMetadata.siteUrl}${url}social.png`
    _meta.push({ name: `twitter:image:src`, content: imagePath })
    _meta.push({ name: `og:image`, content: imagePath })
  }

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title} - ${site.siteMetadata.author}`}
      meta={_meta}
    />
  )
}

Meta.defaultProps = {
  lang: `ko`,
  meta: [],
  keywords: [],
}

Meta.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.array,
  keywords: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string.isRequired,
}
