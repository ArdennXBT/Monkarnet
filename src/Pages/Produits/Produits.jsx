import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, X, Pencil, Trash2, ImagePlus, Package, Search } from 'lucide-react';
import './Produits.css';

const CLOUDINARY_CLOUD_NAME = 'pfmip5ll';
const CLOUDINARY_UPLOAD_PRESET = 'comerza_produits';
const SEUIL_STOCK_FAIBLE = 5;

const CATEGORIES = [
  'Alimentation',
  'Boissons',
  'Mode & Vêtements',
  'Électronique',
  'Beauté & Hygiène',
  'Maison & Déco',
  'Services',
  'Autre',
];

const FORM_VIDE = {
  nom: '',
  categorie: 'Autre',
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

  const [searchParams, setSearchParams] = useSearchParams();
  const recherche = searchParams.get('q') || '';
  const tri = searchParams.get('tri') || 'recent';

  const [categorieActive, setCategorieActive] = useState('Toutes');

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
      categorie: produit.categorie || 'Autre',
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

  const reinitialiserFiltres = () => {
    setCategorieActive('Toutes');
    const nouveaux = new URLSearchParams(searchParams);
    nouveaux.delete('q');
    nouveaux.delete('tri');
    setSearchParams(nouveaux);
  };

  // --- Filtrage + tri ---
  const margeDe = (p) => p.prix - (p.coutRevient || 0);

  let produitsAffiches = produits.filter((p) => {
    const correspondCategorie = categorieActive === 'Toutes' || (p.categorie || 'Autre') === categorieActive;
    const correspondRecherche = p.nom.toLowerCase().includes(recherche.trim().toLowerCase());
    return correspondCategorie && correspondRecherche;
  });

  produitsAffiches = [...produitsAffiches].sort((a, b) => {
    switch (tri) {
      case 'nom':
        return a.nom.localeCompare(b.nom, 'fr');
      case 'stock-asc':
        return a.stock - b.stock;
      case 'stock-desc':
        return b.stock - a.stock;
      case 'marge-desc':
        return margeDe(b) - margeDe(a);
      case 'marge-asc':
        return margeDe(a) - margeDe(b);
      default:
        return 0;
    }
  });

  const aucunProduitDuTout = !chargement && produits.length === 0;
  const aucunResultatFiltre = !chargement && produits.length > 0 && produitsAffiches.length === 0;
  const filtresActifs = recherche.trim() !== '' || categorieActive !== 'Toutes' || tri !== 'recent';

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

      {!aucunProduitDuTout && (
        <div className="produits-categories">
          <button
            className={`produits-categorie-chip ${categorieActive === 'Toutes' ? 'active' : ''}`}
            onClick={() => setCategorieActive('Toutes')}
          >
            Toutes
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`produits-categorie-chip ${categorieActive === cat ? 'active' : ''}`}
              onClick={() => setCategorieActive(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {chargement ? (
        <p className="produits-loading">Chargement...</p>
      ) : aucunProduitDuTout ? (
        <div className="produits-empty">
          <div className="produits-empty-icon">
            <Package size={32} strokeWidth={1.5} />
          </div>
          <h2>Votre catalogue est vide</h2>
          <p>Ajoutez votre premier produit pour commencer à gérer vos ventes.</p>
          <button className="produits-add-btn" onClick={ouvrirAjout}>
            <Plus size={18} />
            Ajouter un produit
          </button>
        </div>
      ) : aucunResultatFiltre ? (
        <div className="produits-empty">
          <div className="produits-empty-icon">
            <Search size={28} strokeWidth={1.5} />
          </div>
          <h2>Aucun produit trouvé</h2>
          <p>Aucun produit ne correspond à votre recherche ou aux filtres sélectionnés.</p>
          {filtresActifs && (
            <button className="produits-reset-btn" onClick={reinitialiserFiltres}>
              Réinitialiser les filtres
            </button>
          )}
        </div>
      ) : (
        <div className="produits-grid">
          {produitsAffiches.map((p) => {
            const marge = margeDe(p);
            const pourcentageMarge = p.prix > 0 ? Math.round((marge / p.prix) * 100) : 0;
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

                  <span className="produits-card-categorie">{p.categorie || 'Autre'}</span>

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

                  {stockFaible && (
                    <div className="produits-card-stock-ribbon">
                      Stock faible — {p.stock} restant{p.stock > 1 ? 's' : ''}
                    </div>
                  )}
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
                    <strong>{p.stock}</strong>
                  </div>

                  <div className="produits-card-marge">
                    <span>Marge : {marge.toLocaleString('fr-FR')} F</span>
                    <span className="produits-card-marge-pct">{pourcentageMarge}%</span>
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
                Catégorie
                <select name="categorie" value={formData.categorie} onChange={handleChange}>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
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