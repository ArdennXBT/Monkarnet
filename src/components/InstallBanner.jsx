import { useState, useEffect } from 'react';
import './InstallBanner.css';

const STORAGE_KEY = 'orbizo_install_banner_seen';
const DISPLAY_DURATION = 15000; // 15 secondes

function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const dismissBanner = () => {
    setIsClosing(true);
    localStorage.setItem(STORAGE_KEY, 'true');
    setTimeout(() => setShowBanner(false), 300);
  };

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();

      const alreadySeen = localStorage.getItem(STORAGE_KEY);
      if (alreadySeen) return;

      setDeferredPrompt(e);
      setShowBanner(true);

      const closeTimer = setTimeout(() => {
        dismissBanner();
      }, DISPLAY_DURATION);

      return () => clearTimeout(closeTimer);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      dismissBanner();
    }
    setDeferredPrompt(null);
  };

  if (!showBanner) return null;

  return (
    <div className={`install-banner ${isClosing ? 'install-banner-closing' : ''}`}>
      <button
        className="install-banner-close"
        onClick={dismissBanner}
        aria-label="Fermer"
      >
        ✕
      </button>
      <div className="install-banner-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"
            stroke="#003d91" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <p className="install-banner-text">
        Installez Orbizo pour un accès plus rapide
      </p>
      <button className="install-banner-btn" onClick={handleInstall}>
        Installer
      </button>
    </div>
  );
}

export default InstallBanner;