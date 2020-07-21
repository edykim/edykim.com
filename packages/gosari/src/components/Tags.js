import React, { Component } from "react"
import styled from "styled-components"
import { Link } from "gatsby"
import { sanitizeUrl } from "@edykim/gatsby-plugin-taxonomy"
import options from "config/taxonomy"
import { colors, fonts, layouts } from "styles/schema"

export const TagLink = styled(Link)`
  display: inline-block;
  border-radius: 10px;
  background-color: ${colors.card};
  color: ${colors.text};
  text-decoration: none;
  padding: 0.3rem 0.7rem;
  font-size: ${fonts.text};
  box-shadow: 0 2px 20px ${colors.shade};
  margin: 5px;
  transition: background-color 0.1s ease-in-out, color 0.1s ease-in-out;

  &.taxonomy-category {
    background-color: ${colors.primary};
    color: ${colors.background};
  }
  &:hover {
    background-color: ${colors.primary};
    color: ${colors.background};
  }
`

const Section = styled.div`
  max-width: ${layouts.content};
  margin: 2rem auto 4rem;
`

const Inner = styled.div`
  padding: 0 ${layouts.sidePadding};
`

export class Tags extends Component {
  render() {
    const { post } = this.props
    const { categories = [], tags = [] } = post.frontmatter

    return (
      <Section>
        <Inner>
          {categories &&
            categories.length &&
            categories.map((category, index) => {
              const path = `/category/${sanitizeUrl(category, options)}/`
              return (
                <TagLink
                  className={`taxonomy-category`}
                  key={`category-${index}`}
                  to={path}
                >
                  {category}
                </TagLink>
              )
            })}
          {tags &&
            tags.length &&
            tags.map((tag, index) => {
              const path = `/tag/${sanitizeUrl(tag, options)}/`
              return (
                <TagLink
                  className={`taxonomy-tag`}
                  key={`tag-${index}`}
                  to={path}
                >
                  {tag}
                </TagLink>
              )
            })}
        </Inner>
      </Section>
    )
  }
}
