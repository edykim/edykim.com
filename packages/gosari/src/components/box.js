import React from "react"
import { Link } from "gatsby"
import styled, { css } from "styled-components"
import { darken } from "polished"

const boxStyle = css`
  display: block;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.07), 0px 0px 80px rgba(0, 0, 0, 0.04);
  border-radius: 15px;
  text-decoration: none;
  padding: 30px;
  margin: 10px 0;
  box-sizing: border-box;
  transition: background 0.3s ease-in;
  background-color: ${props => props.color || "#ffffff"};
  &:hover {
    background-color: ${props => darken(0.02, props.color || "#ffffff")};
  }
`

const StyledBox = styled.div`
  ${boxStyle};
`
const StyledLinkBox = styled(Link)`
  cursor: pointer;
  ${boxStyle};
`

export const Box = ({ color = null, style = {}, link = null, children }) => {
  if (link) {
    return (
      <StyledLinkBox to={link} style={style} color={color}>
        {children}
      </StyledLinkBox>
    )
  }

  return (
    <StyledBox style={style} color={color}>
      {children}
    </StyledBox>
  )
}
