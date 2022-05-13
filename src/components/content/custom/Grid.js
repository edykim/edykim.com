import React from "react"
import styled from "styled-components"
import { layouts } from "~/constraint"

const Container = styled.div`
  max-width: ${layouts.content} !important;
  display: grid;
  grid-auto-rows: 1fr;
  grid-column-gap: 5px;
  grid-row-gap: 5px;
  grid-template-columns: ${props => `repeat(${props.cols}, 1fr)`};
  @media (max-width: 600px) {
    grid-template-columns: 1fr !important;
    .item-card {
      min-height: auto;
    }
  }
}
`

const Grid = ({ cols, children }) => {
  return <Container cols={cols}>{children}</Container>
}

export default Grid
