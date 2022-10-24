import * as React from "react"
import Content from "../components/content/styled"

import Layout from "../components/layout"
import Seo from "../components/seo"

const IndexPage = ({ location }) => (
  <Layout location={location}>
    <Seo title="Home" />
    <Content>
      <h1 style={{ fontWeight: "900", fontSize: '2.5rem', letterSpacing: -1 }}>
        Hello, I am Edward 👋
      </h1>
      <p>
        I am a software engineer who loves to make web services and useful
        tools. I enjoy building small things, taking photographs, and having a
        nice cup of cofffee. I'm currently studying computer science and living
        in San Diego, CA.
      </p>
    </Content>
  </Layout>
)

export default IndexPage
