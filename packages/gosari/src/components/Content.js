import React from "react"
import styled from "styled-components"
import { color, layout } from "styles/schema"

const StyledContent = styled.div`
  color: ${color.plain};
  font-size: 0.8rem;
  line-height: 1.72;
  margin: 2rem auto;
  font-weight: 400;

  [id] {
    scroll-margin-top: 2rem;
  }

  @media (max-width: 800px) {
    margin-top: 1rem;
  }
  li > a,
  em > a,
  i > a,
  p > a,
  h1 > a:not(.title-anchor),
  h2 > a:not(.title-anchor),
  h3 > a:not(.title-anchor),
  h4 > a:not(.title-anchor),
  h5 > a:not(.title-anchor),
  h6 > a:not(.title-anchor) {
    color: ${color.primary};
    text-decoration: none;
    border-bottom: 2px solid ${color.underline};
    > code {
      border-bottom: 2px solid ${color.underline};
    }
    :hover {
      opacity: 0.8;
    }
  }

  > iframe {
    padding: 0;
    max-width: ${layout.wide};
    margin-left: auto;
    margin-right: auto;
    display: block;
  }

  > * {
    padding-left: ${layout.sidePadding};
    padding-right: ${layout.sidePadding};
  }

  > ul,
  > ol {
    padding-left: 3rem;
    padding-right: 2rem;
  }

  ul p {
    margin: 0;
  }

  img {
    max-width: 100%;
  }
  > img {
    text-indent: 0;
    padding: 0;
    margin-left: auto;
    margin-right: auto;
    display: block;
  }
  .aligncenter,
  .instagram-media {
    margin-left: auto !important;
    margin-right: auto !important;
  }
  > div {
    max-width: ${layout.wide};
    margin-left: auto !important;
    margin-right: auto !important;
  }

  h1:hover .title-anchor:after,
  h2:hover .title-anchor:after,
  h3:hover .title-anchor:after,
  h4:hover .title-anchor:after,
  h5:hover .title-anchor:after,
  h6:hover .title-anchor:after,
  h1 .title-anchor:focus:after,
  h2 .title-anchor:focus:after,
  h3 .title-anchor:focus:after,
  h4 .title-anchor:focus:after,
  h5 .title-anchor:focus:after,
  h6 .title-anchor:focus:after {
    margin-left: 6px;
    font-size: 14px;
    vertical-align: middle;
    color: #333333;
    font-weight: 400;
    content: "제목 주소";
  }
  .title-anchor {
    margin: 0;
    padding: 0;
    padding-left: ${layout.sidePadding};
    float: none;
    position: absolute;
    left: 1em;
    right: 0;
    margin-top: -1.4em;
    text-indent: 0;
    text-decoration: none;
    transform: translateX(0);
    svg {
      vertical-align: middle;
    }
  }
  h1,
  h2,
  h3,
  h4,
  h5 {
    position: relative;
    text-indent: 1em;
    word-break: keep-all;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  > p,
  > ul,
  > ol,
  > li, // why?
  .footnotes {
    box-sizing: border-box;
    max-width: ${layout.medium};
    margin-left: auto;
    margin-right: auto;
  }
  > blockquote {
    box-sizing: border-box;
    max-width: ${layout.narrow};
    margin-left: auto;
    margin-right: auto;
  }
  .gatsby-highlight {
    max-width: ${layout.wide};
    margin: 40px auto;
  }
  .translation-note {
    box-sizing: border-box;
    max-width: ${layout.narrow};
    margin: 40px auto;
  }
  p {
    text-indent: 0.5em;
    margin-top: 1.4em;
    margin-bottom: 1.4em;
  }
  p,
  p * {
    word-break: break-all;
  }
  h1 {
    font-size: 1.5em;
    font-weight: 700;
    margin-top: 2.8em;
    margin-bottom: 1.4em;
  }
  h2 {
    margin-top: 2.4em;
    font-size: 1.3em;
    font-weight: 700;
    margin-bottom: 1.3em;
  }
  h3 {
    margin-top: 2.2em;
    font-size: 1.1em;
    font-weight: 700;
    margin-bottom: 1.1em;
  }
  h4,
  h5 {
    margin-top: 2em;
    font-size: 1em;
    margin-bottom: 1em;
  }
  h1 {
    counter-increment: h1counter;
    counter-reset: h2counter;
  }
  h2 {
    counter-increment: h2counter;
    counter-reset: h3counter;
  }
  h3 {
    counter-increment: h3counter;
    counter-reset: h4counter;
  }
  h4 {
    counter-increment: h4counter;
    counter-reset: h5counter;
  }
  h2:before {
    content: counter(h2counter) ". ";
  }
  h3:before {
    content: counter(h2counter) "." counter(h3counter) ". ";
  }
  h4:before {
    content: counter(h2counter) "." counter(h3counter) "." counter(h4counter)
      ". ";
  }
  h1:not(.skip) :before {
    content: counter(h1counter) ". ";
  }
  h1:not(.skip) ~ h2:before {
    content: counter(h1counter) "." counter(h2counter) ". ";
  }
  h1:not(.skip) ~ h3:before {
    content: counter(h1counter) "." counter(h2counter) "." counter(h3counter)
      ". ";
  }
  h1:not(.skip) ~ h4:before {
    content: counter(h1counter) "." counter(h2counter) "." counter(h3counter)
      "." counter(h4counter) ". ";
  }
  hr + h1:not(.skip):before {
    content: "";
  }
  hr + h1:not(.skip) ~ h2:before {
    content: counter(h2counter) ". ";
  }
  hr + h1:not(.skip) ~ h3:before {
    content: counter(h2counter) "." counter(h3counter) ". ";
  }
  hr + h1:not(.skip) ~ h4:before {
    content: counter(h2counter) "." counter(h3counter) "." counter(h4counter)
      ". ";
  }
  hr {
    height: 0;
    border: 0;
    border-bottom: 4px double ${color.separator};
    max-width: 20rem;
    margin: 4rem auto 2rem;

    @media (max-width: 750px) {
      margin-top: 2rem;
      margin-bottom: 1rem;
      width: 200px;
    }
  }
  blockquote {
    font-size: 0.95em;
    line-height: 1.68;
    padding: 20px;
    background: #f0f0f0;
    margin-top: 40px;
    margin-bottom: 40px;
    * {
      margin-top: 0;
      margin-bottom: 0;
    }
    * + * {
      margin-top: 1em;
    }
    @media (max-width: 600px) {
      margin-left: 0;
      margin-right: 0;
      max-width: none;
    }
  }

  .translation-note {
    font-size: 0.95em;
    background: ${color.note};
    margin: 2rem auto;
    padding: 1px 20px;
  }

  .translation-note p:nth-of-type(1):before {
    content: "📝";
  }

  table {
    border-collapse: collapse;
    width: 100%;
    max-width: ${layout.narrow};
    margin: 3rem auto;
    border: 1px solid #ddd;
  }

  table th {
    background: #f0f0f0;
  }

  table th,
  table td {
    border: 1px solid #ddd;
    padding: 0.5rem 1rem;
  }

  table tr:nth-of-type(2n) td {
    background: #fafafa;
  }

  .twitter-tweet {
    margin-left: auto;
    margin-right: auto;
  }
  figure {
    margin: 3rem auto;
    text-align: center;
    text-indent: 0;
    &.wide {
      max-width: ${layout.full};
    }
    * {
      text-indent: 0;
    }
    img {
      max-width: 100%;
      height: auto;
      @media (max-width: 600px) {
        max-width: none;
        width: 100%;
      }
    }
    figcaption {
      font-size: 0.8em;
      color: ${color.caption};
    }

    @media (max-width: 600px) {
      padding-left: 0;
      padding-right: 0;
      max-width: none !important;
      width: 100%;
    }
  }
`

export class Content extends React.Component {
  render() {
    const { html, text, children } = this.props
    return html ? (
      <StyledContent
        className={`content`}
        dangerouslySetInnerHTML={{ __html: html }}
      ></StyledContent>
    ) : (
      <StyledContent className={`content`}>{children || text}</StyledContent>
    )
  }
}
