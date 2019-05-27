import { csv } from 'd3-fetch';
import { pointsFileData, galaxyInfoFilePath } from '../helpers/constants';

function loadPointData(mapType) {
  // fetch the JSON file to get the list of images
  const dataFilePath = pointsFileData[mapType];
  // const startLoad = () => csv('/data/2MASS_DB.csv' /* pointsFileData[mapType] ... fyi, not working */)
  const startLoad = () => csv(dataFilePath)
    .then(data => data)
    .catch((err) => {
      console.log('Point data load request failed with errors:');
      console.log(err);
    });
  return startLoad();
}

function loadGalaxyData() {
  // fetch the JSON file to get the list of images
  const startLoad = () => csv(galaxyInfoFilePath)
    .then(data => data)
    .catch((err) => {
      console.log('Galaxy data load request failed with errors:');
      console.log(err);
    });
  return startLoad();
}

export { loadPointData, loadGalaxyData };
