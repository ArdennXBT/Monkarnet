
import { ClipboardList, Users, TrendingUp, Package, ArrowRight } from 'lucide-react';
import Reveal from '../../../../components/Reveal/Reveal';
import './Features.css';

const features = [
  {
    icon: ClipboardList,
    tag: 'COMMANDES',
    titre: 'Vos commandes, toujours à jour',
    stat: '< 10 sec',
    statLabel: 'pour enregistrer une commande',
    desc: "Enregistrez chaque commande en quelques secondes et changez son statut en un clic. Fini le cahier illisible.",
  },
  {
    icon: Users,
    tag: 'ÉQUIPE',
    titre: 'Votre équipe, sous contrôle',
    stat: 'Illimité',
    statLabel: "nombre d'employés ajoutables",
    desc: "Donnez à chaque employé l'accès qu'il faut, jamais plus. Suivez l'activité de toute votre équipe.",
  },
  {
    icon: TrendingUp,
    tag: 'STATISTIQUES',
    titre: "Votre chiffre d'affaires, en un coup d'œil",
    stat: '0 calcul',
    statLabel: 'à faire vous-même',
    desc: "Jour, semaine, mois, année : toutes vos statistiques mises à jour automatiquement à chaque commande.",
  },
  {
    icon: Package,
    tag: 'PRODUITS',
    titre: 'Vos produits, sans prise de tête',
    stat: 'En 1 clic',
    statLabel: 'pour ajouter un produit',
    desc: "Gérez vos produits, vos prix, et repérez facilement ce qui se vend le mieux avec la marge calculée automatiquement.",
  },
];

function Features() {
  return (
    <section className="ft-section" id="fonctionnalites">
      <div className="ft-intro">
        <h2 className="ft-intro-title">
  <span className="ft-intro-badge">Tout ce qu'il vous faut</span>{' '}
  au même endroit
</h2>
        <p className="ft-intro-subtitle">Fini le cahier, fini les messages perdus dans WhatsApp.</p>
      </div>

      <div className="ft-grid">
        {features.map((f, index) => (
          <Reveal key={f.titre} delay={index * 80} className="ft-card">
            <div className="ft-card-icon">
              <f.icon size={22} />
            </div>
            <p className="ft-card-tag">{f.tag}</p>
            <h3 className="ft-card-title">{f.titre}</h3>
            <p className="ft-card-stat">
              <span className="ft-card-stat-value">{f.stat}</span> {f.statLabel}
            </p>
            <p className="ft-card-desc">{f.desc}</p>
            <a href="#" className="ft-card-link">Explorer <ArrowRight size={15} /></a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default Features;