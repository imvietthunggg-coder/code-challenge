import { createElement, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import App from './src/App.jsx';

createRoot(document.getElementById('root')).render(
  createElement(StrictMode, null, createElement(App)),
);
