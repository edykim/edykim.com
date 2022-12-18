import styled, { css } from "styled-components"

export const button = css`
`

const Content = styled.div`
  margin: 1rem var(--site-margin);
  hr {
    margin-left: var(--site-container-margin);
    margin-right: var(--site-container-margin);
    border: 0;
    border-bottom: 1px solid var(--color-separator);
    width: var(--site-width);
  }
  > p,
  > h1,
  > h2,
  > h3,
  > h4,
  > h5,
  > ul,
  > ol,
  > div:not(.gatsby-highlight, .columns),
  > table {
    width: var(--site-width);
    margin-left: var(--site-container-margin);
    margin-right: var(--site-container-margin);
  }
  > img,
  > p > img {
    max-width: 100%;
    margin-left: var(--site-container-margin);
    margin-right: var(--site-container-margin);
    display: block;
  }
  blockquote {
    max-width: var(--site-narrow-max-width);
    border-left: 5px solid var(--color-separator);
    padding-left: 1rem;
    margin-left: var(--site-blockquote-margin);
    margin-right: var(--site-blockquote-margin);
  }
  .gatsby-highlight {
    width: var(--site-code-width);
    margin-left: var(--site-container-margin);
    margin-right: var(--site-container-margin);
  }
`

export default Content
