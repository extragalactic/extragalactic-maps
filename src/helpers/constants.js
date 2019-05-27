// constants and static data
import { materialParams } from './parameters';

const breakpointSmall = 600;
const imageFadeDelay = 300;
const maxImageWidth = 1600;
const maxInnerImageWidth = 800;

const imageTypes = {
  GALAXY_IMAGES: 'galaxies',
  CAVE_IMAGES: 'caveGlyphs',
  TOTEMICAL_IMAGES: 'totemiGlyphs'
};

const coloringMethods = {
  ColorByDistance: 'by Distance',
  ColorByDensity: 'by Density'
};

const imageFileData = {
  [imageTypes.GALAXY_IMAGES]: {
    imagePath: 'textures/galaxies/',
    imagesListFile: materialParams.isUsingFullImageset // Note: this should not be in constants
      ? '/data/MultiverseGalaxyData.csv'
      : '/data/MultiverseGalaxyData_basic.csv'
  },
  [imageTypes.CAVE_IMAGES]: {
    imagePath: 'textures/cave-glyphs/',
    imagesListFile: '/data/CaveGlyphs.csv'
  },
  [imageTypes.TOTEMICAL_IMAGES]: {
    imagePath: 'textures/totemical-glyphs/',
    imagesListFile: '/data/TotemicalGlyphs.csv'
  }
};

const pointsFileData = {
  TwoMASS: '/data/2MASS_DB.csv',
  Zwicky: '/data/Zwicky-20K.csv',
  SDSS: '/data/SDSS-250K.csv'
};

const galaxyInfoFilePath = materialParams.isUsingFullImageset
  ? '/data/MultiverseGalaxyData.csv'
  : '/data/MultiverseGalaxyData_basic.csv';

export {
  breakpointSmall,
  coloringMethods,
  galaxyInfoFilePath,
  imageFadeDelay,
  imageFileData,
  imageTypes,
  maxImageWidth,
  maxInnerImageWidth,
  pointsFileData
};
