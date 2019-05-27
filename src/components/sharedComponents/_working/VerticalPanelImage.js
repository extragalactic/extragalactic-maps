import * as React from 'react';
import PropTypes from 'prop-types';
import Media from 'react-media';

import { breakpointSmall, maxImageWidth } from '../../helpers/constants';
import { getImagesFromFilenames } from '../../utils/tools';
import * as S from './VerticalPanelImage.styles';

const images = getImagesFromFilenames({
  imagePanel1: 'title-collage-panel1.jpg',
  imagePanel2: 'title-collage-panel2.jpg',
  imagePanel3: 'title-collage-panel3.jpg',
  imagePanel4: 'title-collage-panel4.jpg',
  imagePanel5: 'title-collage-panel5.jpg',
  imagePanel6: 'title-collage-panel6.jpg',
  imagePanel7: 'title-collage-panel7.jpg'
});

const propTypes = {
  numPanels: PropTypes.number.isRequired
};

const imagePanels = [
  images.imagePanel1,
  images.imagePanel2,
  images.imagePanel3,
  images.imagePanel4,
  images.imagePanel5,
  images.imagePanel6,
  images.imagePanel7
];

class VerticalPanelImage extends React.Component {
  render() {
    return (
      <div>
        <Media query={{ maxWidth: breakpointSmall - 1 }} render={() => <div />} />
        <Media
          query={{ minWidth: breakpointSmall }}
          render={() => (
            <S.PosedPanelImageSet key="imagePanelSet" maxImageWidth={maxImageWidth} pose="visible">
              {imagePanels.map((image, i) => (
                <S.PosedPanelImage
                  alt=""
                  key={`panel${i}`}
                  numPanels={this.props.numPanels}
                  panelIndex={i}
                  src={image}
                />
              ))}
            </S.PosedPanelImageSet>
          )}
        />
      </div>
    );
  }
}

VerticalPanelImage.propTypes = propTypes;

export default VerticalPanelImage;
