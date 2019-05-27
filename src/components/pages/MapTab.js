import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
// import Button from '@material-ui/core/Button';

import MapSelectorWidget from '../sharedComponents/MapSelectorWidget';
import { useStateValue } from '../../utils/state';
import { numberWithCommas } from '../../utils/tools';
import { mapInfo } from '../../helpers/mapInfo';
import * as S from './MapTab.styles';

const propTypes = {
  theme: PropTypes.object.isRequired
};

function MapTab({ theme }) {
  // connect to global state/context
  const [{ mapType }, setMapType] = useStateValue();

  function onChangeMap(event, newMapType) {
    setMapType({
      type: 'updateMapType',
      value: newMapType.props.value
    });
  }

  return (
    <S.BodyText>
      <S.LeftColumn>
        <div>Select from the options below, then click the Start button.</div>
        <MapSelectorWidget mapType={mapType} onChangeMap={onChangeMap} />
        <S.StartButtonContainer>
          <Link to="/maps">
            <S.Button color="primary" onClick={() => {}} variant="contained" theme={theme}>
              <S.StartButton>Start</S.StartButton>
            </S.Button>
          </Link>
        </S.StartButtonContainer>
        <S.Paragraph>
          <S.GalaxyMapName>{mapInfo[mapType].description}</S.GalaxyMapName>
          <S.GalaxyCountField>
            {`Number of Galaxies: ${numberWithCommas(mapInfo[mapType].numberPoints)}`}
          </S.GalaxyCountField>
        </S.Paragraph>
      </S.LeftColumn>
      <S.RightColumn>
        <S.MapSampleImage
          src={`/images/pages/${mapInfo[mapType].thumbnail}`}
          alt=""
          theme={theme}
          width="100%"
        />
      </S.RightColumn>
    </S.BodyText>
  );
}

MapTab.propTypes = propTypes;

export default withTheme()(MapTab);
