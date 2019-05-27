import { mapSetTypes } from '../helpers/mapInfo';

// PUBLIC METHODS
const convertToRadiansMultiplier = 3.14159 / 180;
const redshiftToParsecsDivider = 73.8;

// Parse the raw point data, and extract point positions
function getPositions(mapType, data, numParticles = 1500, zoneSize = 3000) {
  let result = [];

  switch (mapType) {
    case mapSetTypes.TwoMASS:
      result = getPoints2MASS(data);
      break;
    case mapSetTypes.Zwicky:
      result = getPointsZwicky(data);
      break;
    case mapSetTypes.SDSS:
      result = getPointsSDSS(data);
      break;
    case mapSetTypes.Random:
      result = getPointsRandom(numParticles, zoneSize);
      break;
    default:
      break;
  }
  return result;
}

function getDistances(mapType, data, numParticles = 1500, zoneSize = 3000) {
  let result = [];

  switch (mapType) {
    case mapSetTypes.TwoMASS:
      result = getDistance2MASS(data);
      break;
    case mapSetTypes.Zwicky:
      result = getDistanceZwicky(data);
      break;
    case mapSetTypes.SDSS:
      result = getDistanceSDSS(data);
      break;
    case mapSetTypes.Random:
      result = getDistanceGeneric(numParticles, zoneSize);
      break;
    default:
      break;
  }
  return result;
}

function getNearestNeighbours(mapType, data) {
  let result = [];

  switch (mapType) {
    case mapSetTypes.TwoMASS:
      result = getNearestNeighbour2MASS(data);
      break;
    case mapSetTypes.Zwicky:
      result = getNearestNeighbourZwicky(data);
      break;
    case mapSetTypes.SDSS:
      result = getNearestNeighbourSDSS(data);
      break;
    default:
      break;
  }
  return result;
}

// PRIVATE METHODS

// get point x,y,z data
const getPoints2MASS = (data) => {
  const sizeFactor = 0.05;
  const result = [];
  data.forEach((point) => {
    result.push(point.x * sizeFactor, point.y * sizeFactor, point.z * sizeFactor);
  });
  // returns expanded point array (sequential x,y,z's, so triple the length)
  return result;
};

const getPointsSDSS = (data) => {
  const sizeFactor = 0.1;
  const result = [];

  data.forEach((point) => {
    const RA = Number(point.ra) * convertToRadiansMultiplier;
    const Decl = Number(point.dec) * convertToRadiansMultiplier;

    let dist = Number(point.redshift) / redshiftToParsecsDivider;
    if (dist < 0) dist *= -1;

    const x = dist * Math.cos(RA) * Math.cos(Decl) * sizeFactor;
    const y = dist * Math.sin(RA) * Math.cos(Decl) * sizeFactor;
    const z = dist * Math.sin(Decl) * sizeFactor;

    result.push(x, y, z);
  });
  // returns expanded point array (sequential x,y,z's, so triple the length)
  return result;
};

const getPointsZwicky = (data) => {
  const result = [];

  data.forEach((point) => {
    // convert Zwicky formatted RA to Equatorial coords
    const RA2000 = Number(point.ra2000);
    const ra_hh = Math.floor(RA2000 / 10000);
    const ra_mm = Math.floor((RA2000 - ra_hh * 10000) / 100);
    const ra_ss = Number(RA2000 - ra_hh * 10000 - ra_mm * 100).toPrecision(6);
    const RA = (ra_hh * 15 + ra_mm / 4 + ra_ss / 240) * convertToRadiansMultiplier;

    // convert Zwicky formatted Decl to Equatorial coords
    let Decl2000 = Number(point['Dec-00']);
    const sign = Math.sign(Decl2000);
    Decl2000 = Math.abs(Decl2000);

    const decl_dd = Math.floor(Decl2000 / 10000);
    const decl_mm = Math.floor((Decl2000 - decl_dd * 10000) / 100);
    const decl_ss = Number(Decl2000 - decl_dd * 10000 - decl_mm * 100).toPrecision(6);
    const Decl = (decl_dd + decl_mm / 60 + decl_ss / 3600) * sign * convertToRadiansMultiplier;

    // convert redshift to parsecs (approximation)
    let dist = Number(point.cz) / redshiftToParsecsDivider;
    if (dist < 0) dist *= -1;

    const sizeFactor = 15;
    // convert equitorial to cartesian coords
    const x = dist * Math.cos(RA) * Math.cos(Decl) * sizeFactor;
    const y = dist * Math.sin(RA) * Math.cos(Decl) * sizeFactor;
    const z = dist * Math.sin(Decl) * sizeFactor;

    result.push(x, y, z);
  });
  return result;
};

// Create a random bunch of points within a defined range
const getPointsRandom = (numParticles, zoneSize) => {
  const result = [];
  for (let i = 0; i < numParticles; i += 1) {
    const x = Math.random() * zoneSize - zoneSize / 2;
    const y = Math.random() * zoneSize - zoneSize / 2;
    const z = Math.random() * zoneSize - zoneSize / 2;
    result.push(x, y, z);
  }
  return result;
};

// currently the distance is fetched separately from the point positions
const getDistance2MASS = (data) => {
  const result = [];
  data.forEach((point) => {
    result.push(Number(point.dist));
  });
  return result;
};

const getDistanceZwicky = (data) => {
  const result = [];
  data.forEach((point) => {
    let distance = Number(point.cz) / redshiftToParsecsDivider;
    distance = distance < 0 ? distance * -1 : distance;
    result.push(distance);
  });
  return result;
};

const getDistanceSDSS = (data) => {
  const result = [];
  data.forEach((point) => {
    let distance = Number(point.redshift) / redshiftToParsecsDivider;
    distance = distance < 0 ? distance * -1 : distance;
    result.push(distance);
  });
  return result;
};

// This is a generic random distance function (mostly for tests)
const getDistanceGeneric = (numParticles, zoneSize) => {
  const result = [];
  for (let i = 0; i < numParticles; i += 1) {
    result[i] = Math.random() * zoneSize * 50;
  }
  return result;
};

const getNearestNeighbour2MASS = (data) => {
  const result = [];
  const distances = getDistance2MASS(data);

  data.forEach((point, i) => {
    let NN = point.NN_500;

    // reduce the NN values for all points close to the origin (because the data is skewed with a higher density)
    if (distances[i] <= 500) {
      NN = Math.floor(NN / 5 - 2);
    } else if (distances[i] <= 6000) {
      NN = Math.floor(NN / 3 - 1);
    }
    if (NN < 1) NN = 1;
    result.push(NN);
  });
  return result;
};

const getNearestNeighbourZwicky = (data) => {
  const result = [];

  data.forEach((point, i) => {
    let NN = Number(point.U) + 1;
    if (NN < 1) NN = 1;
    result.push(NN);
  });
  return result;
};

const getNearestNeighbourSDSS = (data) => {
  const result = [];

  data.forEach((point, i) => {
    const NN = (Number(point.index) % 6) + 1;
    result.push(NN);
  });
  return result;
};

export { getPositions, getDistances, getNearestNeighbours };
