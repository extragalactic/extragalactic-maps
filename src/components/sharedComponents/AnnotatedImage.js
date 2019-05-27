import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as S from '../../styles/stylesMain';

const propTypes = {
  srcMain: PropTypes.string.isRequired,
  srcAnnotated: PropTypes.string.isRequired
};

function AnnotatedImage({ srcMain, srcAnnotated }) {
  const [isAnnotated, setIsAnnotated] = useState(false);

  function onMouseOver() {
    setIsAnnotated(!isAnnotated);
  }

  return (
    <S.Image
      alt=""
      src={isAnnotated ? srcAnnotated : srcMain}
      width="100%"
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOver}
      onFocus={onMouseOver}
      onBlur={onMouseOver}
    />
  );
}
AnnotatedImage.propTypes = propTypes;

export default AnnotatedImage;
