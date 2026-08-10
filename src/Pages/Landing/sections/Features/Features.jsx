import Reveal from '../../../../components/Reveal/Reveal';
import './Features.css';
import { CheckCircle2 } from "lucide-react";

const features = [
  {
    number: "01",
    tag: "Tableau de bord",
    title: "Votre activité, comprise en un coup d'œil.",
    text: "Le chiffre d'affaires du jour, le nombre de commandes et votre produit qui se vend le mieux, réunis sur un seul écran, actualisés en continu.",
    points: [
      "Vue Jour, Semaine, Mois ou Année en un clic",
      "Graphique d'évolution des ventes heure par heure",
      "Produit star du mois mis en avant automatiquement",
    ],
  },
  {
    number: "02",
    tag: "Commandes",
    title: "Chaque commande, à sa place.",
    text: "Créez, suivez et retrouvez chaque commande sans fouiller dans un carnet. Un statut clair, à chaque étape.",
    points: [
      "Nouvelle commande en un clic",
      "Recherche par nom ou téléphone du client",
      "Filtrage par statut : en attente, en cours, livrée",
    ],
  },
  {
    number: "03",
    tag: "Produits",
    title: "Votre catalogue sait ce qui vous rapporte.",
    text: "Prix de vente, prix d'achat, stock et marge : tout est calculé automatiquement pour chaque article, en montant et en pourcentage.",
    points: [
      "Marge calculée en temps réel pour chaque produit",
      "Suivi du stock disponible",
      "Organisation par catégories",
    ],
  },
  {
    number: "04",
    tag: "Clients",
    title: "Chaque client, avec son historique.",
    text: "Fini les numéros griffonnés sur un bout de papier. Vos clients sont enregistrés, classés et prêts à être recontactés.",
    points: [
      "Recherche par nom ou numéro de téléphone",
      "Classement automatique des meilleurs clients",
      "Filtres par période d'achat",
    ],
  },
  {
    number: "05",
    tag: "Sous-comptes",
    title: "Votre équipe, avec les bons accès.",
    text: "Invitez votre comptable ou vos vendeurs, attribuez-leur un rôle, et gardez le contrôle total sur qui voit quoi.",
    points: [
      "Jusqu'à 5 sous-comptes par commerce",
      "Rôles personnalisés (vendeur, comptable...)",
      "Modification ou suppression d'un accès à tout moment",
    ],
  },
];

export default function Features() {
  return (
    <section id="fonctionnalites" className="features-section">
      <div className="features-container">
        <Reveal>
          <span className="features-badge">
            <span className="features-badge-dot" />
            Fonctionnalités
          </span>
        </Reveal>

        <Reveal delay={100}>
          <h3 className="features-title">
            Une page pour chaque partie de votre activité.
          </h3>
        </Reveal>

        <Reveal delay={200}>
          <p className="features-subtitle">
            Rien de superflu. Chaque page fait le travail que vous faites dans
            votre cahier en plus rapide.
          </p>
        </Reveal>

        <div className="features-list">
          {features.map((feature, index) => (
            <Reveal delay={100 * index} key={feature.number}>
              <div className="feature-block">
                <span className="feature-mini-badge">
                  {feature.number} — {feature.tag}
                </span>

                <h4 className="feature-block-title">{feature.title}</h4>

                <p className="feature-block-text">{feature.text}</p>

                <ul className="feature-points">
                  {feature.points.map((point, i) => (
                    <li className="feature-point" key={i}>
                      <CheckCircle2 className="feature-point-icon" size={18} strokeWidth={2} />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}