import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { colors } from "~/constraint"

const StyledLink = styled(Link)`
  border: 1px solid #eee;
  display: block;
  text-decoration: none;
  padding: 0.5rem 0.8rem;
  border-radius: 10px;
  color: ${colors.subtext};
  font-size: 0.8rem;
  span {
    font-size: 1rem;
    display: block;
    color: ${colors.text};
    font-weight: 600;
  }
  background-color: rgba(255, 255, 255, 0.3);
  &:hover,
  &:focus,
  &:active {
    background-color: rgba(255, 255, 255, 0.5) !important;
  }
  ${props =>
    props.isinline
      ? `
  text-align: center; display: flex; align-items: center;  justify-content: center;`
      : `min-height: 105px;`}
`

const CardLink = ({ to, title, subtext = "", inline = false }) => {
  return (
    <StyledLink
      to={to}
      className="item-card"
      isinline={inline === true ? true : undefined}
    >
      <span>{title}</span>
      {subtext}
    </StyledLink>
  )
}

export default CardLink
