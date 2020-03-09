import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import currentReducer from "./reducer/current";
import { ICurrent } from "./types";
import { Provider } from "react-redux";
import { applyMiddleware, compose, createStore } from "redux";
import thunkMiddleware from "redux-thunk-recursion-detect";

// Declaring pages
// Need to add history
// https://stackoverflow.com/questions/42672842/how-to-get-history-on-react-router-v4

/*
let composeEnhancers;

if (
  process.env.NODE_ENV !== "production" &&
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
) {
  composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
} else {
  composeEnhancers = compose;
}

const store = createStore<ICurrent, any, any, any>(
  currentReducer,
  undefined,
  composeEnhancers(applyMiddleware(thunkMiddleware)),
);



*/

/*
Need <Provider store={store}></Provider>

*/


ReactDOM.render(<App />, document.getElementById('root'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
