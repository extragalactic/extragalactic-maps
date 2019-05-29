import styled from 'styled-components';

// ---------- Layout ----------
const App = styled.section`
  display: flex;
  flex-direction: column;
  background-color: #000;
  font-size: 1em;
  color: #fff;
  min-height: 100vh;
  padding-top: 10px;
  font-family: 'Caecilla', 'Merriweather', 'Roboto', 'Helvetica', 'Arial', 'sans-serif';
`;

const Page = styled.section`
  display: absolute;
  top: 0px;
`;

const Image = styled.img`
  width: 100%;
  max-width: 100%;
  padding: 0px;
`;

const ImageLarge = styled.img`
  width: 90%;
  max-width: 900px;
  padding: 0px;
  margin: 0px;
`;

const BodyText = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  padding: 20px 10px;
  width: 100%;
  max-width: 900px;
`;

const Paragraph = styled.p`
  max-width: 900px;
`;

const InsetContent = styled.div`
  color: #ccc;
  font-size: 1.3em;
  display: inline-block;
  margin: 10px 20px;
  @media (max-width: 768px) {
    float: none;
    width: 90%;
    font-size: 1.2em;
    margin: 10px 10px;
    text-align: center;
  }
`;

const InsetLeft = styled(InsetContent)`
  float: left;
  margin: 5px 10px 5px 0px;
`;

const InsetLeftText = styled(InsetLeft)`
  width: 40%;
`;

const InsetRight = styled(InsetContent)`
  float: right;
  margin: 10px 20px;
`;

const InsetRightText = styled(InsetRight)`
  width: 40%;
`;

const LeftColumn = styled.div`
  flex: 1;
  padding: 7px;
`;

const RightColumn = styled.div`
  flex: 1;
  padding: 7px 35px 7px 7px;
`;

// --------- Text & Titles ----------
const Title = styled.h1`
  display: flex;
  flex: 1;
  justify-content: flex-start;
  font-size: 2em;
  margin: 0px 0px 0px 0px;
  padding: 0px;
`;

const SubTitle = styled.h2`
  display: flex;
  flex: 1;
  justify-content: flex-start;
  font-size: 1.1em;
  margin: 0px 0px 5px 0px;
  padding: 0px;
  @media (max-width: 480px) {
    font-size: 0.8em;
  }
`;

const SectionTitle = styled.h1`
  display: flex;
  flex: 1;
  justify-content: left;
  font-size: 1.5em;
  margin: 0px 0px 0px 0px;
  padding: 0px;
`;

const SectionSubTitle = styled.h1`
  display: flex;
  flex: 1;
  justify-content: left;
  font-size: 0.9em;
  margin: 0px 0px 0px 0px;
  padding: 0px;
  color: #ddd;
`;

const IntroLetter = styled.span`
  font-size: 3.5em;
  float: left;
  padding: 0px;
  margin: 0px;
  margin-top: -12px;
  padding-right: 3px;
`;

const PhotoCaption = styled.div`
  font-size: 0.9em;
  color: #ddd;
  float: left;
  margin-left: 2px;
`;

const URLLink = styled.a`
  text-align: center;
  color: #eee;
`;

const TextHighlight = styled.span`
  color: ${props => props.theme.palette.primary.main};
  font-weight: bold;
`;

// Note: Aim for 45-75 characters per line, or 40-50 if using 2 columns.

export {
  App,
  BodyText,
  Image,
  ImageLarge,
  InsetLeft,
  InsetLeftText,
  InsetRight,
  InsetRightText,
  IntroLetter,
  LeftColumn,
  Page,
  Paragraph,
  PhotoCaption,
  RightColumn,
  SectionSubTitle,
  SectionTitle,
  SubTitle,
  TextHighlight,
  Title,
  URLLink
};
