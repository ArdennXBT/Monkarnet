
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Reveal from '../../../../components/Reveal/Reveal';
import './FinalCta.css';

function FinalCta() {
  return (
    <section className="landing-finalcta-wrapper">
      <Reveal className="landing-finalcta">
        <h2>Prêt à commencer</h2>
        <p>Inscrivez-vous en quelques clics et commencez à gérer votre commerce d'une façon différente.</p>
        <Link to="/inscription" className="landing-finalcta-btn">
          Inscrivez-vous gratuitement
          <ArrowRight size={18} />
        </Link>
        <p className="landing-finalcta-sub">Rejoignez les commerçants qui nous font confiance</p>
      </Reveal>
    </section>
  );
}

export default FinalCta;