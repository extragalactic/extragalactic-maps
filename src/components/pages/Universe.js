import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three-full';
import { tween, easing } from 'popmotion';
import OrbitControls from '../../lib/threejs/OrbitControls'; // modded version of OrbitControls

import { getPositions, getDistances, getNearestNeighbours } from '../../services/PointManager';
import { loadAllTextures } from '../../services/ImageLoader';
import { assignImagesToPoints, initializeImageManager } from '../../services/ImageManager';
import { loadPointData, loadGalaxyData } from '../../services/DataLoader';
import { rotateObjects } from '../../services/SceneAnimator';
import { assignLUTColors, assignNNColors, getColorLookupTable } from '../../services/ColorManager';

// import GalacticMap from '../sharedComponents/GalacticMap';
import NavigationHeader from '../sharedComponents/NavigationHeader';

import { useStateValue } from '../../utils/state';
import { imageFileData, imageTypes } from '../../helpers/constants';
import {
  appParams, sceneParams, cameraParams, materialParams
} from '../../helpers/parameters';
import { mapInfo } from '../../helpers/mapInfo';
import { colorPalettes7 } from '../../helpers/colors';
import * as S from './Universe.styles';

const geometry = [];
const materials = [];
let spriteIndexData = {};
let camera = {};
let controls;
let distances = [];
let galaxyImageData = [];
let scene = {};
let isAutoRotating = false; // why not work as state var?

const propTypes = {
  theme: PropTypes.object.isRequired
};

