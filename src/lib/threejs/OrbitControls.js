// This set of controls performs orbiting, dollying (zooming), and panning.
// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
//
//    Orbit - left mouse / touch: one-finger move
//    Zoom - middle mouse, or mousewheel / touch: two-finger spread or squish
//    Pan - right mouse, or left mouse + ctrl/meta/shiftKey, or arrow keys / touch: two-finger move

// import THREE from 'three';
import * as THREE from 'three-full';
import KeyboardController from '../../components/sharedComponents/KeyboardController';

// THREE.OrbitControls = (object, domElement) => {
class OrbitControls {
  constructor(object, domElement) {
    this.object = object;
    this.domElement = domElement !== undefined ? domElement : document;

    // Set to false to disable this control
    this.enabled = true;

    // "target" sets the location of focus, where the object orbits around
    this.target = new THREE.Vector3();

    // How far you can dolly in and out ( PerspectiveCamera only )
    this.minDistance = 0;
    this.maxDistance = Infinity;

    // How far you can zoom in and out ( OrthographicCamera only )
    this.minZoom = 0;
    this.maxZoom = Infinity;

    // How far you can orbit vertically, upper and lower limits.
    // Range is 0 to Math.PI radians.
    this.minPolarAngle = 0; // radians
    this.maxPolarAngle = Math.PI; // radians

    // How far you can orbit horizontally, upper and lower limits.
    // If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
    this.minAzimuthAngle = -Infinity; // radians
    this.maxAzimuthAngle = Infinity; // radians

    // Set to true to enable damping (inertia)
    // If damping is enabled, you must call controls.update() in your animation loop
    this.enableDamping = false;
    this.dampingFactor = 0.25;

    // This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
    // Set to false to disable zooming
    this.enableZoom = true;
    this.zoomSpeed = 1.0;

    // Set to false to disable rotating
    this.enableRotate = true;
    this.rotateSpeed = 1.0;

    // Set to false to disable panning
    this.enablePan = true;
    this.panSpeed = 2.0;
    this.screenSpacePanning = false; // if true, pan in screen-space
    this.keyPanSpeed = 2.0; // pixels moved per arrow key push

    // Set to true to automatically rotate around the target
    // If auto-rotate is enabled, you must call controls.update() in your animation loop
    this.autoRotate = false;
    this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

    // Set to false to disable use of the keys
    this.enableKeys = true;

    // The four arrow keys
    this.keys = {
      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      BOTTOM: 40
    };

    // Mouse buttons
    this.mouseButtons = {
      LEFT: THREE.MOUSE.LEFT,
      MIDDLE: THREE.MOUSE.MIDDLE,
      RIGHT: THREE.MOUSE.RIGHT
    };

    // for reset
    this.target0 = this.target.clone();
    this.position0 = this.object.position.clone();
    this.zoom0 = this.object.zoom;

    this.scope = this;

    this.changeEvent = { type: 'change' };
    this.startEvent = { type: 'start' };
    this.endEvent = { type: 'end' };

    this.STATE = {
      NONE: -1,
      ROTATE: 0,
      DOLLY: 1,
      PAN: 2,
      TOUCH_ROTATE: 3,
      TOUCH_DOLLY_PAN: 4
    };

    this.state = this.STATE.NONE;

    this.EPS = 0.000001;

    // current position in this.spherical coordinates
    this.spherical = new THREE.Spherical();
    this.sphericalDelta = new THREE.Spherical();

    this.scale = 1;
    this.panOffset = new THREE.Vector3();
    this.zoomChanged = false;

    this.rotateStart = new THREE.Vector2();
    this.rotateEnd = new THREE.Vector2();
    this.rotateDelta = new THREE.Vector2();

    this.panStart = new THREE.Vector2();
    this.panEnd = new THREE.Vector2();
    this.panDelta = new THREE.Vector2();

    this.dollyStart = new THREE.Vector2();
    this.dollyEnd = new THREE.Vector2();
    this.dollyDelta = new THREE.Vector2();

    this.getPolarAngle = () => this.spherical.phi;

    this.getAzimuthalAngle = () => this.spherical.theta;

    this.saveState = () => {
      this.scope.target0.copy(this.scope.target);
      this.scope.position0.copy(this.scope.object.position);
      this.scope.zoom0 = this.scope.object.zoom;
    };

    this.reset = () => {
      this.scope.target.copy(this.scope.target0);
      this.scope.object.position.copy(this.scope.position0);
      this.scope.object.zoom = this.scope.zoom0;

      this.scope.object.updateProjectionMatrix();
      this.scope.dispatchEvent(this.changeEvent);

      this.scope.update();

      this.state = this.STATE.NONE;
    };

    // this method is exposed, but perhaps it would be better if we can make it private...
    this.update = (() => {
      const offset = new THREE.Vector3();

      // so camera.up is the orbit axis
      const quat = new THREE.Quaternion().setFromUnitVectors(object.up, new THREE.Vector3(0, 1, 0));
      const quatInverse = quat.clone().inverse();

      const lastPosition = new THREE.Vector3();
      const lastQuaternion = new THREE.Quaternion();

      return function update() {
        const { position } = this.scope.object;

        offset.copy(position).sub(this.scope.target);

        // rotate offset to "y-axis-is-up" space
        offset.applyQuaternion(quat);

        // angle from z-axis around y-axis
        this.spherical.setFromVector3(offset);

        if (this.scope.autoRotate && this.state === this.STATE.NONE) {
          this.rotateLeft(this.getAutoRotationAngle());
        }

        this.spherical.theta += this.sphericalDelta.theta;
        this.spherical.phi += this.sphericalDelta.phi;

        // restrict theta to be between desired limits
        this.spherical.theta = Math.max(
          this.scope.minAzimuthAngle,
          Math.min(this.scope.maxAzimuthAngle, this.spherical.theta)
        );

        // restrict phi to be between desired limits
        this.spherical.phi = Math.max(
          this.scope.minPolarAngle,
          Math.min(this.scope.maxPolarAngle, this.spherical.phi)
        );

        this.spherical.makeSafe();

        this.spherical.radius *= this.scale;

        // restrict radius to be between desired limits
        this.spherical.radius = Math.max(
          this.scope.minDistance,
          Math.min(this.scope.maxDistance, this.spherical.radius)
        );

        // move target to panned location
        this.scope.target.add(this.panOffset);

        offset.setFromSpherical(this.spherical);

        // rotate offset back to "camera-up-vector-is-up" space
        offset.applyQuaternion(quatInverse);

        position.copy(this.scope.target).add(offset);

        this.scope.object.lookAt(this.scope.target);

        if (this.scope.enableDamping === true) {
          this.sphericalDelta.theta *= 1 - this.scope.dampingFactor;
          this.sphericalDelta.phi *= 1 - this.scope.dampingFactor;

          this.panOffset.multiplyScalar(1 - this.scope.dampingFactor);
        } else {
          this.sphericalDelta.set(0, 0, 0);

          this.panOffset.set(0, 0, 0);
        }

        this.scale = 1;

        // update condition is:
        // min(camera displacement, camera rotation in radians)^2 > this.EPS
        // using small-angle approximation cos(x/2) = 1 - x^2 / 8

        if (
          this.zoomChanged
          || lastPosition.distanceToSquared(this.scope.object.position) > this.EPS
          || 8 * (1 - lastQuaternion.dot(this.scope.object.quaternion)) > this.EPS
        ) {
          this.scope.dispatchEvent(this.changeEvent);

          lastPosition.copy(this.scope.object.position);
          lastQuaternion.copy(this.scope.object.quaternion);
          this.zoomChanged = false;

          return true;
        }

        return false;
      };
    })();

    this.dispose = () => {
      this.scope.domElement.removeEventListener('contextmenu', this.onContextMenu, false);
      this.scope.domElement.removeEventListener('mousedown', this.onMouseDown, false);
      this.scope.domElement.removeEventListener('wheel', this.onMouseWheel, false);

      this.scope.domElement.removeEventListener('touchstart', this.onTouchStart, false);
      this.scope.domElement.removeEventListener('touchend', this.onTouchEnd, false);
      this.scope.domElement.removeEventListener('touchmove', this.onTouchMove, false);

      document.removeEventListener('mousemove', this.onMouseMove, false);
      document.removeEventListener('mouseup', this.onMouseUp, false);

      // this.scope.dispatchEvent( { type: 'dispose' } ); // should this be added here?
    };

    this.panLeft = (() => {
      const v = new THREE.Vector3();

      return function panLeft(distance, objectMatrix) {
        v.setFromMatrixColumn(objectMatrix, 0); // get X column of objectMatrix
        v.multiplyScalar(-distance);

        this.panOffset.add(v);
      };
    })();

    this.panUp = (() => {
      const v = new THREE.Vector3();

      return function panUp(distance, objectMatrix) {
        v.setFromMatrixColumn(objectMatrix, 1);

        v.multiplyScalar(distance);

        this.panOffset.add(v);
      };
    })();

    this.panForward = (() => {
      const v = new THREE.Vector3();

      return function panForward(distance, objectMatrix) {
        v.setFromMatrixColumn(objectMatrix, 0);
        v.crossVectors(this.scope.object.up, v);

        v.multiplyScalar(distance);

        this.panOffset.add(v);
      };
    })();

    // deltaX and deltaY are in pixels; right and down are positive
    this.pan = (() => {
      const offset = new THREE.Vector3();

      return function pan(deltaX, deltaY, deltaZ = 0) {
        const element = this.scope.domElement === document ? this.scope.domElement.body : this.scope.domElement;

        if (this.scope.object.isPerspectiveCamera) {
          // perspective
          const { position } = this.scope.object;
          offset.copy(position).sub(this.scope.target);
          let targetDistance = offset.length();

          // half of the fov is center to top of screen
          targetDistance *= Math.tan(((this.scope.object.fov / 2) * Math.PI) / 180.0);

          // we use only clientHeight here so aspect ratio does not distort speed
          this.panLeft(
            (2 * deltaX * targetDistance) / element.clientHeight,
            this.scope.object.matrix
          );
          this.panUp(
            (2 * deltaY * targetDistance) / element.clientHeight,
            this.scope.object.matrix
          );
          this.panForward(
            (2 * deltaZ * targetDistance) / element.clientHeight,
            this.scope.object.matrix
          );
        } else if (this.scope.object.isOrthographicCamera) {
          // orthographic
          this.panLeft(
            (deltaX * (this.scope.object.right - this.scope.object.left))
              / this.scope.object.zoom
              / element.clientWidth,
            this.scope.object.matrix
          );
          this.panUp(
            (deltaY * (this.scope.object.top - this.scope.object.bottom))
              / this.scope.object.zoom
              / element.clientHeight,
            this.scope.object.matrix
          );
          this.panForward(
            (deltaZ * (this.scope.object.top - this.scope.object.bottom))
              / this.scope.object.zoom
              / element.clientHeight,
            this.scope.object.matrix
          );
        } else {
          // camera neither orthographic nor perspective
          console.warn(
            'WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.'
          );
          this.scope.enablePan = false;
        }
      };
    })();

    this.scope.domElement.addEventListener('contextmenu', this.onContextMenu, false);

    this.scope.domElement.addEventListener('mousedown', this.onMouseDown, false);
    this.scope.domElement.addEventListener('wheel', this.onMouseWheel, false);

    this.scope.domElement.addEventListener('touchstart', this.onTouchStart, false);
    this.scope.domElement.addEventListener('touchend', this.onTouchEnd, false);
    this.scope.domElement.addEventListener('touchmove', this.onTouchMove, false);

    this.initKeyboardInput();

    this.scale = 7.0; // Note: move this to a better place

    // force an update at start
    this.update();
  }

