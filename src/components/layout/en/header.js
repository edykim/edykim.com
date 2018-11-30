import React from 'react'
import { Link } from 'gatsby'

const navStyle = {
  color: '#e7d7ff',
  boxShadow: 'none',
}

const Header = ({ siteTitle }) => (
  <div
    style={{
      background: '#5400da',
      marginBottom: '1.45rem',
    }}
  >
    <div
      style={{
        margin: '0 auto',
        maxWidth: 760,
        padding: '1.45rem 1.0875rem',
      }}
    >
      <h1 style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: 'white',
            textDecoration: 'none',
            boxShadow: 'none',
          }}
        >
          {siteTitle}
        </Link>
      </h1>
      <div style={{ marginTop: '0.6rem' }}>
        <Link to={`/about/`} style={navStyle}>
          About
        </Link>
        <Link to={`/ko/`} style={{ marginLeft: '0.5rem', ...navStyle }}>
          한국어
        </Link>
      </div>
    </div>
  </div>
)

export default Header
