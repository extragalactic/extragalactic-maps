// Information for all map types
const mapSetTypes = {
  Zwicky: 'Zwicky',
  TwoMASS: 'TwoMASS',
  SDSS: 'SDSS'
};

const mapInfo = {
  Zwicky: {
    name: 'Zwicky',
    thumbnail: 'Zwicky-sample.jpg',
    numberPoints: 19204,
    distanceLimit: 200,
    description: 'Data collected by Fritz Zwicky (1898-1974)'
  },
  TwoMASS: {
    name: '2MASS',
    thumbnail: '2MASS-sample.jpg',
    numberPoints: 43528,
    distanceLimit: 70000,
    description: 'The 2-Micron All-Sky Survey (2MASS)'
  },
  SDSS: {
    name: 'SDSS',
    thumbnail: 'SDSS-sample.jpg',
    numberPoints: 250663,
    distanceLimit: 120000,
    description: 'A slice of the Sloan Digital Sky Survey (SDSS)'
  }
};

export { mapInfo, mapSetTypes };
