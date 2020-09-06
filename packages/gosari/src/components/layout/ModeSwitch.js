import React, { useState, useLayoutEffect } from "react"
import styled from "styled-components"
import { colors, layouts, fonts } from "styles/schema"

const Button = styled.button`
  appearance: none;
  background: transparent;
  padding: 0;
  margin: 0;
  border: 0;
  cursor: pointer;
  position: relative;
  outline: none;
  .label {
    left: 42px;
    width: 90px;
    line-height: 20px;
    text-align: left;
    opacity: 0;
    position: absolute;
    transition: opacity 0.3s ease;
    color: ${colors.text};
  }
  &:active .label,
  &:focus .label,
  &:hover .label {
    opacity: 1;
  }
  .box {
    width: 34px;
    height: 20px;
    border: 1px solid ${colors.text};
    padding: 3px;
    position: relative;
    z-index: 10;
  }

  &:hover .box,
  &:active .box,
  &:focus .box {
  }

  .switcher {
    width: 12px;
    height: 12px;
    background-color: ${colors.text};
  }
  .switcher.loaded {
    background-color: ${colors.text};
  }
  .switcher.on {
    transform: translateX(14px);
  }
  .switcher.off {
    transform: translateX(0px);
  }
`

const ModeSwitch = ({ isCollapsed = true }) => {
  const [darkMode, setDarkMode] = useState(null)
  const [loaded, setLoaded] = useState(false)
  useLayoutEffect(() => {
    if (darkMode !== null) {
      localStorage.setItem("theme", darkMode ? "dark" : "light")
    } else {
      setDarkMode(
        typeof localStorage !== "undefined" && localStorage.getItem("theme")
          ? localStorage.getItem("theme") === "dark"
            ? true
            : false
          : typeof window !== "undefined"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
          : false
      )
      setLoaded(true)
    }
  }, [darkMode])

  return (
    <Button
      className={`${isCollapsed ? "collapsed" : ""}`}
      onClick={() => {
        document.documentElement.setAttribute(
          "data-theme",
          darkMode ? "light" : "dark"
        )
        setDarkMode(!darkMode)
      }}
    >
      <span className="label">{`${
        !darkMode ? "어둡게 보기" : "밝게 보기"
      }`}</span>
      <div className="box">
        <div
          className={`switcher ${!darkMode ? "on" : "off"} ${loaded &&
            "loaded"}`}
        ></div>
      </div>
      {console.log(darkMode, loaded)}
    </Button>
  )
}

export default ModeSwitch
