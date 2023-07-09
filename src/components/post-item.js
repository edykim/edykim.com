import React, { Component } from "react"
import styled from "styled-components"
import { Link } from "gatsby"
import { colors, fonts } from "~/constraint"

const RowLink = styled(Link)`
  display: flex;
  flex-direction: row;
  padding: 1.5rem 0;
  align-items: flex-start;
  flex-wrap: no-wrap;
  @media screen and (max-width: 900px) {
    display: block;
  }
  color: inherit;
  text-decoration: none;

  .post-item-title {
    margin-bottom: 0.5rem;
    transition: background-color 0.3s;
  }
  .post-item-desc {
    font-size: 0.8em;
    color: var(--color-subtitle);
  }
  > div {
    transition: transform 0.3s;
  }
  &:hover,
  &:active,
  &:focus {
    > div {
      transform: translateX(3px);
    }
  }
`

const PublishedAt = styled.time`
  text-align: right;
  line-height: 1.8;
  font-size: 0.8em;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.012em;
  margin: 0 0.5rem 0 0;
  color: ${colors.subtext};
`

const LinkSection = styled.div`
  font-size: ${fonts.title};
  word-break: keep-all;
  overflow-wrap: break-word;
  flex: 1;
  a {
    color: var(--color-body);
    text-decoration: none;
    border-bottom: 1px solid var(--color-separator);

    &:hover,
    &:active {
      border-bottom: 2px solid var(--color-date);
    }
  }
`

export default class PostItem extends Component {
  render() {
    const { post } = this.props
    return (
      <li>
        <RowLink to={post.fields.url}>
          <LinkSection>
            <PublishedAt>{post.frontmatter.date}</PublishedAt>
            <div className="post-item-title">{post.frontmatter.title || post.excerpt}</div>
            {post.frontmatter.title && <div className="post-item-desc">{post.frontmatter.headline || post.excerpt}</div>}
          </LinkSection>
        </RowLink>
      </li>
    )
  }
}
