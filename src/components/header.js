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

const HeaderContainer = styled.div`
  margin: 0 auto;
  max-width: ${layouts.content};
  padding: 1.45rem 1.0875rem;

  @media (min-width: 1024px) {
    margin-top: 3rem;
    margin-bottom: 2rem;
  }
`

const contentTypeTranslation = {
  ko: {
    post: "게시글",
    micro: "조각글",
    note: "노트",
  },
}

const Header = ({ siteTitle, item }) => {
  const lang = item?.frontmatter.lang
  let contentType = item?.frontmatter.type

  if (contentType === "archive" || contentType === "showcase") {
    contentType = null
  }

  return (
    <header>
      <HeaderContainer>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 20,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <FaceLink to="/">
              <Face
                className={"link"}
                style={{ width: 48, marginRight: 5, fill: colors.text }}
                alt={siteTitle}
              />
              <WowFace
                className={"active"}
                style={{ width: 48, marginRight: 5, fill: colors.text }}
                alt={siteTitle}
              />
            </FaceLink>
            <div>
              {lang && lang !== "en" && (
                <>
                  <span
                    style={{
                      color: colors.text,
                      fontWeight: "normal",
                      margin: "0 0.5rem",
                    }}
                  >
                    {"/"}
                  </span>
                  <Link
                    to={`/${lang}/`}
                    style={{
                      fontWeight: "normal",
                      textDecoration: `none`,
                      color: colors.text,
                      textTransform: "capitalize",
                    }}
                  >
                    {lang === "ko" ? "한국어" : lang}
                  </Link>
                </>
              )}
              {contentType && contentType !== "page" && (
                <>
                  <span
                    style={{
                      color: colors.text,
                      fontWeight: "normal",
                      margin: "0 0.5rem",
                    }}
                  >
                    {"/"}
                  </span>
                  <Link
                    to={`${lang !== "en" ? `/${lang}` : ""}/${contentType}/`}
                    style={{
                      fontWeight: "normal",
                      textDecoration: `none`,
                      color: colors.text,
                      textTransform: "capitalize",
                    }}
                  >
                    {contentTypeTranslation[lang] &&
                    contentTypeTranslation[lang][contentType]
                      ? contentTypeTranslation[lang][contentType]
                      : contentType}
                  </Link>
                </>
              )}
            </div>
          </h1>
        </div>
      </HeaderContainer>
    </header>
  )
}

export default Header
