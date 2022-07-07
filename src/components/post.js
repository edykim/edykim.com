import * as React from "react"
import { Link } from "gatsby"
import Subject, { Headline, Date } from "./subject"
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
        <ul>
          <li>
            {previous && (
              <Link to={previous.fields.url} rel="prev">
                ←{" "}
                {previous.frontmatter.title ||
                  previous.excerpt ||
                  previous.frontmatter.date}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.url} rel="next">
                {next.frontmatter.title ||
                  next.excerpt ||
                  next.frontmatter.date}{" "}
                →
              </Link>
            )}
          </li>
        </ul>
      </PostNav>
    </>
  )
}

export default PostTemplate
