import styled, { css } from "styled-components"
import { colors } from "~/constraint"

export const button = css`
`

const Content = styled.div`
  margin: 1rem var(--site-margin);
  hr {
    margin-left: 0;
    margin-right: 0;
    border: 0;
    border-bottom: 1px solid #ddd;
    max-width: var(--site-max-width);
  }
  > p,
  > h1,
  > h2,
  > h3,
  > h4,
  > h5,
  > ul,
  > ol,
  > div:not(.gatsby-highlight),
  > table {
    max-width: var(--site-max-width);
  }
  > img,
  > p > img {
    max-width: 100%;
  }
  blockquote {
    max-width: var(--site-narrow-max-width);
    border-left: 5px solid #ddbead;
    padding-left: 1rem;
    margin-left: 1rem;
  }
  .gatsby-highlight {
    max-width: var(--site-max-width);
  }
`

export default Content
