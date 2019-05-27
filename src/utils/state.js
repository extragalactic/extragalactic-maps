import React, { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';

// This is a combo of the Context API and React Hooks, to create a global state (like Redux)

export const StateContext = createContext();

const propTypes = {
  reducer: PropTypes.func.isRequired,
  initialState: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired
};

export const StateProvider = ({ reducer, initialState, children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);
StateProvider.propTypes = propTypes;

export const useStateValue = () => useContext(StateContext);
