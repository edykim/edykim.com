import React from 'react'
import { Link } from 'gatsby'

import options from '../../config/taxonomy'
import { sanitizeUrl, languagePrefix } from '../../plugins/edykim-taxonomy/internals'

import './TaxonomyLine.css'

export default ({ post }) => {
  const { lang } = post.frontmatter

  
  let links = []

  if (post.frontmatter.categories) {
    links = links.concat(post.frontmatter.categories.map(category => {
      const path = `${languagePrefix(lang)}/category/${sanitizeUrl(category, options)}/`
      return <Link className={`taxonomy`} to={path}>#{category}</Link>
    }))
  }

  if (post.frontmatter.tags) {
    links = links.concat(post.frontmatter.tags.map(tag => {
      const path = `${languagePrefix(lang)}/tag/${sanitizeUrl(tag, options)}/`
      return <Link className={`taxonomy`} to={path}>#{tag}</Link>
    }))
  }

  return <div className={`taxonomies`}>{ links }</div>;
}
