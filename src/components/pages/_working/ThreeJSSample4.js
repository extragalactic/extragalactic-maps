import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';

import ImageLoader from '../sharedComponents/ImageLoader';
import { imageFileData } from '../../helpers/constants';
import { colorPalettes } from '../../helpers/colors';
import * as S from '../../styles/stylesMain';

function ThreeJSSample(props) {
  const materials = [];
  let camera = {};
  let frameId = 0;
  let imageTextures = [];
  let mouseX = 0;
  let mouseY = 0;
  let particleRoot = null;
  let renderer = {};
  let scene = {};
  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = window.innerHeight / 2;
  const sceneParams = {
    alphaTest: 0.2,
    depthOfField: 100,
    numParticles: 2000,
    particleSize: 40,
    zoneSize: 3000
  };
  const materialParams = {
    colorPaletteIndex: 1,
    useColor: true
  };
  if (materialParams.colorPaletteIndex >= colorPalettes.length) materialParams.colorPaletteIndex = 0;

  // const imageSetName = "caveGlyphs";
  // const imageSetName = "totemiGlyphs";
  const imageSetName = 'galaxies';

  // create ref hooks
  const mount = useRef(null);

  // create effects hooks
  useEffect(() => {
    async function loadImageTextures() {
      // loads the array of texture objects (waits until all textures are completely loaded)
      imageTextures = await ImageLoader.loadAllTextures({
        imageJSONFile: imageFileData[imageSetName].JSONFile,
        imagePath: imageFileData[imageSetName].imagePath
      });

      if (imageTextures && imageTextures.length > 0) {
        createScene();
      } else {
        console.error('Error: textures not loaded');
      }
    }
    loadImageTextures();

    return () => {
      stop();
      mount.current.removeChild(renderer.domElement);
    };
  });

  // build the scene, camera, geometries w/ materials & renderer
  function createScene() {
    const {
      depthOfField, zoneSize, particleSize, numParticles, alphaTest
    } = sceneParams;

    const width = mount.current.clientWidth;
    const height = mount.current.clientHeight;

    // create scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.0008);

    // create camera
    camera = new THREE.PerspectiveCamera(
      depthOfField,
      window.innerWidth / window.innerHeight,
      1,
      2000
    );
    camera.position.z = 500;
    camera.position.x = 500;
    camera.position.y = 300;

    // create material array
    for (let i = 0; i < imageTextures.length; i++) {
      const sprite = imageTextures[i];

      // determine the color for this point set (if there is one)
      const materialColor = materialParams.useColor
        ? colorPalettes[materialParams.colorPaletteIndex][
          i % colorPalettes[materialParams.colorPaletteIndex].length
        ]
        : null;

      // create materials
      materials[i] = new THREE.PointsMaterial({
        alphaTest,
        blending: THREE.NormalBlending,
        color: materialColor,
        depthTest: true,
        map: sprite,
        size: particleSize,
        transparent: true
      });
    }

    // create geometries
    const geometry = new THREE.BoxBufferGeometry(100, 100, 100);
    const material = new THREE.MeshNormalMaterial();
    particleRoot = new THREE.Mesh(geometry, material);
    particleRoot.position.x = 1000;
    scene.add(particleRoot);

    let object = {};
    let parent = particleRoot;
    const amount = 200;

    for (let i = 0; i < amount; i++) {
      object = new THREE.Mesh(geometry, materials[i % imageTextures.length]);
      object.position.x = 100;
      parent.add(object);
      parent = object;
    }
    parent = particleRoot;

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

  function renderUniverse() {
    const time = Date.now() * 0.001;
    const rx = Math.sin(time * 0.7) * 0.2;
    const ry = Math.sin(time * 0.3) * 0.1;
    const rz = Math.sin(time * 0.2) * 0.1;
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    particleRoot.traverse((object) => {
      object.rotation.x = rx;
      object.rotation.y = ry;
      object.rotation.z = rz;
    });

    // finally render the scene using the provided camera
    renderer.render(scene, camera);
  }

  return (
    <S.Page>
      <div>
        <PanelImageSet>
          <CenterContainer style={{ width: '100vw', height: '800px' }} ref={mount} />
        </PanelImageSet>
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

export default ThreeJSSample;
