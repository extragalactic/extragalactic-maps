import React from 'react';
import PropTypes from 'prop-types';
import KeyHandler, { KEYPRESS } from 'react-key-handler';

const propTypes = {
  handleKeyPress: PropTypes.func.isRequired
};

function KeyboardInput(props) {
  const { handleKeyPress } = props;
  return (
    <React.Fragment>
      <KeyHandler keyEventName={KEYPRESS} keyValue="w" onKeyHandle={handleKeyPress} />
      <KeyHandler keyEventName={KEYPRESS} keyValue="s" onKeyHandle={handleKeyPress} />
      <KeyHandler keyEventName={KEYPRESS} keyValue="a" onKeyHandle={handleKeyPress} />
      <KeyHandler keyEventName={KEYPRESS} keyValue="d" onKeyHandle={handleKeyPress} />
    </React.Fragment>
  );
}

KeyboardInput.propTypes = propTypes;

export default KeyboardInput;
