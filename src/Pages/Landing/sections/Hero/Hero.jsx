import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Reveal from '../../../../components/Reveal/Reveal';
import dashboardMockup from '../../../../assets/hero-dashboard-mockup.png';
import commandesMockup from '../../../../assets/hero-commandes-mockup.png';
import produitsMockup from '../../../../assets/hero-produits-mockup.png';
import clientsMockup from '../../../../assets/hero-clients-mockup.png';
import './Hero.css';

const SLIDES = [
  { src: dashboardMockup, alt: 'Tableau de bord Orbizo : chiffre d\u2019affaires, b\u00e9n\u00e9fice et commandes en temps r\u00e9el' },
  { src: commandesMockup, alt: 'Suivi des commandes Orbizo par statut : en attente, en cours, livr\u00e9e, en litige' },
  { src: produitsMockup, alt: 'Catalogue produits Orbizo avec photos, prix et stock' },
  { src: clientsMockup, alt: 'Fiches clients Orbizo avec historique et coordonn\u00e9es' },
];

const AUTOPLAY_DELAY = 4500;

function Hero() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);
  const touchDeltaX = useRef(0);

  const goTo = useCallback((i) => {
    setIndex(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Défilement automatique, en pause au survol ou au toucher
  useEffect(() => {
    if (isPaused) return undefined;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % SLIDES.length);
    }, AUTOPLAY_DELAY);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
    setIsPaused(true);
  };

  const handleTouchMove = (e) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    const threshold = 40;
    if (touchDeltaX.current > threshold) {
      goPrev();
    } else if (touchDeltaX.current < -threshold) {
      goNext();
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
    setIsPaused(false);
  };

  return (
    <section className="hero-wrapper">
      <div className="hero-inner">
        <Reveal>
          <div className="hero-col-text">
            <span className="hero-badge">
              <span className="hero-badge-dot" aria-hidden="true" />
              Simplifie le quotidien des commerçants
            </span>

            <h1 className="hero-title">
              <span className="hero-title-black">Votre chiffre d&rsquo;affaires,</span><br />
              <span className="hero-title-gold">en temps réel.</span>
            </h1>

            <p className="hero-lede">
              Fini les commandes copiées à la main et la caisse recomptée en fin de
              journée. Orbizo calcule tout pour vous, pendant que vos concurrents
              perdent encore du temps.
            </p>

            <Link to="/login" className="hero-cta">
              Essai gratuit 7 jours
            </Link>
          </div>
        </Reveal>

        <Reveal>
          <div
            className="hero-col-image"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className="hero-image-frame"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="hero-slider-track"
                style={{ transform: `translateX(-${index * 100}%)` }}
              >
                {SLIDES.map((slide) => (
                  <img
                    key={slide.src}
                    src={slide.src}
                    alt={slide.alt}
                    className="hero-image"
                    draggable="false"
                  />
                ))}
              </div>

              <button
                type="button"
                className="hero-slider-arrow hero-slider-arrow-left"
                onClick={goPrev}
                aria-label="Aperçu précédent"
              >
                <ChevronLeft size={20} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                className="hero-slider-arrow hero-slider-arrow-right"
                onClick={goNext}
                aria-label="Aperçu suivant"
              >
                <ChevronRight size={20} strokeWidth={2.5} />
              </button>
            </div>

            <div className="hero-slider-dots" role="tablist" aria-label="Aperçus de l'application">
              {SLIDES.map((slide, i) => (
                <button
                  key={slide.src}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Aller à l'aperçu ${i + 1}`}
                  className={`hero-slider-dot ${i === index ? 'hero-slider-dot-active' : ''}`}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default Hero;