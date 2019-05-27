import * as React from "react";
import * as THREE from "three";
// import styled from "styled-components";
// import posed from "react-pose";

import * as S from "../../styles/stylesMain";

class ThreeJSSample extends React.Component {
  componentDidMount() {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;
    // add scene
    this.scene = new THREE.Scene();
    // add camera
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 2;
    // add renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor("#000000");
    this.renderer.setSize(width, height);
    this.mount.appendChild(this.renderer.domElement);

    // add geometries
    const geometry = new THREE.IcosahedronGeometry(1, 0);
    const material = new THREE.MeshBasicMaterial({ color: "#433F81" });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    // ... testing sprite ...
    var map2 = new THREE.TextureLoader().load(
      "../../assets/png/galaxies/M81.png"
    );
    var material2 = new THREE.SpriteMaterial({ map: map2, color: 0xffffff });
    // var sprite = new THREE.Sprite(material2);
    // sprite.scale.set(80, 80, 1);
    // this.scene.add(sprite);

    // add light
    var light = new THREE.PointLight(0xffffff, 1);
    this.camera.add(light);

    // add helper axis
    this.scene.add(new THREE.AxesHelper(20));

    var starsGeometry = new THREE.Geometry();

    for (var i = 0; i < 10000; i++) {
      var star = new THREE.Vector3();
      star.x = THREE.Math.randFloatSpread(200);
      star.y = THREE.Math.randFloatSpread(200);
      star.z = THREE.Math.randFloatSpread(200);

      starsGeometry.vertices.push(star);
    }

    var starsMaterial = new THREE.PointsMaterial({ color: 0x888888 });

    var starField = new THREE.Points(starsGeometry, starsMaterial);

    this.scene.add(starField);

    this.start();
  }

  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
  }

  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  };

  stop = () => {
    cancelAnimationFrame(this.frameId);
  };

  animate = () => {
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  };

  renderScene = () => {
    this.renderer.render(this.scene, this.camera);
  };

  render() {
    return (
      <S.Page>
        <div
          style={{ width: "400px", height: "400px" }}
          ref={mount => {
            this.mount = mount;
          }}
        />
      </S.Page>
    );
  }
}

export default ThreeJSSample;
