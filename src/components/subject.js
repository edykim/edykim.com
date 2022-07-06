import styled from "styled-components"
import { colors, layouts } from "~/constraint"

const Subject = styled.header`
  margin: 1rem var(--site-margin);
  max-width: var(--site-max-width);
  padding: 3rem 0 2rem;
  h1 {
    word-break: keep-all;
    color: ${colors.text};
  }
  h1 a {
    color: ${colors.text};
    text-decoration: none;
  }
`

export const Headline = styled.p`
  font-size: 0.9rem;
  color: ${colors.subtext};
  margin-top: -1rem;
`
export const Date = styled.p`
  color: ${colors.subtext};
  font-size: 0.9rem;
`

export default Subject
