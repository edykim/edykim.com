import React from 'react'
import { Link } from 'gatsby'

import './ListButton.css'

const ListButton = ({ post }) => (
  <div style={{textAlign: 'center'}}>
    <Link
      className={`list-btn`}
      to={post.frontmatter.lang === 'en' ? '/archives/' : `/${post.frontmatter.lang}/archives/`}>
      {post.frontmatter.lang === 'ko' ? '목록으로' : 'Back to list'}
    </Link>
  </div>
)

export default ListButton
