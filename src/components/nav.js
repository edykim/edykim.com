import styled from "styled-components"

export const PostNav = styled.nav`
  margin: 0 var(--site-margin);
  a {
    color: inherit;
  }
  ul {
    list-style: none;
    padding: 0;
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
