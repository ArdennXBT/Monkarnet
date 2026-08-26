import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CommercantContext = createContext(null);

export function CommercantProvider({ children }) {
  const [commercant, setCommercant] = useState(null);
  const [chargement, setChargement] = useState(true);

  const chargerCommercant = useCallback(async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setCommercant(null);
      setChargement(false);
      return;
    }

    setChargement(true);

    try {
      const response = await fetch('https://monkarnet-backend.onrender.com/api/profil', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok) {
        setCommercant(data);
      } else {
        setCommercant(null);
      }
    } catch (err) {
      setCommercant(null);
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => {
    chargerCommercant();
  }, [chargerCommercant]);

  return (
    <CommercantContext.Provider
      value={{
        commercant,
        setCommercant,
        chargement,
        rechargerCommercant: chargerCommercant,
      }}
    >
      {children}
    </CommercantContext.Provider>
  );
}

export function useCommercant() {
  const context = useContext(CommercantContext);
  if (!context) {
    throw new Error('useCommercant doit être utilisé à l’intérieur de CommercantProvider');
  }
  return context;
}