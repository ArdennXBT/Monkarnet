
import { useState, useEffect } from 'react';
import { Plus, X, Trash2 } from 'lucide-react';
import './Commandes.css';

const filtres = ['Toutes', 'en_attente', 'en_cours', 'livree', 'litige'];
const filtreLabels = {
  Toutes: 'Toutes',
  en_attente: 'En attente',
  en_cours: 'En cours',
  livree: 'Livrée',
  litige: 'En litige',
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

  const [clientNom, setClientNom] = useState('');
  const [clientTelephone, setClientTelephone] = useState('');
  const [clientAdresse, setClientAdresse] = useState('');
  const [lignesProduits, setLignesProduits] = useState([{ produit: '', nomLibre: '', prixLibre: '', quantite: 1 }]);

  const token = localStorage.getItem('token');

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    chargerDonnees();
  }, []);

  const commandesFiltrees = filtreActif === 'Toutes'
    ? commandes
    : commandes.filter((c) => c.statut === filtreActif);

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

  return (
    <div className="commandes">
      <div className="commandes-header">
        <div>
          <h1 className="commandes-title">Commandes</h1>
          <p className="commandes-subtitle">Suivez et gérez toutes vos commandes.</p>
        </div>
        <button className="commandes-add-btn" onClick={() => setModalOuvert(true)}>
          <Plus size={18} />
          Nouvelle commande
        </button>
      </div>

      {erreur && <p className="commandes-error">{erreur}</p>}

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
        <p className="commandes-loading">Aucune commande pour l'instant.</p>
      ) : (
        <>
          <div className="commandes-table-wrapper commandes-desktop-only">
            <table className="commandes-table">
              <thead>
                <tr>
                  <th>N°</th>
                  <th>Client</th>
                  <th>Montant</th>
                  <th>Statut</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {commandesFiltrees.map((c) => (
                  <tr key={c._id}>
                    <td><span className="commandes-numero">{c.numero || '—'}</span></td>
                    <td>{c.client?.nom}</td>
                    <td>{c.total.toLocaleString('fr-FR')} F</td>
                    <td>
                      <select
                        className={`commandes-statut-select ${statutClass(c.statut)}`}
                        value={c.statut}
                        onChange={(e) => handleChangerStatut(c._id, e.target.value)}
                      >
                        {statutsPossibles.map((s) => (
                          <option key={s} value={s}>{filtreLabels[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td>{new Date(c.createdAt).toLocaleDateString('fr-FR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="commandes-cards commandes-mobile-only">
            {commandesFiltrees.map((c) => (
              <div className="commande-card" key={c._id}>
                <div className="commande-card-top">
                  <span className="commandes-numero">{c.numero || '—'}</span>
                  <span className="commande-card-date">{new Date(c.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="commande-card-client">{c.client?.nom}</div>
                <div className="commande-card-bottom">
                  <span className="commande-card-montant">{c.total.toLocaleString('fr-FR')} F</span>
                  <select
                    className={`commandes-statut-select ${statutClass(c.statut)}`}
                    value={c.statut}
                    onChange={(e) => handleChangerStatut(c._id, e.target.value)}
                  >
                    {statutsPossibles.map((s) => (
                      <option key={s} value={s}>{filtreLabels[s]}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

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
                <input type="text" value={clientNom} onChange={(e) => setClientNom(e.target.value)} required />
              </label>
              <label>
                Téléphone
                <input type="tel" value={clientTelephone} onChange={(e) => setClientTelephone(e.target.value)} />
              </label>
              <label>
                Adresse
                <input type="text" value={clientAdresse} onChange={(e) => setClientAdresse(e.target.value)} />
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
                        <option key={p._id} value={p._id}>{p.nom} — {p.prix.toLocaleString('fr-FR')} F</option>
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
                      <button type="button" className="commandes-modal-remove" onClick={() => supprimerLigne(index)}>
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

              <button type="submit" className="commandes-modal-submit">Créer la commande</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Commandes;