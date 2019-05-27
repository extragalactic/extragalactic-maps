// Extra (offline) tools

// Brute-force algorithm for calculating Nearest Neighbour values for points
// Note: this is only being run offline to pre-generate data (is very slow)
function calculateNearestNeighbour(data) {
  const result = [];
  let dist = 0;
  let numNeighbours = -1;
  const threshold = 500;
  let deltaX = 0;
  let deltaY = 0;
  let deltaZ = 0;
  let point1 = {};
  let point2 = {};
  let progressCounter = 0;

  for (let i = 0; i < data.length; i += 1) {
    point1 = data[i];
    // console.log(i);
    for (let j = 0; j < data.length; j += 1) {
      point2 = data[j];
      deltaX = (point1.x - point2.x) ** 2;
      deltaY = (point1.y - point2.y) ** 2;
      deltaZ = (point1.z - point2.z) ** 2;

      dist = Math.sqrt(deltaX + deltaY + deltaZ);
      if (dist < threshold) {
        numNeighbours += 1;
      }
    }
    result[i] = numNeighbours;
    progressCounter += 1;
    if (progressCounter % 1000 === 0) {
      console.log(progressCounter);
    }
    numNeighbours = 0;
  }
  return result.join('\n');
}

export { calculateNearestNeighbour };
