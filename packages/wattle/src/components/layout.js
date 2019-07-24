/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { StaticQuery, graphql, Link } from "gatsby"

import "./layout.css"

const Layout = ({ location, children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => {
      const rootPath = `${__PATH_PREFIX__}/`
      return (
        <>
          <div
            style={{
              margin: `0 auto`,
              maxWidth: 640,
              padding: `0px 1.0875rem 1.45rem`,
              paddingTop: 0,
            }}
          >
            <header>
              <div>
                <Link
                  to={`/`}
                  style={{
                    textDecoration: "none",
                    margin: "60px 0 20px",
                    display: "inline-block",
                    fontWeight: "900",
                    color: "#666666",
                  }}
                >
                  Edward Kim
                </Link>
              </div>
            </header>
            <main>{children}</main>
            <footer
              style={{
                margin: `50px auto`,
              }}
            >
              <Link style={{ color: "#666666" }} to={`/`}>
                edykim
              </Link>
              <Link
                style={{ color: "#666666", marginLeft: "6px" }}
                to={`/pages`}
              >
                pages
              </Link>
            </footer>
          </div>
        </>
      )
    }}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
