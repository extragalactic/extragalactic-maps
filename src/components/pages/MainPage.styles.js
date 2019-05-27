import styled from 'styled-components';
import Tab from '@material-ui/core/Tab';
import * as S from '../../styles/stylesMain';

const TitleBar = styled.div``;

const TitleImage = styled.img`
  max-width: 100%;
`;

const TitleBlock = styled.div`
  padding-left: 15px;
`;

const AppBarContainer = styled.div`
  border-bottom: 1px solid #fff;
`;

const TabMatUI = styled(Tab)`
  font-size: 1em !important;
  font-family: 'Roboto', 'Arial' !important;
`;

const MainPageContainer = styled.div`
  display: flex;
  justify-content: center;
`;

// pass along global styles
const { Page, Paragraph, SubTitle } = S;

export {
  TitleBar,
  TitleImage,
  TitleBlock,
  Page,
  Paragraph,
  SubTitle,
  AppBarContainer,
  MainPageContainer,
  TabMatUI as Tab
};
