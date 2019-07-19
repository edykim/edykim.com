import React, { Component } from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { color, layout } from "styles/schema"

const Container = styled.div`
  background-color: ${color.white};
  border: 5px solid ${color.white};
  border-radius: 20px;
  box-shadow: 0 1rem 30px rgba(0, 0, 0, 0.03);
  transition: border-color 0.1s ease-in-out;
  &:hover {
    border-color: ${color.highlight};
  }
  a {
    display: block;
    padding: ${layout.sidePadding};
    text-decoration: none;
    color: ${color.plain};
  }

  + .button-type-link {
    margin-top: 1rem;

    @media (max-width: 600px) {
      margin-top: 0;
      border-top: 1px solid ${color.separator};
    }
  }

  @media (max-width: 600px) {
    border-radius: 0;
  }
`
const Title = styled.h2`
  font-size: 1.1rem;
  margin-top: 0;
  margin-bottom: 0.5em;
  color: ${color.primary};
`
const Subtext = styled.div`
  font-size: 0.8rem;
  margin-bottom: 0.3em;
`

export class ButtonTypeLink extends Component {
  render() {
    const { linkTo, title, subtext } = this.props
    return (
      <Container className={"button-type-link"}>
        <Link to={linkTo}>
          <Title>{title}</Title>
          <Subtext>{subtext}</Subtext>
        </Link>
      </Container>
    )
  }
}

// export const BulkyButton = ({ style, link, title, subtext, color }) => {
//   return (
//     <Box color={color} style={style} link={link}>
//       <span
//         style={{
//           fontSize: 30,
//           fontWeight: 700,
//           color: "#ffffff",
//           lineHeight: 1,
//         }}
//       >
//         {title}
//       </span>

//       <span
//         style={{
//           marginTop: 5,
//           display: "block",
//           color: "rgba(255,255,255,0.8)",
//         }}
//       >
//         {subtext}
//       </span>
//     </Box>
//   )
// }
