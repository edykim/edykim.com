import React from "react"
import { Header, Footer } from "."

export class Site extends React.Component {
  render() {
    const { location, children } = this.props
    // const rootPath = `${__PATH_PREFIX__}/`
    return (
      <>
        <Header location={location} />
        <main>{children}</main>
        <Footer />
      </>
    )
  }
}
