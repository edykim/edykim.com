import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"

const StyledLink = styled.a`
  text-decoration: none;
  display: inline-block;
  background-color: #eeeeee;
  border-radius: 50px;
  color: #6700ee;
  font-size: 14px;
  font-weight: 600;
  padding: 5px 20px;
  margin-right: 10px;
  margin-top: 10px;
  &:last-of-type {
    margin-right: 0;
  }
`

const StyledInternalLink = StyledLink.withComponent(Link)

export const InBoxLink = props => {
  if (props.to) {
    return <StyledInternalLink {...props} />
  }
  return <StyledLink {...props} />
}
