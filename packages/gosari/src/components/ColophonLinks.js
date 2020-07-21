import React, { Component } from "react"
import styled from "styled-components"
import { Link } from "gatsby"
import moment from "moment"
import { colors, layouts, fonts } from "styles/schema"

const Wrapper = styled.div`
  max-width: ${layouts.content};
  margin: 0 auto 2rem;
`

const Sections = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  padding 0 ${layouts.sidePadding};
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
  color: ${colors.subtext};
`

const TitleLink = styled(Link)`
  display: block;
  word-break: keep-all;
  width: 100%;
  text-decoration: none;
  color: ${colors.primary};
  font-size: ${fonts.card.title};
  span {
    box-shadow: 0 3px 0;
    font-weight: 700;
  }
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
                  <TitleLink to={post.fields.url} rel={`nofollow`}>
                    <PublishedAt>
                      {moment(post.frontmatter.date).format(
                        "YYYY[년] M[월] D[일]"
                      )}
                    </PublishedAt>
                    <span>{post.frontmatter.title}</span>
                  </TitleLink>
                </Section>
              )
          )}
        </Sections>
      </Wrapper>
    )
  }
}
