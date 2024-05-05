import React from 'react';import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CssBaseline } from '@mui/material';
import { createRoot } from 'react-dom/client';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <CssBaseline />
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found in the DOM.");
}