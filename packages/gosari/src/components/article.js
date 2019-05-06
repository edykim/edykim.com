import React from "react"
import styled from "styled-components"

export const Content = styled.div`
  color: #333333;
  font-size: 18px;
  line-height: 1.8;
  @media (max-width: 800px) {
    font-size: 16px;
    line-height: 1.7;
  }
  @media (min-width: 1400px) {
    font-size: 20px;
  }
  a {
    color: #6700ee;
  }
  img {
    max-width: 100%;
  }
  h1,
  h2,
  h3,
  h4,
  h5 {
    color: #222222;
    line-height: 1.3;
  }

  img.aligncenter {
    display: block;
    margin: 30px auto;
  }

  h1 {
    font-weight: 900;
    font-size: 40px;
  }

  h2 {
    margin-top: 50px;
    margin-bottom: 10px;
    font-weight: 700;
    font-size: 30px;
  }

  h3 {
    margin-top: 40px;
    font-weight: 700;
    font-size: 24px;
    &:before {
      display: block;
      content: "";
      height: 5px;
      border-radius: 10px;
      background-color: #545454;
      width: 5px;
      margin-bottom: 5px;
      box-shadow: 10px 0 0 #545454, 20px 0 0 #aaa;
    }
  }

  h4 {
    font-weight: 700;
    font-size: inherit;
  }

  hr {
    height: 10px;
    border-radius: 50px;
    border: 0;
    background-color: #eeeeee;
    max-width: 130px;
    margin-left: 0;
    margin-top: 80px;
    margin-bottom: 40px;
  }

  blockquote {
    border-left: 10px solid #ddd;
    padding: 1px 20px;
    background: #fafafa;
    @media (max-width: 800px) {
      margin-left: 0;
      margin-right: 0;
    }
  }

  figure {
    margin: 70px 0;
    text-align: center;
    figcaption {
      font-size: 0.8em;
      color: #545454;
    }
  }
`

export const Title = styled.h1`
  font-size: 50px;
  font-weight: 900;
  line-height: 1.2;
  margin: 70px 0 30px;
  @media (max-width: 800px) {
    margin-top: 10px;
  }
`

export const Tagline = styled.p`
  font-size: 24px;
  color: #545454;
  margin: -20px 0 40px;
`

export const Time = ({ className, datetime, children }) => (
  <time datetime={datetime} className={className}>
    {children}
  </time>
)

export const Date = styled(Time)`
  color: #757575;
`
