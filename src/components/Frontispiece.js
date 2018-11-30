import React from 'react'

import Headline from './Headline'
import './Frontispiece.css'

const Frontispiece = ({ frontmatter }) => (
  <div className={`frontispiece`}>
    <h1>{frontmatter.title}</h1>
    <Headline line={frontmatter.headline || []} />
  </div>
)

export default Frontispiece
