
import { UserPlus, Package, TrendingUp } from 'lucide-react';
import Reveal from '../../../../components/Reveal/Reveal';
import './Steps.css';

const steps = [
  { icon: UserPlus, titre: 'Créez votre compte', texte: 'Inscrivez votre commerce en moins de 2 minutes, gratuitement.' },
  { icon: Package, titre: 'Ajoutez vos produits', texte: 'Renseignez votre catalogue et vos prix, une seule fois.' },
  { icon: TrendingUp, titre: 'Suivez votre activité', texte: 'Enregistrez vos commandes et regardez vos statistiques évoluer.' },
];

function Steps() {
  return (
    <section className="landing-steps-wrapper">
      <Reveal>
        <h2 className="landing-steps-title">Trois étapes, c'est tout</h2>
      </Reveal>

      <div className="landing-steps-grid">
        {steps.map((s, index) => (
          <Reveal key={s.titre} delay={index * 120} className="landing-step">
            <div className="landing-step-icon">
              <s.icon size={20} />
            </div>
            <div className="landing-step-text">
              <h3>{s.titre}</h3>
              <p>{s.texte}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default Steps;