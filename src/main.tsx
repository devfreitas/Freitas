import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeContext'
import { LangProvider } from './context/LangContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <LangProvider>
        <App />
      </LangProvider>
    </ThemeProvider>
  </StrictMode>,
)
