import styled from 'styled-components';
import posed from 'react-pose';

import { appParams } from '../../helpers/parameters';
import * as S from '../../styles/stylesMain';

const { interfaceFadeDelay, interfaceAnimationStaggerDelay } = appParams;

// ===================================================================
// StyledComponents
const ControlPanel = styled.div`
  position: relative;
  margin-top: 10px;
  padding-left: 10px;
  background-color: rgba(0, 0, 0, 0.65);
  border: 1px solid #777;
  border-radius: ${props => props.theme.shape.borderRadius}px;
  padding: 10px;
`;

const NavSection = styled.div`
  display: flex;
  width: 285px;
  align-items: center;
  justify-content: space-between;
`;

const NavComponent = styled.div`
  min-width: 80;
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ColorSelectContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const LogoIcon = styled.img`
  cursor: pointer;
  margin-left: 5px;
  margin-top: 5px;
  opacity: ${props => (props.isShowingColorControls ? 1 : 0.5)};
`;

const ControlsContainer = styled.div`
  position: relative;
`;

const Loader = styled.div`
  position: absolute;
  bottom: 0px;
  right: 0px;
`;

// ===================================================================
// Posed style components
const PosedNavSection = posed(NavSection)({
  visible: {
    staggerChildren: interfaceAnimationStaggerDelay
  },
  hidden: {}
});

const PosedNavComponent = posed(NavComponent)({
  hidden: {
    opacity: 0.01,
    x: -550,
    transition: {
      x: { ease: 'easeIn', duration: interfaceFadeDelay, round: true },
      opacity: { ease: 'easeIn', duration: interfaceFadeDelay }
    }
  },
  visible: {
    scale: 1.0,
    opacity: 1,
    x: 0,
    transition: {
      x: {
        ease: 'easeOut',
        duration: interfaceFadeDelay,
        round: true
      },
      opacity: { ease: 'easeOut', duration: interfaceFadeDelay }
    }
  }
});

const PosedControlsContainer = posed(ControlsContainer)({});

const PosedControlPanel = posed(ControlPanel)({
  hidden2: {
    opacity: 0.01,
    y: -400,
    transition: {
      y: { ease: 'easeIn', duration: interfaceFadeDelay, round: true },
      opacity: { ease: 'easeIn', duration: interfaceFadeDelay }
    }
  },
  visible2: {
    scale: 1.0,
    opacity: 1,
    y: 0,
    transition: {
      y: {
        ease: 'easeOut',
        duration: interfaceFadeDelay,
        round: true
      },
      opacity: { ease: 'easeOut', duration: interfaceFadeDelay }
    }
  }
});

// global styles imported then passed to export
const { SectionTitle, SectionSubTitle, TextHighlight } = S;

export {
  ColorSelectContainer,
  ControlsContainer,
  Loader,
  LogoIcon,
  NavComponent,
  PosedControlPanel,
  PosedControlsContainer,
  PosedNavComponent,
  PosedNavSection,
  SectionSubTitle,
  SectionTitle,
  SliderContainer,
  TextHighlight
};
