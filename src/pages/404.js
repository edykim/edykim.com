import { Link } from "gatsby"
import * as React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Content from "../components/content"

const NotFoundPage = () => (
  <Layout>
    <Seo title="404: Not found" />
    <Content style={{ textAlign: "center" }}>
      <h1 class="skip">Page not found</h1>
      <p>Sorry 😔😔😔 we couldn't find what you were looking for.</p>
      <p>
        <Link to={`/`}>Go to homepage</Link>
      </p>
    </Content>
  </Layout>
)

export default NotFoundPage
