import React from "react"
import { Link } from "gatsby"
import { PostNav } from "./nav"

const PostListNav = ({ pageContext }) => {
  const { currentPage, numPages } = pageContext
  const isFirst = currentPage === 1
  const isLast = currentPage === numPages
  const prevPage =
    currentPage - 1 === 1
      ? "/ko/post"
      : "/ko/post/page/" + (currentPage - 1).toString()
  const nextPage = "/ko/post/page/" + (currentPage + 1).toString()

  return (
    <PostNav>
      <span>{`${numPages} 페이지 중 ${currentPage} 페이지`}</span>
      <ul>
        <li>
          {!isFirst && (
            <Link to={prevPage} rel="prev">
              ← 이전 페이지
            </Link>
          )}
        </li>
        <li>
          {!isLast && (
            <Link to={nextPage} rel="next">
              다음 페이지 →
            </Link>
          )}
        </li>
      </ul>
    </PostNav>
  )
}

export default PostListNav
