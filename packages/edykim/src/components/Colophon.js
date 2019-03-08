import React from 'react'

import DateTime from './DateTime'
import FromHistory from './FromHistory'
import TaxonomyLine from './TaxonomyLine'
import ListButton from './ListButton'

import './Colophon.css'

const Colophon = ({ content }) => (
  <div className={`colophon`}>
    <FromHistory history={content.frontmatter.history} />

    <DateTime at={content.frontmatter.date} />
    <TaxonomyLine post={content} />

    <div style={{ marginTop: '3rem' }}>
      <ListButton post={content} />
    </div>
  </div>
)

export default Colophon
