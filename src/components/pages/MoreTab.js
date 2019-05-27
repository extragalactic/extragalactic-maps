import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';

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

function MoreTab({ classes }) {
  return (
    <S.BodyText>
      <S.LeftColumn>
        <div>
          Galaxy Class is created by Matt Mazur. The goal of this project is to teach the public
          about galactic geography and cosmology in a creative way.
        </div>
        <br />
        <div>
          I also teach a live Galaxy Class to groups at special events. My Earth address is the
          human city of Vancouver, Canada.
        </div>
        <br />
        <S.URLLink
          href="http://www.facebook.com/vj.elfmaster"
          target="_blank"
          rel="noopener noreferrer"
        >
          Say hi on Facebook
        </S.URLLink>
        <br />
        <br />
        <S.URLLink href="mailto:matt.elf@gmail.com" target="_blank" rel="noopener noreferrer">
          Email contact
        </S.URLLink>
      </S.LeftColumn>
      <S.RightColumn>
        <S.Image src="/images/pages/GC-Inshala-2013.jpg" alt="" />
      </S.RightColumn>
    </S.BodyText>
  );
}

MoreTab.propTypes = propTypes;

export default withStyles(styles)(MoreTab);
