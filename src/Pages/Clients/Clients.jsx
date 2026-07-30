
import { Phone, MapPin } from 'lucide-react';
import './Clients.css';

const clientsData = [
  { nom: 'Awa Dossou', telephone: '+229 97 00 11 22', adresse: 'Cotonou, Fidjrossè', commandes: 12, total: '145 000 F' },
  { nom: 'Koffi Aza', telephone: '+229 96 22 33 44', adresse: 'Cotonou, Akpakpa', commandes: 5, total: '38 000 F' },
  { nom: 'Fatou Bio', telephone: '+229 95 33 44 55', adresse: 'Cotonou, Cadjehoun', commandes: 8, total: '92 500 F' },
  { nom: 'Léa Sossou', telephone: '+229 94 44 55 66', adresse: 'Abomey-Calavi', commandes: 2, total: '11 000 F' },
];

function Clients() {
  return (
    <div className="clients">
      <h1 className="clients-title">Clients</h1>
      <p className="clients-subtitle">Retrouvez vos clients et leur historique.</p>

      <div className="clients-grid">
        {clientsData.map((c) => (
          <div key={c.nom} className="clients-card">
            <div className="clients-card-avatar">{c.nom.charAt(0)}</div>
            <div className="clients-card-info">
              <p className="clients-card-nom">{c.nom}</p>
              <p className="clients-card-detail"><Phone size={14} /> {c.telephone}</p>
              <p className="clients-card-detail"><MapPin size={14} /> {c.adresse}</p>
            </div>
            <div className="clients-card-stats">
              <div>
                <p className="clients-card-stat-value">{c.commandes}</p>
                <p className="clients-card-stat-label">Commandes</p>
              </div>
              <div>
                <p className="clients-card-stat-value">{c.total}</p>
                <p className="clients-card-stat-label">Total dépensé</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Clients;