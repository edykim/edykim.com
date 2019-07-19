import React, { Component } from "react"
import styled from "styled-components"
import { Link } from "gatsby"
import { color } from "styles/schema"

const Row = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0.3rem 0;
`

const PublishedAt = styled.time`
  width: 4.2rem;
  font-size: 0.6rem;
  text-align: right;
  line-height: 1.8;
  color: ${color.caption};
`
const LinkSection = styled.div`
  flex: 1;
  font-size: 0.8rem;
  a {
    color: ${color.primary};
    text-decoration: none;
    border-bottom: 2px solid ${color.underline};
  }
`

export class PostItem extends Component {
  render() {
    const { post } = this.props
    return (
      <Row>
        <LinkSection>
          <Link to={`/${post.fields.url}`}>{post.frontmatter.title}</Link>
        </LinkSection>
        <PublishedAt>{post.frontmatter.date}</PublishedAt>
      </Row>
    )
  }
}
