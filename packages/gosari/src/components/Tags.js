import React, { Component } from "react"
import styled from "styled-components"
import { Link } from "gatsby"
import { sanitizeUrl } from "@edykim/gatsby-plugin-taxonomy"
import options from "config/taxonomy"
import { layout, color } from "styles/schema"

export const TagLink = styled(Link)`
  display: inline-block;
  border-radius: 10px;
  background-color: ${color.white};
  color: ${color.plain};
  text-decoration: none;
  padding: 0.3rem 0.7rem;
  font-size: 0.65rem;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.04);
  margin: 5px;
  transition: background-color 0.1s ease-in-out, color 0.1s ease-in-out;

  &.taxonomy-category {
    background-color: ${color.note};
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    color: ${color.primary};
  }
  &:hover {
    background-color: ${color.primary};
    color: ${color.white};
  }
`

const Section = styled.div`
  max-width: ${layout.medium};
  margin: -1rem auto 4rem;
`

const Inner = styled.div`
  padding: 0 ${layout.sidePadding};
`

export class Tags extends Component {
  render() {
    const { post } = this.props
    const { categories = [], tags = [] } = post.frontmatter

    return (
      <Section>
        <Inner>
          {categories &&
            categories.length &&
            categories.map((category, index) => {
              const path = `/category/${sanitizeUrl(category, options)}/`
              return (
                <TagLink
                  className={`taxonomy-category`}
                  key={`category-${index}`}
                  to={path}
                >
                  {category}
                </TagLink>
              )
            })}
          {tags &&
            tags.length &&
            tags.map((tag, index) => {
              const path = `/tag/${sanitizeUrl(tag, options)}/`
              return (
                <TagLink
                  className={`taxonomy-tag`}
                  key={`tag-${index}`}
                  to={path}
                >
                  {tag}
                </TagLink>
              )
            })}
        </Inner>
      </Section>
    )
  }
}
// export const Taxonomy = ({ post, style, linkStyle }) => {
//   let links = []

//   if (post.frontmatter.categories) {
//     links = links.concat(
//       post.frontmatter.categories.map(category => {
//         const path = `/category/${sanitizeUrl(category, options)}/`
//         return (
//           <InBoxLink
//             style={linkStyle}
//             key={category}
//             className={`taxonomy`}
//             to={path}
//           >
//             {category}
//           </InBoxLink>
//         )
//       })
//     )
//   }

//   if (post.frontmatter.tags) {
//     links = links.concat(
//       post.frontmatter.tags.map(tag => {
//         const path = `/tag/${sanitizeUrl(tag, options)}/`
//         return (
//           <InBoxLink
//             style={linkStyle}
//             key={tag}
//             className={`taxonomy`}
//             to={path}
//           >
//             {tag}
//           </InBoxLink>
//         )
//       })
//     )
//   }

//   return (
//     <div className={`taxonomies`} style={style}>
//       {links}
//       <InBoxLink
//         to={`/archives`}
//         style={{ backgroundColor: "rgba(0,0,0,0.1)", color: "#ffffff" }}
//       >
//         전체보기
//       </InBoxLink>
//     </div>
//   )
// }
