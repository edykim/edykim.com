import React from "react"
import { Link, StaticQuery, graphql } from "gatsby"
import styled from "styled-components"
import { Logo } from "./logo"

const HeaderDiv = styled.div`
  min-height: 50px;
  margin-top: 40px;
  @media (max-width: 800px) {
    margin-top: 20px;
  }
`

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`
    let header = null

    if (location.pathname !== rootPath) {
      header = (
        <StaticQuery
          query={layoutQuery}
          render={data => {
            return (
              <HeaderDiv>
                <Link
                  to={rootPath}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Logo
                    style={{ verticalAlign: "middle" }}
                    size={50}
                    leftColor={"#6700ee"}
                    rightColor={"#e91e63"}
                  />{" "}
                  <span style={{ verticalAlign: "middle", visibility: "none" }}>
                    {data.site.siteMetadata.title}
                  </span>
                </Link>
              </HeaderDiv>
            )
          }}
        />
      )
    }
    return (
      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: `1024px`,
          padding: `0 10px`,
        }}
      >
        <header>{header}</header>
        <main>{children}</main>
        <footer
          style={{
            textAlign: "center",
            margin: "100px 0 70px",
            fontSize: 14,
            color: "#545454",
          }}
        >
          <Link to={rootPath}>
            <Logo
              style={{ display: "block", margin: "0 auto 30px" }}
              size={30}
              leftColor={"#6700ee"}
              rightColor={"#e91e63"}
            />
          </Link>
          © 2011-{new Date().getFullYear()},{" "}
          <a href="https://github.com/edykim/edykim.com/issues/new">Feedback</a>
        </footer>
      </div>
    )
  }
}

export default Layout

const layoutQuery = graphql`
  query LayoutQuery {
    site {
      siteMetadata {
        title
        author
      }
    }
  }
`
