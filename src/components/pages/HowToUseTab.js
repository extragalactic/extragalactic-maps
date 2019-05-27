import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';

import KeyControlsIcon from '../sharedComponents/KeyControlsIcon';
import * as S from '../../styles/stylesMain';

// Material-UI styles
const styles = theme => ({});

const propTypes = {
  classes: PropTypes.object.isRequired
};

function HowToUseTab({ classes }) {
  return (
    <S.BodyText>
      <S.LeftColumn>
        <S.SectionTitle>Keyboard</S.SectionTitle>
        <br />
        <div>Move Forward/Backward with W/S, slide Left/Right with A/D</div>
        <KeysRow>
          <KeyControlsIcon letter="Q" disabled />
          <KeyControlsIcon letter="W" />
          <KeyControlsIcon letter="E" disabled />
        </KeysRow>
        <KeysRow>
          <KeyControlsIcon letter="A" />
          <KeyControlsIcon letter="S" />
          <KeyControlsIcon letter="D" />
        </KeysRow>
        <br />
        <div>Move Up/Down with Q/E</div>
        <KeysRow>
          <KeyControlsIcon letter="Q" />
          <KeyControlsIcon letter="W" disabled />
          <KeyControlsIcon letter="E" />
        </KeysRow>
        <KeysRow>
          <KeyControlsIcon letter="A" disabled />
          <KeyControlsIcon letter="S" disabled />
          <KeyControlsIcon letter="D" disabled />
        </KeysRow>
      </S.LeftColumn>
      <S.RightColumn>
        <S.SectionTitle>Mouse</S.SectionTitle>
        <br />
        <div>Click on the map and drag around to look in a new direction.</div>
        <MouseIcon alt="" height="75" src="/images/interface/mouse-cursor.png" width="50" />
        <br />
        <div>Click on the galaxy in the corner to hide the controls.</div>
        <MouseIcon alt="" height="40" src="/images/interface/spiral-icon-white.png" width="70" />
      </S.RightColumn>
    </S.BodyText>
  );
}

HowToUseTab.propTypes = propTypes;

const KeysRow = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 200px;
  padding: 5px;
`;

const MouseIcon = styled.img`
  padding: 5px;
`;

export default withStyles(styles)(HowToUseTab);
