
import { createContext, useContext, useState, useEffect } from 'react';

const CommercantContext = createContext(null);

export function CommercantProvider({ children }) {
  const [commercant, setCommercant] = useState(null);
  const [chargement, setChargement] = useState(true);

  const token = localStorage.getItem('token');

  const chargerCommercant = async () => {
    try {
      const response = await fetch('https://monkarnet-backend.onrender.com/api/profil', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) setCommercant(data);
    } catch (err) {
      // silencieux
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerCommercant();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CommercantContext.Provider value={{ commercant, setCommercant, chargement, rechargerCommercant: chargerCommercant }}>
      {children}
    </CommercantContext.Provider>
  );
}

export function useCommercant() {
  return useContext(CommercantContext);
}