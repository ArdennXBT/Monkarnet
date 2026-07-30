
import { Link } from 'react-router-dom';
import './Login.css';

function Login() {
  return (
    <div className="login">
      <div className="login-card">
        <span className="login-logo">Monkarnet</span>
        <h1 className="login-title">Connexion</h1>
        <p className="login-subtitle">Accédez à votre espace commerçant.</p>

        <form className="login-form">
          <label>
            Email
            <input type="email" placeholder="vous@exemple.com" />
          </label>
          <label>
            Mot de passe
            <input type="password" placeholder="••••••••" />
          </label>
          <button type="submit" className="login-submit">Se connecter</button>
        </form>

        <p className="login-footer">
          Pas encore de compte ? <Link to="/inscription">Inscrivez-vous</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;