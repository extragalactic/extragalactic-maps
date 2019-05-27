import styled from "styled-components";
import posed from "react-pose";

import * as S from "../../styles/stylesMain";

// StyledComponents
const PanelImageSet = styled.div`
  display: flex;
  max-width: ${props => props.maxImageWidth}px;
  width: 100%;
`;

const PanelImage = styled.img`
  width: ${props => 100 / props.numPanels}%;
  height: ${props => 100 / props.numPanels}%;
  padding: 0px;
`;

// Posed styles
const PosedPanelImageSet = posed(PanelImageSet)({
  visible: {
    staggerChildren: 80
  }
});

const PosedPanelImage = posed(PanelImage)({
  hoverable: true,
  pressable: true,
  init: {
    scale: 1,
    boxShadow: "0px 0px 0px rgba(0,0,0,0)"
  },
  hover: {
    scale: 1.1,
    boxShadow: "8px 0px 5px rgba(0,0,0,0.3)"
  },
  visible: {
    opacity: 1,
    x: 0
  },
  hidden: {
    opacity: 0.01,
    x: -20
  }
});

// imported global styles
const Title = S.Title;

export {
  PanelImageSet,
  PanelImage,
  PosedPanelImageSet,
  PosedPanelImage,
  Title
};
