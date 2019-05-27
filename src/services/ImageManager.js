// Functions to interface with the loaded image library

import { imageTypes } from '../helpers/constants';

const imageBuckets = {
  elliptical: [],
  lenticular: [],
  spiral: []
};

const ELLIPTICAL = 'elliptical';
const LENTICULAR = 'lenticular';
const SPIRAL = 'spiral';

// creates the data buckets for each image
function initializeImageManager(imagesType, imageData) {
  if (imagesType === imageTypes.GALAXY_IMAGES) {
    imageData.forEach((imageInfo, i) => {
      const info = { info: imageInfo, imageIndex: i, assignedPoints: [] };

      if (imageInfo.Type_Text === 'Elliptical') {
        imageBuckets.elliptical.push(info);
      } else if (imageInfo.Type_Text === 'Lenticular') {
        imageBuckets.lenticular.push(info);
      } else {
        imageBuckets.spiral.push(info);
      }
    });
  } else {
    // If the image types are not galaxies (i.e. cave symbols, flowers, etc.) randomly assign a "galaxy type" for each image
    imageData.forEach((imageInfo, i) => {
      const info = { info: imageInfo, imageIndex: i, assignedPoints: [] };
      const randomType = Math.random() * 100;

      if (randomType < 15) {
        // Elliptical (approx 15% of total)
        imageBuckets.elliptical.push(info);
      } else if (randomType < 30) {
        // Lenticular (approx 15% of total)
        imageBuckets.lenticular.push(info);
      } else {
        // Spiral, Barred Spiral, Irregular or other types (approx 70% of total)
        imageBuckets.spiral.push(info);
      }
    });
  }
}

function assignImagesToPoints(imageTextures, nearestNeighbours) {
  let probabilities = [0, 0, 0]; // [elliptical, lenticular, spiral]

  for (let i = 0; i < nearestNeighbours.length; i += 1) {
    const NN = nearestNeighbours[i];
    let imageIndex = 0;
    let imageType;

    if (NN <= 1) {
      probabilities = [5, 5, 90];
    } else if (NN <= 2) {
      probabilities = [5, 15, 80];
    } else if (NN <= 4) {
      probabilities = [10, 25, 65];
    } else if (NN <= 5) {
      probabilities = [50, 20, 30];
    } else {
      probabilities = [75, 20, 5];
    }

    const imageTypeIndex = Math.random() * 100;

    if (imageTypeIndex < probabilities[0]) {
      imageType = ELLIPTICAL;
    } else if (imageTypeIndex < probabilities[0] + probabilities[1]) {
      imageType = LENTICULAR;
    } else {
      imageType = SPIRAL;
    }

    imageIndex = getImageIndexOfType(imageType);
    imageBuckets[imageType][imageIndex].assignedPoints.push(i);
  }
  console.log('loaded buckets:');
  console.log(imageBuckets);
  return imageBuckets;
}

// randomly choose an image from its group (such as selecting from the group of spirals)
function getImageIndexOfType(imageType) {
  const randomBucketIndex = Math.floor(Math.random() * imageBuckets[imageType].length);
  return randomBucketIndex;
}

export { assignImagesToPoints, initializeImageManager };
