import * as React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import taxonomy from "../../config/taxonomy"
import { sanitizeUrl } from "@/plugins/edykim-plugin-taxonomy/utils"
import { colors } from "~/constraint"

export const Container = styled.div`
  margin: 1rem 0 2rem;
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
      transform: translateY(-1px);
    }

    @media (prefers-color-scheme: dark) {
      background-color: #3b3b38;
      color: #cececb;
    }
  }
  @media screen and (max-width: 860px) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    grid-gap: 0.5rem;
    a {
      text-align: center;
      padding: 0.5rem 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`

const defaultTags = taxonomy.mappedUrls.map(({ key }) => key)
const TaxonomyLinks = ({ tags = defaultTags }) => {
  return (
    <Container>
      {tags.map(tag => {
        const url = sanitizeUrl(tag, taxonomy)
        return (
          <Link key={`taxonomy-${url}`} to={`/ko/tag/${url}/`}>
            {`${tag}`}
          </Link>
        )
      })}
    </Container>
  )
}

export default TaxonomyLinks
