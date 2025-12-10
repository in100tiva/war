import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import App from './App';
import './index.css';

// Inicializa cliente Convex
// Em producao, use a URL do seu projeto Convex
const convexUrl = import.meta.env.VITE_CONVEX_URL || 'https://your-project.convex.cloud';
const convex = new ConvexReactClient(convexUrl);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  </StrictMode>
);
