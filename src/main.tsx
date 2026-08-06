import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.tsx';
import ClientApp from './client-app/ClientApp.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/counselor/*" element={<App />} />
        <Route path="/client/*" element={<ClientApp />} />
        {/* Default redirect to counselor */}
        <Route path="*" element={<Navigate to="/counselor" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
