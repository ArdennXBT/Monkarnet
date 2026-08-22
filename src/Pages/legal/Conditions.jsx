import './LegalPage.css';

function Conditions() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Conditions générales d'utilisation</h1>
        <p className="legal-updated">Dernière mise à jour : 22/08/2026</p>

        <h2>1. Objet</h2>
        <p>
          Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès
          et l'utilisation d'Orbizo, une application permettant aux commerçants de
          suivre et gérer leur activité commerciale : commandes, produits, stock et
          clients.
        </p>
        <p>
          <strong>
            Orbizo ne permet pas de recevoir, transférer ou stocker de l'argent au
            sein de l'application.
          </strong>{' '}
          Seuls les paiements liés à votre abonnement Orbizo transitent, via notre
          prestataire SebPay.
        </p>
        <p>
          Orbizo est édité par ARDENN TRADE X, RCCM n° RB/ABC/25 A 120345,
          Calavi, Bénin.
        </p>

        <h2>2. Accès au service</h2>
        <p>
          L'utilisation d'Orbizo nécessite la création d'un compte, en fournissant
          un nom, un prénom et une adresse email valides. Vous êtes responsable de
          l'exactitude des informations fournies ainsi que de la confidentialité de
          vos identifiants de connexion.
        </p>

        <h2>3. Essai gratuit et abonnement</h2>
        <ul>
          <li>Chaque nouveau compte bénéficie d'un <strong>essai gratuit de 14 jours</strong>, donnant accès à l'ensemble des fonctionnalités.</li>
          <li>À l'issue de cette période, l'accès à l'application est suspendu, sauf souscription à un <strong>abonnement mensuel ou annuel</strong>.</li>
          <li>
            Le paiement de l'abonnement s'effectue via mobile money, par
            l'intermédiaire de notre prestataire SebPay.{' '}
            <strong>Le renouvellement n'est pas automatique</strong> : vous devez
            effectuer le paiement manuellement à chaque échéance.
          </li>
          <li>
            <strong>Tout abonnement payé est non remboursable</strong>, y compris en
            cas d'interruption anticipée de l'utilisation du service par
            l'utilisateur.
          </li>
        </ul>

        <h2>4. Utilisation autorisée</h2>
        <p>
          Vous vous engagez à utiliser Orbizo conformément à son objet — la gestion
          de votre activité commerciale — et à ne pas :
        </p>
        <ul>
          <li>Utiliser le service à des fins illégales</li>
          <li>Tenter d'accéder de manière non autorisée aux systèmes ou données d'autres utilisateurs</li>
          <li>Perturber le fonctionnement du service (piratage, spam, faux comptes, etc.)</li>
        </ul>

        <h2>5. Suspension et résiliation</h2>
        <p>
          Orbizo se réserve le droit de{' '}
          <strong>suspendre ou supprimer, sans préavis ni remboursement</strong>,
          tout compte dont l'usage constitue un abus ou une violation des présentes
          CGU.
        </p>
        <p>
          Vous pouvez à tout moment demander la suppression de votre compte en nous
          contactant à <a href="mailto:0xardenn@gmail.com">0xardenn@gmail.com</a>.
        </p>

        <h2>6. Sous-comptes</h2>
        <p>
          Le titulaire d'un compte peut créer des sous-comptes (par exemple pour un
          vendeur ou un comptable) et leur attribuer des rôles et accès spécifiques.
          Le titulaire du compte principal reste responsable de l'utilisation faite
          par ses sous-comptes.
        </p>

        <h2>7. Propriété intellectuelle</h2>
        <p>
          L'application Orbizo, son code, son design, sa marque et ses contenus
          sont la propriété exclusive de ARDENN TRADE X. Aucune reproduction
          ou utilisation non autorisée n'est permise.
        </p>
        <p>
          Les données que vous saisissez dans Orbizo (vos produits, commandes,
          clients) vous appartiennent.
        </p>

        <h2>8. Responsabilité</h2>
        <p>
          Orbizo met tout en œuvre pour assurer la disponibilité et le bon
          fonctionnement du service, sans garantie de résultat commercial pour
          l'utilisateur. Orbizo ne pourra être tenu responsable des interruptions
          temporaires du service liées à la maintenance ou à des causes
          indépendantes de sa volonté.
        </p>

        <h2>9. Modification des CGU</h2>
        <p>
          Ces CGU peuvent être modifiées à tout moment. La date de dernière mise à
          jour figure en haut de cette page. Toute modification substantielle vous
          sera communiquée.
        </p>

        <h2>10. Droit applicable</h2>
        <p>
          Les présentes CGU sont soumises au <strong>droit béninois</strong>. Tout
          litige relatif à leur interprétation ou leur exécution relève de la
          compétence des juridictions béninoises, sous réserve des règles
          impératives applicables dans votre pays de résidence.
        </p>
      </div>
    </div>
  );
}

export default Conditions;