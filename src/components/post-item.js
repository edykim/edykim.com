import React, { Component } from "react"
import styled from "styled-components"
import { Link } from "gatsby"
import { colors, fonts } from "~/constraint"

const Row = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: 0.3rem;
  align-items: flex-start;
  flex-wrap: no-wrap;
  @media screen and (max-width: 900px) {
    display: block;
  }
`

const PublishedAt = styled.time`
  text-align: right;
  line-height: 1.8;
  font-size: ${fonts.title};
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.012em;
  margin: 0 0.5rem 0 0;
  color: ${colors.subtext};
  @media (prefers-color-scheme: dark) {
    color: #b7a792;
  }
`

const LinkSection = styled.div`
  font-size: ${fonts.title};
  word-break: keep-all;
  overflow-wrap: break-word;
  flex: 1;
  a {
    text-decoration: underline;
    &:hover,
    &:active {
      text-decoration: underline;
    }
  }
`

export default class PostItem extends Component {
  render() {
    const { post } = this.props
    return (
      <li>
        <Row>
          <PublishedAt>{post.frontmatter.date}</PublishedAt>
          <LinkSection>
            <Link to={post.fields.url}>
              {post.frontmatter.title || post.excerpt}
            </Link>
          </LinkSection>
        </Row>
      </li>
    )
  }
}
