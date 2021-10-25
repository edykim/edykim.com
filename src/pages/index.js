import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"

import Layout, { HeroContainer, ContentContainer } from "../components/layout"
import Seo from "../components/seo"

const IndexPage = () => (
  <Layout>
    <Seo title="Home" />

    <HeroContainer>
      <figure>
        <StaticImage
          src="../images/me.jpg"
          width={1140}
          aspectRatio={2}
          quality={95}
          formats={["auto", "webp", "avif"]}
          transformOptions={{ cropFocus: "attention" }}
          alt="Edward"
        />
        <figcaption>When I visited UT Austin</figcaption>
      </figure>
    </HeroContainer>
    <ContentContainer>
      <h1>Hello, I am Edward.</h1>
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
