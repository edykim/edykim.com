import { Link } from "gatsby"
import * as React from "react"

import Layout from "../../components/layout"
import Seo from "../../components/seo"
import Content from "../../components/content"

const KoNotFoundPage = ({ location }) => (
  <Layout location={location}>
    <Seo title="404: 페이지를 찾을 수 없음" lang={"ko"} />
    <Content style={{ textAlign: "center" }}>
      <h1 class="skip">페이지가 없어요!</h1>
      <p>😔😔😔 찾은 페이지가 어디인지 알 수 없어요.</p>
      <p>
        <Link to={`/ko/`}>첫 화면으로 돌아가기</Link>
      </p>
    </Content>
  </Layout>
)

export default KoNotFoundPage
