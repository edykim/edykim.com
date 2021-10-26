import * as React from "react"
import { Link } from "gatsby"
import styled from 'styled-components'
import taxonomy from "../../config/taxonomy"

const Container = styled.div`
margin: 0 -0.5rem;
a {
    display: inline-block;
    color: #000000;
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
