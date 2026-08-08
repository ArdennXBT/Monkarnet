import Reveal from '../../../../components/Reveal/Reveal';
import './Highlight.css';
import { Zap, TrendingUp, UserCheck, ShieldCheck } from "lucide-react";

const highlights = [
  {
    icon: Zap,
    title: "Zéro calcul",
    text: "Chiffre d'affaires, commandes, meilleur produit du mois — Orbizo met tout à jour pour vous, en temps réel.",
  },
  {
    icon: TrendingUp,
    title: "Marges automatiques",
    text: "Chaque produit affiche sa marge en francs et en pourcentage. Plus jamais de calculette ni d'erreur.",
  },
  {
    icon: UserCheck,
    title: "Fini les clients anonymes",
    text: "Chaque vente construit le profil de votre client. Retrouvez qui a acheté quoi, en une recherche.",
  },
  {
    icon: ShieldCheck,
    title: "Une équipe, sous contrôle",
    text: "Ajoutez votre équipe sans perdre le contrôle. Chacun a un rôle, un accès, des limites que vous fixez.",
  },
];

export default function Highlight() {
  return (
    <section id="avantages" className="highlight-section">
      <div className="highlight-container">
        <Reveal>
          <span className="highlight-badge">
            <span className="highlight-badge-dot" />
            Bienvenue sur Orbizo
          </span>
        </Reveal>

        <Reveal delay={100}>
          <h3 className="highlight-title">
            Fini le cahier.
            <br />
            <span>Votre commerce mérite mieux.</span>
          </h3>
        </Reveal>

        <Reveal delay={200}>
          <p className="highlight-subtitle">
            Voici ce qui change concrètement, dès le premier jour avec Orbizo.
          </p>
        </Reveal>

        <div className="highlight-grid">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal delay={300 + index * 100} key={index}>
                <div className="highlight-card">
                  <div className="highlight-icon-wrapper">
                    <Icon className="highlight-icon" size={20} strokeWidth={2} />
                  </div>
                  <h4 className="highlight-card-title">{item.title}</h4>
                  <p className="highlight-card-text">{item.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}