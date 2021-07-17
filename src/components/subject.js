import styled from "styled-components"
import { colors, layouts } from "~/constraint"

const Subject = styled.header`
  max-width: ${layouts.content};
  margin: 0 auto;
  padding-left: ${layouts.sidePadding};
  padding-right: ${layouts.sidePadding};
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
  color: ${colors.text};
`

export default Subject
