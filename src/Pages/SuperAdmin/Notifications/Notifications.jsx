
import { Send } from 'lucide-react';
import './Notifications.css';

const historiqueData = [
  { titre: 'Maintenance prévue', cible: 'Tous les commerçants', date: '20/07/2026' },
  { titre: 'Nouvelle fonctionnalité : filtres commandes', cible: 'Tous les commerçants', date: '10/07/2026' },
];

function Notifications() {
  return (
    <div className="notifications">
      <h1 className="notifications-title">Notifications</h1>
      <p className="notifications-subtitle">Envoyez des annonces à vos utilisateurs.</p>

      <div className="notifications-form-card">
        <h2 className="notifications-form-label">Nouvelle notification</h2>
        <form className="notifications-form">
          <input type="text" placeholder="Titre de la notification" />
          <textarea placeholder="Message..." rows="3"></textarea>
          <select>
            <option>Tous les commerçants</option>
            <option>Commerces actifs uniquement</option>
            <option>Commerces suspendus</option>
          </select>
          <button type="submit" className="notifications-send-btn">
            <Send size={16} />
            Envoyer
          </button>
        </form>
      </div>

      <h2 className="notifications-history-label">Déjà envoyées</h2>
      <div className="notifications-history">
        {historiqueData.map((n) => (
          <div key={n.titre} className="notifications-history-item">
            <div>
              <p className="notifications-history-titre">{n.titre}</p>
              <p className="notifications-history-cible">{n.cible}</p>
            </div>
            <span className="notifications-history-date">{n.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;