import React, { Component } from "react"
import styled from "styled-components"
import { Link } from "gatsby"
import { colors, fonts } from "styles/schema"
import moment from "moment"

const Row = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0.3rem 0;
`

const PublishedAt = styled.time`
  width: 5rem;
  text-align: right;
  line-height: 1.8;
  color: ${colors.subtext};
`
const LinkSection = styled.div`
  flex: 1;
  font-size: ${fonts.title};
  a {
    color: ${colors.primary};
    text-decoration: none;
    box-shadow: 0 3px 0;
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
        <PublishedAt>
          {moment(post.frontmatter.date).format("M[월] D[일]")}
        </PublishedAt>
      </Row>
    )
  }
}
