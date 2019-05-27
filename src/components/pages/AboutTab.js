import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';

import AnnotatedImage from '../sharedComponents/AnnotatedImage';
import * as S from '../../styles/stylesMain';

// Material-UI styles
const styles = theme => ({
  button: {
    margin: '2px',
    background: '#555'
  }
});

const propTypes = {
  classes: PropTypes.object.isRequired
};

function AboutTab({ classes }) {
  return (
    <S.BodyText>
      <S.LeftColumn>
        <S.SubTitle>Real Maps (mostly)</S.SubTitle>
        <div>
          These maps are real extra-galactic maps using actual astrometric data. The images are of
          the largest 475 galaxies within 100 million light years of the Milky Way. This pool of
          images is randomly* assigned to the galaxy locations. In this sense the maps are visual
          approximations, although the locations are from real data, and each image is still a real
          telescope image from the Hubble Space Telescope or other telescopes from around the world.
          Each image has been hand-selected & processed (removing foreground stars, etc.) to
          maximize visual quality.
        </div>
        <S.PhotoCaption>
          (* the image placement algorithm will preferentially place elliptical galaxies in
          high-density areas)
        </S.PhotoCaption>
        <br />
        <br />
        <br />
        <S.SubTitle>Extragalactic Distance</S.SubTitle>
        <div>
          When using the map viewer, you can adjust the size of the galaxies. Generally the maps
          look better when the size is exaggerated, but if you want to see a more accurate relative
          size, set the size slider to the minimum value (i.e. there is lots of space between
          galaxies!).
        </div>
        <br />
        <S.SubTitle>Zone of Avoidance</S.SubTitle>
        <div>
          Our home galaxy, the Milky Way, is located at the center of each map. The large gap around
          the circumference of the maps (most obvious in the 2MASS map) is due to the plane of the
          Milky Way blocking the view. This is called the Zone of Avoidance.
        </div>
        <br />
        <S.SubTitle>Density Illusions</S.SubTitle>
        <div>
          It appears that there are relatively more galaxies close to the center of each map. This
          is a data sampling bias, because galaxies close to the Milky Way are easier to see and
          thus catalogue. So the higher relative density in the center of the maps is not an
          accurate representation.
        </div>
        <br />
      </S.LeftColumn>
      <S.RightColumn>
        <S.SubTitle>Finger of God</S.SubTitle>
        <ImageInset>
          <AnnotatedImage
            srcMain="/images/interface/finger-of-god-example.jpg"
            srcAnnotated="/images/interface/finger-of-god-example-annotated.jpg"
          />
        </ImageInset>
        <div>
          You will also notice that the maps appear to show that many galaxies are oriented in long
          lines pointing towards the Milky Way. Like the orange structures in the galactic
          density-map pictured above (rollover with mouse), these obvious long lines of galaxies all
          point to the center of the map, like radiating spokes. This is actually due to a
          measurement error called the Finger of God Effect, and it is caused by an error inherent
          in measuring the redshift of light when galaxies are clustered in tight groups. The result
          is that the positions become stretched out along the line-of-sight, and so the resulting
          map becomes distorted. These maps are clearly not perfect, but they are the best humans
          can currently achieve. And although measurements of distance are often inaccurate, the sky
          positions of each galaxy are measured with a very high degree of accuracy.
        </div>
        <br />
        <div>
          <S.URLLink
            href="https://en.wikipedia.org/wiki/Redshift-space_distortions"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read more about the Finger of God Effect
          </S.URLLink>
        </div>
      </S.RightColumn>
    </S.BodyText>
  );
}

AboutTab.propTypes = propTypes;

const ImageInset = styled.div`
  padding: 10px;
`;

export default withStyles(styles)(AboutTab);
