
import { Plus, Pencil } from 'lucide-react';
import './SousComptes.css';

const sousComptesData = [
  { nom: 'Marius (Livreur)', dateCreation: '15/06/2026', permissions: ['Commandes', 'Livraisons'] },
  { nom: 'Chantal (Caisse)', dateCreation: '02/07/2026', permissions: ['Commandes', 'Produits'] },
];

function SousComptes() {
  return (
    <div className="souscomptes">
      <div className="souscomptes-header">
        <div>
          <h1 className="souscomptes-title">Sous-comptes</h1>
          <p className="souscomptes-subtitle">Gérez les accès de votre équipe.</p>
        </div>
        <button className="souscomptes-add-btn">
          <Plus size={18} />
          Ajouter un sous-compte
        </button>
      </div>

      <div className="souscomptes-list">
        {sousComptesData.map((s) => (
          <div key={s.nom} className="souscomptes-card">
            <div className="souscomptes-card-info">
              <p className="souscomptes-card-nom">{s.nom}</p>
              <p className="souscomptes-card-date">Créé le {s.dateCreation}</p>
            </div>
            <div className="souscomptes-card-permissions">
              {s.permissions.map((perm) => (
                <span key={perm} className="souscomptes-badge">{perm}</span>
              ))}
            </div>
            <button className="souscomptes-edit-btn">
              <Pencil size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SousComptes;