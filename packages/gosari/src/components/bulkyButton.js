import React from "react"
import { Box } from "./box"

export const BulkyButton = ({ style, link, title, subtext, color }) => {
  return (
    <Box color={color} style={style} link={link}>
      <span
        style={{
          fontSize: 30,
          fontWeight: 900,
          color: "#ffffff",
          lineHeight: 1,
        }}
      >
        {title}
      </span>

      <span
        style={{
          marginTop: 5,
          display: "block",
          color: "rgba(255,255,255,0.8)",
        }}
      >
        {subtext}
      </span>
    </Box>
  )
}