  setSpeed = (newSpeed) => {
    this.keyPanSpeed = newSpeed;
    // this.panSpeed = newSpeed / 4;
  };

  getAutoRotationAngle = () => ((2 * Math.PI) / 60 / 60) * this.scope.autoRotateSpeed;

  getZoomScale = () => 0.95 ** this.scope.zoomSpeed;

  rotateLeft = (angle) => {
    this.sphericalDelta.theta -= angle;
  };

  rotateUp = (angle) => {
    this.sphericalDelta.phi -= angle;
  };

  dollyIn = (dollyScale) => {
    if (this.scope.object.isPerspectiveCamera) {
      console.log('hi');
      this.scale /= dollyScale;
    } else if (this.scope.object.isOrthographicCamera) {
      this.scope.object.zoom = Math.max(
        this.scope.minZoom,
        Math.min(this.scope.maxZoom, this.scope.object.zoom * dollyScale)
      );
      this.scope.object.updateProjectionMatrix();
      this.zoomChanged = true;
    } else {
      console.warn(
        'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.'
      );
      this.scope.enableZoom = false;
    }
    console.log(this.scope.object.zoom);
  };

  dollyOut = (dollyScale) => {
    if (this.scope.object.isPerspectiveCamera) {
      this.scale *= dollyScale;
    } else if (this.scope.object.isOrthographicCamera) {
      this.scope.object.zoom = Math.max(
        this.scope.minZoom,
        Math.min(this.scope.maxZoom, this.scope.object.zoom / dollyScale)
      );
      this.scope.object.updateProjectionMatrix();
      this.zoomChanged = true;
    } else {
      console.warn(
        'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.'
      );
      this.scope.enableZoom = false;
    }
  };

