import React from "react"
import styled from "styled-components"
import { Link } from "gatsby"
import { colors, fonts, layouts } from "styles/schema"
import taxonomyConfig from "../../config/taxonomy"

const Wrapper = styled.div`
  max-width: ${layouts.content};
  margin: 0 auto 2rem;
`

const Container = styled.div`
  padding: 0 ${layouts.sidePadding};
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  @media screen and (max-width: 900px) {
    display: block;
  }
`

const CategoryLink = styled(Link)`
  min-width: 25%;
  color: ${colors.primary};
  font-size: ${fonts.title};
  text-decoration: none;
  margin: 10px;
  small {
    color: ${colors.subtext};
  }
  span {
    text-decoration: underline;
  }

  @media screen and (max-width: 900px) {
    display: block;
    min-width: 0;
  }
`

export const CategoryList = ({ summary }) => {
  const { mappedUrls } = taxonomyConfig
  return (
    <Wrapper>
      <Container>
        {mappedUrls.map(({ key, url }) => (
          <CategoryLink key={`category-${key}`} to={`/category/${url}/`}>
            <span>{`${key}`}</span> <small>{`(${summary[key]})`}</small>
          </CategoryLink>
        ))}
      </Container>
    </Wrapper>
  )
}
