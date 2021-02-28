import styled from "styled-components"
import { Link } from "gatsby"

export const Title = styled.h1`
  color: var(--site-color-text);
  font-size: 1.2rem;
  line-height: 1;
  a {
    color: var(--site-color-text);
    text-decoration: none;
  }
`

export const TitleLink = styled(Link)`
  color: var(--site-color-text);
  text-decoration: none;
`
