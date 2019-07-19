import React, { Component } from "react"
import styled from "styled-components"
import { layout, color } from "styles/schema"

const Wrapper = styled.div`
  padding: 0 0 4rem;
`

const Inner = styled.div`
  max-width: ${layout.medium};
  margin: 0 auto;
`

const Section = styled.footer`
  font-size: 0.8rem;
  padding: ${layout.sidePadding};
  color: ${color.footer};
`

export class Footer extends Component {
  render() {
    return (
      <Wrapper>
        <Inner>
          <Section>매일 성장하기</Section>
        </Inner>
      </Wrapper>
    )
  }
}
