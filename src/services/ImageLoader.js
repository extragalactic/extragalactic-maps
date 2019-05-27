import * as THREE from 'three';
import PropTypes from 'prop-types';
import { csv } from 'd3-fetch';

const propTypes = {
  imagesListFile: PropTypes.string,
  imagePath: PropTypes.string
};

// Component that loads all images from a provided CSV file list. It returns a Promise.all array,
// so if the calling function uses "async/await" it will pause execution until fully loaded.
// Currently if a single file is not found, the whole thing throws an anonymous error (i.e. not ideal).
// The other loader (asyncLoadAllTextures) will not fail, however, and just leave a blank texture in its place.
function loadAllTextures(props) {
  // fetch the data CSV to get the list of images
  const startLoad = () => csv(props.imagesListFile)
    .then((data) => {
      console.log(data);
      const textures = getTextures(data);
      console.log(textures);
      return Promise.all(textures);
    })
    .catch((err) => {
      console.log('Galaxy data load request failed with errors:');
      console.log(err);
    });

  const getTextures = (imageInfo) => {
    const loader = new THREE.TextureLoader();
    return imageInfo.map(
      info => new Promise((resolve, reject) => {
        loader.load(
          `${props.imagePath}${info.ImageFile}`,
          texture => resolve(texture),
          undefined,
          // err => reject(err)
          () => console.log(`cannot load: ${info.ImageFile}`)
        );
      })
    );
  };

  THREE.ImageUtils.crossOrigin = '';
  return startLoad();
}

loadAllTextures.propTypes = propTypes;

export { loadAllTextures };

/**
 * This function allow you to modify a JS Promise by adding some status properties.
 * Based on: http://stackoverflow.com/questions/21485545/is-there-a-way-to-tell-if-an-es6-promise-is-fulfilled-rejected-resolved
 * But modified according to the specs of promises : https://promisesaplus.com/
 */

// Note: looking for a way to check the promise status, so that I can filter out the "pending" promises (i.e. image not found)
// function MakeQuerablePromise(promise) {
//   // Don't modify any promise that has been already modified.
//   if (promise.isResolved) return promise;

//   // Set initial state
//   let isPending = true;
//   let isRejected = false;
//   let isFulfilled = false;

//   // Observe the promise, saving the fulfillment in a closure scope.
//   const result = promise.then(
//     (v) => {
//       isFulfilled = true;
//       isPending = false;
//       return v;
//     },
//     (e) => {
//       isRejected = true;
//       isPending = false;
//       throw e;
//     }
//   );

//   result.isFulfilled = () => isFulfilled;
//   result.isPending = () => isPending;
//   result.isRejected = () => isRejected;
//   return result;
// }
