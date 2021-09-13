import styled from "styled-components"
import { colors, layouts } from "~/constraint"

export const PostNav = styled.nav`
  max-width: ${layouts.narrow};
  margin: 0 auto;
  a {
    color: ${colors.primary};
  }
  ul {
    margin: 0 1rem;
  }
  @media screen and (max-width: 720px) {
    ul {
      display: block !important;
    }
    a {
      display: inline-block;
      padding: 0.5rem 0;
    }
  }
`
