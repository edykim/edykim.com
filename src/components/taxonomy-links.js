import * as React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import taxonomy from "../../config/taxonomy"
import { colors } from "~/constraint"

export const Container = styled.div`
  margin: 1rem -0.5rem 3rem;
  a {
    display: inline-block;
    color: ${colors.text};
    margin: 0.1rem 0.1rem;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.8rem;
    border-radius: 6px;
    background-color: ${colors.backgroundAlt};
    padding: 0.1rem 0.5rem;
    &:hover,
    &:active {
      transform: translateY(-2px);
    }
  }
  @media screen and (max-width: 750px) {
    a {
      text-align: center;
      min-width: 90px;
      margin: 0.5rem 0.1rem;
      padding: 0.5rem 1rem;
    }
  }
`

const TaxonomyLinks = () => {
  return (
    <Container>
      {taxonomy.mappedUrls.map(({ key, url }) => (
        <Link key={`taxonomy-${url}`} to={`/ko/tag/${url}/`}>
          {`${key}`}
        </Link>
      ))}
    </Container>
  )
}

export default TaxonomyLinks
