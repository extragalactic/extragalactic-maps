import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { PoseGroup } from 'react-pose';

import ResponsiveTitleImage from './ResponsiveTitleImage';
import { imageFadeDelay } from '../../helpers/constants';
import * as S from './AnimatedImage.styles';

const numImageSegments = 5;

const propTypes = {
  caption: PropTypes.string.isRequired,
  imageAspectRatio: PropTypes.number.isRequired,
  imageMain: PropTypes.string.isRequired,
  imageMainAlt: PropTypes.string.isRequired,
  imageMainZoom: PropTypes.string.isRequired
};

function AnimatedImage({
  caption, imageAspectRatio, imageMain, imageMainAlt, imageMainZoom
}) {
  const [isImageVisible, setIsImageVisible] = useState(false);
  const [isAlternateImage, setIsAlternateImage] = useState(false);

  // run once on component mount
  useEffect(() => {
    setTimeout(() => {
      setIsImageVisible(!isImageVisible);
    }, 1);
  }, []);

  function flipImage() {
    setIsImageVisible(false);

    setTimeout(() => {
      setIsImageVisible(true);
      setIsAlternateImage(!isAlternateImage);
    }, imageFadeDelay / 2 + 10);
  }

  // Note: added an extra image to the array, which becomes "index: -1", for the purpose of establishing a single
  // dummy base image with relative position whose only purpose is to mark the height for the padding-bottom trick.
  // This padding-bottom algorithm must play with the algorithm used to display multiple images on top of each other,
  // which normally needs the first one to be relative. Here, the "fake" first image is used as that placeholder.
  const images = new Array(numImageSegments + 1).fill('');

  return (
    <PoseGroup>
      <S.PosedMultiImage
        imageAspectRatio={imageAspectRatio}
        key="posedMultiImage"
        pose={isImageVisible ? 'visible' : 'toggle'}
      >
        {images.map((image, i) => {
          const j = i - 1;
          return (
            <S.PosedImageContainer
              imageIndex={j}
              imageRatio={(1 / (images.length - 1)) * 100}
              key={`image${j}`}
              numImages={images.length - 1}
              onClick={(e) => {
                flipImage();
              }}
            >
              <ResponsiveTitleImage
                alt={caption}
                imageMain={isAlternateImage ? imageMainAlt : imageMain}
                imageMainZoom={imageMainZoom}
              />
            </S.PosedImageContainer>
          );
        })}
      </S.PosedMultiImage>
    </PoseGroup>
  );
}

AnimatedImage.propTypes = propTypes;

export default AnimatedImage;
