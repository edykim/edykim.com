import React from "react"
import { Link } from "gatsby"
import styled, { css } from "styled-components"
import { colors, layouts, fonts } from "styles/schema"

const ContainerWrapper = styled.header``

const Container = styled.div`
  max-width: ${layouts.content};
  padding: ${layouts.sidePadding};
  padding-top: ${layouts.headerPadding};
  margin: 0 auto;
`

const Title = styled(Link)`
  color: ${colors.primary};
  font-size: ${fonts.title};
  letter-spacing: -0.05em;
  font-weight: 900;
  margin: 0;
  word-break: keep-all;
  text-decoration: none;
`

const Subtitle = styled.span`
  opacity: 0.5;
`

const NewLine = styled.span`
  display: block;
`

export const Header = () => (
  <ContainerWrapper>
    <Container>
      <Title to={"/"}>매일 성장하기</Title>
    </Container>
  </ContainerWrapper>
)
