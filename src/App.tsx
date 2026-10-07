import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Clapperboard,
  Menu,
  Play,
  Scissors,
  Send,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react';

const WHATSAPP_URL = 'https://wa.me/message/SAFGEJCQOHUOM1';
const ORIGINAL_SITE = 'https://dhyper-portfolio.preview.emergentagent.com';
const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

const durations = ['0:48', '1:15', '0:59', '2:26', '0:41', '0:37', '1:31', '1:53', '1:43', '1:24', '0:59', '1:25'];
const clips = durations.map((duration, index) => {
  const id = `clip-${String(index + 1).padStart(2, '0')}`;
  return {
    id,
    label: `CLIP ${String(index + 1).padStart(2, '0')}`,
    duration,
    src: `${ORIGINAL_SITE}/videos/${id}.mp4`,
    poster: asset(`posters/${id}.jpg`),
  };
});

const marqueeItems = [
  'EDITING',
  'COLOR GRADING',
  'SOUND DESIGN',
  'REELS',
  'ANÚNCIOS',
  'YOUTUBE',
  'MOTION DESIGN',
  'LEGENDAS DINÂMICAS',
];

const processSteps = [
  {
    title: 'Entrega do material do cliente',
    marker: 'THE INTAKE',
    description: 'Você envia os arquivos brutos — vídeos, áudios, logos e referências — por link, do jeito mais simples para você.',
  },
  {
    title: 'Briefing',
    marker: 'VISION SYNC',
    description: 'Alinhamos objetivo, público, ritmo, estilo e plataforma. Cada detalhe definido antes do primeiro corte.',
  },
  {
    title: 'Edição',
    marker: 'THE SYNTHESISE',
    description: 'Cortes, ritmo, legendas dinâmicas, motion, trilha, efeitos sonoros e cor. É aqui que o bruto vira resultado.',
  },
  {
    title: 'Entrega para o cliente',
    marker: 'FINAL CUT',
    description: 'Você recebe o vídeo pronto para postar, no formato certo para cada rede, com espaço para ajustes.',
  },
];

function Wordmark({ className = '' }: { className?: string }) {
  return <span className={`wordmark ${className}`}>Dhyper<span>.</span></span>;
}