function Universe({ theme }) {
  // let mouseX = 0;
  // let mouseY = 0;
  let renderer = {};
  let frameId = 0;
  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = window.innerHeight / 2;

  // const imagesType = imageTypes.CAVE_IMAGES;
  // const imagesType = imageTypes.TOTEMICAL_IMAGES;
  const imagesType = imageTypes.GALAXY_IMAGES;

  // create ref hooks
  const mount = useRef(null);

  // create local state hooks
  const [colorThemeIndex, setColorThemeIndex] = useState(materialParams.colorPaletteIndex);
  if (colorThemeIndex >= colorPalettes7.length || colorThemeIndex < 0) setColorThemeIndex(colorPalettes7.length - 1);

  const [isUsingColorLUT, setIsUsingColorLUT] = useState(materialParams.isUsingColorLUT);
  const [coloringMethod, setColoringMethod] = useState(materialParams.coloringMethod);
  // const [isAutoRotating, setIsAutoRotating] = useState(sceneParams.isAutoRotating);

  const [pointSize, setPointSize] = useState(sceneParams.particleSize);
  const [moveSpeed, setMoveSpeed] = useState(sceneParams.panSpeed);
  const [isLoaded, setIsLoaded] = useState(false);
  const [pointData, setPointData] = useState([]);

  // connect to global state/context
  const [{ imageTextures }, setImageTextures] = useStateValue();
  const [{ mapType }, setMapType] = useStateValue();

  // ===================== REACT HOOKS =====================
  // create effects hook to load data on component mount
  useEffect(() => {
    async function loadAllData() {
      // loads the array of texture objects (images)
      const imageTexturesLoaded = await loadAllTextures({
        imagesListFile: imageFileData[imagesType].imagesListFile,
        imagePath: imageFileData[imagesType].imagePath
      });

      // load point data
      const loadedPointData = await loadPointData(mapType);
      if (pointData.length <= 0) {
        console.error('Error: cannot load point data from CSV');
      }
      setPointData(loadedPointData);

      // load info on galaxy images
      galaxyImageData = await loadGalaxyData();
      if (galaxyImageData.length <= 0) {
        console.error('Error: cannot load galaxy data from CSV');
      }
      initializeImageManager(imagesType, galaxyImageData);

      // set the global state var to store images, then the scene is created on the next render
      setImageTextures({
        type: 'updateImageTextures',
        value: imageTexturesLoaded
      });
    } // end loadAllData
    loadAllData();

    createScene();

    return () => {
      // Note: this likely will require a more thorough cleanup of objects
      if (appParams.runInBackground === false) {
        stop();
        mount.current.removeChild(renderer.domElement);
      }
    };
  }, []); // runs once for mount and dismount (Note: i need to install the full eslint plugin to get perfect syntax for hooks)

  // render scene once image textures have been loaded
  useEffect(() => {
    console.log('hook: textures changed');
    if (!imageTextures || imageTextures.length <= 0) {
      console.error('Error: textures not loaded');
      return;
    }
    createGeometry();
    createRenderer();
    addListeners();
    onZoom();
    start();
  }, [imageTextures]);

  // when component updates (isUsingColorLUT, pointSize) refresh the materials
  useEffect(() => {
    console.log('hook: use color option or point size changed');
    if (materials) {
      materials.forEach((mat, i) => {
        materials[i].size = pointSize;
        materials[i].vertexColors = isUsingColorLUT ? THREE.VertexColors : THREE.NoColors;
        materials[i].needsUpdate = true;
      });
    }
  }, [isUsingColorLUT, pointSize]);

  // load new point data when the map type changes
  useEffect(() => {
    console.log('hook: mapType changed: ', mapType);
    loadMap();
  }, [mapType]);

  // refresh the map when the point data changes
  useEffect(() => {
    console.log('hook: pointData changed');
    if (pointData.length > 0 && mapType !== sceneParams.mapType) {
      console.log('new point data detected: ', pointData);
      // createGeometry();
    }
  }, [pointData]);

  // when component updates, refresh the colors applied to the geometries
  useEffect(() => {
    console.log('hook: geo colors changed');
    if (geometry && imageTextures.length > 0) {
      const lut = getColorLookupTable(
        colorPalettes7[colorThemeIndex],
        mapInfo[mapType].distanceLimit
      );
      const nearestNeighbours = getNearestNeighbours(mapType, pointData); // note: removed optional slice()
      let i = 0;

      Object.keys(spriteIndexData).forEach((group) => {
        // in each group, loop through the assigned galaxy images
        spriteIndexData[group].forEach((image) => {
          // for each galaxy image, create the point cloud from the assigned points array
          const points = image.assignedPoints;
          let lutColors;
          if (coloringMethod === 'ColorByDensity') {
            lutColors = assignNNColors(lut, points, nearestNeighbours);
          } else {
            lutColors = assignLUTColors(lut, points, distances);
          }
          geometry[i].addAttribute('color', new THREE.Float32BufferAttribute(lutColors, 3));
          geometry[i].needsUpdate = true;
          i += 1;
        });
      });
    }
  });
  // ===================== End of Hooks =====================

  // build the scene & camera
  function createScene() {
    const { fogLevel } = sceneParams;
    const { depthOfField, nearPlane, startLocation } = cameraParams;

    // create scene
    scene = new THREE.Scene();
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
  }

  // create geometry point clouds
  function createGeometry() {
    const { alphaTest, particleSize, startIndex } = sceneParams;
    const parentObject = scene;

    // get data for points (position, nearest-neighbour, and distance to origin)
    // console.log('points:');
    // console.log(pointData);
    const vertices = getPositions(mapType, pointData); // .slice(startIndex * 3);
    // console.log('vertices:');
    // console.log(vertices);

    const nearestNeighbours = getNearestNeighbours(mapType, pointData).slice(startIndex);
    distances = getDistances(mapType, pointData); // .slice(startIndex);
    // console.log('distances:');
    // console.log(distances);

    // build color lookup table (LUT)
    const lut = getColorLookupTable(
      colorPalettes7[colorThemeIndex],
      mapInfo[mapType].distanceLimit
    );

    // calculate which points are assigned to each image
    spriteIndexData = assignImagesToPoints(imageTextures, nearestNeighbours);

    // a loop counter, one entry for each material/geometry (1:1)
    let matGeoCount = 0;

    // loop through each galaxy group (spiral, elliptical, lenticular) and create particle groups
    Object.keys(spriteIndexData).forEach((group) => {
      // in each group, loop through the assigned galaxy images
      spriteIndexData[group].forEach((image) => {
        // for each galaxy image, create the point cloud from the assigned points array
        const points = image.assignedPoints;
        const subVertices = [];
        points.forEach((value) => {
          subVertices.push(vertices[value * 3], vertices[value * 3 + 1], vertices[value * 3 + 2]);
        });

        // create geometry
        geometry[matGeoCount] = new THREE.BufferGeometry();
        geometry[matGeoCount].addAttribute(
          'position',
          new THREE.Float32BufferAttribute(subVertices, 3)
        );

        // build color lookup table (default is NN coloring for now...)
        const lutColors = assignNNColors(lut, points, nearestNeighbours);

        geometry[matGeoCount].addAttribute('color', new THREE.Float32BufferAttribute(lutColors, 3));

        // create materials
        materials[matGeoCount] = new THREE.PointsMaterial({
          alphaTest,
          blending: THREE.NormalBlending,
          color: null,
          vertexColors: isUsingColorLUT ? THREE.VertexColors : THREE.NoColors,
          depthTest: true,
          map: imageTextures[image.imageIndex],
          size: particleSize,
          transparent: true
        });

        const particles = new THREE.Points(geometry[matGeoCount], materials[matGeoCount]);
        particles.visible = false;

        // add the point cloud to the scene
        parentObject.add(particles);

        matGeoCount += 1;
      });
    });
  }

  // create renderer object and add to the DOM
  function createRenderer() {
    const width = mount.current.clientWidth;
    const height = mount.current.clientHeight;

    // create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.sortObjects = true;
    renderer.gammaOutput = true;
    renderer.gammaFactor = 0.7;

    // add the renderer to the DOM
    mount.current.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    document.addEventListener(
      'keyDown',
      (event) => {
        event.stopPropagation();
      },
      true
    );

    // trigger a resize event to init the screen-size dependent vars
    onWindowResize();
  }

  // add all interface listeners
  function addListeners() {
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
  }

  // start ThreeJS engine
  function start() {
    if (!frameId) {
      frameId = requestAnimationFrame(animate);
    }
    setIsLoaded(true);
    // all objects are hidden until everything is ready (prevents screen flicker)
    for (let i = 0; i < scene.children.length; i += 1) {
      const object = scene.children[i];
      if (object instanceof THREE.Points) {
        object.visible = true;
      }
    }
  }

  function stop() {
    cancelAnimationFrame(frameId);
  }

  function animate() {
    controls.update();
    requestAnimationFrame(animate);
    renderUniverse();
  }

  function loadMap() {
    async function loadNewPointData() {
      // load point data
      const loadedPointData = await loadPointData(mapType);
      if (pointData.length <= 0) {
        console.error('Error: cannot load point data from CSV');
      }
      setPointData(loadedPointData);
    }
    loadNewPointData();
  }

  function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function onDocumentMouseMove(event) {
    // mouseX = event.clientX - windowHalfX;
    // mouseY = event.clientY - windowHalfY;
  }

  function onToggleColor() {
    setIsUsingColorLUT(prevState => !prevState);
  }

  function onToggleAutoRotate() {
    isAutoRotating = !isAutoRotating;
  }

  function onChangeMap(event, newMapType) {
    setMapType(newMapType.props.value);
  }

  function onChangeSize(event, newPointSize) {
    setPointSize(newPointSize);
  }

  function onChangeSpeed(event, newSpeed) {
    setMoveSpeed(newSpeed);
    controls.setSpeed(newSpeed);
  }

  function onChangeTheme(event, selectedIndex) {
    setColorThemeIndex(selectedIndex.props.value);
  }

  function onChangeColoringMethod(event, newColoringMethod) {
    setColoringMethod(newColoringMethod.props.value);
  }

  function onZoom() {
    tween({
      to: 1,
      duration: 800,
      ease: easing.linear
    }).start((value) => {
      controls.dollyOut(0.95);
    });
  }

  // this function is called every frame
  function renderUniverse() {
    // change camera lookat position based on mouse position
    // camera.position.x += (mouseX * -2 - camera.position.x) * 0.5;
    // camera.position.y += (mouseY * -4 - camera.position.y) * 0.5;

    // const speed = Date.now() * 0.0025;
    // camera.position.x = Math.cos(speed) * 100;
    // camera.position.z = Math.sin(speed) * 100;

    // camera.lookAt(scene.position);
    // camera.lookAt(mouseX, mouseY, 5000);

    if (isAutoRotating) {
      // do all rotations
      camera.rotation.x += 500;
      // camera.rotation.y += 120;
      // camera.rotation.z += 260;
      rotateObjects(scene, sceneParams);
    }

    // finally render the scene using the provided camera
    renderer.render(scene, camera);
  }

  return (
    <S.Page>
      <S.PageContainer>
        <S.Viewport>
          <S.ThreeJSContainer ref={mount} />
          <S.Header>
            <NavigationHeader
              coloringMethod={coloringMethod}
              colorThemeIndex={colorThemeIndex}
              isUsingColor={isUsingColorLUT}
              isAutoRotating={isAutoRotating}
              mapType={mapType}
              moveSpeed={moveSpeed}
              numPoints={isLoaded ? distances.length : 0}
              pointSize={pointSize}
              onChangeColoringMethod={onChangeColoringMethod}
              onChangeSize={onChangeSize}
              onChangeSpeed={onChangeSpeed}
              onChangeTheme={onChangeTheme}
              onToggleColor={onToggleColor}
              onToggleAutoRotate={onToggleAutoRotate}
              onZoom={onZoom}
            />
          </S.Header>
        </S.Viewport>
        <S.Footer>{/* */}</S.Footer>
      </S.PageContainer>
    </S.Page>
  );
}
Universe.propTypes = propTypes;

export default Universe;
