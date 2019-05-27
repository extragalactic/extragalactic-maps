import * as React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

import MainPage from './components/pages/MainPage';
import Universe from './components/pages/Universe';
import { sceneParams } from './helpers/parameters';
import * as S from './styles/stylesMain';
import theme from './styles/theme';
import { StateProvider } from './utils/state';

function App() {
  // initial state for global context
  const initialState = {
    imageTextures: [],
    mapType: sceneParams.mapType
  };

  // reducer for global context
  const reducer = (state, action) => {
    switch (action.type) {
      case 'updateImageTextures':
        return {
          ...state,
          imageTextures: action.value
        };
      case 'updateMapType':
        return {
          ...state,
          mapType: action.value
        };
      default:
        return state;
    }
  };

  return (
    <Router>
      <MuiThemeProvider theme={theme}>
        <StateProvider initialState={initialState} reducer={reducer}>
          <S.App>
            <Route exact path="/" component={MainPage} />
            <Route path="/maps" component={Universe} />
          </S.App>
        </StateProvider>
      </MuiThemeProvider>
    </Router>
  );
}

export default App;
