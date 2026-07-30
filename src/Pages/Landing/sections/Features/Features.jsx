
import { Check } from 'lucide-react';
import Reveal from '../../../../components/Reveal/Reveal';
import imgCommandes from '../../../../assets/feature-commandes.svg';
import imgEquipe from '../../../../assets/feature-equipe.svg';
import imgStats from '../../../../assets/feature-stats.svg';
import imgProduits from '../../../../assets/feature-produits.svg';
import './Features.css';

function Features() {
  return (
    <section className="landing-features" id="fonctionnalites">
      <div className="landing-features-intro">
        <h2 className="landing-features-title">Tout ce qu'il vous faut, au même endroit</h2>
        <p className="landing-features-subtitle">Fini le cahier, fini les messages perdus dans WhatsApp.</p>
      </div>

      {/* Feature 1 */}
      <Reveal className="feature-row">
        <div className="feature-visual">
          <div className="illustration illustration-green">
            <div className="illustration-ring illustration-ring-2"></div>
            <div className="illustration-ring illustration-ring-1"></div>
            <div className="illustration-blob illustration-blob-green"></div>
            <img src={imgCommandes} alt="Aperçu de la gestion des commandes" className="feature-image" />
          </div>
        </div>
        <div className="feature-text">
          <h3>Vos commandes, toujours à jour</h3>
          <p>Enregistrez chaque commande en quelques secondes et changez son statut en un clic.</p>
          <ul>
            <li><Check size={16} /> Statut mis à jour en un clic</li>
            <li><Check size={16} /> Historique de chaque client</li>
          </ul>
        </div>
      </Reveal>

      {/* Feature 2 */}
      <Reveal className="feature-row feature-row-reverse">
        <div className="feature-visual">
          <div className="illustration illustration-blue">
            <div className="illustration-ring illustration-ring-2"></div>
            <div className="illustration-ring illustration-ring-1"></div>
            <div className="illustration-blob"></div>
            <img src={imgEquipe} alt="Aperçu de la gestion des sous-comptes" className="feature-image" />
          </div>
        </div>
        <div className="feature-text">
          <h3>Votre équipe, sous contrôle</h3>
          <p>Donnez à chaque employé l'accès qu'il faut — jamais plus, jamais moins.</p>
          <ul>
            <li><Check size={16} /> Droits activables un par un</li>
            <li><Check size={16} /> Suivi de l'activité de chacun</li>
          </ul>
        </div>
      </Reveal>

      {/* Feature 3 */}
      <Reveal className="feature-row">
        <div className="feature-visual">
          <div className="illustration illustration-green">
            <div className="illustration-blob illustration-blob-green"></div>
            <img src={imgStats} alt="Aperçu du tableau de bord des statistiques" className="feature-image" />
          </div>
        </div>
        <div className="feature-text">
          <h3>Votre chiffre d'affaires, en un coup d'œil</h3>
          <p>Jour, semaine, mois, année — toutes vos statistiques sans avoir à faire de calculs.</p>
          <ul>
            <li><Check size={16} /> Calculé automatiquement</li>
            <li><Check size={16} /> Jour, semaine, mois ou année</li>
          </ul>
        </div>
      </Reveal>

      {/* Feature 4 */}
      <Reveal className="feature-row feature-row-reverse">
        <div className="feature-visual">
          <div className="illustration illustration-blue">
            <div className="illustration-dot illustration-dot-1"></div>
            <div className="illustration-dot illustration-dot-2"></div>
            <div className="illustration-blob"></div>
            <img src={imgProduits} alt="Aperçu de la gestion des produits" className="feature-image" />
          </div>
        </div>
        <div className="feature-text">
          <h3>Vos produits, sans prise de tête</h3>
          <p>Gérez vos produits, vos prix et repérez facilement ce qui se vend le mieux.</p>
          <ul>
            <li><Check size={16} /> Ajout en un clic</li>
            <li><Check size={16} /> Vos plats les plus vendus, en un clin d'œil</li>
          </ul>
        </div>
      </Reveal>
    </section>
  );
}

export default Features;