import styled, { css } from "styled-components"
import { layouts } from "styles/schema"

const Container = styled.div`
  max-width: ${layouts.content};
  margin: 0 auto;
  padding: ${layouts.innerPadding} ${layouts.sidePadding} 0;
  ${props =>
    props.overwrap &&
    css`
      margin-bottom: 0;
      padding-bottom: 0;

      > :last-child {
        position: relative;
        top: 60px;
        margin-top: -20px;
      }
    `}
`

export default Container
