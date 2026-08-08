import Reveal from '../../../../components/Reveal/Reveal';
import './DashboardPreview.css';

function DashboardPreview() {
  return (
    <section className="dashboard-preview-section">
      <div className="dashboard-preview-container">
        <Reveal>
          <div className="dashboard-preview-frame">
            <img
              src="/dashboard-mockup.png"
              alt="Aperçu du tableau de bord Orbizo"
              className="dashboard-preview-image"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default DashboardPreview;