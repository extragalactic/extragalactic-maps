// SceneAnimator Service

import * as THREE from 'three-full';

function rotateObjects(scene, sceneParams) {
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
      // object.rotation.y = time * 4 * globalTimeFactor;
      object.rotation.x = time * 4 * globalTimeFactor;
      // object.rotation.z = time * (i + 0.5) * -3 * globalTimeFactor;
    }
  }
}

export { rotateObjects };
