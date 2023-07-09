import styled from "styled-components"

const Subject = styled.header`
  margin: 1rem var(--site-margin);
  width: var(--site-width);
  padding: 3rem 0 2rem;
  color: var(--color-title);
  @media screen and (max-width: 860px) {
    padding: 0rem 0 0rem;
  }
  h1 {
    word-break: keep-all;
    color: inherit;
    font-size: 1.5rem;
  }
  h1 a {
    color: inherit;
    text-decoration: none;
  }
`

export const Headline = styled.p`
  font-size: 0.9rem;
  color: var(--color-subtitle);
  margin-top: -1rem;
`
export const Date = styled.p`
  color: var(--color-date);
  font-size: 0.9rem;
`

export default Subject
