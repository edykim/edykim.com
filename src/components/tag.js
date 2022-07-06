import React, { Component } from "react"
import styled from "styled-components"
import { Link } from "gatsby"
import { sanitizeUrl } from "@/plugins/edykim-plugin-taxonomy/utils"
import options from "@/config/taxonomy"
import { Container } from "./taxonomy-links"

export const TagLink = styled(Link)``

const Section = styled.div`
  margin: 2rem var(--site-margin) 4rem;
  width: var(--site-width);
`

export default class Tags extends Component {
  render() {
    const { post } = this.props
    const { tags = [], lang } = post.frontmatter
    const langPrefix = lang !== "en" ? `/${lang}` : ""
    return (
      <Section>
        <Container>
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
                  {`${tag}`}
                </TagLink>
              )
            })}
        </Container>
      </Section>
    )
  }
}
