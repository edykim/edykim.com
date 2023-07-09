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
    color: var(--color-taxonomy-color);
    margin: 0.2rem 0.2rem;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.8rem;
    padding: 0.3rem 0.5rem;
    text-align: center;
    border: 1px solid var(--color-taxonomy-border);
    box-shadow: 1px 1px 0px var(--color-taxonomy-border);
    &:hover,
    &:active {
      transform: translate(-1px, -2px);
      box-shadow: 2px 3px 0px var(--color-taxonomy-border);
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

const defaultTags = taxonomy.mappedUrls
  .filter(tag => tag.featured)
  .map(({ key }) => key)
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
