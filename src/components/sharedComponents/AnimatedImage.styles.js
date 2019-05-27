import styled from 'styled-components';
import posed from 'react-pose';

import { imageFadeDelay } from '../../helpers/constants';

// StyledComponents
const MultiImage = styled.div`
  position: relative;
  top: 0;
  left: 0;
  height: 0;
  padding-bottom: ${props => `${props.imageAspectRatio}%`};
`;

const ImageContainer = styled.div`
  position: ${props => (props.imageIndex === -1 ? 'relative' : 'absolute')};
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: ${props => props.imageIndex};
  clip-path: polygon(
    ${props => props.imageIndex * props.imageRatio}% 0,
    ${props => (props.imageIndex + 1) * props.imageRatio}% 0,
    ${props => (props.imageIndex + 1) * props.imageRatio}% 100%,
    ${props => props.imageIndex * props.imageRatio}% 100%
  );
`;

// Posed style components
const PosedMultiImage = posed(MultiImage)({
  visible: {
    staggerChildren: 80
  },
  hidden: {}
});

const PosedImageContainer = posed(ImageContainer)({
  pressable: true,
  hidden: {
    opacity: 0.01,
    x: -300,
    transition: {
      x: { ease: 'easeOut', duration: imageFadeDelay, round: true },
      opacity: { ease: 'linear', duration: imageFadeDelay },
      clipPath: { ease: 'linear', duration: imageFadeDelay }
    }
  },
  visible: {
    scale: 1.0,
    opacity: ({ imageIndex, numImages }) => 1 - (numImages - 1 - imageIndex) * 0,
    x: ({ imageIndex, numImages }) => (numImages - 1 - imageIndex) * -0,
    transition: {
      x: {
        ease: 'easeOut',
        duration: imageFadeDelay,
        round: true
      },
      opacity: { ease: 'linear', duration: imageFadeDelay },
      clipPath: { ease: 'linear', duration: imageFadeDelay }
    }
  },
  toggle: {
    opacity: 0.01,
    x: 0,
    scale: 0.95,
    transition: {
      opacity: { ease: 'easeOut', duration: imageFadeDelay / 2 }
    }
  }
});

export {
  ImageContainer, MultiImage, PosedImageContainer, PosedMultiImage
};
