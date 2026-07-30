
import { Check } from 'lucide-react';
import Reveal from '../../../../components/Reveal/Reveal';
import imgCommandes from '../../../../assets/feature-commandes.svg';
import imgEquipe from '../../../../assets/feature-equipe.svg';
import imgStats from '../../../../assets/feature-stats.svg';
import imgProduits from '../../../../assets/feature-produits.svg';
import './Features.css';

const features = [
  {
    image: imgCommandes,
    alt: 'Aperçu de la gestion des commandes',
    illustration: 'green',
    titre: 'Vos commandes, toujours à jour',
    intro: 'Enregistrez chaque commande en quelques secondes et changez son statut en un clic.',
    detail: "Fini le cahier où on raye une ligne à moitié lisible : chaque commande est horodatée, reliée à un client, et son statut (en attente, en cours, livrée, en litige) est visible d'un coup d'œil par toute votre équipe.",
    points: [
      'Statut mis à jour en un clic',
      'Historique complet de chaque client',
      'Retrouvez une commande en quelques secondes',
    ],
    stat: { valeur: '< 10 sec', label: 'pour enregistrer une commande' },
  },
  {
    image: imgEquipe,
    alt: 'Aperçu de la gestion des sous-comptes',
    illustration: 'blue',
    titre: 'Votre équipe, sous contrôle',
    intro: "Donnez à chaque employé l'accès qu'il faut — jamais plus, jamais moins.",
    detail: "Livreur, caissier, gérant : chacun a son propre accès, avec uniquement les droits que vous lui donnez. Vous gardez la main sur qui peut voir vos statistiques, enregistrer une commande, ou juste marquer une livraison comme faite.",
    points: [
      'Droits activables un par un',
      "Suivi de l'activité de chaque employé",
      'Aucun partage de votre mot de passe principal',
    ],
    stat: { valeur: 'Illimité', label: "nombre d'employés que vous pouvez ajouter" },
  },
  {
    image: imgStats,
    alt: 'Aperçu du tableau de bord des statistiques',
    illustration: 'green',
    titre: "Votre chiffre d'affaires, en un coup d'œil",
    intro: 'Jour, semaine, mois, année — toutes vos statistiques sans avoir à faire de calculs.',
    detail: "Plus besoin d'additionner vos ventes à la main en fin de journée. Chaque commande vient nourrir automatiquement votre tableau de bord, avec vos plats les plus vendus mis en avant pour savoir sur quoi vous concentrer.",
    points: [
      'Calculé automatiquement à chaque commande',
      'Filtres par jour, semaine, mois ou année',
      'Vos plats les plus vendus mis en avant',
    ],
    stat: { valeur: '0 calcul', label: 'à faire vous-même' },
  },
  {
    image: imgProduits,
    alt: 'Aperçu de la gestion des produits',
    illustration: 'blue',
    titre: 'Vos produits, sans prise de tête',
    intro: 'Gérez vos produits, vos prix et repérez facilement ce qui se vend le mieux.',
    detail: "Ajoutez un plat ou un article une seule fois, avec son prix et son coût — la marge se calcule toute seule. Vous savez exactement ce qui vous rapporte le plus, sans sortir une calculatrice.",
    points: [
      'Ajout en un clic',
      'Marge calculée automatiquement',
      'Produits les plus vendus mis en évidence',
    ],
    stat: { valeur: 'En 1 clic', label: 'pour ajouter un produit' },
  },
];

function Features() {
  return (
    <section className="ft-section" id="fonctionnalites">
      <div className="ft-intro">
        <h2 className="ft-intro-title">Tout ce qu'il vous faut, au même endroit</h2>
        <p className="ft-intro-subtitle">Fini le cahier, fini les messages perdus dans WhatsApp.</p>
      </div>

      {features.map((f, index) => (
        <Reveal
          key={f.titre}
          delay={index * 80}
          className={`ft-row ${index % 2 === 1 ? 'ft-row-reverse' : ''}`}
        >
          <div className="ft-visual">
            <div className={`ft-illustration ft-illustration-${f.illustration}`}>
              <img src={f.image} alt={f.alt} className="ft-image" />
            </div>
          </div>
          <div className="ft-text">
            <h3>{f.titre}</h3>
            <p className="ft-text-intro">{f.intro}</p>
            <p className="ft-text-detail">{f.detail}</p>
            <ul>
              {f.points.map((p) => (
                <li key={p}><Check size={16} /> {p}</li>
              ))}
            </ul>
            <div className="ft-stat">
              <span className="ft-stat-value">{f.stat.valeur}</span>
              <span className="ft-stat-label">{f.stat.label}</span>
            </div>
          </div>
        </Reveal>
      ))}
    </section>
  );
}

export default Features;