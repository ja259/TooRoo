import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store'; // Ensure this path is correct and that store.js exports your Redux store
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// Measure performance in your app, you can pass a function to log results
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

