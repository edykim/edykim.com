import * as React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { colors, layouts } from "~/constraint"
import Face from "../../assets/yong.svg"
import WowFace from "../../assets/yong-surprised.svg"

const FaceLink = styled(Link)`
  .active {
    display: none;
  }
  .link {
    display: inline-block;
  }

  &:hover {
    .active {
      display: inline-block;
    }
    .link {
      display: none;
    }
  }
`

const Header = ({ siteTitle, item }) => {
  const lang = item?.frontmatter.lang
  let contentType = item?.frontmatter.type

  if (contentType === "archive" || contentType === "showcase") {
    contentType = item.frontmatter.contentType
  }

  return (
    <header>
      <div
        style={{
          margin: `0 auto`,
          maxWidth: layouts.content,
          padding: `1.45rem 1.0875rem`,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <FaceLink to="/">
            <Face
              className={"link"}
              style={{ width: 64, marginRight: 15, fill: colors.text }}
            />
            <WowFace
              className={"active"}
              style={{ width: 64, marginRight: 15, fill: colors.text }}
            />
          </FaceLink>

          <h1 style={{ margin: 0, fontSize: 16 }}>
            <Link
              to="/"
              style={{
                textDecoration: `none`,
                color: colors.text,
              }}
            >
              {siteTitle}
            </Link>
            {lang && lang !== "en" && (
              <>
                <span style={{ color: colors.subtext }}>{"/"}</span>
                <Link
                  to={`/${lang}/`}
                  style={{
                    textDecoration: `none`,
                    color: colors.text,
                  }}
                >
                  {lang}
                </Link>
              </>
            )}
            {contentType && contentType !== "page" && (
              <>
                <span style={{ color: colors.subtext }}>{"/"}</span>
                <Link
                  to={`${lang !== "en" ? `/${lang}` : ""}/${contentType}/`}
                  style={{
                    textDecoration: `none`,
                    color: colors.text,
                  }}
                >
                  {contentType}
                </Link>
              </>
            )}
          </h1>
        </div>
      </div>
    </header>
  )
}

export default Header
