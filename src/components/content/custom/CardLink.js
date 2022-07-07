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
  color: inherit;
  font-size: 0.8rem;
  span {
    font-size: 1rem;
    display: block;
    color: inherit;
    font-weight: 600;
  }
  background-color: rgba(255, 255, 255, 0.3);
  &:hover,
  &:focus,
  &:active {
    background-color: rgba(255, 255, 255, 0.5) !important;
  }
  @media (prefers-color-scheme: dark) {
    border-width: 0;
    background-color: rgba(0, 0, 0, 0.1);
    &:hover,
    &:focus,
    &:active {
      background-color: rgba(0, 0, 0, 0.2) !important;
    }
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
