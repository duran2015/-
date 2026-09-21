import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import ClientApp from './client-app/ClientApp.tsx';
import './index.css';
import { isKnownAppPath, resolveAppRoute } from './routeResolution';
import { SharedProfileLanding } from './components/Growth/ProfilePublicView';
import { PROFILE_SHARE_PATH } from './components/Growth/profileSharing';

if (!isKnownAppPath(window.location.pathname)) {
  window.history.replaceState(null, '', '/counselor');
}

const route = resolveAppRoute(window.location.pathname);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {window.location.pathname === PROFILE_SHARE_PATH ? <SharedProfileLanding /> : route === 'client' ? <ClientApp /> : <App />}
  </StrictMode>,
);
