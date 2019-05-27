// General Tools

// create list of full image paths
function getImagesFromFilenames(pageImageLocations) {
  const imageFileLocationContext = require.context('../assets/jpg/pages', true);
  const pageImages = {};

  Object.keys(pageImageLocations).forEach((image) => {
    pageImages[image] = imageFileLocationContext(`./${pageImageLocations[image]}`);
  });

  return pageImages;
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export { getImagesFromFilenames, numberWithCommas };
