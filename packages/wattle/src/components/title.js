import styled from "styled-components"
import { Link } from "gatsby"

export const Title = styled.h1`
  color: var(--site-color-text);
  font-size: 4rem;
  line-height: 1;
  a {
    color: var(--site-color-text);
    text-decoration: none;
  }

  @media screen and (max-width: 1024px) {
    font-size: 2rem;
  }
`

export const TitleLink = styled(Link)`
  color: var(--site-color-text);
  text-decoration: none;
`
