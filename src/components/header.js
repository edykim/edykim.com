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

  > * {
    width: 64px;
    margin-right: 5px;
    fill: ${colors.text};
    @media (max-width: ${layouts.wide}) {
      width: 48px;
    }
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
  margin: 0rem auto 0.5rem;
  max-width: ${layouts.content};
  padding: 1.45rem 1.0875rem;

  @media (min-width: ${layouts.wide}) {
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
              fontSize: "1rem",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <FaceLink to="/">
              <Face className={"link"} alt={siteTitle} />
              <WowFace className={"active"} alt={siteTitle} />
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
