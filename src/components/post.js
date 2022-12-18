import * as React from "react"
import { Link } from "gatsby"
import Subject, { Headline, Date } from "./subject"
import Content from "./content"
import { PostNav } from "./nav"
import PostShortList from "./post-short-list"
import Tags from "./tag"

const PostTemplate = ({ data, showLinkCaret = false }) => {
  const post = data.markdownRemark
  const headline = post.frontmatter.headline?.join(" ")
  const { previous, next, beforePrevious, afterNext } = data
  const related = [afterNext, next, previous, beforePrevious]
    .filter(v => !!v)
    .map(v => ({node: v}))
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
            lineHeight: 1.76,
            fontSize: "1rem",
            wordBreak: "keep-all",
          }}
          page={post}
        />
      </article>
      <Tags post={post} />
      <PostNav>
        <PostShortList posts={related} />
      </PostNav>
    </>
  )
}

export default PostTemplate