  //
  // event callbacks - update the object state
  //

  handleMouseDownRotate = (event) => {
    // console.log( 'handleMouseDownRotate' );

    this.rotateStart.set(event.clientX, event.clientY);
  };

  handleMouseDownDolly = (event) => {
    // console.log( 'handleMouseDownDolly' );

    this.dollyStart.set(event.clientX, event.clientY);
  };

  handleMouseDownPan = (event) => {
    // console.log( 'handleMouseDownPan' );

    this.panStart.set(event.clientX, event.clientY);
  };

  handleMouseMoveRotate = (event) => {
    // console.log( 'handleMouseMoveRotate' );

    this.rotateEnd.set(event.clientX, event.clientY);

    this.rotateDelta
      .subVectors(this.rotateEnd, this.rotateStart)
      .multiplyScalar(this.scope.rotateSpeed);

    const element = this.scope.domElement === document ? this.scope.domElement.body : this.scope.domElement;

    this.rotateLeft((2 * Math.PI * this.rotateDelta.x) / element.clientHeight); // yes, height

    this.rotateUp((2 * Math.PI * this.rotateDelta.y) / element.clientHeight);

    this.rotateStart.copy(this.rotateEnd);

    this.scope.update();
  };

  handleMouseMoveDolly = (event) => {
    // console.log( 'handleMouseMoveDolly' );

    this.dollyEnd.set(event.clientX, event.clientY);

    this.dollyDelta.subVectors(this.dollyEnd, this.dollyStart);

    if (this.dollyDelta.y > 0) {
      this.dollyIn(this.getZoomScale());
    } else if (this.dollyDelta.y < 0) {
      this.dollyOut(this.getZoomScale());
    }

    this.dollyStart.copy(this.dollyEnd);

    this.scope.update();
  };

