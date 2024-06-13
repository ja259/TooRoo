import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

// Import your reducers
import { authReducer } from './reducers/authReducer';  // Adjust the path as necessary

// Combine all reducers into a single root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  // Add other reducers here when needed
});

// Configure middlewares (thunk and possibly others)
const middleware = [thunk];

// Create the store with root reducer, middleware, and Redux DevTools integration
const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(...middleware)
  )
);

export default store;
