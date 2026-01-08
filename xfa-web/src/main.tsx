import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initConfig } from './config/appConfig'

// Carregar configurações antes de inicializar a aplicação
initConfig()
  .then(() => {
    createRoot(document.getElementById("root")!).render(<App />);
  })
  .catch((error) => {
    // console.error('Erro ao carregar configurações:', error);
    // Renderiza mesmo assim com fallback
    createRoot(document.getElementById("root")!).render(<App />);
  });
