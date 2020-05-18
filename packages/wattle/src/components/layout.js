/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { StaticQuery, graphql, Link } from "gatsby"
import { library } from "@fortawesome/fontawesome-svg-core"
import {
  fab,
  faTwitter,
  faGithub,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import "./layout.css"

library.add(fab, faTwitter, faGithub, faLinkedin)

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
              maxWidth: 740,
              padding: `0px 1.0875rem 1.45rem`,
              paddingTop: 0,
            }}
          >
            <header>
              <div>
                <Link className={`header__title`} to={`/`}>
                  Edward Kim
                </Link>
              </div>
            </header>
            <main>{children}</main>
            <footer
              style={{
                margin: `50px auto`,
                display: `flex`,
                flexDirection: `row`,
                justifyContent: `space-between`,
                alignItems: `flex-end`,
              }}
            >
              <div>
                <Link
                  style={{ color: `#555555`, textDecoration: `none` }}
                  to={`/`}
                >
                  edykim
                </Link>
              </div>
              <div>
                <a
                  style={{ margin: 5 }}
                  href={`https://twitter.com/heyedykim`}
                  title={`twitter @heyedykim`}
                >
                  <FontAwesomeIcon
                    size={`lg`}
                    icon={[`fab`, `twitter`]}
                    style={{ color: `#555555` }}
                  />
                </a>
                <a
                  style={{ margin: 5 }}
                  href={`https://github.com/edykim`}
                  title={`github @edykim`}
                >
                  <FontAwesomeIcon
                    size={`lg`}
                    icon={[`fab`, `github`]}
                    style={{ color: `#555555` }}
                  />
                </a>
                <a
                  style={{ margin: 5 }}
                  href={`https://www.linkedin.com/in/edwardykim/`}
                  title={`Linkedin @edwardykim`}
                >
                  <FontAwesomeIcon
                    size={`lg`}
                    icon={[`fab`, `linkedin`]}
                    style={{ color: `#555555` }}
                  />
                </a>
              </div>
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
