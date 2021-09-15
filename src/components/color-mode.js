import React from "react"
import { Helmet } from "react-helmet"

const ColorModeMeta = () => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? (
    <Helmet
      meta={[
        {
          name: "color-scheme",
          content: "dark",
        },
      ]}
    />
  ) : null
}

export default ColorModeMeta
