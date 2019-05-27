import * as THREE from 'three';
import PropTypes from 'prop-types';

const propTypes = {
  imageJSONFile: PropTypes.string,
  imagePath: PropTypes.string
};

// Component that loads all images from a provided JSON file list. It returns a Promise.all array,
// so if the calling function uses "async/await" it will pause execution until fully loaded.
// Currently if a single file is not found, the whole thing throws an anonymous error (i.e. not ideal).
// The other loader (asyncLoadAllTextures) will not fail, however, and just leave a blank texture in its place.
function loadAllTextures(props) {
  const checkJSONStatus = (response) => {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    }
    return Promise.reject(new Error(response.statusText));
  };

  const processJSON = response => response.json();

  const getTextures = (imageFileNames) => {
    const loader = new THREE.TextureLoader();
    return imageFileNames.map(
      filename => new Promise((resolve, reject) => {
        loader.load(
          `${props.imagePath}${filename}`,
          texture => resolve(texture),
          undefined,
          err => reject(err)
        );
      })
    );
  };

  // fetch the JSON file to get the list of images
  const startLoad = () => fetch(props.imageJSONFile)
    .then(checkJSONStatus)
    .then(processJSON)
    .then((data) => {
      const textures = getTextures(data.imageList);
      return Promise.all(textures);
    })
    .catch((err) => {
      console.log('Image load request failed with errors:');
      console.log(err);
    });

  THREE.ImageUtils.crossOrigin = '';
  return startLoad();
}

loadAllTextures.propTypes = propTypes;

export { loadAllTextures };
