// import React from "react";
import * as THREE from "three";

// Component that loads all images from a provided JSON file, then returns an array of textures (that are promises themselves)
function loadAllImages(props) {
  const textureLoader = new THREE.TextureLoader();

  // return a promise to load a single image
  function loadImage(image) {
    return new Promise(
      (resolve, reject) => {
        console.log(`promise resolving for: ${image}`);
        return textureLoader.load(`galaxies2/${image}`);
        // return new THREE.TextureLoader().load("galaxies/" + image, resolve);
      },
      () => {
        console.log(`promise failed for: ${image}`);
      }
    );
  }

  function testWait() {
    console.log("starting wait");
    return new Promise(resolve => {
      setTimeout(function() {
        resolve("fast");
        console.log("wait is done");
      }, 4000);
    });
  }

  async function checkJSONStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  }

  function processJSON(response) {
    return response.json();
  }

  function startLoad() {
    // fetch the JSON file to get the list of images
    return fetch(props.imageListName)
      .then(checkJSONStatus)
      .then(processJSON)
      .then(data => {
        return data.imageList;
      })
      .catch(err => {
        console.log(`JSON request failed with: ${err}`);
      });
  }

  function getTextures(texturesSources) {
    const loader = new THREE.TextureLoader();
    return texturesSources.map(textureSource => {
      return new Promise((resolve, reject) => {
        loader.load(
          textureSource,
          texture => resolve(texture),
          undefined,
          err => reject(err)
        );
      });
    });
  }

  return startLoad().then(images => {
    THREE.ImageUtils.crossOrigin = "";
    const imageAssets = [];
    const imagePromises = [];

    // start loading all images
    images.forEach((image, k) => {
      imageAssets[k] = textureLoader.load("galaxies2/" + image);
    });

    // return loadEverything(images);

    // Promise.all(getTextures(images))
    //   .then(textures => {
    //     console.log(textures);
    //     return textures;
    //   })
    //   .catch(err => console.error(err));

    console.log(imageAssets);
    return imageAssets;
  });

  // imagePromises[0] = Promise.resolve(textureLoader.load("galaxies/M49.png"));
  // imagePromises[1] = Promise.resolve(textureLoader.load("galaxies/M64.png"));
  // imagePromises[2] = Promise.resolve(textureLoader.load("galaxies/M81.png"));

  // imagePromises[0] = Promise.resolve(textureLoader.load("galaxies/M49.png"));
  // imagePromises[1] = Promise.resolve(textureLoader.load("galaxies/M64.png"));
  // imagePromises[2] = Promise.resolve(textureLoader.load("galaxies/M81.png"));

  // imagePromises[0] = loadImage("galaxies/M49.png");
  // imagePromises[1] = loadImage("galaxies/M64.png");
  // imagePromises[2] = loadImage("galaxies/M81.png");

  // imagePromises[0] = loadImage("galaxies/M49.png");
  // imagePromises[1] = loadImage("galaxies/M64.png");
  // imagePromises[2] = loadImage("galaxies/M81.png");

  // images.forEach((image, k) => {
  //   imagePromises.push(loadImage(`galaxies/${image}`));
  // });

  // console.log(imagePromises);

  // return Promise.all(imagePromises).then(
  //   result => {
  //     console.log("done...");
  //     console.log(result);
  //     return result;
  //   },
  //   error => {
  //     console.log("Image loader failed");
  //   }
  // );
}

export { loadAllImages };
