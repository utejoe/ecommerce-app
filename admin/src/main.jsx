import React from 'react'
import ReactDOM from 'react-dom/client'  // Fix: should be ReactDOM, not ReactDom
import App from './App.jsx'
import './index.css'                     // Fix: use './index.css' not '/index.css'
import { BrowserRouter } from 'react-router-dom' // Fix: it's BrowserRouter, not BroserRouter

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
