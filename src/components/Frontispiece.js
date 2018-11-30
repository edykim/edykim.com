import React from 'react'
import { Link } from 'gatsby'

import Headline from './Headline'
import './Frontispiece.css'

const Frontispiece = ({ frontmatter, url }) => (
  <div className={`frontispiece`}>
      <h1>
        { url
          ? <Link to={url}>{frontmatter.title}</Link>
          : frontmatter.title }
      </h1>

    <Headline line={frontmatter.headline || []} />
  </div>
)

export default Frontispiece
