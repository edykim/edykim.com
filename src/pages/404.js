import React from 'react'
import Layout from '../components/layout'

const NotFoundPage = () => (
  <Layout>
    <h1>NOT FOUND</h1>
    <p>You just hit a page that doesn&#39;t exist...</p>

    <p>
      What did you looking for? Let's google it!
    </p>

    <form action="http://www.google.com/search" method="get">
      <input type="text" name="q" />
      <input type="submit" value="search" />
    </form>
  </Layout>
)

export default NotFoundPage