  handleMouseMovePan = (event) => {
    // console.log( 'handleMouseMovePan' );

    this.panEnd.set(event.clientX, event.clientY);

    this.panDelta.subVectors(this.panEnd, this.panStart).multiplyScalar(this.scope.panSpeed);

    this.pan(this.panDelta.x, this.panDelta.y);

    this.panStart.copy(this.panEnd);

    this.scope.update();
  };

  handleMouseUp = (event) => {
    // console.log( 'handleMouseUp' );
  };

  handleMouseWheel = (event) => {
    // console.log( 'handleMouseWheel' );

    if (event.deltaY < 0) {
      this.dollyOut(this.getZoomScale());
    } else if (event.deltaY > 0) {
      this.dollyIn(this.getZoomScale());
    }

    this.scope.update();
  };

  handleKeyDown = (event) => {
    // console.log( 'handleKeyDown' );

    let needsUpdate = false;

    switch (event.keyCode) {
      case this.scope.keys.UP:
        this.pan(0, this.scope.keyPanSpeed);
        needsUpdate = true;
        break;

      case this.scope.keys.BOTTOM:
        this.pan(0, -this.scope.keyPanSpeed);
        needsUpdate = true;
        break;

      case this.scope.keys.LEFT:
        this.pan(this.scope.keyPanSpeed, 0);
        needsUpdate = true;
        break;

      case this.scope.keys.RIGHT:
        this.pan(-this.scope.keyPanSpeed, 0);
        needsUpdate = true;
        break;

      default:
        break;
    }

    if (needsUpdate) {
      // prevent the browser from scrolling on cursor keys
      event.preventDefault();

      this.scope.update();
    }
  };

