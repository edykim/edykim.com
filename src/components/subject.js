import styled from "styled-components"
import { colors } from "~/constraint"

const Subject = styled.header`
  max-width: 52rem;
  margin: 0 auto;
  padding-left: 1.0875rem;
  padding-right: 1.0875rem;
  h1 {
    word-break: keep-all;
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

export default Subject
