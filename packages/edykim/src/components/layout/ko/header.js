import React from 'react'
import { Link } from 'gatsby'

import './header.css'

const Head = ({ site }) => (
  <div className={`head`}>
    <Link to={`/ko/`}>{site.siteMetadata.title}</Link>
    <div className={`lang-selector`}>
      <Link to={`/`}>English</Link>
    </div>
  </div>
)

export default Head
