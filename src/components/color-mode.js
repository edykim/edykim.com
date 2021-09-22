import React, { useEffect, useState } from "react"
import { Helmet } from "react-helmet"

const COLOR_SCHEME_DARK = "dark"
const COLOR_SCHEME_LIGHT = "light"
const PREFERS_COLOR_SCHEME = `(prefers-color-scheme: ${COLOR_SCHEME_DARK})`

const darkMeta = [
  {
    name: "color-scheme",
    content: COLOR_SCHEME_DARK,
  },
  {
    name: "theme-color",
    content: "#121212",
  },
]

const lightMeta = [{ name: "theme-color", content: "#ffffff" }]

const getPersistColorScheme = () => {
  return (
    typeof localStorage !== "undefined" && localStorage.getItem("color-scheme")
  )
}

const setPersistColorScheme = colorScheme => {
  return (
    typeof localStorage !== "undefined" &&
    localStorage.setItem("color-scheme", colorScheme)
  )
}

const getSystemColorScheme = () => {
  if (typeof window === "undefined") return
  return window.matchMedia(PREFERS_COLOR_SCHEME).matches
    ? COLOR_SCHEME_DARK
    : COLOR_SCHEME_LIGHT
}

const ColorModeMeta = () => {
  const [colorScheme, setColorScheme] = useState(
    getPersistColorScheme() || getSystemColorScheme() || COLOR_SCHEME_LIGHT
  )

  useEffect(() => {
    if (typeof window === "undefined") return

    const onChange = e => {
      const newColor = e.matches ? COLOR_SCHEME_DARK : COLOR_SCHEME_LIGHT
      setColorScheme(newColor)
      setPersistColorScheme(newColor)
    }

    const media = window.matchMedia(PREFERS_COLOR_SCHEME)

    onChange(media)
    media.addEventListener("change", onChange)

    return () => {
      media.removeEventListener("change", onChange)
    }
  }, [setColorScheme])

  return (
    <Helmet meta={colorScheme === COLOR_SCHEME_DARK ? darkMeta : lightMeta} />
  )
}

export default ColorModeMeta
