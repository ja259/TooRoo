import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import authReducer from './reducers/authReducer'; // Ensure you are exporting it correctly

const rootReducer = combineReducers({
  auth: authReducer, // Make sure authReducer is correctly exported as a default or named export
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk)) // Correct usage of thunk middleware
);

export default store;
