import React, { Component } from "react"
import styled from "styled-components"
import { Link } from "gatsby"
import { colors } from "~/constraint"
import PostItem from "./post-item"
import { button } from "./content"

const Wrapper = styled.div`
  margin: 2rem auto;
  ${button};
`

const Title = styled.h2`
  color: ${colors.text};
`

const PostShortList = ({ posts, title, linkTitle, link }) => (
  <Wrapper>
    <Title>{title}</Title>
    <ul style={{ listStyle: "square" }}>
      {posts.length > 0 &&
        posts.map(({ node }, index) => (
          <PostItem post={node} key={`${title}-${index}`} showYears={true} />
        ))}
    </ul>
    {linkTitle && (
      <span className={"button"}>
        <Link to={link}>{linkTitle}</Link>
      </span>
    )}
  </Wrapper>
)

export default PostShortList
