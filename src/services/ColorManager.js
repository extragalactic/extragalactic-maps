import * as THREE from 'three-full';

// build color lookup table (LUT) based on a 7-color palette
function getColorLookupTable(colorPalette7, maxLutValue) {
  const maxLutColorSteps = 16;
  const colors = colorPalette7.map(color => `0x${color.slice(1)}`);
  let lut = new THREE.Lut('blackbody', 16);

  lut.addColorMap('2MASS', [
    [0.0, colors[0]],
    [0.13, colors[0]],
    [0.14, colors[1]],
    [0.25, colors[1]],
    [0.26, colors[2]],
    [0.37, colors[2]],
    [0.4, colors[3]],
    [0.49, colors[3]],
    [0.52, colors[4]],
    [0.63, colors[4]],
    [0.64, colors[5]],
    [0.71, colors[5]],
    [0.75, colors[6]],
    [1.0, colors[6]]
  ]);
  lut = lut.changeColorMap('2MASS', maxLutColorSteps);
  lut.setMax(maxLutValue);
  lut.setMin(0);

  return lut;
}

// assign colors from lookup table to points
function assignLUTColors(lut, points, distances) {
  const lutColors = [];
  const colorMultiplier = 2.55;

  // build color lookup table
  points.forEach((point, i) => {
    const color = lut.getColor(distances[point]);
    lutColors[3 * i] = color.r * colorMultiplier;
    lutColors[3 * i + 1] = color.g * colorMultiplier;
    lutColors[3 * i + 2] = color.b * colorMultiplier;
  });
  return lutColors;
}

// creating a Nearest-Neighbour "density" color map
function assignNNColors(lut, points, nearestNeighbours) {
  const lutColors = [];
  const colorMultiplier = 2.55;
  lut.setMax(7);

  // build color lookup table
  points.forEach((point, i) => {
    // let color;
    const NN = nearestNeighbours[point];
    const color = lut.getColor(NN);

    // if (NN <= 1) {
    //   color = { r: 1, g: 1, b: 1 }; // white
    // } else if (NN <= 2) {
    //   color = { r: 1, g: 1, b: 0 }; // yellow
    // } else if (NN <= 4) {
    //   color = { r: 0, g: 1, b: 0 }; // green
    // } else if (NN <= 5) {
    //   color = { r: 1, g: 0.2, b: 0.8 }; // pink
    // } else {
    //   color = { r: 1, g: 0.2, b: 0.2 }; // red
    // }

    lutColors[3 * i] = color.r * colorMultiplier;
    lutColors[3 * i + 1] = color.g * colorMultiplier;
    lutColors[3 * i + 2] = color.b * colorMultiplier;
  });

  return lutColors;
}

export { assignLUTColors, assignNNColors, getColorLookupTable };
