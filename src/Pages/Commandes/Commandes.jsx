
import { useState, useEffect, useRef } from 'react';
import { Plus, X, Trash2, Calendar, ChevronDown } from 'lucide-react';
import './Commandes.css';

const filtres = ['Toutes', 'en_attente', 'en_cours', 'livree', 'litige'];
const filtreLabels = {
  Toutes: 'Toutes',
  en_attente: 'En attente',
  en_cours: 'En cours',
  livree: 'Livrée',
  litige: 'En litige',
};

const periodeLabels = {
  aujourdhui: "Aujourd'hui",
  hier: 'Hier',
  semaine: 'Cette semaine',
  mois: 'Ce mois',
};

const statutsPossibles = ['en_attente', 'en_cours', 'livree', 'litige'];

function statutClass(statut) {
  if (statut === 'livree') return 'commandes-badge-green';
  if (statut === 'en_cours') return 'commandes-badge-blue';
  if (statut === 'litige') return 'commandes-badge-red';
  return 'commandes-badge-gray';
}

function Commandes() {
  const [commandes, setCommandes] = useState([]);
  const [produits, setProduits] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [filtreActif, setFiltreActif] = useState('Toutes');
  const [modalOuvert, setModalOuvert] = useState(false);

  // Période
  const [periode, setPeriode] = useState('aujourdhui');
  const [dateCustom, setDateCustom] = useState(() => new Date().toISOString().split('T')[0]);
  const [menuPeriodeOuvert, setMenuPeriodeOuvert] = useState(false);
  const periodeRef = useRef(null);

  const [clientNom, setClientNom] = useState('');
  const [clientTelephone, setClientTelephone] = useState('');
  const [clientAdresse, setClientAdresse] = useState('');
  const [lignesProduits, setLignesProduits] = useState([{ produit: '', nomLibre: '', prixLibre: '', quantite: 1 }]);

  const token = localStorage.getItem('token');

  // Fermer le menu si on clique dehors
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (periodeRef.current && !periodeRef.current.contains(e.target)) {
        setMenuPeriodeOuvert(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const chargerDonnees = async () => {
    try {
      const [resCommandes, resProduits] = await Promise.all([
        fetch('https://monkarnet-backend.onrender.com/api/commandes', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('https://monkarnet-backend.onrender.com/api/produits', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const dataCommandes = await resCommandes.json();
      const dataProduits = await resProduits.json();

      if (!resCommandes.ok) throw new Error(dataCommandes.message || 'Erreur commandes.');
      if (!resProduits.ok) throw new Error(dataProduits.message || 'Erreur produits.');

      setCommandes(dataCommandes);
      setProduits(dataProduits);
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerDonnees();
  }, []);

  // Filtrage par période
  const getDateRange = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (periode === 'aujourdhui') {
      const end = new Date(today);
      end.setHours(23, 59, 59, 999);
      return { start: today, end };
    }

    if (periode === 'hier') {
      const start = new Date(today);
      start.setDate(start.getDate() - 1);
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }

    if (periode === 'semaine') {
      const start = new Date(today);
      start.setDate(start.getDate() - 6);
      const end = new Date(today);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }

    if (periode === 'mois') {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }

    // custom
    const start = new Date(dateCustom);
    start.setHours(0, 0, 0, 0);
    const end = new Date(dateCustom);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  };

  const commandesParPeriode = commandes.filter((c) => {
    const d = new Date(c.createdAt);
    const { start, end } = getDateRange();
    return d >= start && d <= end;
  });

  const commandesFiltrees =
    filtreActif === 'Toutes'
      ? commandesParPeriode
      : commandesParPeriode.filter((c) => c.statut === filtreActif);

  const ajouterLigne = () => {
    setLignesProduits([...lignesProduits, { produit: '', nomLibre: '', prixLibre: '', quantite: 1 }]);
  };

  const supprimerLigne = (index) => {
    setLignesProduits(lignesProduits.filter((_, i) => i !== index));
  };

  const modifierLigne = (index, champ, valeur) => {
    const nouvellesLignes = [...lignesProduits];
    nouvellesLignes[index][champ] = valeur;
    if (champ === 'produit' && valeur) {
      nouvellesLignes[index].nomLibre = '';
      nouvellesLignes[index].prixLibre = '';
    }
    setLignesProduits(nouvellesLignes);
  };

  const handleChangerStatut = async (commandeId, nouveauStatut) => {
    setCommandes((prev) =>
      prev.map((c) => (c._id === commandeId ? { ...c, statut: nouveauStatut } : c))
    );

    try {
      const response = await fetch(`https://monkarnet-backend.onrender.com/api/commandes/${commandeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ statut: nouveauStatut }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors du changement de statut.');
      }
    } catch (err) {
      setErreur(err.message);
      chargerDonnees();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const produitsFormates = [];

    for (const l of lignesProduits) {
      if (l.produit) {
        const produitInfo = produits.find((p) => p._id === l.produit);
        produitsFormates.push({
          produit: l.produit,
          quantite: Number(l.quantite),
          prixUnitaire: produitInfo.prix,
        });
      } else if (l.nomLibre.trim()) {
        produitsFormates.push({
          nomLibre: l.nomLibre.trim(),
          quantite: Number(l.quantite),
          prixUnitaire: Number(l.prixLibre) || 0,
        });
      }
    }

    if (produitsFormates.length === 0) {
      setErreur('Ajoutez au moins un produit.');
      return;
    }

    try {
      const response = await fetch('https://monkarnet-backend.onrender.com/api/commandes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          client: { nom: clientNom, telephone: clientTelephone, adresse: clientAdresse },
          produits: produitsFormates,
          statut: 'en_attente',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la création de la commande.");
      }

      await chargerDonnees();
      setModalOuvert(false);
      setClientNom('');
      setClientTelephone('');
      setClientAdresse('');
      setLignesProduits([{ produit: '', nomLibre: '', prixLibre: '', quantite: 1 }]);
    } catch (err) {
      setErreur(err.message);
    }
  };

  const labelPeriodeAffiche =
    periode === 'custom'
      ? new Date(dateCustom).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : periodeLabels[periode];

  return (
    <div className="commandes">
      {/* ========== HEADER ========== */}
      <div className="commandes-header">
        <div className="commandes-header-top">
          <h1 className="commandes-title">Commandes</h1>

          {/* Sélecteur de période - coin droit sur la même ligne que le titre */}
          <div className="commandes-periode" ref={periodeRef}>
            <button
              className="commandes-periode-btn"
              onClick={() => setMenuPeriodeOuvert(!menuPeriodeOuvert)}
            >
              <Calendar size={14} />
              <span>{labelPeriodeAffiche}</span>
              <ChevronDown size={14} className={menuPeriodeOuvert ? 'rotate' : ''} />
            </button>

            {menuPeriodeOuvert && (
              <div className="commandes-periode-menu">
                {Object.entries(periodeLabels).map(([key, label]) => (
                  <button
                    key={key}
                    className={periode === key ? 'actif' : ''}
                    onClick={() => {
                      setPeriode(key);
                      setMenuPeriodeOuvert(false);
                    }}
                  >
                    {label}
                  </button>
                ))}

                <div className="commandes-periode-custom">
                  <span>Choisir une date</span>
                  <input
                    type="date"
                    value={dateCustom}
                    onChange={(e) => {
                      setDateCustom(e.target.value);
                      setPeriode('custom');
                      setMenuPeriodeOuvert(false);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="commandes-subtitle">Suivez et gérez toutes vos commandes.</p>

        <button className="commandes-add-btn" onClick={() => setModalOuvert(true)}>
          <Plus size={18} />
          Nouvelle commande
        </button>
      </div>

      {erreur && <p className="commandes-error">{erreur}</p>}

      {/* ========== FILTRES STATUT ========== */}
      <div className="commandes-filtres">
        {filtres.map((f) => (
          <button
            key={f}
            className={`commandes-filtre-btn ${filtreActif === f ? 'commandes-filtre-actif' : ''}`}
            onClick={() => setFiltreActif(f)}
          >
            {filtreLabels[f]}
          </button>
        ))}
      </div>

      {chargement ? (
        <p className="commandes-loading">Chargement...</p>
      ) : commandesFiltrees.length === 0 ? (
        <p className="commandes-loading">
          Aucune commande pour {labelPeriodeAffiche.toLowerCase()}.
        </p>
      ) : (
        <>
          {/* TABLEAU Desktop */}
          <div className="commandes-table-wrapper">
            <table className="commandes-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Montant</th>
                  <th>Statut</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {commandesFiltrees.map((c) => (
                  <tr key={c._id}>
                    <td className="commandes-cell-client">
                      <span className="commandes-numero-mobile">{c.numero || '—'}</span>
                      <span className="commandes-nom-client">{c.client?.nom}</span>
                    </td>
                    <td className="commandes-montant">{c.total.toLocaleString('fr-FR')} F</td>
                    <td>
                      <select
                        className={`commandes-statut-select ${statutClass(c.statut)}`}
                        value={c.statut}
                        onChange={(e) => handleChangerStatut(c._id, e.target.value)}
                      >
                        {statutsPossibles.map((s) => (
                          <option key={s} value={s}>
                            {filtreLabels[s]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="commandes-date">
                      {new Date(c.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CARTES Mobile */}
          <div className="commandes-cards">
            {commandesFiltrees.map((c) => (
              <div key={c._id} className="commandes-card">
                <div className="commandes-card-top">
                  <div className="commandes-card-client">
                    <span className="commandes-numero-mobile">{c.numero || '—'}</span>
                    <span className="commandes-nom-client">{c.client?.nom}</span>
                  </div>
                  <span className="commandes-card-montant">
                    {c.total.toLocaleString('fr-FR')} F
                  </span>
                </div>

                <div className="commandes-card-bottom">
                  <select
                    className={`commandes-statut-select ${statutClass(c.statut)}`}
                    value={c.statut}
                    onChange={(e) => handleChangerStatut(c._id, e.target.value)}
                  >
                    {statutsPossibles.map((s) => (
                      <option key={s} value={s}>
                        {filtreLabels[s]}
                      </option>
                    ))}
                  </select>
                  <span className="commandes-card-date">
                    {new Date(c.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ========== MODAL ========== */}
      {modalOuvert && (
        <div className="commandes-modal-overlay" onClick={() => setModalOuvert(false)}>
          <div className="commandes-modal" onClick={(e) => e.stopPropagation()}>
            <div className="commandes-modal-header">
              <h2>Nouvelle commande</h2>
              <button className="commandes-modal-close" onClick={() => setModalOuvert(false)}>
                <X size={20} />
              </button>
            </div>
            <form className="commandes-modal-form" onSubmit={handleSubmit}>
              <label>
                Nom du client
                <input
                  type="text"
                  value={clientNom}
                  onChange={(e) => setClientNom(e.target.value)}
                  required
                />
              </label>
              <label>
                Téléphone
                <input
                  type="tel"
                  value={clientTelephone}
                  onChange={(e) => setClientTelephone(e.target.value)}
                />
              </label>
              <label>
                Adresse
                <input
                  type="text"
                  value={clientAdresse}
                  onChange={(e) => setClientAdresse(e.target.value)}
                />
              </label>

              <div className="commandes-modal-produits-label">Produits</div>
              {lignesProduits.map((ligne, index) => (
                <div key={index} className="commandes-modal-bloc-produit">
                  <div className="commandes-modal-ligne">
                    <select
                      value={ligne.produit}
                      onChange={(e) => modifierLigne(index, 'produit', e.target.value)}
                    >
                      <option value="">Produit du catalogue...</option>
                      {produits.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.nom} — {p.prix.toLocaleString('fr-FR')} F
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      value={ligne.quantite}
                      onChange={(e) => modifierLigne(index, 'quantite', e.target.value)}
                      className="commandes-modal-qte"
                    />
                    {lignesProduits.length > 1 && (
                      <button
                        type="button"
                        className="commandes-modal-remove"
                        onClick={() => supprimerLigne(index)}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  {!ligne.produit && (
                    <div className="commandes-modal-ligne-libre">
                      <span className="commandes-modal-ou">ou saisir librement :</span>
                      <input
                        type="text"
                        placeholder="Nom du produit"
                        value={ligne.nomLibre}
                        onChange={(e) => modifierLigne(index, 'nomLibre', e.target.value)}
                        className="commandes-modal-nom-libre"
                      />
                      <input
                        type="number"
                        min="0"
                        placeholder="Prix"
                        value={ligne.prixLibre}
                        onChange={(e) => modifierLigne(index, 'prixLibre', e.target.value)}
                        className="commandes-modal-prix-libre"
                      />
                    </div>
                  )}
                </div>
              ))}
              <button type="button" className="commandes-modal-add-ligne" onClick={ajouterLigne}>
                + Ajouter un produit
              </button>

              <button type="submit" className="commandes-modal-submit">
                Créer la commande
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Commandes;