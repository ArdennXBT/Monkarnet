
import { Plus } from 'lucide-react';
import './Produits.css';

const produitsData = [
  { nom: 'T-shirt col rond', prix: '5 000 F', cout: '2 000 F' },
  { nom: 'Sac à main', prix: '12 000 F', cout: '5 500 F' },
  { nom: 'Chaussures sport', prix: '18 000 F', cout: '9 000 F' },
  { nom: 'Casquette', prix: '3 500 F', cout: '1 200 F' },
];

function Produits() {
  return (
    <div className="produits">
      <div className="produits-header">
        <div>
          <h1 className="produits-title">Produits</h1>
          <p className="produits-subtitle">Gérez votre catalogue de produits.</p>
        </div>
        <button className="produits-add-btn">
          <Plus size={18} />
          Ajouter un produit
        </button>
      </div>

      <div className="produits-grid">
        {produitsData.map((p) => {
          const marge = parseInt(p.prix.replace(/\D/g, '')) - parseInt(p.cout.replace(/\D/g, ''));
          return (
            <div key={p.nom} className="produits-card">
              <p className="produits-card-nom">{p.nom}</p>
              <div className="produits-card-row">
                <span>Prix de vente</span>
                <strong>{p.prix}</strong>
              </div>
              <div className="produits-card-row">
                <span>Coût de préparation</span>
                <strong>{p.cout}</strong>
              </div>
              <div className="produits-card-marge">
                Marge : {marge.toLocaleString('fr-FR')} F
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Produits;