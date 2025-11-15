
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Note: React.StrictMode has been removed to enhance stability with various libraries,
// preventing potential issues from double-invoking effects during development.
root.render(
    <App />
);
