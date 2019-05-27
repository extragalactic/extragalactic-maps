import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import { withStyles } from '@material-ui/core/styles';

import MapTab from './MapTab';
import HowToUseTab from './HowToUseTab';
import AboutTab from './AboutTab';
import MoreTab from './MoreTab';
import AnimatedImage from '../sharedComponents/AnimatedImage';
import { getImagesFromFilenames } from '../../utils/tools';
import * as S from './MainPage.styles';

// Material-UI styles
const styles = theme => ({});

const propTypes = {
  classes: PropTypes.object.isRequired
};

function MainPage({ classes }) {
  const [selectedTab, setSelectedTab] = useState(0);

  const images = getImagesFromFilenames({
    GCLogo: 'galaxyclass-logo.jpg',
    SDSS01: 'banner-image.jpg',
    alt: 'banner-image.jpg',
    main: 'banner-image.jpg',
    SDSS01_mobile: 'banner-image-mobile.jpg'
  });

  function handleChange(event, value) {
    setSelectedTab(value);
  }

  return (
    <S.Page>
      <S.TitleBar>
        <S.TitleBlock>
          <img src={images.GCLogo} alt="" width="300px" />
          <S.SubTitle>Interactive 3D Maps of Extragalactic Space</S.SubTitle>
        </S.TitleBlock>
        <AnimatedImage
          caption=""
          imageAspectRatio={12.08}
          imageMain={images.SDSS01}
          imageMainAlt={images.SDSS01}
          imageMainZoom={images.SDSS01_mobile}
        />
      </S.TitleBar>
      <S.AppBarContainer>
        <AppBar position="static" color="secondary">
          <Tabs value={selectedTab} onChange={handleChange}>
            <S.Tab label="Maps" />
            <S.Tab label="How to Use" />
            <S.Tab label="About the Maps" />
            <S.Tab label="More..." />
          </Tabs>
        </AppBar>
      </S.AppBarContainer>
      <S.MainPageContainer>
        {selectedTab === 0 && <MapTab />}
        {selectedTab === 1 && <HowToUseTab />}
        {selectedTab === 2 && <AboutTab />}
        {selectedTab === 3 && <MoreTab />}
      </S.MainPageContainer>
    </S.Page>
  );
}

MainPage.propTypes = propTypes;

export default withStyles(styles)(MainPage);
