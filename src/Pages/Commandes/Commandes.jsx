
import { useState } from 'react';

import './Commandes.css';

const commandesData = [
  { numero: 'CMD-001', client: 'Awa Dossou', montant: '12 500 F', mode: 'Livraison', statut: 'Livrée', date: '28/07/2026' },
  { numero: 'CMD-002', client: 'Koffi Aza', montant: '8 000 F', mode: 'Retrait', statut: 'En cours', date: '28/07/2026' },
  { numero: 'CMD-003', client: 'Fatou Bio', montant: '21 300 F', mode: 'Livraison', statut: 'En litige', date: '27/07/2026' },
  { numero: 'CMD-004', client: 'Léa Sossou', montant: '5 500 F', mode: 'Livraison', statut: 'En attente', date: '27/07/2026' },
];

const filtres = ['Toutes', 'En attente', 'En cours', 'Livrée', 'En litige'];

function statutClass(statut) {
  if (statut === 'Livrée') return 'commandes-badge-green';
  if (statut === 'En cours') return 'commandes-badge-blue';
  if (statut === 'En litige') return 'commandes-badge-red';
  return 'commandes-badge-gray';
}

function Commandes() {
  const [filtreActif, setFiltreActif] = useState('Toutes');

  const commandesFiltrees = filtreActif === 'Toutes'
    ? commandesData
    : commandesData.filter((c) => c.statut === filtreActif);

  return (
    <div className="commandes">
      <h1 className="commandes-title">Commandes</h1>
      <p className="commandes-subtitle">Suivez et gérez toutes vos commandes.</p>

      <div className="commandes-filtres">
        {filtres.map((f) => (
          <button
            key={f}
            className={`commandes-filtre-btn ${filtreActif === f ? 'commandes-filtre-actif' : ''}`}
            onClick={() => setFiltreActif(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <table className="commandes-table">
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Client</th>
            <th>Montant</th>
            <th>Mode</th>
            <th>Statut</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {commandesFiltrees.map((c) => (
            <tr key={c.numero}>
              <td>{c.numero}</td>
              <td>{c.client}</td>
              <td>{c.montant}</td>
              <td>{c.mode}</td>
              <td><span className={`commandes-badge ${statutClass(c.statut)}`}>{c.statut}</span></td>
              <td>{c.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Commandes;