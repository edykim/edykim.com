import styled, { css } from "styled-components"
import { colors, layouts, fonts } from "~/constraint"

const Hr = css`
  height: 0;
  border: 0;
  background-color: #ffffff;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23aaaaaa' fill-opacity='1' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
  background-position: center;
  max-width: ${layouts.tiny};
  height: 16px;
  margin: 4rem auto 4rem;

  @media (max-width: 750px) {
    margin-top: 2rem;
    margin-bottom: 1rem;
  }
`

export const button = css`
  .button {
    display: inline-block;
    + .button {
      margin-left: 10px;
    }
    a {
      font-weight: 700;
      font-size: 0.9rem;
      text-indent: 0;
      display: inline-block;
      text-decoration: none;
      color: ${colors.text};
      padding: 0.4rem 0.8rem;
      border-radius: 4px;
      border: 2px solid ${colors.text};
      &:hover,
      &:active {
        text-decoration: underline;
      }
    }
  }
`
const Content = styled.div`
  color: ${colors.text};
  font-size: ${fonts.body};
  line-height: 1.6;
  margin: 2rem auto;
  font-weight: 400;

  [id] {
    scroll-margin-top: 2rem;
  }

  * {
    word-break: keep-all;
  }

  li > a,
  em > a,
  i > a,
  p > a,
  a.footnote-ref,
  h1 > a:not(.title-anchor),
  h2 > a:not(.title-anchor),
  h3 > a:not(.title-anchor),
  h4 > a:not(.title-anchor),
  h5 > a:not(.title-anchor),
  h6 > a:not(.title-anchor) {
    color: ${colors.link};
    word-break: keep-all;
    overflow-wrap: break-word;
    :hover {
      background-color: ${colors.highlight};
    }
  }
  h1 *,
  h2 *,
  h3 *,
  h4 *,
  h5 * {
    font-size: inherit;
  }

  li {
    margin-bottom: 0;
  }

  > iframe,
  > div > iframe,
  .gatsby-resp-iframe-wrapper iframe {
    padding: 0;
    max-width: ${layouts.wide};
    margin-left: auto;
    margin-right: auto;
    display: block;
    border: 0;
  }

  > * {
    padding-left: ${layouts.sidePadding};
    padding-right: ${layouts.sidePadding};
  }

  > ul,
  > ol {
    padding-left: 3rem;
    padding-right: 2rem;
  }
  ul {
    list-style: square;
  }
  ul p,
  ol p {
    margin: 0;
  }

  li ul,
  li ol {
    margin-top: 0;
    margin-bottom: 0.5rem;
  }

  ul > li > ul {
    list-style-type: circle;
  }

  ul > li > ul > li > ul {
    list-style-type: disc;
  }

  p {
    line-height: 1.76;
  }

  img {
    max-width: 100%;
    height: auto;
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
    max-width: ${layouts.wide};
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
    color: ${colors.subtext};
    font-weight: 400;
    content: "제목 주소";
  }
  .title-anchor {
    margin: 0;
    padding: 0;
    padding-left: 0;
    float: none;
    position: absolute;
    left: 1em;
    right: 0;
    margin-top: -1.4em;
    text-indent: 0;
    text-decoration: none;
    transform: translateX(0);
    svg {
      fill: ${colors.subtext};
      vertical-align: middle;
    }
  }
  h1,
  h2,
  h3,
  h4,
  h5 {
    position: relative;
    text-indent: 0;
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
  > li,
  > div.no-indent,
  > div.hero,
  .footnotes {
    box-sizing: border-box;
    max-width: ${layouts.content};
    margin-left: auto;
    margin-right: auto;
  }
  > ul *,
  > ol *,
  .gatsby-highlight * {
    text-indent: 0;
  }
  > blockquote {
    box-sizing: border-box;
    max-width: ${layouts.narrow};
    margin-left: auto;
    margin-right: auto;
  }
  .gatsby-highlight {
    max-width: ${layouts.content};
    margin: 40px auto;
  }
  .translation-note {
    box-sizing: border-box;
    max-width: ${layouts.narrow};
    margin: 40px auto;
  }
  p {
    margin-top: 1em;
    margin-bottom: 0.7em;
  }
  p,
  p * {
    word-break: keep-all;
    overflow-wrap: break-word;
  }
  h1 {
    font-size: 1.3rem;
    position: relative;
    &:after {
      content: "";
      display: block;
      position: absolute;
      border-bottom: 1px solid #ccc;
      left: ${layouts.sidePadding};
      right: ${layouts.sidePadding};
      bottom: 0;
    }
    padding-bottom: 1rem;
    font-weight: 700;
    margin-top: 2.8em;
    margin-bottom: 1em;
  }
  hr + h1:after {
    display: none;
  }
  h2 {
    margin-top: 2.4em;
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 1.3em;
  }
  h3 {
    margin-top: 2.2em;
    font-size: 1em;
    font-weight: 700;
    margin-bottom: 1.1em;
  }
  h4,
  h5 {
    margin-top: 2em;
    font-size: 0.9em;
    margin-bottom: 1em;
  }
  hr {
    ${Hr};
  }
  blockquote {
    font-size: 0.95rem;
    line-height: 1.68;
    padding: 20px;
    background: ${colors.backgroundAlt};
    margin-top: 40px;
    margin-bottom: 40px;
    a {
      color: ${colors.primary};
    }
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
    background: ${colors.backgroundAlt};
    margin: 2rem auto;
    padding: 1px 20px;
  }

  .translation-note p:nth-of-type(1):before {
    content: "📝";
    margin-right: 0.5rem;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    max-width: ${layouts.narrow};
    margin: 3rem auto;
    border: 1px solid ${colors.shade};
  }

  table th {
    background: ${colors.shade};
  }

  table th,
  table td {
    border: 1px solid ${colors.shade};
    padding: 0.5rem 1rem;
  }

  table tr:nth-of-type(2n) td {
    background: ${colors.backgroundAlt};
  }

  .twitter-tweet {
    margin-left: auto;
    margin-right: auto;
  }
  figure {
    margin: 3rem auto;
    text-align: center;
    text-indent: 0;
    p a {
      font-size: 0;
      box-shadow: none;
    }
    &.wide {
      max-width: ${layouts.full};
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
      color: ${colors.subtext};
    }

    @media (max-width: 600px) {
      padding-left: 0;
      padding-right: 0;
      max-width: none !important;
      width: 100%;
    }
  }
  .align-center {
    margin: 0 auto;
    text-align: center;
  }
  .dark-only {
    display: none;
  }
  .light-only {
    display: inline-block;
  }
  @media (prefers-color-scheme: dark) {
    .dark-only {
      display: inline-block;
    }
    .light-only {
      display: none;
    }
  }
  .no-indent,
  .no-indent * {
    text-indent: 0;
  }

  ${button};

  @media (prefers-color-scheme: dark) {
    .gatsby-resp-image-image {
      box-shadow: none !important;
    }
  }

  div.hero {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .aside {
      min-width: 20%;
      text-align: right;
      margin-left: 20px;
    }
    h1 {
      margin-top: 0;
      font-size: 2rem;
      font-weight: 900;
    }
    p {
      text-indent: 0;
    }
    p.tagline {
      font-size: 1.6rem;
      line-height: 1.5;
    }
    @media (max-width: 600px) {
      flex-direction: column;
      .aside {
        order: 1;
        text-align: center;
      }
      .text {
        order: 2;
      }
    }
  }

  .columns {
    max-width: ${layouts.full};

    @media (max-width: 600px) {
      padding-left: 0;
      padding-right: 0;
      max-width: none !important;
      width: 100%;
      column-gap: 0.1rem;
    }

    display: flex;
    column-gap: 1rem;
    > * {
      flex: 1;
    }
  }
`

export default Content

export const ContentHr = styled.hr`
  ${Hr};
  @media (max-width: 750px) {
    margin-bottom: 2rem;
  }
`
