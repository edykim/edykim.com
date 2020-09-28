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

  @media screen and (max-width: 900px) {
    display: block;

  > div:nth-of-type(2) {
    text-align: left;
    margin-top: 2rem;
  }
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
  text-decoration: none;
  color: ${colors.subtext};
`

const TitleLink = styled(Link)`
  display: block;
  word-break: keep-all;
  width: 100%;
  text-decoration: none;
  color: ${colors.text};
  font-size: ${fonts.card.title};
  span {
    text-decoration: underline;
  }
`

export class ColophonLinks extends Component {
  render() {
    const { links } = this.props
    return (
      <Wrapper>
        <Sections>
          {links.map(post => {
            if (!post) return null
            let title
            if (post.frontmatter && post.frontmatter.title) {
              title = post.frontmatter.title
            } else if (post.excerpt) {
              title = post.excerpt.substr(0, 24).trim()
              if (post.excerpt.length > 24) title += "..."
            } else {
              title = "제목 없음"
            }
            return (
              post && (
                <Section key={post.fields.url}>
                  <TitleLink to={post.fields.url} rel={`nofollow`}>
                    <PublishedAt>
                      {moment(post.frontmatter.date).format(
                        "YYYY[년] M[월] D[일]"
                      )}
                    </PublishedAt>
                    <span>{title}</span>
                  </TitleLink>
                </Section>
              )
            )
          })}
        </Sections>
      </Wrapper>
    )
  }
}
