import * as React from "react"
import { Link } from "gatsby"
import Subject, { Headline, Date } from "./subject"
import Content from "./content"
import { PostNav } from "./nav"
import PostShortList from "./post-short-list"
import Tags from "./tag"
import Comment from "./comment"
import { styled } from "styled-components"

const PostSeparator = styled.div`
margin-top: 8rem;
margin-bottom: 3rem;
width: var(--site-width);
background-color: var(--color-separator);
position: relative;
&:after {
  content: '//';
  font-size: 1.2rem;
  position: absolute;
  width: 100px;
  height: 40px;
  background-color: var(--color-background);
  left: 50%;
  margin-left: -50px;
  margin-top: -16px;
  text-align: center;
  font-family: monospace;
  color: var(--color-table);
}
height: 1px;
@media screen and (min-width: 1150px) {
  margin-left: 5rem;
}
`

const PostTemplate = ({ data, showLinkCaret = false }) => {
  const post = data.markdownRemark
  const headline = post.frontmatter.headline?.join(" ")
  return (
    <>
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <Subject>
          <h1 itemProp="headline">
            <Link to={post.fields.url}>
              {post.frontmatter.title || "#"}
              {showLinkCaret ? <span className="link-caret"></span> : null}
            </Link>
          </h1>
          {headline && <Headline>{headline}</Headline>}
          <Date>{post.frontmatter.date}</Date>
        </Subject>
        <Content
          style={{
            fontSize: "1rem",
            wordBreak: "keep-all",
          }}
          page={post}
        />
      </article>
      <Tags post={post} />

      {showLinkCaret ? <>
        <PostSeparator />
      </> : (
        <>
          <PostNav>
            <PostShortList posts={data.relatedPosts.edges ?? []} />
          </PostNav>
          <Comment />
        </>
      )}
    </>
  )
}

export default PostTemplate
