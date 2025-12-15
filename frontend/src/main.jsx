import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import {SearchProvider} from '../context/SearchContext.jsx'
import '@fortawesome/fontawesome-free/css/all.min.css';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <SearchProvider>
          <App />
      </SearchProvider>
    </Router>
  </StrictMode>,
)
