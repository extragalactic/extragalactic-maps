import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import * as S from '../../styles/stylesMain';

// Styled Components
const ButtonMatUI = styled(Button)`
  margin: 8px !important;
  background-color: ${props => props.theme.palette.text.disabled} !important;
  &:hover {
    background-color: ${props => props.theme.palette.primary.dark} !important;
  }
`;

const MapSampleImage = styled.img`
  max-width: 100%;
  border: 2px solid #555;
  border-radius: ${props => props.theme.shape.borderRadius}px;
`;

const StartButtonContainer = styled.div`
  margin: 15px;
`;

const StartButton = styled.div`
  font-size: 1.3em;
  padding: 3px;
`;

const GalaxyMapName = styled.div`
  font-size: 1.2em;
  color: #fff;
  margin-bottom: 5px;
`;

const GalaxyCountField = styled.div`
  font-size: 1.2em;
  color: #aaa;
`;

// pass along global styles
const {
  BodyText, IntroLetter, Page, Paragraph, LeftColumn, RightColumn
} = S;

export {
  BodyText,
  IntroLetter,
  Page,
  MapSampleImage,
  Paragraph,
  LeftColumn,
  RightColumn,
  GalaxyCountField,
  StartButton,
  StartButtonContainer,
  GalaxyMapName,
  ButtonMatUI as Button
};
