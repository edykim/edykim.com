import React from "react"
import styled from "styled-components"

const Wrapper = styled.div`
  font-size: 2.4vw;
  @media all and (min-width: 1000px) {
    font-size: 24px;
  }
  @media all and (max-width: 750px) {
    font-size: 18px;
  }
`

const Section = styled.div`
  font-size: 0.8em;
  line-height: 1.7;
  font-weight: 400;

  a[href^="http"]:after {
    content: "external";
    color: #333333;
    text-decoration: none;
    display: inline-block;
    font-size: 0.6em;
    margin-left: 5px;
    vertical-align: super;
  }
  blockquote {
    padding: 1em;
    margin: 0;
    background-color: #eeeeee;
  }

  ul p {
    margin: 0;
  }

  h1 {
    font-size: 1.5em;
    font-weight: 700;
  }
  h2 {
    font-size: 1.3em;
    font-weight: 700;
  }
  h3 {
    font-size: 1.1em;
    font-weight: 700;
  }
  h4,
  h5 {
    font-size: 1em;
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

  .no-number:before {
    content: none;
  }

  .reset-number {
    counter-reset: h1counter 0 h2counter 0 h3counter 0 h4counter 0 h5counter 0;
  }
`

export const Content = ({ html }) => (
  <Wrapper>
    <Section className="content" dangerouslySetInnerHTML={{ __html: html }} />
  </Wrapper>
)
