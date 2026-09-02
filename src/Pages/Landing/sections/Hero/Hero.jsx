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
  { src: dashboardMockup, alt: 'Tableau de bord Orbizo : chiffre d’affaires, bénéfice et commandes en temps réel' },
  { src: commandesMockup, alt: 'Suivi des commandes Orbizo par statut : en attente, en cours, livrée, en litige' },
  { src: produitsMockup, alt: 'Catalogue produits Orbizo avec photos, prix et stock' },
  { src: clientsMockup, alt: 'Fiches clients Orbizo avec historique et coordonnées' },
];

const TITLES = [
  { black: 'Votre chiffre d’affaires,', accent: 'en temps réel.' },
  { black: 'Vos commandes,', accent: 'suivies à la lettre.' },
  { black: 'Votre catalogue,', accent: 'toujours à jour.' },
  { black: 'Vos clients,', accent: 'jamais oubliés.' },
];

const TITLE_DELAY = 3800;
const TOTAL_ROTATION_TIME = TITLE_DELAY * 4 + 400;

function Hero() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [titleIndex, setTitleIndex] = useState(0);
  const touchStartX = useRef(null);
  const touchDeltaX = useRef(0);

  // Rotation des titres pendant un temps limité, puis arrêt sur le titre principal
  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((current) => (current + 1) % TITLES.length);
    }, TITLE_DELAY);

    const stopTimer = setTimeout(() => {
      clearInterval(interval);
      setTitleIndex(0);
    }, TOTAL_ROTATION_TIME);

    return () => {
      clearInterval(interval);
      clearTimeout(stopTimer);
    };
  }, []);

  const goTo = useCallback((i) => {
    setIndex(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Défilement automatique des images
  useEffect(() => {
    if (isPaused) return undefined;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % SLIDES.length);
    }, 4500);
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

            <h1 className="hero-title" key={titleIndex}>
              <span className="hero-title-black">{TITLES[titleIndex].black}</span>
              <br />
              <span className="hero-title-gold">{TITLES[titleIndex].accent}</span>
            </h1>

            <p className="hero-lede">
              Fini les commandes copiées à la main et la caisse recomptée en fin de
              journée. Orbizo calcule tout pour vous, pendant que vos concurrents
              perdent encore du temps.
            </p>

            <Link to="/inscription" className="hero-cta">
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
                {SLIDES.map((slide, i) => (
                  <img
                    key={slide.src}
                    src={slide.src}
                    alt={slide.alt}
                    className="hero-image"
                    draggable="false"
                    loading="eager"
                    decoding="async"
                    fetchPriority={i === 0 ? 'high' : 'auto'}
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