  handleTouchStartRotate = (event) => {
    // console.log( 'handleTouchStartRotate' );

    this.rotateStart.set(event.touches[0].pageX, event.touches[0].pageY);
  };

  handleTouchStartDollyPan = (event) => {
    // console.log( 'handleTouchStartDollyPan' );

    if (this.scope.enableZoom) {
      const dx = event.touches[0].pageX - event.touches[1].pageX;
      const dy = event.touches[0].pageY - event.touches[1].pageY;

      const distance = Math.sqrt(dx * dx + dy * dy);

      this.dollyStart.set(0, distance);
    }

    if (this.scope.enablePan) {
      const x = 0.5 * (event.touches[0].pageX + event.touches[1].pageX);
      const y = 0.5 * (event.touches[0].pageY + event.touches[1].pageY);

      this.panStart.set(x, y);
    }
  };

  handleTouchMoveRotate = (event) => {
    // console.log( 'handleTouchMoveRotate' );

    this.rotateEnd.set(event.touches[0].pageX, event.touches[0].pageY);

    this.rotateDelta
      .subVectors(this.rotateEnd, this.rotateStart)
      .multiplyScalar(this.scope.rotateSpeed);

    const element = this.scope.domElement === document ? this.scope.domElement.body : this.scope.domElement;

    this.rotateLeft((2 * Math.PI * this.rotateDelta.x) / element.clientHeight); // yes, height

    this.rotateUp((2 * Math.PI * this.rotateDelta.y) / element.clientHeight);

    this.rotateStart.copy(this.rotateEnd);

    this.scope.update();
  };

  handleTouchMoveDollyPan = (event) => {
    // console.log( 'handleTouchMoveDollyPan' );

    if (this.scope.enableZoom) {
      const dx = event.touches[0].pageX - event.touches[1].pageX;
      const dy = event.touches[0].pageY - event.touches[1].pageY;

      const distance = Math.sqrt(dx * dx + dy * dy);

      this.dollyEnd.set(0, distance);

      this.dollyDelta.set(0, (this.dollyEnd.y / this.dollyStart.y) ** this.scope.zoomSpeed);

      this.dollyIn(this.dollyDelta.y);

      this.dollyStart.copy(this.dollyEnd);
    }

    if (this.scope.enablePan) {
      const x = 0.5 * (event.touches[0].pageX + event.touches[1].pageX);
      const y = 0.5 * (event.touches[0].pageY + event.touches[1].pageY);

      this.panEnd.set(x, y);

      this.panDelta.subVectors(this.panEnd, this.panStart).multiplyScalar(this.scope.panSpeed);

      this.pan(this.panDelta.x, this.panDelta.y);

      this.panStart.copy(this.panEnd);
    }

    this.scope.update();
  };

  handleTouchEnd = (event) => {
    // console.log( 'handleTouchEnd' );
  };

  //
  // event handlers - FSM: listen for events and reset state
  //

  onMouseDown = (event) => {
    if (this.scope.enabled === false) return;

    // Prevent the browser from scrolling.

    event.preventDefault();

    // Manually set the focus since calling preventDefault above
    // prevents the browser from setting it automatically.

    if (this.scope.domElement.focus) {
      this.scope.domElement.focus();
    } else {
      window.focus();
    }

    switch (event.button) {
      case this.scope.mouseButtons.LEFT:
        if (event.ctrlKey || event.metaKey || event.shiftKey) {
          if (this.scope.enablePan === false) return;

          this.handleMouseDownPan(event);

          this.state = this.STATE.PAN;
        } else {
          if (this.scope.enableRotate === false) return;

          this.handleMouseDownRotate(event);

          this.state = this.STATE.ROTATE;
        }

        break;

      case this.scope.mouseButtons.MIDDLE:
        if (this.scope.enableZoom === false) return;

        this.handleMouseDownDolly(event);

        this.state = this.STATE.DOLLY;

        break;

      case this.scope.mouseButtons.RIGHT:
        if (this.scope.enablePan === false) return;

        this.handleMouseDownPan(event);

        this.state = this.STATE.PAN;

        break;
      default:
        break;
    }

    if (this.state !== this.STATE.NONE) {
      document.addEventListener('mousemove', this.onMouseMove, false);
      document.addEventListener('mouseup', this.onMouseUp, false);

      this.scope.dispatchEvent(this.startEvent);
    }
  };

