import React from "react";
import * as THREE from "three";
import styled from "styled-components";

import { loadAllImages } from "../sharedComponents/ImageLoader";
import * as S from "../../styles/stylesMain";

class ThreeJSSample extends React.Component {
  constructor() {
    super();
    this.mouseX = 0;
    this.mouseY = 0;
  }

  componentDidMount() {
    // // load image assets
    // this.imageAssets = new Promise(resolve => {
    //   loadAllImages();
    // }).then(() => {
    //   this.createScene();
    // });
    this.imageAssets = loadAllImages();
    this.createScene();
  }

  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
  }

  createScene = () => {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;

    // add camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      2000
    );
    this.camera.position.z = 500; // 1000

    // add scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x000000, 0.0008);

    // create random points matrix
    let vertices = [];
    for (let i = 0; i < 3000; i++) {
      const x = Math.random() * 4000 - 2000;
      const y = Math.random() * 4000 - 2000;
      const z = Math.random() * 4000 - 2000;
      vertices.push(x, y, z);
    }

    // add geometries
    const geometry = new THREE.BufferGeometry();
    geometry.addAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );

    // create particles
    this.materials = [];

    for (let i = 0; i < this.imageAssets.length; i++) {
      const sprite = this.imageAssets[i];
      const size = 25;

      this.materials[i] = new THREE.PointsMaterial({
        size: size,
        map: sprite,
        blending: THREE.NormalBlending,
        depthTest: true,
        transparent: true,
        alphaTest: 0.2
      });

      const particles = new THREE.Points(geometry, this.materials[i]);
      this.scene.add(particles);
    }

    // add renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.renderer.sortObjects = true;
    this.mount.appendChild(this.renderer.domElement);

    // add light
    // var light = new THREE.PointLight(0xffffff, 1);
    // this.camera.add(light);

    // add helper axis
    // this.scene.add(new THREE.AxesHelper(20));

    window.addEventListener("resize", this.onWindowResize, false);

    this.start();
  };

  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  };

  stop = () => {
    cancelAnimationFrame(this.frameId);
  };

  animate = () => {
    requestAnimationFrame(this.animate);
    this.renderUniverse();
  };

  onWindowResize = () => {
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  renderUniverse = () => {
    const { camera, mouseX, mouseY, renderer, scene } = this;
    // rotate positions
    let time = Date.now() * 0.00001;
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    for (let i = 0; i < scene.children.length; i++) {
      const object = scene.children[i];
      if (object instanceof THREE.Points) {
        object.rotation.y = time * (i + 1);
      }
    }
    renderer.render(scene, camera);
  };

  render() {
    return (
      <S.Page>
        <div>
          <PanelImageSet>
            <CenterContainer
              style={{ width: "100vw", height: "800px" }}
              ref={mount => {
                this.mount = mount;
              }}
            />
          </PanelImageSet>
        </div>
      </S.Page>
    );
  }
}

// SAVE THIS for later ...
// sampleSpriteSheet = (texture, samplePosX, samplePosY) => {
//   const tilesDimension = 4;
//   texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
//   texture.repeat.set(1 / tilesDimension, 1 / tilesDimension);

//   texture.offset.x = samplePosX / tilesDimension;
//   texture.offset.y = samplePosY / tilesDimension;

//   return texture;
// };

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
