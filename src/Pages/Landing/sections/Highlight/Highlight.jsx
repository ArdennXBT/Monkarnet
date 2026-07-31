
import { Zap, Users, Infinity as InfinityIcon, BookX } from 'lucide-react';
import Reveal from '../../../../components/Reveal/Reveal';
import './Highlight.css';

const stats = [
  { icon: Zap, valeur: 'En temps réel', label: 'Votre CA mis à jour à chaque commande' },
  { icon: Users, valeur: 'Multi-employés', label: 'Créez des accès pour toute votre équipe' },
  { icon: InfinityIcon, valeur: 'Sans limite', label: 'Enregistrez autant de commandes que vous voulez' },
  { icon: BookX, valeur: 'Fini les cahiers', label: "Passez au digital, l'air professionnel dès le premier jour" },
];

function Highlight() {
  return (
    <section className="landing-highlight">
      <Reveal>
        <h2 className="landing-highlight-title">
            L'outil pensé pour les commerçants qui se retrouvent perdus après avoir noté toutes leurs ventes dans un cahier.
        </h2>
      </Reveal>

      <div className="landing-highlight-grid">
        {stats.map((s, index) => (
          <Reveal key={s.valeur} delay={index * 100} className="landing-highlight-card">
            <div className="landing-highlight-icon">
              <s.icon size={20} />
            </div>
            <div>
              <p className="landing-highlight-value">{s.valeur}</p>
              <p className="landing-highlight-label">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default Highlight;