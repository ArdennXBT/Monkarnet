import './LegalPage.css';

function Confidentialite() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Politique de confidentialité</h1>
        <p className="legal-updated">Dernière mise à jour : 22/08/2026</p>

        <h2>1. Qui sommes-nous</h2>
        <p>
          Orbizo est édité par ARDENN TRADE X, immatriculée au Registre du
          Commerce et du Crédit Mobilier (RCCM) sous le numéro RB/ABC/25 A 120345, dont le
          siège est situé à Calavi, Bénin.
        </p>
        <p>
          Pour toute question relative à cette politique de confidentialité ou à vos
          données personnelles, vous pouvez nous contacter à :{' '}
          <a href="mailto:0xardenn@gmail.com">0xardenn@gmail.com</a>
        </p>

        <h2>2. Quelles données nous collectons</h2>
        <p>Lorsque vous utilisez Orbizo, nous collectons :</p>
        <ul>
          <li><strong>À l'inscription :</strong> votre nom, prénom et adresse email</li>
          <li>
            <strong>Dans le cadre de l'utilisation du service :</strong> les données
            que vous saisissez vous-même pour gérer votre commerce (produits, stock,
            commandes, informations sur vos propres clients, sous-comptes que vous
            créez pour votre équipe)
          </li>
          <li>
            <strong>Concernant les paiements d'abonnement :</strong> nous recevons
            uniquement le statut de la transaction (réussie ou échouée) transmis par
            notre prestataire de paiement, SebPay. Nous n'avons accès à aucune
            information bancaire ou de mobile money vous concernant — ces données
            sont traitées exclusivement par SebPay.
          </li>
        </ul>
        <p>
          Nous n'utilisons aucun outil de suivi publicitaire ou statistique tiers
          (type Google Analytics, Facebook Pixel). Seul un cookie de session,
          strictement nécessaire pour vous garder connecté, est utilisé.
        </p>

        <h2>3. Pourquoi nous collectons ces données</h2>
        <p>Ces données sont collectées uniquement pour :</p>
        <ul>
          <li>Créer et gérer votre compte</li>
          <li>Vous permettre d'utiliser les fonctionnalités d'Orbizo (gestion de commandes, produits, clients, sous-comptes)</li>
          <li>Gérer votre abonnement et son renouvellement</li>
          <li>Vous répondre en cas de question ou de demande de support</li>
        </ul>

        <h2>4. Qui a accès à vos données</h2>
        <p>
          Vos données ne sont ni vendues ni partagées avec des tiers à des fins
          commerciales. Elles sont accessibles uniquement par :
        </p>
        <ul>
          <li>Vous-même et les sous-comptes que vous autorisez</li>
          <li>L'équipe d'Orbizo, dans le cadre strictement nécessaire au fonctionnement et au support du service</li>
          <li>
            Nos prestataires techniques d'hébergement cloud, qui stockent les
            données de manière sécurisée dans le cadre de l'exploitation du
            service. Ce recours à des prestataires peut impliquer un hébergement
            des données en dehors du territoire béninois.
          </li>
        </ul>

        <h2>5. Durée de conservation</h2>
        <ul>
          <li>Si vous supprimez votre compte, vos données sont effacées dans un délai de <strong>30 jours</strong>.</li>
          <li>
            Si votre abonnement prend fin sans que vous supprimiez votre compte,
            vos données sont conservées pendant une durée raisonnable afin de vous
            permettre de reprendre votre activité, avant suppression si le compte
            reste inactif de manière prolongée.
          </li>
        </ul>

        <h2>6. Vos droits</h2>
        <p>
          Conformément au Code du numérique en République du Bénin (loi n° 2017-20)
          et à la réglementation applicable, vous disposez d'un droit d'accès, de
          rectification, de modification et de suppression de vos données
          personnelles.
        </p>
        <p>
          Pour exercer ces droits, contactez-nous à{' '}
          <a href="mailto:0xardenn@gmail.com">0xardenn@gmail.com</a>. Nous nous
          engageons à répondre dans un délai raisonnable.
        </p>

        <h2>7. Sécurité</h2>
        <p>
          Nous mettons en œuvre des mesures techniques raisonnables pour protéger
          vos données contre l'accès non autorisé, la perte ou l'altération.
        </p>

        <h2>8. Modification de cette politique</h2>
        <p>
          Cette politique peut être mise à jour pour refléter des évolutions du
          service ou de la réglementation. La date de dernière mise à jour est
          indiquée en haut de cette page. En cas de changement important, vous en
          serez informé.
        </p>
      </div>
    </div>
  );
}

export default Confidentialite;