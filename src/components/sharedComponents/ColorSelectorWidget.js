import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';

import { colorPalettes7 } from '../../helpers/colors';
import ColorSwatch from './ColorSwatch';

const styles = theme => ({
  select: {
    color: '#fff',
    backgroundColor: '#000'
  },
  root: {
    color: '#fff',
    backgroundColor: '#000'
  },
  selected: {
    color: '#fff',
    backgroundColor: '#555 !important'
  }
});

const propTypes = {
  classes: PropTypes.object.isRequired,
  colorThemeIndex: PropTypes.number.isRequired,
  onChangeTheme: PropTypes.func.isRequired
};

// component to create a color swatch drop-down selector
function ColorSelectorWidget(props) {
  const { classes, colorThemeIndex, onChangeTheme } = props;

  return (
    <Select
      className={classes.select}
      value={colorThemeIndex}
      onChange={onChangeTheme}
      inputProps={{
        name: 'colors',
        id: 'color-theme'
      }}
    >
      {colorPalettes7.map((palette, index) => (
        <MenuItem
          className={colorThemeIndex === index ? classes.selected : classes.root}
          value={index}
          key={`theme${index}`}
          // onMouseEnter={e => (e.target.style.color = '#fff')}
          // onMouseLeave={e => (e.target.style.color = '#fff')}
        >
          <ItemContainer>
            {`Style ${index + 1}`}
            <ColorSwatch palette={palette} />
          </ItemContainer>
        </MenuItem>
      ))}
    </Select>
  );
}
ColorSelectorWidget.propTypes = propTypes;

const ItemContainer = styled.div`
  display: flex;
  align-items: center;
`;

export default withStyles(styles)(ColorSelectorWidget);