function SectionMarker({ number, label }: { number: string; label: string }) {
  return (
    <div className="section-marker">
      <span>{number}</span>
      <i aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

function WhatsAppIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20.3 11.8a8.35 8.35 0 0 1-12.34 7.3L3.7 20.2l1.16-4.12a8.34 8.34 0 1 1 15.44-4.28Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M8.55 8.35c.18-.39.38-.4.65-.4h.46c.2 0 .36.08.46.31l.72 1.64c.1.24.07.42-.08.6l-.52.57c-.15.16-.16.32-.04.53.3.52.8 1.18 1.53 1.69.74.52 1.35.73 1.67.83.23.08.39.04.55-.14l.7-.82c.16-.19.34-.23.57-.14l1.64.77c.23.11.35.2.37.37.04.44-.2 1.1-.61 1.43-.38.31-.85.48-1.39.49-.35 0-.8-.07-1.55-.38-.9-.38-1.8-.96-2.67-1.8-.72-.7-1.43-1.64-1.8-2.37-.36-.72-.46-1.33-.43-1.73.03-.52.2-.95.57-1.45Z" fill="currentColor" />
    </svg>
  );
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [showFloatingContact, setShowFloatingContact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeClip, setActiveClip] = useState<number | null>(null);
  const timecodeRef = useRef<HTMLSpanElement>(null);
  const cardVideos = useRef<Array<HTMLVideoElement | null>>([]);
  const lightboxVideo = useRef<HTMLVideoElement>(null);

  const closeLightbox = useCallback(() => setActiveClip(null), []);
  const moveLightbox = useCallback((step: number) => {
    setActiveClip((current) => current === null ? null : (current + step + clips.length) % clips.length);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      setShowFloatingContact(window.scrollY > 300);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    let frames = 15;
    const timer = window.setInterval(() => {
      frames += 1;
      const seconds = Math.floor(frames / 24) % 60;
      const frame = frames % 24;
      if (timecodeRef.current) {
        timecodeRef.current.textContent = `00:00:${String(seconds).padStart(2, '0')}:${String(frame).padStart(2, '0')}`;
      }
    }, 1000 / 24);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (activeClip === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    void lightboxVideo.current?.play().catch(() => undefined);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowRight') moveLightbox(1);
      if (event.key === 'ArrowLeft') moveLightbox(-1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeClip, closeLightbox, moveLightbox]);

  const previewClip = (index: number, play: boolean) => {
    const video = cardVideos.current[index];
    if (!video) return;
    if (play) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
      video.currentTime = 0;
    }
  };

  return (
    <div className="site-shell">
      <header className={`site-nav${scrolled ? ' is-scrolled' : ''}`}>
        <div className="nav-inner">
          <a className="logo-link" href="#inicio" aria-label="Dhyper Media Studio — início" onClick={() => setMenuOpen(false)}>
            <Wordmark />
          </a>
          <nav className="desktop-nav" aria-label="Navegação principal">
            <a href="#portfolio">Portfólio</a>
            <a href="#processo">Processo</a>
            <a href="#sobre">Sobre</a>
            <a className="nav-cta" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              Começar a edição <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </nav>
          <button
            type="button"
            className="menu-toggle"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>
        {menuOpen && (
          <nav className="mobile-nav" aria-label="Navegação móvel">
            <a href="#portfolio" onClick={() => setMenuOpen(false)}>Portfólio</a>
            <a href="#processo" onClick={() => setMenuOpen(false)}>Processo</a>
            <a href="#sobre" onClick={() => setMenuOpen(false)}>Sobre</a>
            <a className="mobile-nav-cta" href={WHATSAPP_URL} target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>
              Começar a edição <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </nav>
        )}
      </header>

      <main>
        <section className="hero" id="inicio" aria-label="Dhyper Media Studio">
          <picture className="hero-picture">
            <source media="(max-width: 767px)" srcSet={asset('images/hero-mobile.jpg')} />
            <img
              className="hero-image"
              src={asset('images/hero-desktop.jpg')}
              alt="Dhyper Media Studio — estúdio de edição de vídeos"
              fetchPriority="high"
            />
          </picture>
          <div className="hero-shade" aria-hidden="true" />
          <div className="hero-content">
            <p className="hero-description">Reels · Anúncios · YouTube — edição com foco total em retenção.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#portfolio"><Play size={14} fill="currentColor" aria-hidden="true" /> Ver portfólio</a>
              <a className="button button-light" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Começar a edição</a>
            </div>
          </div>
          <div className="hero-timeline" aria-hidden="true">
            <span className="timecode" ref={timecodeRef}>00:00:00:15</span>
            <div className="timeline-track"><span /></div>
            <span className="scroll-prompt">ROLE PARA VER ↓</span>
          </div>
        </section>

        <div className="marquee" aria-label={marqueeItems.join(' · ')}>
          <div className="marquee-track">
            {[0, 1].map((copy) => (
              <div className="marquee-group" key={copy} aria-hidden={copy === 1}>
                {marqueeItems.map((item, index) => (
                  <span className="marquee-item" key={`${copy}-${item}`}>
                    {item}<i aria-hidden="true">{index % 2 === 0 ? '✳' : '·'}</i>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <section className="section portfolio-section" id="portfolio">
          <div className="section-wrap">
            <SectionMarker number="01" label="PORTFÓLIO" />
            <div className="section-heading">
              <h2>CADA CORTE<br />TEM UM MOTIVO.</h2>
              <p>Uma seleção de edições para criadores e marcas. Toque em qualquer vídeo para assistir em tela cheia.</p>
            </div>
            <div className="video-grid" aria-label="Portfólio de vídeos">
              {clips.map((clip, index) => (
                <button
                  className="video-card"
                  key={clip.id}
                  type="button"
                  aria-label={`Assistir ${clip.label}, duração ${clip.duration}`}
                  onClick={() => setActiveClip(index)}
                  onMouseEnter={() => previewClip(index, true)}
                  onMouseLeave={() => previewClip(index, false)}
                >
                  <video
                    ref={(node) => { cardVideos.current[index] = node; }}
                    poster={clip.poster}
                    muted
                    loop
                    playsInline
                    preload="none"
                    aria-hidden="true"
                  >
                    <source src={clip.src} type="video/mp4" />
                  </video>
                  <span className="video-overlay" aria-hidden="true" />
                  <span className="video-play"><Play size={20} fill="currentColor" aria-hidden="true" /></span>
                  <span className="video-label"><span>{clip.label}</span><time>{clip.duration}</time></span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="process-section" id="processo">
          <div className="section-wrap">
            <SectionMarker number="02" label="PROCESSO" />
            <div className="section-heading">
              <h2>DO BRUTO AO<br />CORTE FINAL.</h2>
              <p>Um fluxo claro, em quatro etapas, para você saber exatamente o que acontece com o seu material.</p>
            </div>
            <div className="process-grid">
              {processSteps.map((step, index) => (
                <article className="process-step" key={step.title}>
                  <div className="process-step-top">
                    <span className="process-number">0{index + 1}</span>
                    <span className="process-marker">{step.marker}</span>
                  </div>
                  <div className="process-line" aria-hidden="true"><span /></div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              ))}
            </div>
            <div className="process-footer">
              <p>Sem burocracia: você acompanha cada etapa direto pelo WhatsApp.</p>
              <a className="button button-outline" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                <WhatsAppIcon className="whatsapp-icon" /> Enviar meu material <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <section className="about-section" id="sobre">
          <div className="about-wrap">
            <div className="about-photo-wrap">
              <div className="about-photo-frame" aria-hidden="true" />
              <img src={asset('images/hero-mobile.jpg')} alt="Editor da Dhyper Media Studio no estúdio" loading="lazy" />
              <span className="about-photo-label">DHYPER MEDIA STUDIO</span>
            </div>
            <div className="about-copy">
              <SectionMarker number="03" label="SOBRE" />
              <h2>EDIÇÃO QUE PRENDE<br />DO INÍCIO AO FIM.</h2>
              <p className="about-description">Por trás da Dhyper está um editor obcecado por detalhe — ritmo, enquadramento, som e cor trabalhando juntos para o seu vídeo cumprir um objetivo: prender a atenção do primeiro segundo e transformar visualização em resultado.</p>
              <div className="about-pillars">
                <article>
                  <Scissors size={19} aria-hidden="true" />
                  <div><h3>EDIÇÃO PROFISSIONAL</h3><p>Cortes precisos, cor calibrada e acabamento de estúdio.</p></div>
                </article>
                <article>
                  <Clapperboard size={19} aria-hidden="true" />
                  <div><h3>VÍDEOS CRIATIVOS</h3><p>Narrativa, ritmo e motion que dão vida à sua ideia.</p></div>
                </article>
                <article>
                  <TrendingUp size={19} aria-hidden="true" />
                  <div><h3>MAIS RESULTADOS</h3><p>Cada segundo pensado para reter atenção e converter.</p></div>
                </article>
              </div>
              <a className="text-link" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Falar com o editor <ArrowUpRight size={16} aria-hidden="true" /></a>
            </div>
          </div>
        </section>

        <section className="final-cta" id="contato">
          <div className="final-cta-glow" aria-hidden="true" />
          <div className="final-cta-content">
            <SectionMarker number="04" label="CONTATO" />
            <h2>VAMOS TRANSFORMAR<br />SEU PROJETO EM<br /><span>ALGO ÉPICO?</span></h2>
            <p>Envie seu material e receba um vídeo pronto para postar — direto com o editor, sem formulários e sem enrolação.</p>
            <a className="button button-primary final-button" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
              <WhatsAppIcon className="whatsapp-icon" /> Começar a edição <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <a className="logo-link" href="#inicio" aria-label="Dhyper Media Studio — início"><Wordmark /></a>
            <p>Media Studio — edição de vídeos que transformam ideias em resultados.</p>
          </div>
          <nav className="footer-nav" aria-label="Links do rodapé">
            <a href="#portfolio">Portfólio</a>
            <a href="#processo">Processo</a>
            <a href="#sobre">Sobre</a>
          </nav>
          <a className="footer-whatsapp" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
            <WhatsAppIcon className="whatsapp-icon" /> Falar pelo WhatsApp
          </a>
        </div>
        <div className="footer-bottom">
          <span>EDIÇÃO COM INTENÇÃO. RESULTADO COM PRESENÇA.</span>
          <span>© {new Date().getFullYear()} DHUPER MEDIA STUDIO</span>
        </div>
      </footer>

      {showFloatingContact && (
        <a className="floating-whatsapp" href={WHATSAPP_URL} target="_blank" rel="noreferrer" aria-label="Falar no WhatsApp">
          <span className="floating-pulse" aria-hidden="true" />
          <WhatsAppIcon className="whatsapp-icon" />
        </a>
      )}

      {activeClip !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${clips[activeClip].label} — vídeo do portfólio`} onClick={closeLightbox}>
          <button type="button" className="lightbox-close" aria-label="Fechar vídeo" onClick={closeLightbox}><X size={24} /></button>
          <button type="button" className="lightbox-arrow lightbox-prev" aria-label="Vídeo anterior" onClick={(event: MouseEvent<HTMLButtonElement>) => { event.stopPropagation(); moveLightbox(-1); }}><ArrowLeft size={23} /></button>
          <div className="lightbox-video-wrap" onClick={(event) => event.stopPropagation()}>
            <video ref={lightboxVideo} className="lightbox-video" controls autoPlay playsInline poster={clips[activeClip].poster}>
              <source src={clips[activeClip].src} type="video/mp4" />
              Seu navegador não conseguiu carregar este vídeo.
            </video>
            <div className="lightbox-caption"><span>{clips[activeClip].label}</span><span>{clips[activeClip].duration}</span></div>
          </div>
          <button type="button" className="lightbox-arrow lightbox-next" aria-label="Próximo vídeo" onClick={(event: MouseEvent<HTMLButtonElement>) => { event.stopPropagation(); moveLightbox(1); }}><ArrowRight size={23} /></button>
        </div>
      )}
    </div>
  );
}
