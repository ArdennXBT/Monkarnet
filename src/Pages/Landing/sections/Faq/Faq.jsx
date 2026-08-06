
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Reveal from '../../../../components/Reveal/Reveal';
import './Faq.css';

const questions = [
  {
    q: "Est-ce vraiment gratuit ?",
    r: "Oui, toutes les fonctionnalités actuelles sont gratuites, sans limite de temps et sans carte bancaire requise."
  },
  {
    q: "Mes données sont-elles en sécurité ?",
    r: "Vos données vous appartiennent et ne sont partagées avec personne. Nous mettons tout en œuvre pour les protéger."
  },
  {
    q: "Puis-je utiliser Orbiza pour n'importe quel commerce ?",
    r: "Oui, que vous soyez restaurant, boutique, ou tout autre commerce en ligne avec livraison, Monkarnet s'adapte à votre activité."
  },
  {
    q: "Ai-je besoin de compétences techniques pour l'utiliser ?",
    r: "Non, l'interface est pensée pour être simple et intuitive, même si vous n'avez jamais utilisé de logiciel de gestion auparavant."
  },
  {
    q: "Combien de temps prend l'inscription ?",
    r: "Moins de 2 minutes. Il vous suffit de renseigner vos informations et celles de votre commerce pour commencer."
  },
  {
    q: "Puis-je ajouter des employés à mon compte ?",
    r: "Oui, via les sous-comptes, vous pouvez créer des accès pour votre équipe avec des permissions spécifiques."
  },
  {
    q: "Que se passe-t-il si j'ai un litige avec un client ?",
    r: "Chaque commande en litige est clairement identifiée dans votre liste de commandes, pour un suivi et une résolution facile."
  },
  {
    q: "Y aura-t-il des fonctionnalités payantes plus tard ?",
    r: "Le cœur de l'outil restera gratuit. Des fonctionnalités avancées optionnelles pourront être proposées plus tard, sans obligation."
  },
];

function Faq() {
  const [ouverte, setOuverte] = useState(null);

  const toggle = (index) => {
    setOuverte(ouverte === index ? null : index);
  };

  return (
    <section className="landing-faq">
      <Reveal>
        <h2 className="landing-faq-title">Questions fréquentes</h2>
      </Reveal>

      <div className="landing-faq-list">
        {questions.map((item, index) => {
          const estOuverte = ouverte === index;
          return (
            <Reveal key={item.q} delay={(index % 4) * 80} className={`landing-faq-item ${estOuverte ? 'landing-faq-item-active' : ''}`}>
              <button className="landing-faq-question" onClick={() => toggle(index)}>
                {item.q}
                <ChevronDown size={18} className={estOuverte ? 'landing-faq-icon-open' : ''} />
              </button>
              <div className={`landing-faq-reponse-wrapper ${estOuverte ? 'landing-faq-reponse-open' : ''}`}>
                <p className="landing-faq-reponse">{item.r}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

export default Faq;