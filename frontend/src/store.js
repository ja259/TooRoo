import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';  // Correct import for thunk

import authReducer from './reducers/authReducer'; // Verify the correct export

const rootReducer = combineReducers({
  auth: authReducer, // authReducer should be correctly imported
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk)) // Correct application of thunk middleware
);

export default store;
