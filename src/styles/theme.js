// Material-UI theme overrides

import { createMuiTheme } from '@material-ui/core/styles';

const palette = {
  type: 'dark',
  primary: {
    main: '#E91E63',
    light: '#EC6592',
    dark: '#690E2C',
    contrastText: '#fff'
  },
  secondary: {
    main: '#4A2259',
    light: '#A011D9',
    dark: '#2f0540',
    contrastText: '#fff'
  },
  text: {
    disabled: '#666'
  }
};

export default createMuiTheme({
  palette,
  typography: {
    fontFamily: ['Caecilla', 'Merriweather', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
    fontSize: 14
  },
  transitions: {
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
    },
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195
    }
  },
  spacing: {
    unit: 8
  },
  shape: {
    borderRadius: 8
  }
  // overrides: {
  //   MuiButton: {
  //     contained: {
  //       backgroundColor: '#eee',
  //       '&:hover': {
  //         backgroundColor: '#e11'
  //       }
  //     }
  //     // backgroundColor: `${palette.text.disabled} !important;`,
  //     // '&:hover': {
  //     //   backgroundColor: `${palette.primary.dark} !important`
  //     // }
  //   }
  // }
});
