import { useState, useEffect } from 'react';
import { Plus, X, Pencil, Trash2, ImagePlus, Package } from 'lucide-react';
import './Produits.css';

const CLOUDINARY_CLOUD_NAME = 'pfmip5ll';
const CLOUDINARY_UPLOAD_PRESET = 'comerza_produits';
const SEUIL_STOCK_FAIBLE = 5;

const FORM_VIDE = {
  nom: '',
  prix: '',
  coutRevient: '',
  stock: '',
  description: '',
  image: '',
};

function Produits() {
  const [produits, setProduits] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  const [modalOuvert, setModalOuvert] = useState(false);
  const [produitEnEdition, setProduitEnEdition] = useState(null);
  const [formData, setFormData] = useState(FORM_VIDE);
  const [uploadEnCours, setUploadEnCours] = useState(false);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  const [produitASupprimer, setProduitASupprimer] = useState(null);
  const [suppressionEnCours, setSuppressionEnCours] = useState(false);

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

  const handleImageChange = async (e) => {
    const fichier = e.target.files[0];
    if (!fichier) return;

    setUploadEnCours(true);
    setErreur('');

    try {
      const data = new FormData();
      data.append('file', fichier);
      data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: data }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || "Erreur lors de l'envoi de l'image.");
      }

      setFormData((prev) => ({ ...prev, image: result.secure_url }));
    } catch (err) {
      setErreur(err.message);
    } finally {
      setUploadEnCours(false);
    }
  };

  const ouvrirAjout = () => {
    setProduitEnEdition(null);
    setFormData(FORM_VIDE);
    setModalOuvert(true);
  };

  const ouvrirEdition = (produit) => {
    setProduitEnEdition(produit);
    setFormData({
      nom: produit.nom || '',
      prix: produit.prix ?? '',
      coutRevient: produit.coutRevient ?? '',
      stock: produit.stock ?? '',
      description: produit.description || '',
      image: produit.image || '',
    });
    setModalOuvert(true);
  };

  const fermerModal = () => {
    if (envoiEnCours) return;
    setModalOuvert(false);
    setProduitEnEdition(null);
    setFormData(FORM_VIDE);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnvoiEnCours(true);
    setErreur('');

    const enEdition = Boolean(produitEnEdition);
    const url = enEdition
      ? `https://monkarnet-backend.onrender.com/api/produits/${produitEnEdition._id}`
      : 'https://monkarnet-backend.onrender.com/api/produits';

    try {
      const response = await fetch(url, {
        method: enEdition ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          prix: Number(formData.prix),
          coutRevient: Number(formData.coutRevient) || 0,
          stock: Number(formData.stock) || 0,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'enregistrement du produit.");
      }

      if (enEdition) {
        setProduits(produits.map((p) => (p._id === data._id ? data : p)));
      } else {
        setProduits([data, ...produits]);
      }

      fermerModal();
    } catch (err) {
      setErreur(err.message);
    } finally {
      setEnvoiEnCours(false);
    }
  };

  const confirmerSuppression = async () => {
    if (!produitASupprimer) return;
    setSuppressionEnCours(true);
    setErreur('');

    try {
      const response = await fetch(
        `https://monkarnet-backend.onrender.com/api/produits/${produitASupprimer._id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la suppression.');
      }

      setProduits(produits.filter((p) => p._id !== produitASupprimer._id));
      setProduitASupprimer(null);
    } catch (err) {
      setErreur(err.message);
    } finally {
      setSuppressionEnCours(false);
    }
  };

  return (
    <div className="produits">
      <div className="produits-header">
        <div>
          <h1 className="produits-title">Produits</h1>
          <p className="produits-subtitle">Gérez votre catalogue de produits.</p>
        </div>
        <button className="produits-add-btn" onClick={ouvrirAjout}>
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
            const marge = p.prix - (p.coutRevient || 0);
            const stockFaible = p.stock <= SEUIL_STOCK_FAIBLE;

            return (
              <div key={p._id} className="produits-card">
                <div className="produits-card-media">
                  {p.image ? (
                    <img src={p.image} alt={p.nom} className="produits-card-img" />
                  ) : (
                    <div className="produits-card-img-placeholder">
                      <Package size={28} strokeWidth={1.5} />
                    </div>
                  )}

                  <div className="produits-card-actions">
                    <button
                      className="produits-card-action-btn"
                      onClick={() => ouvrirEdition(p)}
                      aria-label="Modifier le produit"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      className="produits-card-action-btn produits-card-action-danger"
                      onClick={() => setProduitASupprimer(p)}
                      aria-label="Supprimer le produit"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="produits-card-body">
                  <p className="produits-card-nom">{p.nom}</p>

                  <div className="produits-card-row prix-vente">
                    <span>Prix de vente</span>
                    <strong>{p.prix.toLocaleString('fr-FR')} F</strong>
                  </div>
                  <div className="produits-card-row">
                    <span>Prix d'achat</span>
                    <strong>{(p.coutRevient || 0).toLocaleString('fr-FR')} F</strong>
                  </div>
                  <div className="produits-card-row">
                    <span>Stock</span>
                    {stockFaible ? (
                      <span className="produits-stock-badge">{p.stock} restant{p.stock > 1 ? 's' : ''}</span>
                    ) : (
                      <strong>{p.stock}</strong>
                    )}
                  </div>

                  <div className="produits-card-marge">
                    Marge : {marge.toLocaleString('fr-FR')} F
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOuvert && (
        <div className="produits-modal-overlay" onClick={fermerModal}>
          <div className="produits-modal" onClick={(e) => e.stopPropagation()}>
            <div className="produits-modal-header">
              <h2>{produitEnEdition ? 'Modifier le produit' : 'Ajouter un produit'}</h2>
              <button className="produits-modal-close" onClick={fermerModal}>
                <X size={20} />
              </button>
            </div>

            <form className="produits-modal-form" onSubmit={handleSubmit}>
              <label className="produits-image-upload">
                Photo du produit
                <div className="produits-image-upload-zone">
                  {formData.image ? (
                    <img src={formData.image} alt="Aperçu" className="produits-image-preview" />
                  ) : (
                    <div className="produits-image-upload-placeholder">
                      <ImagePlus size={22} strokeWidth={1.5} />
                      <span>{uploadEnCours ? 'Envoi en cours...' : 'Ajouter une photo'}</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={uploadEnCours}
                  />
                </div>
              </label>

              <label>
                Nom du produit
                <input type="text" name="nom" value={formData.nom} onChange={handleChange} required />
              </label>
              <label>
                Prix de vente (F)
                <input type="number" name="prix" value={formData.prix} onChange={handleChange} required />
              </label>
              <label>
                Prix d'achat (F)
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

              <button type="submit" className="produits-modal-submit" disabled={envoiEnCours || uploadEnCours}>
                {envoiEnCours
                  ? 'Enregistrement...'
                  : produitEnEdition
                  ? 'Enregistrer les modifications'
                  : 'Ajouter le produit'}
              </button>
            </form>
          </div>
        </div>
      )}

      {produitASupprimer && (
        <div className="produits-modal-overlay" onClick={() => !suppressionEnCours && setProduitASupprimer(null)}>
          <div className="produits-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Supprimer ce produit ?</h2>
            <p>
              "{produitASupprimer.nom}" sera définitivement supprimé de votre catalogue. Cette action est
              irréversible.
            </p>
            <div className="produits-confirm-actions">
              <button
                className="produits-confirm-cancel"
                onClick={() => setProduitASupprimer(null)}
                disabled={suppressionEnCours}
              >
                Annuler
              </button>
              <button
                className="produits-confirm-delete"
                onClick={confirmerSuppression}
                disabled={suppressionEnCours}
              >
                {suppressionEnCours ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Produits;