import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// component to draw a color bar based on a 7-color array
const propTypes = {
  palette: PropTypes.array.isRequired
};

function ColorSwatch(props) {
  const { palette } = props;

  return (
    <SwatchContainer>
      {palette.map(color => (
        <SwatchSegment color={color} key={color} />
      ))}
    </SwatchContainer>
  );
}

// StyledComponents
const SwatchContainer = styled.div`
  display: flex;
  width: 70px;
  height: 15px;
  border: 1px solid #fff;
  margin-left: 10px;
`;
const SwatchSegment = styled.div`
  width: 10px;
  background: ${props => props.color};
`;

ColorSwatch.propTypes = propTypes;

export default ColorSwatch;
