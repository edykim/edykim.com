import styled from "styled-components"
import { colors } from "~/constraint"

const Subject = styled.header`
  margin: 1rem var(--site-margin);
  width: var(--site-width);
  padding: 3rem 0 2rem;
  @media screen and (max-width: 860px) {
    padding: 0rem 0 0rem;
  }
  h1 {
    word-break: keep-all;
    color: inherit;
  }
  h1 a {
    color: inherit;
    text-decoration: none;
  }
`

export const Headline = styled.p`
  font-size: 0.9rem;
  color: ${colors.subtext};
  @media (prefers-color-scheme: dark) {
    color: #b7a792;
  }
  margin-top: -1rem;
`
export const Date = styled.p`
  color: ${colors.subtext};
  @media (prefers-color-scheme: dark) {
    color: #b7a792;
  }
  font-size: 0.9rem;
`

export default Subject
