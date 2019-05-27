// Earlier version of ThreeJSSample:

// const numIterations = pointReplicator ? imageTextures.length : 1;
// for (let i = 0; i < numIterations; i++) {
//   const sprite = imageTextures[i];

//   // determine the single color for this point set (if there is one)
//   const materialColor = materialParams.useSingleColor
//     ? colorPalettes[materialParams.colorPaletteIndex][
//         i % colorPalettes[materialParams.colorPaletteIndex].length
//       ]
//     : null;

//   // build color lookup table
//   const colorMultiplier = 2.55;
//   for (let i = 0; i < distances.length; i++) {
//     const color = lut.getColor(distances[i]);
//     lutColors[3 * i] = color.r * colorMultiplier;
//     lutColors[3 * i + 1] = color.g * colorMultiplier;
//     lutColors[3 * i + 2] = color.b * colorMultiplier;
//   }
//   if (useColorLUT) {
//     geometry.addAttribute(
//       "color",
//       new THREE.Float32BufferAttribute(lutColors, 3)
//     );
//   }

//   // create materials
//   materials[i] = new THREE.PointsMaterial({
//     alphaTest: alphaTest,
//     blending: THREE.NormalBlending,
//     color: materialColor,
//     vertexColors: useColorLUT ? THREE.VertexColors : THREE.NoColors,
//     depthTest: true,
//     map: sprite,
//     size: particleSize,
//     transparent: true
//   });

//   const particles = new THREE.Points(geometry, materials[i]);

//   // add the point cloud to the scene
//   parentObject.add(particles);
//   parentObject = particles;
// }

// --------------------------------------------
// The old createGeometry function...

// build the geometries w/ materials & renderer
function createGeometry_Old() {
  const { alphaTest, particleSize, startIndex } = sceneParams;

  // get data for points (position, nearest-neighbour, and distance to origin)
  const vertices = getPositions(mapType, pointData).slice(startIndex * 3);
  const nearestNeighbours = getNearestNeighbours(mapType, pointData).slice(startIndex);
  distances = getDistances(mapType, pointData).slice(startIndex);

  // build color lookup table (LUT)
  lut = getColorLookupTable(colorPalettes7[colorThemeIndex]);

  // create particles (using the geometry & materials)
  const parentObject = scene;
  const numPoints = distances.length;
  const numGroups = imageTextures.length;
  const pointsPerGroup = Math.floor(numPoints / numGroups);

  // Create point geometry by breaking up the points into groups, where each group has a single image type
  // (Note that while points can still be individually colored, ThreeJS limits a point cloud to use a single texture,
  // and I don't think it's possible to use a sprite sheet for a points geo unless you're just animating an image)
  for (let i = 0; i < numGroups; i += 1) {
    const sprite = imageTextures[i];

    // build a subset of vertices
    const subVertices = [];
    for (let k = 0; k < pointsPerGroup; k += 1) {
      const pointIndex = numGroups * k + i;
      subVertices.push(
        vertices[pointIndex * 3],
        vertices[pointIndex * 3 + 1],
        vertices[pointIndex * 3 + 2]
      );
    }

    // create geometry
    geometry[i] = new THREE.BufferGeometry();
    geometry[i].addAttribute('position', new THREE.Float32BufferAttribute(subVertices, 3));

    // determine the single color for this point set (if there is one)
    const materialColor = applyBaseColor && i >= 0
      ? colorPalettes7[colorThemeIndex][i % colorPalettes7[colorThemeIndex].length]
      : null;

    // build color lookup table
    const lutColors = assignNNColors(
      lut,
      numGroups,
      pointsPerGroup,
      i,
      nearestNeighbours,
      distances
    );
    geometry[i].addAttribute('color', new THREE.Float32BufferAttribute(lutColors, 3));

    // create materials
    materials[i] = new THREE.PointsMaterial({
      alphaTest,
      blending: THREE.NormalBlending,
      color: isUsingColorLUT ? '#fff' : materialColor,
      vertexColors: isUsingColorLUT ? THREE.VertexColors : THREE.NoColors,
      depthTest: true,
      map: sprite,
      size: particleSize,
      transparent: true
    });

    const particles = new THREE.Points(geometry[i], materials[i]);
    particles.visible = false;

    // add the point cloud to the scene
    parentObject.add(particles);
  }
} // end createScene
