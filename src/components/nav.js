import styled from "styled-components"

export const PostNav = styled.nav`
  margin: 2rem var(--site-margin);
  width: var(--site-width);
  
  a {
    color: inherit;
  }
  li {
    display: inline-block;
    margin: 0 0.3rem;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0 -0.3rem;
  }
  .disabled {
    opacity: 0.5;
  }
  @media screen and (max-width: 720px) {
    ul {
      display: block !important;
    }
    > ul a {
      display: inline-block;
      padding: 0.5rem 0;
    }
  }
`
