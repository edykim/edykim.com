import * as React from "react"

import Layout, { ContentContainer } from "../components/layout"
import Seo from "../components/seo"

const IndexPage = ({ location }) => (
  <Layout location={location}>
    <Seo title="Home" />
    <ContentContainer>
      <h1 style={{ fontWeight: "900", fontSize: 42, letterSpacing: -1 }}>
        Hello, I am Edward 👋
      </h1>
      <p>
        I am a software engineer who loves to make web services and useful
        tools. I enjoy building small things, taking photographs, and having a
        nice cup of cofffee. I'm currently studying computer science and living
        in Riverside, CA.
      </p>
    </ContentContainer>
  </Layout>
)

export default IndexPage
