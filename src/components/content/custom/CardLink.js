import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { colors } from "~/constraint"

const StyledLink = styled(Link)`
  min-height: 105px;
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
  &:hover,
  &:focus,
  &:active {
    background-color: #f8f8f8;
  }
`

const CardLink = ({ to, title, subtext = "" }) => {
  return (
    <StyledLink to={to} className="item-card">
      <span>{title}</span>
      {subtext}
    </StyledLink>
  )
}

export default CardLink
