import * as React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import taxonomy from "../../config/taxonomy"
import { colors, fonts } from "~/constraint"

const Container = styled.div`
  margin: 1rem -0.5rem 3rem;
  a {
    display: inline-block;
    color: ${colors.text};
    margin: 0.1rem 0.5rem;
  }
`

const TaxonomyLinks = () => {
  return (
    <Container>
      {taxonomy.mappedUrls.map(({ key, url }) => (
        <Link key={`taxonomy-${url}`} to={`/ko/tag/${url}/`}>
          {`#${key}`}
        </Link>
      ))}
    </Container>
  )
}

export default TaxonomyLinks
