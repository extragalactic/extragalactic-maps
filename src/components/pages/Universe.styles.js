import styled from 'styled-components';
import * as S from '../../styles/stylesMain';

// StyledComponents
const PageContainer = styled.div`
  position: absolute;
  left: 0px;
`;
const Viewport = styled.div`
  display: flex;
  width: 100%;
  min-height: 600px;
  min-width: 800px;
  position: relative;
  top: 0;
  left: 0;
`;
const ThreeJSContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  top: 0;
  left: 0;
`;
const Header = styled.div`
  display: flex;
  position: absolute;
  top: 0px;
  left: 0px;
`;
const Footer = styled.div`
  height: 50px;
  text-align: center;
  margin: 20px;
`;

// global styles imported then passed to export
const { Page } = S;

export {
  PageContainer, Viewport, ThreeJSContainer, Header, Footer, Page
};
