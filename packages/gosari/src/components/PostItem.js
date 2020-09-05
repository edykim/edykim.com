import React, { Component } from "react"
import styled from "styled-components"
import { Link } from "gatsby"
import { colors, fonts } from "styles/schema"
import moment from "moment"

const Row = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0.3rem 0;

  @media screen and (max-width: 900px) {
    display: block;
  }
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
  word-break: keep-all;
  overflow-wrap: break-word;
  a {
    color: ${colors.primary};
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
          {moment(post.frontmatter.date, "MMMM D").format("M[월] D[일]")}
        </PublishedAt>
      </Row>
    )
  }
}
