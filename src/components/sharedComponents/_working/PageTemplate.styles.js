import * as S from "../../styles/stylesMain";
import styled from "styled-components";
import posed from "react-pose";

import { imageFadeDelay } from "../../helpers/constants";

// StyledComponents
const MultiImage = styled.div`
  position: relative;
  top: 0;
  left: 0;
  height: 0;
  padding-bottom: ${props => `${props.imageAspectRatio}%`};
`;

const ImageContainer = styled.div`
  position: ${props => (props.imageIndex === -1 ? "relative" : "absolute")};
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
      x: { ease: "easeOut", duration: imageFadeDelay, round: true },
      opacity: { ease: "linear", duration: imageFadeDelay },
      clipPath: { ease: "linear", duration: imageFadeDelay }
    }
    // clipPath: ({ imageIndex, imageRatio }) =>
    //   `polygon(
    //     50% 0%,
    //     100% 50%,
    //     50% 100%,
    //     0% 50%
    //   )`
  },
  visible: {
    scale: 1.0,
    opacity: ({ imageIndex, numImages }) =>
      1 - (numImages - 1 - imageIndex) * 0,
    x: ({ imageIndex, numImages }) => (numImages - 1 - imageIndex) * -0,
    // clipPath: ({ imageIndex, imageRatio }) =>
    //   `polygon(
    //     ${imageIndex * imageRatio}% 0%,
    //     ${(imageIndex + 1) * imageRatio}% 0%,
    //     ${(imageIndex + 1) * imageRatio}% 100%,
    //     ${imageIndex * imageRatio}% 100%
    //   )`,
    transition: {
      x: {
        ease: "easeOut",
        duration: imageFadeDelay,
        round: true
      },
      opacity: { ease: "linear", duration: imageFadeDelay },
      clipPath: { ease: "linear", duration: imageFadeDelay }
    }
  },
  toggle: {
    opacity: 0.01,
    x: 0,
    scale: 0.95,
    transition: {
      opacity: { ease: "easeOut", duration: imageFadeDelay / 2 }
    }
  }
});

// ... a diamond
// polygon(50% 0, 100% 50%, 50% 100%, 0 50%);

// ... an interesting shape
// clip-path: polygon(
//   ${props => props.imageIndex * props.imageRatio}% 0,
//   100% 50%,
//   ${props => props.imageAnchor}% 100%,
//   ${props => props.imageIndex * props.imageRatio}% 50%
// );

// global styles imported then passed to export
const BodyText = S.BodyText;
const MenuContainer = S.MenuContainer;
const Page = S.Page;
const PhotoCaption = S.PhotoCaption;

export {
  ImageContainer,
  MultiImage,
  PosedImageContainer,
  PosedMultiImage,
  BodyText,
  MenuContainer,
  Page,
  PhotoCaption
};
