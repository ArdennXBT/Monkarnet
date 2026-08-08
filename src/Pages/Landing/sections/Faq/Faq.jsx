import { useState } from "react";
import "./Faq.css";
import { Plus } from "lucide-react";

const faqs = [
  {
    question: "Est-ce que je peux utiliser Orbizo depuis mon téléphone ?",
    answer:
      "Oui. Orbizo fonctionne directement dans votre navigateur mobile, sans installation. Vous pouvez gérer votre commerce depuis votre téléphone, où que vous soyez.",
  },
  {
    question: "Combien de temps faut-il pour commencer ?",
    answer:
      "Quelques minutes suffisent. Créez votre compte, ajoutez vos premiers produits, et votre tableau de bord commence à se remplir dès votre première vente.",
  },
  {
    question: "Puis-je ajouter mes vendeurs ou ma comptable ?",
    answer:
      "Oui, avec les sous-comptes. Vous invitez votre équipe, vous attribuez un rôle à chacun, et vous décidez qui a accès à quoi.",
  },
  {
    question: "Mes données sont-elles en sécurité ?",
    answer:
      "Vos ventes, vos produits et vos clients sont sauvegardés automatiquement en ligne. Contrairement à un cahier, rien ne se perd, ne se mouille ou ne s'égare.",
  },
  {
    question: "Ça fonctionne même si j'ai beaucoup de produits ?",
    answer:
      "Oui. Que vous ayez 10 ou 1000 produits, la recherche, les catégories et le calcul des marges restent instantanés.",
  },
  {
    question: "Comment puis-je payer mon abonnement ?",
    answer:
      "Depuis votre page Profil, vous pouvez vous abonner et payer par Mobile Money ou par carte bancaire, en toute sécurité, en quelques clics.",
  },
  {
    question: "Puis-je essayer avant de m'engager ?",
    answer:
      "Bien sûr. Créez votre compte gratuitement et testez Orbizo avec vos vrais produits et vos vraies commandes, sans engagement.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="faq-section">
      <div className="faq-container">
        <span className="faq-badge">
          <span className="faq-badge-dot" />
          Questions fréquentes
        </span>

        <h3 className="faq-title">
          Tout ce que vous vous demandez
          <br />
          <span>avant de commencer.</span>
        </h3>

        <div className="faq-list">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div className="faq-item" key={index}>
                <button
                  className="faq-question"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <span className={`faq-icon-wrapper ${isOpen ? "faq-icon-wrapper-open" : ""}`}>
                    <Plus className="faq-icon" size={18} strokeWidth={2.5} />
                  </span>
                </button>

                {isOpen && (
                  <div className="faq-answer-box">
                    <p className="faq-answer">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}