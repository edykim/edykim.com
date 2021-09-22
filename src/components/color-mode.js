import React, { useEffect, useState } from "react"
import { Helmet } from "react-helmet"

const darkMeta = [
  {
    name: "color-scheme",
    content: "dark",
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

const ColorModeMeta = () => {
  const [colorScheme, setColorScheme] = useState(getPersistColorScheme() || "light")

  useEffect(() => {
    if (typeof window === "undefined") return

    const onChange = e => {
      const newColor = e.matches ? "dark" : "light"
      setColorScheme(newColor)
      setPersistColorScheme(newColor)
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)")

    onChange(media)
    media.addEventListener("change", onChange)

    return () => {
      media.removeEventListener("change", onChange)
    }
  }, [setColorScheme])

  return <Helmet meta={colorScheme === "dark" ? darkMeta : lightMeta} />
}

export default ColorModeMeta
