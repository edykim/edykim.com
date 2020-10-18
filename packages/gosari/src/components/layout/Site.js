import React from "react"
import { Header, Footer } from "."
import "../../../content/assets/_global.css"

export class Site extends React.Component {
  render() {
    const { location, linkTo, linkTitle, children } = this.props
    return (
      <>
        <Header location={location} linkTo={linkTo} linkTitle={linkTitle} />
        <main>{children}</main>
        <Footer />
      </>
    )
  }
}
