import * as React from "react"
import { Link } from "gatsby"
import Subject, { Headline } from "./subject"
import Content from "./content"
import { PostNav } from "./nav"
import Tags from "./tag"

const PostTemplate = ({ data, location }) => {
  const post = data.markdownRemark
  const headline = post.frontmatter.headline?.join(" ")
  const { previous, next } = data
  return (
    <>
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <Subject>
          <h1 itemProp="headline">
            <Link to={post.fields.url}>{post.frontmatter.title || "#"}</Link>
          </h1>
          {headline && <Headline>{headline}</Headline>}
          <p>{post.frontmatter.date}</p>
        </Subject>
        <Content
          style={{
            lineHeight: 1.76,
            fontSize: "1rem",
            wordBreak: "keep-all",
            textIndent: "0.5rem",
          }}
          dangerouslySetInnerHTML={{ __html: post.html }}
          itemProp="articleBody"
        />
      </article>
      <Tags post={post} />
      <PostNav>
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.fields.url} rel="prev">
                ← {previous.frontmatter.title || previous.frontmatter.date}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.url} rel="next">
                {next.frontmatter.title || next.frontmatter.date} →
              </Link>
            )}
          </li>
        </ul>
      </PostNav>
    </>
  )
}

export default PostTemplate
