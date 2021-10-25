import React, { Component } from "react"
import styled from "styled-components"
import { Link } from "gatsby"
import { sanitizeUrl } from "@/plugins/edykim-plugin-taxonomy/utils"
import options from "@/config/taxonomy"
import { colors, fonts, layouts } from "~/constraint"

export const TagLink = styled(Link)`
  display: inline-block;
  color: ${colors.text};
  font-size: ${fonts.tag};
  margin-right: 6px;
  margin-bottom: 6px;
`

const Section = styled.div`
  max-width: ${layouts.content};
  margin: 2rem auto 4rem;
`

const Inner = styled.div`
  padding: 0 ${layouts.sidePadding};
`

export default class Tags extends Component {
  render() {
    const { post } = this.props
    const { tags = [], lang } = post.frontmatter
    const langPrefix = lang !== "en" ? `/${lang}` : ""
    return (
      <Section>
        <Inner>
          {tags &&
            tags.length > 0 &&
            tags.map((tag, index) => {
              const path = `${langPrefix}/tag/${sanitizeUrl(tag, options)}/`
              return (
                <TagLink
                  className={`taxonomy-tag`}
                  key={`tag-${index}`}
                  to={path}
                >
                  {`#${tag}`}
                </TagLink>
              )
            })}
        </Inner>
      </Section>
    )
  }
}
