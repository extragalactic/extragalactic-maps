import * as React from "react";
import * as THREE from "three";
// import styled from "styled-components";

import * as S from "../../styles/stylesMain";

// Under Construction -- attempting to loads point cloud with custom GLSL (not fully working)
class ThreeJSSample2 extends React.Component {
  componentDidMount() {
    this.init();
  }

  init = () => {
    this.setupEnvironment();

    this.callResize = function() {
      this.resize();
    };
    window.addEventListener("resize", this.callResize, false);

    this.callRender();
  };

  callRender = () => {
    this.renderPage();
    this.renderID = requestAnimationFrame(this.callRender);
  };

  setupEnvironment = () => {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.domElement.id = "canvas";
    this.renderer.context.getProgramInfoLog = function() {
      return "";
    };
    document.body.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      1,
      200000
    );
    this.camera.position.set(0, 0, 9000);
    this.scene = new THREE.Scene();

    this.container = new THREE.Object3D();
    this.scene.add(this.container);

    const particleCount = 5500;

    const uniforms = {
      textures: {
        type: "tv",
        value: this.getTextures()
      },
      uStartTime: { type: "f", value: 0.0 }
    };

    this.material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: this.getVertexShader(),
      fragmentShader: this.getFragmentShader(uniforms.textures.value.length),
      transparent: true,
      alphaTest: 0.01,
      size: 3,
      depthTest: false,
      blending: THREE.NormalBlending
    });

    this.geometry = new THREE.BufferGeometry();
    let vertices = new Float32Array(particleCount * 3);

    //generate clock for shader
    const clock = new THREE.Clock();
    const elapsed = clock.getElapsedTime();
    this.material.uniforms.uStartTime.value = elapsed;

    // generate random particle positions
    for (let i = 0; i < particleCount; i++) {
      const cubeWidth = 8000;
      vertices[i * 3] = (Math.random() - 0.5) * cubeWidth;
      vertices[i * 3 + 1] = (Math.random() - 0.5) * cubeWidth;
      vertices[i * 3 + 2] = (Math.random() - 0.5) * cubeWidth;
    }
    this.geometry.addAttribute(
      "position",
      new THREE.BufferAttribute(vertices, 3)
    );

    // generate random texture indexes for the particles
    const vIndex = new Float32Array(particleCount);
    for (let i = 0, l = particleCount; i < l; i++) {
      vIndex[i] = Math.random() * this.getTextures().length;
    }
    this.geometry.addAttribute(
      "texIndex",
      new THREE.BufferAttribute(vIndex, 1)
    );

    const particles = new THREE.Points(this.geometry, this.material);
    particles.sortParticles = true;
    this.container.add(particles);
  };

  renderPage = () => {
    this.container.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
  };

  resize = () => {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  };

  getFragmentShader = numTextures => {
    var fragShader = `
      uniform sampler2D textures[${numTextures}];

      varying vec3 vColor;
      varying float vTexIndex;



      void main() {
          vec4 startColor = vec4(vColor, 1.0);
          vec4 finalColor;

    `;

    for (let i = 0; i < numTextures; i++) {
      if (i === 0) {
        fragShader += `if (vTexIndex < ${i}.5) {
        finalColor = texture2D(textures[${i}], gl_PointCoord);
        }
      `;
      } else {
        fragShader += `else if (vTexIndex < ${i}.5) {
        finalColor = texture2D(textures[${i}], gl_PointCoord);
        }
      `;
      }
    }

    fragShader += `
     gl_FragColor = startColor * finalColor;
    }`;

    console.log("frag shader: ", fragShader);
    return fragShader;
  };

  getVertexShader = () => {
    let vertexShader = `
    attribute vec3 color;
    attribute float texIndex;
    uniform float uStartTime;

    varying vec3 vColor;
    varying float vTexIndex;

    void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position.xyz, 1.0);

        vColor = color;
        vTexIndex = texIndex;

        gl_PointSize = position.z/100.0; // + 50.0 + uStartTime*10000.0;
        gl_Position = projectionMatrix * mvPosition;
    }`;

    console.log("vertex shader: ", vertexShader);
    return vertexShader;
  };

  getTextures = () => {
    const textureLoader = new THREE.TextureLoader();
    THREE.ImageUtils.crossOrigin = "";
    return [
      textureLoader.load("galaxies/M49.png"),
      textureLoader.load("galaxies/M64.png"),
      textureLoader.load("galaxies/M81.png"),
      textureLoader.load("galaxies/M95.png"),
      textureLoader.load("galaxies/NGC 1023.png"),
      textureLoader.load("galaxies/NGC 1097.png")
    ];
  };

  render() {
    return (
      <S.Page>
        <div
          style={{ width: "100vw", height: "800px" }}
          ref={canvas => {
            this.canvas = canvas;
          }}
        />
      </S.Page>
    );
  }
}

export default ThreeJSSample2;
