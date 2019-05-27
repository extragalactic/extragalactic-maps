// import React from "react";
import * as THREE from 'three';
import PropTypes from 'prop-types';

const propTypes = {
  imageJSONFile: PropTypes.string,
  imagePath: PropTypes.string
};

// Component that loads all images from a provided JSON file, then returns an array of textures.
// Returned array items are texture promises, so the images will asynchronously resolve at a later time.
// Note: this component has async behavior, although it's the *other* loader that actually uses async functions
// (i.e. the behavior is reversed relative to the component's name)
function asyncLoadAllTextures(props) {
  const textureLoader = new THREE.TextureLoader();

  function checkJSONStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    }
    return Promise.reject(new Error(response.statusText));
  }

  function processJSON(response) {
    return response.json();
  }

  function startLoad() {
    // fetch the JSON file to get the list of images
    return fetch(props.imageJSONFile)
      .then(checkJSONStatus)
      .then(processJSON)
      .then(data => data.imageList)
      .catch((err) => {
        console.error(`JSON request failed with: ${err}`);
      });
  }

  return startLoad().then((images) => {
    THREE.ImageUtils.crossOrigin = '';
    const imageAssets = [];

    // start loading all images
    images.forEach((image, k) => {
      imageAssets[k] = textureLoader.load(`${props.imagePath}${image}`);
    });

    return imageAssets;
  });
}

asyncLoadAllTextures.propTypes = propTypes;

export default asyncLoadAllTextures;
