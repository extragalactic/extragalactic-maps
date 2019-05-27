import React, { useEffect, useRef } from 'react';
import * as THREE from 'three-full';
import styled from 'styled-components';
import KeyHandler, { KEYPRESS } from 'react-key-handler';

import {
  getDistance2MASS,
  getDistanceGeneric,
  getPoints2MASS,
  getPointsRandom,
  getPointsZwicky,
  loadPointData
} from '../sharedComponents/PointData';
import ImageLoader from '../sharedComponents/ImageLoader';
import { imageFileData } from '../../helpers/constants';
import { colorPalettes } from '../../helpers/colors';
import * as S from '../../styles/stylesMain';

function Universe(props) {
  let pointData = [];
  let mouseX = 0;
  let mouseY = 0;
  let camera = {};
  let scene = {};
  let renderer = {};
  let imageTextures = [];
  let frameId = 0;
  let lut;
  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = window.innerHeight / 2;
  const sceneParams = {
    alphaTest: 0.5,
    fogLevel: 0, // 0.0001,
    globalTimeFactor: 0.2,
    numParticles: 1500, // num particles for random option
    particleSize: 20,
    pointReplicator: false,
    zoneSize: 3000 // location constraint for random option
  };
  const cameraParams = {
    depthOfField: 100,
    nearPlane: 40
  };

  // const imageSetName = "caveGlyphs";
  // const imageSetName = "totemiGlyphs";
  const imageSetName = 'galaxies';

  const materialParams = {
    colorPaletteIndex: 3,
    useColorLUT: true,
    useSingleColor: false
  };

  if (
    materialParams.colorPaletteIndex >= colorPalettes.length
    || materialParams.colorPaletteIndex < 0
  ) materialParams.colorPaletteIndex = colorPalettes.length - 1;

  // create ref hooks
  const mount = useRef(null);

  // create effects hooks
  useEffect(() => {
    async function loadAllData() {
      // loads the array of texture objects (waits until all textures are completely loaded)
      imageTextures = await ImageLoader.loadAllTextures({
        imageJSONFile: imageFileData[imageSetName].JSONFile,
        imagePath: imageFileData[imageSetName].imagePath
      });

      if (!imageTextures || imageTextures.length <= 0) {
        console.error('Error: textures not loaded');
      }
      // load point data
      // pointData = await loadPointData({ filePath: "/data/Zwicky-20K.csv" });
      pointData = await loadPointData({ filePath: '/data/2MASS_DB.csv' });
      if (pointData.length <= 0) {
        console.error('Error: cannot load point data from CSV');
      }

      createScene();
    }
    loadAllData();

    return () => {
      stop();
      mount.current.removeChild(renderer.domElement);
    };
  });

  // build the scene, camera, geometries w/ materials & renderer
  function createScene() {
    const {
      fogLevel,
      zoneSize,
      particleSize,
      numParticles,
      alphaTest,
      pointReplicator
    } = sceneParams;
    const { depthOfField, nearPlane } = cameraParams;
    const { useColorLUT } = materialParams;
    const width = mount.current.clientWidth;
    const height = mount.current.clientHeight;

    // create scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, fogLevel);

    // create camera
    camera = new THREE.PerspectiveCamera(
      depthOfField,
      window.innerWidth / window.innerHeight,
      nearPlane,
      20000
    );
    camera.position.z = 2000;

    // create random points matrix
    let vertices = [];

    // vertices = getPointsRandom(numParticles, zoneSize);
    // let distances = getDistanceGeneric(numParticles, zoneSize);

    // vertices = getPointsZwicky(pointData);

    vertices = getPoints2MASS(pointData);
    const distances = getDistance2MASS(pointData);

    // create geometries
    const geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    // build color lookup table (LUT)
    const lutColors = [];
    lut = new THREE.Lut('blackbody', 16);

    lut.addColorMap('2MASS', [
      [0.0, '0xFF69B4'],
      [0.12, '0xFF69B4'],
      [0.13, '0x0080FF'],
      [0.23, '0x0080FF'],
      [0.24, '0x00FFFF'],
      [0.37, '0x00FFFF'],
      [0.4, '0x00FF00'],
      [0.49, '0x00FF00'],
      [0.52, '0xFFFF00'],
      [0.63, '0xFFFF00'],
      [0.64, '0xFF8C00'],
      [0.71, '0xFF8C00'],
      [0.75, '0xFF0000'],
      [1.0, '0xFF0000']
    ]);
    lut = lut.changeColorMap('2MASS', 16);
    lut.setMax(70000);
    lut.setMin(0);

    // create particles (using the geometry & materials)
    const materials = [];
    let parentObject = scene;

    const numPoints = distances.length;
    const numGroups = imageTextures.length;
    const pointsPerGroup = Math.floor(numPoints / numGroups);

    const numIterations = pointReplicator ? imageTextures.length : 1;
    for (let i = 0; i < numIterations; i++) {
      const sprite = imageTextures[i];

      // determine the single color for this point set (if there is one)
      const materialColor = materialParams.useSingleColor
        ? colorPalettes[materialParams.colorPaletteIndex][
          i % colorPalettes[materialParams.colorPaletteIndex].length
        ]
        : null;

      // build color lookup table
      const colorMultiplier = 2.55;
      for (let i = 0; i < distances.length; i++) {
        const color = lut.getColor(distances[i]);
        lutColors[3 * i] = color.r * colorMultiplier;
        lutColors[3 * i + 1] = color.g * colorMultiplier;
        lutColors[3 * i + 2] = color.b * colorMultiplier;
      }
      if (useColorLUT) {
        geometry.addAttribute('color', new THREE.Float32BufferAttribute(lutColors, 3));
      }

      // create materials
      materials[i] = new THREE.PointsMaterial({
        alphaTest,
        blending: THREE.NormalBlending,
        color: materialColor,
        vertexColors: useColorLUT ? THREE.VertexColors : THREE.NoColors,
        depthTest: true,
        map: sprite,
        size: particleSize,
        transparent: true
      });

      const particles = new THREE.Points(geometry, materials[i]);

      // add the point cloud to the scene
      parentObject.add(particles);
      parentObject = particles;
    }

    // create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.sortObjects = true;

    // add the renderer to the DOM
    mount.current.appendChild(renderer.domElement);

    // add listeners
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);

    start();
  }

  function start() {
    if (!frameId) {
      frameId = requestAnimationFrame(animate);
    }
  }

  function stop() {
    cancelAnimationFrame(frameId);
  }

  function animate() {
    requestAnimationFrame(animate);
    renderUniverse();
  }

  function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
  }

  function handleKeyPress(event) {
    event.preventDefault();
    console.log(event.key);
    if (event.key === 'w') {
      camera.position.z = camera.position.z - 100;
    } else if (event.key === 's') {
      camera.position.z = camera.position.z + 100;
    }
    // else if (event.key === "a") {
    //   camera.position.y = camera.position.y - 50;
    // } else if (event.key === "d") {
    //   camera.position.y = camera.position.y + 50;
    // }
  }

  function rotateObjects() {
    const { globalTimeFactor } = sceneParams;

    const time = Date.now() * 0.0002;
    const rx = Math.sin((time + 2) * 0.7) * globalTimeFactor;
    const ry = (Math.cos(time * 0.3) * globalTimeFactor) / 2;
    const rz = (Math.sin(time * 0.2) * globalTimeFactor) / 2;

    // traverse full heirarchy of each object, and apply rotation
    scene.traverse((object) => {
      // object.rotation.x = rx;
      // object.rotation.y = ry;
      // object.rotation.z = rz;
    });

    // auto-rotate all root-level objects
    for (let i = 0; i < scene.children.length; i++) {
      const object = scene.children[i];
      if (object instanceof THREE.Points) {
        object.rotation.y = time * (i + 0.5) * 4 * globalTimeFactor;
        // object.rotation.z = time * (i + 0.5) * -3 * globalTimeFactor;
      }
    }
  }

  function renderUniverse() {
    // change camera lookat position based on mouse position
    camera.position.x += (mouseX - camera.position.x) * 0.5;
    camera.position.y += (-mouseY - camera.position.y) * 0.5;
    camera.lookAt(scene.position);

    // do all rotations
    rotateObjects();

    // finally render the scene using the provided camera
    renderer.render(scene, camera);
  }

  // Note: likely move this to KeyboardInput.js
  function renderKeyboardHandlers() {
    return (
      <React.Fragment>
        <KeyHandler keyEventName={KEYPRESS} keyValue="w" onKeyHandle={handleKeyPress} />
        <KeyHandler keyEventName={KEYPRESS} keyValue="s" onKeyHandle={handleKeyPress} />
        <KeyHandler keyEventName={KEYPRESS} keyValue="a" onKeyHandle={handleKeyPress} />
        <KeyHandler keyEventName={KEYPRESS} keyValue="d" onKeyHandle={handleKeyPress} />
      </React.Fragment>
    );
  }

  return (
    <S.Page>
      <div>
        {renderKeyboardHandlers()}
        <PanelImageSet>
          <CenterContainer style={{ width: '100vw', height: '800px' }} ref={mount} />
        </PanelImageSet>
        <Footer>
          My experiments with 3D Javascript.
          <br />
          <FooterTextLink href="http://www.facebook.com/vj.elfmaster">
            Say hi on Facebook
          </FooterTextLink>
        </Footer>
        <div>
          <input type="text" id="one" onKeyPress={handleKeyPress} />
        </div>
      </div>
    </S.Page>
  );
}

// StyledComponents
const CenterContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const PanelImageSet = styled.div`
  display: flex;
  width: 100%;
`;

const Footer = styled.div`
  height: 50px;
  text-align: center;
  margin: 20px;
`;
const FooterTextLink = styled.a`
  text-align: center;
  color: #777;
`;

export default Universe;
