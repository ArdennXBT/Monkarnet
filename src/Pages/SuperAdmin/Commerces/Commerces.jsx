
import './Commerces.css';

const commercesData = [
  { nom: 'Chez Rosine', type: 'Restaurant', ville: 'Cotonou', dateInscription: '12/03/2026', statut: 'Actif' },
  { nom: 'Boutique Aza', type: 'Prêt-à-porter', ville: 'Porto-Novo', dateInscription: '28/04/2026', statut: 'Actif' },
  { nom: 'Fatou Shop', type: 'Cosmétique', ville: 'Cotonou', dateInscription: '05/07/2026', statut: 'Actif' },
  { nom: 'Léa Pâtisserie', type: 'Restaurant', ville: 'Abomey-Calavi', dateInscription: '19/07/2026', statut: 'Suspendu' },
];

function Commerces() {
  return (
    <div className="commerces">
      <h1 className="commerces-title">Commerces</h1>
      <p className="commerces-subtitle">Tous les commerces inscrits sur la plateforme.</p>

      <table className="commerces-table">
        <thead>
          <tr>
            <th>Commerce</th>
            <th>Type</th>
            <th>Ville</th>
            <th>Inscrit le</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {commercesData.map((c) => (
            <tr key={c.nom}>
              <td>{c.nom}</td>
              <td>{c.type}</td>
              <td>{c.ville}</td>
              <td>{c.dateInscription}</td>
              <td>
                <span className={`commerces-badge ${c.statut === 'Actif' ? 'commerces-badge-green' : 'commerces-badge-red'}`}>
                  {c.statut}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Commerces;