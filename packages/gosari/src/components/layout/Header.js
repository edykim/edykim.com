import React from "react"
import { Link } from "gatsby"
import styled, { css } from "styled-components"
import { colors, layouts, fonts } from "styles/schema"
import ModeSwitch from "./ModeSwitch"

const ContainerWrapper = styled.header``

const Container = styled.div`
  max-width: ${layouts.content};
  padding: ${layouts.sidePadding};
  padding-top: ${layouts.headerPadding};
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`

const titleStyle = css`
  font-size: ${fonts.title};
  letter-spacing: -0.05em;
  font-weight: 900;
  margin: 0;
  word-break: keep-all;
  text-decoration: none;
`

const Title = styled(Link)`
  ${titleStyle};
  color: ${colors.primary};
`

const SubTitle = styled(Link)`
  ${titleStyle};
  color: ${colors.subtext};
  margin-left: 10px;
`

const Subtitle = styled.span`
  opacity: 0.5;
`

const NewLine = styled.span`
  display: block;
`

export const Header = ({ linkTo, linkTitle }) => (
  <ContainerWrapper>
    <Container>
      <div>
        <Title to={"/"}>매일 성장하기</Title>
        {linkTo && <SubTitle to={linkTo}>{linkTitle}</SubTitle>}
      </div>

      <ModeSwitch />
    </Container>
  </ContainerWrapper>
)
