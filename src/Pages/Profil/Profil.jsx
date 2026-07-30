
import './Profil.css';

function Profil() {
  return (
    <div className="profil">
      <h1 className="profil-title">Profil</h1>
      <p className="profil-subtitle">Informations de votre commerce.</p>

      <div className="profil-card">
        <div className="profil-avatar">C</div>
        <div>
          <p className="profil-nom">Chez Rosine</p>
          <p className="profil-role">Compte Admin</p>
        </div>
      </div>

      <div className="profil-section">
        <h2 className="profil-section-title">Informations du commerce</h2>
        <form className="profil-form">
          <label>
            Nom du commerce
            <input type="text" defaultValue="Chez Rosine" />
          </label>
          <label>
            Type de commerce
            <input type="text" defaultValue="Restaurant" />
          </label>
          <label>
            Adresse
            <input type="text" defaultValue="Cotonou, Fidjrossè" />
          </label>
          <label>
            Téléphone
            <input type="tel" defaultValue="+229 97 00 00 00" />
          </label>
          <button type="submit" className="profil-save-btn">Enregistrer</button>
        </form>
      </div>

      <div className="profil-section">
        <h2 className="profil-section-title">Abonnement</h2>
        <div className="profil-plan-card">
          <div>
            <p className="profil-plan-nom">Plan Gratuit</p>
            <p className="profil-plan-desc">Toutes les fonctionnalités de base, sans limite de temps.</p>
          </div>
          <span className="profil-plan-badge">Actif</span>
        </div>
      </div>
    </div>
  );
}

export default Profil;