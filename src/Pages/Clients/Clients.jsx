import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Phone, MapPin, MessageCircle, Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import './Clients.css';
import AccesAbonnementRequis from '../../components/AccesAbonnementRequis/AccesAbonnementRequis';

// Indicatif pays utilisé pour construire les liens WhatsApp à partir des numéros locaux.
// À adapter si tu gères plusieurs pays / si les numéros sont déjà stockés avec indicatif.
const INDICATIF_PAYS = '229';

const ONGLETS_ACTIVITE = [
  { id: 'tous', label: 'Tous' },
  { id: 'aujourdhui', label: "Aujourd'hui" },
  { id: 'hier', label: 'Hier' },
  { id: 'semaine', label: 'Cette semaine' },
  { id: 'mois', label: 'Ce mois' },
];

const PERIODES_TOP = [
  { id: '7', label: '7 jours' },
  { id: '30', label: '30 jours' },
  { id: '90', label: '3 mois' },
  { id: '180', label: '6 mois' },
  { id: 'tout', label: 'Tout' },
];

function debutDeJournee(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function correspondActivite(dateStr, ongletId) {
  if (ongletId === 'tous') return true;
  if (!dateStr) return false;

  const date = new Date(dateStr);
  const maintenant = new Date();

  switch (ongletId) {
    case 'aujourdhui':
      return debutDeJournee(date).getTime() === debutDeJournee(maintenant).getTime();
    case 'hier': {
      const hier = new Date(maintenant);
      hier.setDate(hier.getDate() - 1);
      return debutDeJournee(date).getTime() === debutDeJournee(hier).getTime();
    }
    case 'semaine': {
      const limite = new Date(maintenant);
      limite.setDate(limite.getDate() - 7);
      return date >= limite && date <= maintenant;
    }
    case 'mois': {
      const limite = new Date(maintenant);
      limite.setDate(limite.getDate() - 30);
      return date >= limite && date <= maintenant;
    }
    default:
      return true;
  }
}

function dansLesNJours(dateStr, nbJours) {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const maintenant = new Date();
  const limite = new Date(maintenant);
  limite.setDate(limite.getDate() - nbJours);
  return date >= limite && date <= maintenant;
}

function formaterNumeroWhatsapp(telephone) {
  if (!telephone) return null;
  const chiffres = telephone.replace(/\D/g, '');
  if (!chiffres) return null;
  return chiffres.startsWith(INDICATIF_PAYS) ? chiffres : `${INDICATIF_PAYS}${chiffres}`;
}

function estNouveauClient(dateCreation) {
  if (!dateCreation) return false;
  return dansLesNJours(dateCreation, 7);
}

const MEDAILLES = ['🥇', '🥈', '🥉'];

function Clients() {
  const [clients, setClients] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  // La recherche est saisie dans la barre de la navbar et transmise via ?q=
  const [searchParams] = useSearchParams();
  const recherche = searchParams.get('q') || '';

  const [ongletActivite, setOngletActivite] = useState('tous');

  const [afficherTop, setAfficherTop] = useState(false);
  const [periodeTop, setPeriodeTop] = useState('30');
  const [triTop, setTriTop] = useState('montant'); // 'montant' | 'commandes'

  // Id du client dont la carte est actuellement dépliée (un seul à la fois)
  const [clientOuvertId, setClientOuvertId] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const chargerClients = async () => {
      try {
        const response = await fetch('https://monkarnet-backend.onrender.com/api/clients', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Erreur lors du chargement.');

        setClients(data);
      } catch (err) {
        setErreur(err.message);
      } finally {
        setChargement(false);
      }
    };

    chargerClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Vérifie si au moins un client possède un historique détaillé de commandes
  const historiqueDetailleDisponible = useMemo(
    () => clients.some((c) => Array.isArray(c.commandes) && c.commandes.length > 0),
    [clients]
  );

  // Liste principale : recherche + filtre d'activité (basé sur la dernière commande)
  const clientsFiltres = useMemo(() => {
    const rechercheNormalisee = recherche.trim().toLowerCase();

    return clients.filter((c) => {
      const correspondRecherche =
        !rechercheNormalisee ||
        c.nom?.toLowerCase().includes(rechercheNormalisee) ||
        c.telephone?.includes(rechercheNormalisee) ||
        c.adresse?.toLowerCase().includes(rechercheNormalisee);

      const correspondPeriode = correspondActivite(c.derniereCommande, ongletActivite);

      return correspondRecherche && correspondPeriode;
    });
  }, [clients, recherche, ongletActivite]);

  // Classement des meilleurs clients sur la période choisie
  const topClients = useMemo(() => {
    const clientsAvecPeriode = clients.map((c) => {
      const aHistorique = Array.isArray(c.commandes) && c.commandes.length > 0;

      if (periodeTop === 'tout' || !aHistorique) {
        return {
          ...c,
          montantPeriode: c.totalDepense || 0,
          commandesPeriode: c.nombreCommandes || 0,
          approximatif: periodeTop !== 'tout' && !aHistorique,
        };
      }

      const commandesPeriode = c.commandes.filter((cmd) => dansLesNJours(cmd.date, Number(periodeTop)));

      return {
        ...c,
        montantPeriode: commandesPeriode.reduce((total, cmd) => total + (cmd.montant || 0), 0),
        commandesPeriode: commandesPeriode.length,
        approximatif: false,
      };
    });

    return clientsAvecPeriode
      .filter((c) => (triTop === 'montant' ? c.montantPeriode > 0 : c.commandesPeriode > 0))
      .sort((a, b) =>
        triTop === 'montant' ? b.montantPeriode - a.montantPeriode : b.commandesPeriode - a.commandesPeriode
      )
      .slice(0, 5);
  }, [clients, periodeTop, triTop]);

  const messageWhatsapp = (nom) =>
    encodeURIComponent(`Bonjour ${nom || ''}, `.trim() + ' ');

  const toggleClient = (id) => {
    setClientOuvertId((actuel) => (actuel === id ? null : id));
  };

  return (
    <AccesAbonnementRequis>
    <div className="clients">
      <h1 className="clients-title">Clients</h1>
      <p className="clients-subtitle">Retrouvez vos clients et leur historique.</p>

      {erreur && <p className="clients-error">{erreur}</p>}

      {!chargement && !erreur && clients.length > 0 && (
        <>
          {/* Filtre d'activité (la recherche a été déplacée dans la navbar) */}
          <div className="clients-toolbar">
            <div className="clients-tabs">
              {ONGLETS_ACTIVITE.map((onglet) => (
                <button
                  key={onglet.id}
                  type="button"
                  className={`clients-tab ${ongletActivite === onglet.id ? 'active' : ''}`}
                  onClick={() => setOngletActivite(onglet.id)}
                >
                  {onglet.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bloc Top clients */}
          <div className="clients-top-section">
            <button
              type="button"
              className="clients-top-toggle"
              onClick={() => setAfficherTop((v) => !v)}
            >
              <span>
                <Trophy size={16} /> Meilleurs clients
              </span>
              {afficherTop ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {afficherTop && (
              <div className="clients-top-content">
                <div className="clients-top-controls">
                  <div className="clients-top-periodes">
                    {PERIODES_TOP.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        className={`clients-chip ${periodeTop === p.id ? 'active' : ''}`}
                        onClick={() => setPeriodeTop(p.id)}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  <div className="clients-top-tri">
                    <button
                      type="button"
                      className={`clients-chip ${triTop === 'montant' ? 'active' : ''}`}
                      onClick={() => setTriTop('montant')}
                    >
                      Montant dépensé
                    </button>
                    <button
                      type="button"
                      className={`clients-chip ${triTop === 'commandes' ? 'active' : ''}`}
                      onClick={() => setTriTop('commandes')}
                    >
                      Nb. commandes
                    </button>
                  </div>
                </div>

                {!historiqueDetailleDisponible && periodeTop !== 'tout' && (
                  <p className="clients-top-note">
                    Classement approximatif : l'historique détaillé des commandes n'est pas encore
                    disponible côté serveur pour cette période. Il affiche les totaux globaux.
                  </p>
                )}

                {topClients.length === 0 ? (
                  <p className="clients-loading">Aucun client sur cette période.</p>
                ) : (
                  <div className="clients-top-list">
                    {topClients.map((c, index) => (
                      <div key={c._id} className="clients-top-item">
                        <span className="clients-top-rang">{MEDAILLES[index] || `#${index + 1}`}</span>
                        <div className="clients-card-avatar clients-top-avatar">
                          {c.nom?.charAt(0) || '?'}
                        </div>
                        <div className="clients-top-info">
                          <p className="clients-card-nom">{c.nom}</p>
                          <p className="clients-card-detail">
                            {c.commandesPeriode} commande{c.commandesPeriode > 1 ? 's' : ''}
                          </p>
                        </div>
                        <p className="clients-top-montant">
                          {c.montantPeriode.toLocaleString('fr-FR')} F
                        </p>
                        <div className="clients-card-actions clients-top-actions">
                          {c.telephone && (
                            <a href={`tel:${c.telephone}`} className="clients-action-btn" title="Appeler">
                              <Phone size={15} />
                            </a>
                          )}
                          {formaterNumeroWhatsapp(c.telephone) && (
                            <a
                              href={`https://wa.me/${formaterNumeroWhatsapp(c.telephone)}?text=${messageWhatsapp(c.nom)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="clients-action-btn whatsapp"
                              title="WhatsApp"
                            >
                              <MessageCircle size={15} />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="clients-compteur">
            {clientsFiltres.length} client{clientsFiltres.length > 1 ? 's' : ''} affiché
            {clientsFiltres.length > 1 ? 's' : ''}
          </p>
        </>
      )}

      {chargement ? (
        <p className="clients-loading">Chargement...</p>
      ) : clients.length === 0 ? (
        <p className="clients-loading">
          Aucun client pour l'instant. Vos clients apparaîtront ici après leur première commande.
        </p>
      ) : clientsFiltres.length === 0 ? (
        <p className="clients-loading">Aucun client ne correspond à ce filtre.</p>
      ) : (
        <div className="clients-grid">
          {clientsFiltres.map((c) => {
            const estOuvert = clientOuvertId === c._id;

            return (
              <div key={c._id} className={`clients-card ${estOuvert ? 'ouverte' : ''}`}>
                <button
                  type="button"
                  className="clients-card-header"
                  onClick={() => toggleClient(c._id)}
                  aria-expanded={estOuvert}
                >
                  <div className="clients-card-avatar">{c.nom?.charAt(0) || '?'}</div>
                  <div className="clients-card-info">
                    <p className="clients-card-nom">
                      {c.nom}
                      {estNouveauClient(c.dateCreation) && (
                        <span className="clients-badge-nouveau">Nouveau</span>
                      )}
                    </p>
                    <p className="clients-card-detail">
                      <Phone size={14} /> {c.telephone || 'Non renseigné'}
                    </p>
                    <p className="clients-card-detail">
                      <MapPin size={14} /> {c.adresse || 'Non renseignée'}
                    </p>
                  </div>
                  <span className="clients-card-chevron">
                    {estOuvert ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </button>

                {estOuvert && (
                  <div className="clients-card-footer">
                    <div className="clients-card-stats">
                      <div>
                        <p className="clients-card-stat-value">{c.nombreCommandes}</p>
                        <p className="clients-card-stat-label">Commandes</p>
                      </div>
                      <div>
                        <p className="clients-card-stat-value">
                          {c.totalDepense.toLocaleString('fr-FR')} F
                        </p>
                        <p className="clients-card-stat-label">Total dépensé</p>
                      </div>
                    </div>

                    <div className="clients-card-actions">
                      {c.telephone && (
                        <a href={`tel:${c.telephone}`} className="clients-action-btn" title="Appeler">
                          <Phone size={16} />
                        </a>
                      )}
                      {formaterNumeroWhatsapp(c.telephone) && (
                        <a
                          href={`https://wa.me/${formaterNumeroWhatsapp(c.telephone)}?text=${messageWhatsapp(c.nom)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="clients-action-btn whatsapp"
                          title="WhatsApp"
                        >
                          <MessageCircle size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
    </AccesAbonnementRequis>
  );
}

export default Clients;