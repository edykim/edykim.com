import React from "react"
import { Header, HeroHeader, Footer } from "."

export class Site extends React.Component {
  render() {
    const { hero = false, location, children } = this.props
    return (
      <>
        {hero ? (
          <HeroHeader location={location} />
        ) : (
          <Header location={location} />
        )}
        <main>{children}</main>
        <Footer />
      </>
    )
  }
}
