import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Slider from '@material-ui/lab/Slider';
import Switch from '@material-ui/core/Switch';
import ToggleButton from '@material-ui/lab/ToggleButton';
import { withStyles } from '@material-ui/core/styles';
import { PoseGroup } from 'react-pose';
import { Link } from 'react-router-dom';

import { numberWithCommas } from '../../utils/tools';
import { sceneParams } from '../../helpers/parameters';
import { coloringMethods } from '../../helpers/constants';
import { mapInfo } from '../../helpers/mapInfo';
import ColorSelectorWidget from './ColorSelectorWidget';
import * as S from './NavigationHeader.styles';

// Material-UI styles
const styles = theme => ({
  button: {
    margin: '2px', // theme.spacing.unit
    background: '#555'
  },
  input: {
    display: 'none'
  },
  // Note: move 'root' and 'selected' to a global interface style
  root: {
    width: '100%',
    color: '#fff',
    backgroundColor: '#000'
  },
  slider: {
    marginLeft: '15px'
  },
  select: {
    color: '#fff'
  },
  selected: {
    color: '#fff',
    backgroundColor: '#555 !important'
  },
  control: {
    backgroundColor: '#000'
  }
});

const propTypes = {
  classes: PropTypes.object.isRequired,
  colorThemeIndex: PropTypes.number.isRequired,
  coloringMethod: PropTypes.number.isRequired,
  isUsingColor: PropTypes.bool.isRequired,
  isAutoRotating: PropTypes.bool.isRequired,
  mapType: PropTypes.string.isRequired,
  moveSpeed: PropTypes.number.isRequired,
  numPoints: PropTypes.number.isRequired,
  onChangeColoringMethod: PropTypes.func.isRequired,
  onChangeSize: PropTypes.func.isRequired,
  onChangeSpeed: PropTypes.func.isRequired,
  onChangeTheme: PropTypes.func.isRequired,
  onToggleAutoRotate: PropTypes.func.isRequired,
  onToggleColor: PropTypes.func.isRequired,
  onZoom: PropTypes.func.isRequired,
  pointSize: PropTypes.number.isRequired
};

function NavigationHeader({
  classes,
  coloringMethod,
  colorThemeIndex,
  isAutoRotating,
  isUsingColor,
  mapType,
  moveSpeed,
  numPoints,
  onChangeColoringMethod,
  onChangeSize,
  onChangeSpeed,
  onChangeTheme,
  onToggleAutoRotate,
  onToggleColor,
  onZoom,
  pointSize
}) {
  const {
    maxPanSpeed, maxPointSize, minPanSpeed, minPointSize
  } = sceneParams;

  // state hook
  const [isShowingColorControls, setIsShowingColorControls] = useState(true);

  // when logo is clicked, show/hide the controls
  function onClickLogo() {
    setIsShowingColorControls(!isShowingColorControls);
  }

  return (
    <React.Fragment>
      <S.LogoIcon
        alt=""
        height="40"
        isShowingColorControls={isShowingColorControls}
        onClick={onClickLogo}
        src="/images/interface/spiral-icon-white.png"
        width="70"
      />
      <S.PosedControlPanel pose={isShowingColorControls ? 'visible2' : 'hidden2'}>
        <S.SectionSubTitle>Galaxy Class Map Viewer</S.SectionSubTitle>
        <S.SectionTitle>{`${mapInfo[mapType].name} Extragalactic Map`}</S.SectionTitle>
        <div>{numPoints > 0 ? `${numberWithCommas(numPoints)} Galaxies` : 'Loading...'}</div>
        <S.ColorSelectContainer>
          <S.PosedNavComponent key="colorControl">
            Use Color:
            <Switch
              checked={isUsingColor}
              color="primary"
              onChange={onToggleColor}
              value={isUsingColor}
            />
          </S.PosedNavComponent>
          <PoseGroup>
            <S.PosedNavSection key="navSection" pose={isUsingColor ? 'visible' : 'hidden'}>
              <S.PosedNavComponent key="coloringMethodControls">
                <Select
                  className={classes.select}
                  inputProps={{
                    name: 'coloringMethod',
                    id: 'color-method'
                  }}
                  onChange={onChangeColoringMethod}
                  value={coloringMethod}
                >
                  {Object.keys(coloringMethods).map((colorMethod, i) => (
                    <MenuItem
                      value={colorMethod}
                      key={`colorMethod${i}`}
                      className={colorMethod === i ? classes.selected : classes.root}
                    >
                      {coloringMethods[colorMethod]}
                    </MenuItem>
                  ))}
                </Select>
              </S.PosedNavComponent>
              <S.PosedNavComponent key="colorThemeControls">
                <ColorSelectorWidget
                  colorThemeIndex={colorThemeIndex}
                  onChangeTheme={onChangeTheme}
                />
              </S.PosedNavComponent>
            </S.PosedNavSection>
          </PoseGroup>
        </S.ColorSelectContainer>

        <S.ColorSelectContainer>
          <S.PosedNavComponent key="autoRotateControl">
            Auto-Rotate:
            <Switch
              checked={isAutoRotating}
              color="primary"
              onChange={onToggleAutoRotate}
              value={isAutoRotating}
            />
          </S.PosedNavComponent>
        </S.ColorSelectContainer>

        <S.SliderContainer>
          <div>Size:</div>
          <Slider
            classes={{ container: classes.slider }}
            defaultValue={12}
            max={maxPointSize}
            min={minPointSize}
            onChange={onChangeSize}
            value={pointSize}
          />
        </S.SliderContainer>
        <S.SliderContainer>
          <div>Speed:</div>
          <Slider
            classes={{ container: classes.slider }}
            defaultValue={7}
            max={maxPanSpeed}
            min={minPanSpeed}
            onChange={onChangeSpeed}
            value={moveSpeed}
          />
        </S.SliderContainer>
        <Link to="/">
          <Button className={classes.button} color="primary" onClick={() => {}} variant="contained">
            Select New Map
          </Button>
        </Link>
      </S.PosedControlPanel>
    </React.Fragment>
  );
}

NavigationHeader.propTypes = propTypes;

export default withStyles(styles)(NavigationHeader);
