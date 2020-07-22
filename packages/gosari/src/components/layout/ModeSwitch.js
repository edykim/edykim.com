import React, { useState, useEffect } from "react"
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
    right: 60px;
    width: 150px;
    text-align: right;
    line-height: 30px;
    opacity: 0;
    position: absolute;
    transition: opacity 0.3s ease;
    color: ${colors.text};
  }
  @media screen and (max-width: 900px) {
    &.collapsed .label {
      right: 0px;
      top: -35px;
    }
  }
  &:active .label,
  &:focus .label,
  &:hover .label {
    opacity: 1;
  }
  .box {
    width: 50px;
    height: 30px;
    background-color: ${colors.backgroundAlt};
    border: 1px solid ${colors.subtext};
    border-radius: 100px;
    padding: 3px;
    position: relative;
    z-index: 10;
  }

  &:hover .box,
  &:active .box,
  &:focus .box {
    background-color: ${colors.highlight};
    border-color: ${colors.primary};
    box-shadow: 0 0 8px ${colors.primary};
  }

  .switcher {
    width: 22px;
    height: 22px;
    border-radius: 100px;
    background-color: ${colors.primary};
    transition: transform 0.3s ease;
  }
  .switcher.on {
    transform: translateX(20px);
  }
  .switcher.off {
    transform: translateX(0px);
  }
`

const ModeSwitch = ({ isCollapsed = true }) => {
  const [darkMode, setDarkMode] = useState(
    typeof localStorage !== "undefined" && localStorage.getItem("theme")
      ? localStorage.getItem("theme") === "dark"
        ? true
        : false
      : typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)")
      : false
  )
  useEffect(() => {
    if (darkMode !== null) {
      localStorage.setItem("theme", darkMode ? "dark" : "light")
    }
  }, [darkMode])
  return (
    <Button
      className={`${isCollapsed ? "collapsed" : ""}`}
      onClick={() => {
        document.documentElement.setAttribute("data-theme-transition", "true")
        document.documentElement.setAttribute(
          "data-theme",
          darkMode ? "light" : "dark"
        )
        setDarkMode(!darkMode)
      }}
    >
      <span className="label">{`${
        !darkMode ? "어두운 모드 전환하기" : "밝은 모드 전환하기"
      }`}</span>
      <div className="box">
        <div className={`switcher ${darkMode ? "on" : "off"}`}></div>
      </div>
    </Button>
  )
}

export default ModeSwitch
