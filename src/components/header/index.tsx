import React from 'react';
import { Container, HeaderLeft, HeaderRight, HeaderBackTitle } from './styles';

interface HeaderProps {
  title: React.ElementType;
  titleContainerStyle?: object;
  style?: object;
  headerBackTitleVisible?: boolean;
  headerLeft?: React.ElementType;
  headerRight?: React.ElementType;
  headerLeftContainerStyle?: object;
  headerRightContainerStyle?: object;
}

export default function Header(props: HeaderProps) {
  const {
    style,
    titleContainerStyle,
    headerBackTitleVisible,
    headerLeftContainerStyle,
    headerRightContainerStyle
  } = props;
  return (
    <Container style={style}>
      <HeaderLeft style={headerLeftContainerStyle}>
        {props.headerLeft ? <props.headerLeft /> : null}
        {headerBackTitleVisible && <HeaderBackTitle>back</HeaderBackTitle>}
      </HeaderLeft>
      <props.title style={titleContainerStyle} />
      <HeaderRight style={headerRightContainerStyle}>
        {props.headerRight ? <props.headerRight /> : null}
      </HeaderRight>
    </Container>
  );
}
