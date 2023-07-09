import React from "react"
import { Link } from "gatsby"
import { PostNav } from "./nav"

const PostListNav = ({ pageContext }) => {
  const { currentPage, numPages, taxonomySlug = null } = pageContext
  const isFirst = currentPage === 1
  const isLast = currentPage === numPages
  const taxSlug = taxonomySlug ? `/tag/${taxonomySlug}` : '';
  const prevPage =
    currentPage - 1 === 1
      ? `/ko/post${taxSlug}`
      : `/ko/post${taxSlug}/page/` + (currentPage - 1).toString()
  const nextPage = `/ko/post${taxSlug}/page/` + (currentPage + 1).toString()

  return (
    <PostNav>
      {numPages > 1 ? <span>{`${numPages} 페이지 중 ${currentPage} 페이지`}</span> : null}
      <ul className={'horizontal'}>
        <li>
          {!isFirst ? (
            <Link to={prevPage} rel="prev">
              ← 이전 페이지
            </Link>
          ): <span className={'disabled'}>← 이전 페이지</span>}
        </li>
        {taxonomySlug && <li><Link to={`/ko${taxSlug}`}>게시글 목록</Link></li>}
        <li>
          {!isLast ? (
            <Link to={nextPage} rel="next">
              다음 페이지 →
            </Link>
          ): <span className={'disabled'}>다음 페이지 →</span>}
        </li>
      </ul>
    </PostNav>
  )
}

export default PostListNav
