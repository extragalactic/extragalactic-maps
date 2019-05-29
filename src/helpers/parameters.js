// All parameters and their default values
const appParams = {
  interfaceAnimationStaggerDelay: 120,
  interfaceFadeDelay: 150,
  runInBackground: false
};
const sceneParams = {
  alphaTest: 0.5,
  fogLevel: 0, // 0.0003,
  globalTimeFactor: 0.08,
  isAutoRotating: true,
  mapType: 'Zwicky',
  maxPanSpeed: 7,
  maxPointSize: 75,
  minPanSpeed: 0.05,
  minPointSize: 1,
  numParticles: 1500, // num particles for random option
  panSpeed: 3,
  particleSize: 9,
  pointReplicator: false,
  startIndex: 0,
  zoneSize: 3000 // location constraint for random option
};
const cameraParams = {
  depthOfField: 100,
  moveStepAmount: 7, // amount to move for each key press
  nearPlane: 5,
  startLocation: [0, 0, 500]
};
const materialParams = {
  applyBaseColor: false,
  colorPaletteIndex: 7,
  coloringMethod: 'ColorByDistance',
  isUsingColorLUT: false,
  isUsingFullImageset: true
};

export {
  sceneParams, cameraParams, materialParams, appParams
};
