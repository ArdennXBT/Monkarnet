
import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import './Produits.css';

function Produits() {
  const [produits, setProduits] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [modalOuvert, setModalOuvert] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prix: '',
    coutRevient: '',
    stock: '',
    description: '',
  });

  const token = localStorage.getItem('token');

  const chargerProduits = async () => {
    try {
      const response = await fetch('https://monkarnet-backend.onrender.com/api/produits', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors du chargement des produits.');
      }

      setProduits(data);
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerProduits();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://monkarnet-backend.onrender.com/api/produits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          prix: Number(formData.prix),
          coutRevient: Number(formData.coutRevient),
          stock: Number(formData.stock),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'ajout du produit.");
      }

      setProduits([data, ...produits]);
      setModalOuvert(false);
      setFormData({ nom: '', prix: '', coutRevient: '', stock: '', description: '' });
    } catch (err) {
      setErreur(err.message);
    }
  };

  return (
    <div className="produits">
      <div className="produits-header">
        <div>
          <h1 className="produits-title">Produits</h1>
          <p className="produits-subtitle">Gérez votre catalogue de produits.</p>
        </div>
        <button className="produits-add-btn" onClick={() => setModalOuvert(true)}>
          <Plus size={18} />
          Ajouter un produit
        </button>
      </div>

      {erreur && <p className="produits-error">{erreur}</p>}

      {chargement ? (
        <p className="produits-loading">Chargement...</p>
      ) : produits.length === 0 ? (
        <p className="produits-loading">Aucun produit pour l'instant. Ajoutez-en un pour commencer.</p>
      ) : (
        <div className="produits-grid">
          {produits.map((p) => {
            const marge = p.prix - p.coutRevient;
            return (
              <div key={p._id} className="produits-card">
                <p className="produits-card-nom">{p.nom}</p>
                <div className="produits-card-row">
                  <span>Prix de vente</span>
                  <strong>{p.prix.toLocaleString('fr-FR')} F</strong>
                </div>
                <div className="produits-card-row">
                  <span>Coût de préparation</span>
                  <strong>{p.coutRevient.toLocaleString('fr-FR')} F</strong>
                </div>
                <div className="produits-card-row">
                  <span>Stock</span>
                  <strong>{p.stock}</strong>
                </div>
                <div className="produits-card-marge">
                  Marge : {marge.toLocaleString('fr-FR')} F
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOuvert && (
        <div className="produits-modal-overlay" onClick={() => setModalOuvert(false)}>
          <div className="produits-modal" onClick={(e) => e.stopPropagation()}>
            <div className="produits-modal-header">
              <h2>Ajouter un produit</h2>
              <button className="produits-modal-close" onClick={() => setModalOuvert(false)}>
                <X size={20} />
              </button>
            </div>
            <form className="produits-modal-form" onSubmit={handleSubmit}>
              <label>
                Nom du produit
                <input type="text" name="nom" value={formData.nom} onChange={handleChange} required />
              </label>
              <label>
                Prix de vente (F)
                <input type="number" name="prix" value={formData.prix} onChange={handleChange} required />
              </label>
              <label>
                Coût de préparation (F)
                <input type="number" name="coutRevient" value={formData.coutRevient} onChange={handleChange} />
              </label>
              <label>
                Stock
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} />
              </label>
              <label>
                Description
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} />
              </label>
              <button type="submit" className="produits-modal-submit">Ajouter le produit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Produits;