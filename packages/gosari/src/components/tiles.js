import styled from "styled-components"

export const Tiles = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin-left: -10px;
  margin-right: -10px;
  @media (max-width: 800px) {
    grid-template-columns: minmax(0, 1fr);
    margin-left: 0;
    margin-right: 0;
  }
`
