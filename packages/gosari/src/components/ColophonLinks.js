import React, { Component } from "react"
import styled from "styled-components"
import { Link } from "gatsby"
import { color, layout } from "styles/schema"

const Wrapper = styled.div`
  max-width: ${layout.medium};
  margin: 0 auto 2rem;
`

const Sections = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  padding 0 ${layout.sidePadding};
  a {
    display: block;
    word-break: keep-all;
    width: 100%;
    text-decoration: none;
    color: ${color.primary};
  }
  > div:nth-of-type(2) {
    text-align: right;
  }
`
const Section = styled.div`
  font-size: 0.8rem;
  flex: 1;
  display: flex;
  align-items: stretch;
`

const PublishedAt = styled.time`
  display: block;
  font-size: 0.78em;
  color: ${color.caption};
`

export class ColophonLinks extends Component {
  render() {
    const { links } = this.props
    return (
      <Wrapper>
        <Sections>
          {links.map(
            post =>
              post && (
                <Section key={post.fields.url}>
                  <Link to={post.fields.url}>
                    <PublishedAt>{post.frontmatter.date}</PublishedAt>
                    {post.frontmatter.title}
                  </Link>
                </Section>
              )
          )}
        </Sections>
      </Wrapper>
    )
  }
}
