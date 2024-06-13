import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'; // Import the Provider
import store from './store'; // Make sure this path is correct
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>  {/* Wrap your App in the Provider and pass the store */}
      <App />
    </Provider>
  </React.StrictMode>
);

// If you are still interested in measuring performance in your app pass a function
// to log results (for example: reportWebVitals(console.log))
reportWebVitals();
