import Reveal from '../../../../components/Reveal/Reveal';
import './Pricing.css';
import { CheckCircle2 } from "lucide-react";

const plans = [
  {
    name: "Mensuel",
    text: "Facturé chaque mois. Idéal pour tester Orbizo à votre rythme.",
    price: "4 200",
    period: "/ mois",
    oldPrice: null,
    note: null,
    button: "Commencer l'essai gratuit",
    highlighted: false,
    points: [
      "Essai gratuit de 14 jours inclus",
      "Dashboard, commandes, produits et clients",
      "Jusqu'à 5 sous-comptes",
      "Résiliation possible à tout moment",
    ],
  },
  {
    name: "Annuel",
    text: "Payez une fois par an et oubliez la facturation mensuelle.",
    price: "30 240",
    period: "/ an",
    oldPrice: "50 400 F",
    note: "soit 40% d'économie",
    button: "Choisir l'abonnement annuel",
    highlighted: true,
    badge: "- 40%",
    points: [
      "Essai gratuit de 14 jours inclus",
      "Dashboard, commandes, produits et clients",
      "Jusqu'à 5 sous-comptes",
      "20 160 F d'économie sur l'année",
    ],
  },
];

export default function Pricing() {
  return (
    <section id="tarifs" className="pricing-section">
      <div className="pricing-container">
        <Reveal>
          <span className="pricing-badge">
            <span className="pricing-badge-dot" />
            Tarifs
          </span>
        </Reveal>

        <Reveal delay={100}>
          <h3 className="pricing-title">
            Essayez 14 jours.
            <br />
            <span>Décidez ensuite en toute confiance.</span>
          </h3>
        </Reveal>

        <Reveal delay={200}>
          <p className="pricing-subtitle">
            Accès complet à Orbizo dès l'inscription, sans carte bancaire. À la
            fin de l'essai, choisissez la formule qui vous convient.
          </p>
        </Reveal>

        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <Reveal delay={300 + index * 100} key={plan.name}>
              <div
                className={`pricing-card ${
                  plan.highlighted ? "pricing-card-highlighted" : ""
                }`}
              >
                {plan.badge && (
                  <span className="pricing-discount-badge">{plan.badge}</span>
                )}

                <h4 className="pricing-plan-name">{plan.name}</h4>
                <p className="pricing-plan-text">{plan.text}</p>

                <div className="pricing-price-row">
                  <span className="pricing-price">{plan.price} F</span>
                  <span className="pricing-period">{plan.period}</span>
                </div>

                {plan.oldPrice && (
                  <p className="pricing-old-price">
                    au lieu de <s>{plan.oldPrice}</s> — {plan.note}
                  </p>
                )}

                <button
                  className={`pricing-button ${
                    plan.highlighted
                      ? "pricing-button-filled"
                      : "pricing-button-outline"
                  }`}
                >
                  {plan.button}
                </button>

                <ul className="pricing-points">
                  {plan.points.map((point, i) => (
                    <li className="pricing-point" key={i}>
                      <CheckCircle2
                        className="pricing-point-icon"
                        size={18}
                        strokeWidth={2}
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={500}>
          <p className="pricing-footer">Sans carte bancaire pour l'essai</p>
        </Reveal>
      </div>
    </section>
  );
}