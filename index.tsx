
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

console.log('index.tsx: Starting to mount React');

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

console.log('index.tsx: Found root element');

const root = ReactDOM.createRoot(rootElement);
console.log('index.tsx: Created root, about to render');

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('index.tsx: Render called');
