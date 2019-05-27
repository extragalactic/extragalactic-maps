import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';

// import * as S from '../../styles/stylesMain';
import { mapSetTypes, mapInfo } from '../../helpers/mapInfo';

// Material-UI styles
const styles = theme => ({
  button: {
    margin: '2px', // theme.spacing.unit
    background: '#555'
  },
  widgetText: {
    fontSize: '1.1em'
  }
});

const propTypes = {
  classes: PropTypes.object.isRequired,
  mapType: PropTypes.string.isRequired,
  onChangeMap: PropTypes.func.isRequired
};

// Component to create a map selector dropdown
function MapSelectorWidget({ classes, mapType, onChangeMap }) {
  return (
    <MapSelector>
      {'Select Map: '}
      <Select
        className={classes.widgetText}
        inputProps={{
          name: 'map',
          id: 'map-type'
        }}
        onChange={onChangeMap}
        value={mapSetTypes[mapType]}
      >
        {Object.keys(mapSetTypes).map((type, i) => (
          <MenuItem value={type} key={`mapType${i}`} className={classes.widgetText}>
            {`${mapInfo[type].name}`}
          </MenuItem>
        ))}
      </Select>
    </MapSelector>
  );
}

MapSelectorWidget.propTypes = propTypes;

const MapSelector = styled.div`
  font-size: 1.3em;
  color: #aaa;
  margin: 5px;
`;

export default withStyles(styles)(MapSelectorWidget);
