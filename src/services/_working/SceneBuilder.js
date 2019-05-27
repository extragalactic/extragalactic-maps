import * as THREE from 'three-full';

import { getPositions, getDistances, getNearestNeighbours } from '../utils/PointManager';

function buildScene() {
  const {
    alphaTest, fogLevel, particleSize, pointReplicator, startIndex
  } = sceneParams;
  const { depthOfField, nearPlane, startLocation } = cameraParams;
  // const width = mount.current.clientWidth;
  // const height = mount.current.clientHeight;

  // create scene
  const scene = new THREE.Scene();
  scene.autoUpdate = true;
  scene.fog = new THREE.FogExp2(0x000000, fogLevel);

  // create camera
  camera = new THREE.PerspectiveCamera(
    depthOfField,
    window.innerWidth / window.innerHeight,
    nearPlane,
    20000
  );
  camera.position.set(...startLocation);

  // get data for points (position, nearest-neighbour, and distance to origin)
  const vertices = getPositions(mapType, pointData).slice(startIndex * 3);
  const nearest = getNearestNeighbours(mapType, pointData).slice(startIndex);
  distances = getDistances(mapType, pointData).slice(startIndex);

  // build color lookup table (LUT)
  lut = getColorLookupTable(colorPalettes7[colorThemeIndex]);

  // create particles (using the geometry & materials)
  const parentObject = scene;
  const numPoints = distances.length;
  const numGroups = imageTextures.length;
  const pointsPerGroup = Math.floor(numPoints / numGroups);

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
    const lutColors = assignNNColors(lut, numGroups, pointsPerGroup, i, nearest, distances);
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
  return scene;
}

export { buildScene };
