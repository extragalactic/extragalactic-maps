import * as React from 'react';
import PropTypes from 'prop-types';
import Media from 'react-media';

import * as S from '../../styles/stylesMain';
import { breakpointSmall } from '../../helpers/constants';

const propTypes = {
  alt: PropTypes.string.isRequired,
  imageMain: PropTypes.string.isRequired,
  imageMainZoom: PropTypes.string.isRequired
};

function ResponsiveTitleImage(props) {
  return (
    <div>
      <Media
        query={{ maxWidth: breakpointSmall - 1 }}
        render={() => (
          <div>
            <S.Image src={props.imageMainZoom} alt={props.alt} />
          </div>
        )}
      />
      <Media
        query={{ minWidth: breakpointSmall }}
        render={() => (
          <div>
            <S.Image src={props.imageMain} alt={props.alt} />
          </div>
        )}
      />
    </div>
  );
}

ResponsiveTitleImage.propTypes = propTypes;

export default ResponsiveTitleImage;
