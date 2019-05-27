import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '@material-ui/core/styles';
import * as S from './KeyControlsIcon.styles';

const propTypes = {
  disabled: PropTypes.bool,
  letter: PropTypes.string.isRequired,
  theme: PropTypes.object.isRequired
};

const defaultProps = {
  disabled: false
};

// Component is a letter with a rounded border, resembling a keyboard key
function KeyControlsIcon({ theme, disabled, letter }) {
  return (
    <S.KeyContainer disabled={disabled} theme={theme}>
      <S.KeyLetter disabled={disabled} theme={theme}>
        {letter}
      </S.KeyLetter>
    </S.KeyContainer>
  );
}

KeyControlsIcon.propTypes = propTypes;
KeyControlsIcon.defaultProps = defaultProps;

export default withTheme()(KeyControlsIcon);
