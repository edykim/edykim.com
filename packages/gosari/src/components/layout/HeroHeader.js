import React from "react"
import styled from "styled-components"
import Container from "./Container"
import { colors, layouts, fonts } from "styles/schema"

const Header = styled.header`
  background-color: ${colors.primary};
`

const Title = styled.h1`
  color: ${colors.background};
  line-height: ${fonts.hero};
  font-size: ${fonts.hero};
  letter-spacing: -0.05em;
  font-weight: 900;
  margin: 0;
  word-break: keep-all;
`

const Subtitle = styled.span`
  opacity: 0.5;
`

const NewLine = styled.span`
  display: block;
`

export const HeroHeader = () => (
  <Header>
    <Container>
      <Title>
        <Subtitle>
          단순하게 생각하기 <NewLine />
          점진적으로 개선하기 <NewLine />
        </Subtitle>
        매일 성장하기
      </Title>
    </Container>
  </Header>
)
