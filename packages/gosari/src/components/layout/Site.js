import React from "react"
import { Header, HeroHeader, Footer } from "."

export class Site extends React.Component {
  render() {
    const { hero = false, location, linkTo, linkTitle, children } = this.props
    return (
      <>
        {hero ? (
          <HeroHeader location={location} />
        ) : (
          <Header location={location} linkTo={linkTo} linkTitle={linkTitle} />
        )}
        <main>{children}</main>
        <Footer />
      </>
    )
  }
}