  onMouseMove = (event) => {
    if (this.scope.enabled === false) return;

    event.preventDefault();

    switch (this.state) {
      case this.STATE.ROTATE:
        if (this.scope.enableRotate === false) return;

        this.handleMouseMoveRotate(event);

        break;

      case this.STATE.DOLLY:
        if (this.scope.enableZoom === false) return;

        this.handleMouseMoveDolly(event);

        break;

      case this.STATE.PAN:
        if (this.scope.enablePan === false) return;

        this.handleMouseMovePan(event);

        break;
      default:
        break;
    }
  };

  onMouseUp = (event) => {
    if (this.scope.enabled === false) return;

    this.handleMouseUp(event);

    document.removeEventListener('mousemove', this.onMouseMove, false);
    document.removeEventListener('mouseup', this.onMouseUp, false);

    this.scope.dispatchEvent(this.endEvent);

    this.state = this.STATE.NONE;
  };

  onMouseWheel = (event) => {
    if (
      this.scope.enabled === false
      || this.scope.enableZoom === false
      || (this.state !== this.STATE.NONE && this.state !== this.STATE.ROTATE)
    ) return;

    event.preventDefault();
    event.stopPropagation();

    this.scope.dispatchEvent(this.startEvent);

    this.handleMouseWheel(event);

    this.scope.dispatchEvent(this.endEvent);
  };

  onTouchStart = (event) => {
    if (this.scope.enabled === false) return;

    event.preventDefault();

    switch (event.touches.length) {
      case 1: // one-fingered touch: rotate
        if (this.scope.enableRotate === false) return;

        this.handleTouchStartRotate(event);

        this.state = this.STATE.TOUCH_ROTATE;

        break;

      case 2: // two-fingered touch: dolly-pan
        if (this.scope.enableZoom === false && this.scope.enablePan === false) return;

        this.handleTouchStartDollyPan(event);

        this.state = this.STATE.TOUCH_DOLLY_PAN;

        break;

      default:
        this.state = this.STATE.NONE;
    }

    if (this.state !== this.STATE.NONE) {
      this.scope.dispatchEvent(this.startEvent);
    }
  };

  onTouchMove = (event) => {
    if (this.scope.enabled === false) return;

    event.preventDefault();
    event.stopPropagation();

    switch (event.touches.length) {
      case 1: // one-fingered touch: rotate
        if (this.scope.enableRotate === false) return;
        if (this.state !== this.STATE.TOUCH_ROTATE) return; // is this needed?

        this.handleTouchMoveRotate(event);

        break;

      case 2: // two-fingered touch: dolly-pan
        if (this.scope.enableZoom === false && this.scope.enablePan === false) return;
        if (this.state !== this.STATE.TOUCH_DOLLY_PAN) return; // is this needed?

        this.handleTouchMoveDollyPan(event);

        break;

      default:
        this.state = this.STATE.NONE;
    }
  };

  onTouchEnd = (event) => {
    if (this.scope.enabled === false) return;

    this.handleTouchEnd(event);

    this.scope.dispatchEvent(this.endEvent);

    this.state = this.STATE.NONE;
  };

  onContextMenu = (event) => {
    if (this.scope.enabled === false) return;

    event.preventDefault();
  };

  initKeyboardInput = () => {
    // const moveStepAmount = 7;
    const controller = this;
    KeyboardController(
      {
        87() {
          // w
          controller.pan(0, 0, controller.keyPanSpeed);
          controller.update();
        },
        83() {
          // s
          controller.pan(0, 0, -controller.keyPanSpeed);
          controller.update();
        },
        65() {
          // a
          controller.pan(controller.keyPanSpeed, 0);
          controller.update();
        },
        68() {
          // d
          controller.pan(-controller.keyPanSpeed, 0);
          controller.update();
        },
        81() {
          // q
          controller.pan(0, controller.keyPanSpeed);
          controller.update();
        },
        69() {
          // e
          controller.pan(0, -controller.keyPanSpeed);
          controller.update();
        }
      },
      5
    );
  };
}

OrbitControls.prototype = Object.create(THREE.EventDispatcher.prototype);

export default OrbitControls;
