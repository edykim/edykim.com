/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import { colors, layouts } from "~/constraint"
import Header from "./header"
import "./layout.css"

const Layout = ({ item, children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <Header
        siteTitle={data.site.siteMetadata?.title || `Title`}
        item={item}
      />
      <div
        style={{
          margin: `0 auto`,
        }}
      >
        <main>{children}</main>
        <footer
          style={{
            maxWidth: layouts.content,
            margin: "2rem auto",
            padding: `0 ${layouts.sidePadding}`,
            fontSize: "0.8rem",
          }}
        >
          <a
            href="https://github.com/edykim/edykim.com/issues/new"
            style={{ color: colors.subtext }}
          >
            {item?.frontmatter.lang === "ko" ? "피드백 보내기" : "feedback"}
          </a>
        </footer>
      </div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
