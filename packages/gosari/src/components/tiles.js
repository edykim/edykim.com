import styled from "styled-components"

export const Tiles = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-left: -10px;
  margin-right: -10px;
  & > * {
    margin-left: 10px;
    margin-right: 10px;
    width: 40%;
    flex-grow: 1;
  }
  @media (max-width: 800px) {
    display: block;
    margin-left: 0;
    margin-right: 0;
    & > * {
      width: 100%;
      display: block;
      margin-left: 0;
      mragin-right: 0;
    }
  }
`
