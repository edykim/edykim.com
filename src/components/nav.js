import styled from "styled-components"
import { colors, layouts } from "~/constraint"

export const PostNav = styled.nav`
  max-width: ${layouts.wide};
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
  }
`
