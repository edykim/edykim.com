import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Image from "../components/image"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" keywords={[`edykim`]} />
    <h1>
      Howdy{" "}
      <span role="img" aria-label="wave hand">
        👋
      </span>
    </h1>
    <p>
      Hey! I'm Edward. I'm passionate about solving complexities and problems
      through development with a strong background in communication and software
      engineering.
    </p>
    <ul>
      <li>
        <a href="mailto:edward@edykim.com?subject=Hello">edward@edykim.com</a>
      </li>
      <li>
        <a href="https://twitter.com/heyedykim">twitter (@heyedykim)</a>
      </li>
      <li>
        <a href="https://github.com/edykim">github (@edykim)</a>
      </li>
      <li>
        <a href="https://www.linkedin.com/in/edwardykim/">Linkedin</a>
      </li>
      <li>
        <a href="https://edykim.com/ko/">한국어 (Korean)</a>
      </li>
    </ul>
    <hr style={{ width: "30%", margin: "30px auto" }} />
    <Image
      style={{
        border: "8px solid #6700ee",
        maxWidth: 100,
        borderRadius: "100%",
      }}
    />
    <h1>Edward Kim</h1>
    <p>
      I'm an open web developer who loves focusing on problems and creating
      quick prototypes. I'm excited about web technology, software architecture
      and community.
    </p>
    <h2>Me Now</h2>
    <ul>
      <li>
        Love to talk about ECMAScript, microservices, serverless architecture
      </li>
      <li>Comfortable with Python, PHP, HTML/CSS, and C#</li>
      <li>Passionate about solving complexities and problems</li>
      <li>
        Community Manager at <a href="http://weirdx.io">weirdx.io</a>
      </li>
    </ul>
    <h2>Me Previously</h2>
    <ul>
      <li>Software engineer at Swinburne</li>
      <li>Web/Integration developer at Kobe Creations</li>
      <li>Web developer at Nine Communications</li>
    </ul>
    <p>
      More details are{" "}
      <a href="https://www.linkedin.com/in/edwardykim/">here</a>.
    </p>
    <h2>My Name</h2>
    <p>
      My Korean name is Yong Gyun Kim (김용균) and{" "}
      <a href="https://translate.google.com/translate_tts?ie=UTF-8&amp;q=%EA%B9%80%EC%9A%A9%EA%B7%A0&amp;tl=ko&amp;total=1&amp;idx=0&amp;textlen=3&amp;tk=799460.701964&amp;client=t&amp;prev=input">
        Google speaks right way
      </a>
      . You can call me Edward!
    </p>
  </Layout>
)

export default IndexPage
