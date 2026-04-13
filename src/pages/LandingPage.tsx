import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import HeroV2 from '../components/landing-page/HeroV2';

/**
 * Drop-in page component:
 * <LandingPage />
 *
 * Optional: Replace placeholder backgrounds with your assets.
 * - Hero background, mountain, clouds, video preview, feature photo can be swapped via CSS backgroundImage.
 */

const ease = [0.22, 1, 0.36, 1] as const;

const revealVariants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease },
  },
};

function Reveal({ children, delay = 0, className = '', once = true }) {
  return (
    <motion.div
      className={className}
      variants={revealVariants}
      initial='hidden'
      whileInView='show'
      viewport={{ once, amount: 0.25 }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

function Button({ children, variant = 'primary', className = '', ...props }) {
  return (
    <button
      className={[
        'btn',
        variant === 'primary' ? 'btnPrimary' : 'btnGhost',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={['navWrap', scrolled ? 'navWrapScrolled' : ''].join(' ')}>
      <div className='container nav'>
        <div className='brand'>
          <div className='brandMark' />
          <span className='brandText'>UnitHub</span>
        </div>

        <div className='navLinks'>
          <a href='#product'>Product</a>
          <a href='#use-cases'>Use Cases</a>
          <a href='#pricing'>Pricing</a>
        </div>

        <Button className='navCta'>Join now</Button>
      </div>
    </div>
  );
}

function Hero() {
  // Subtle parallax for hero elements
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const mountainY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const cloudY = useTransform(scrollYProgress, [0, 1], [0, 25]);

  return (
    <section ref={ref} className='hero'>
      <div className='heroBg' />

      <Nav />

      <div className='container heroInner'>
        <Reveal delay={0.05} className='heroPillRow'>
          <button className='pill'>
            Read the latest release <span className='pillArrow'>→</span>
          </button>
        </Reveal>

        <motion.h1 className='heroTitle' style={{ y: titleY }}>
          Ain&apos;t no mountain
          <br />
          high enough
        </motion.h1>

        {/* Decorative plane */}
        <motion.div
          className='plane'
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 0.55, x: 0 }}
          transition={{ duration: 1.2, ease }}
        >
          ✈
        </motion.div>

        {/* Decorative clouds */}
        <motion.div className='cloud cloud1' style={{ y: cloudY }} />
        <motion.div className='cloud cloud2' style={{ y: cloudY }} />

        {/* Mountain silhouette */}
        <motion.div className='mountain' style={{ y: mountainY }} />

        {/* Gradient fade bottom */}
        <div className='heroFade' />
      </div>
    </section>
  );
}

function LogoStrip() {
  const logos = useMemo(
    () => [
      'WIRED TUNE',
      'Magnifo',
      'UnitHub',
      'Percenty',
      'doculy.',
      'HANDCRAFTED',
    ],
    [],
  );

  return (
    <section className='section sectionTight' aria-label='Trusted by'>
      <div className='container'>
        <Reveal>
          <div className='logos'>
            {logos.map((l) => (
              <div key={l} className='logoItem'>
                {l}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function LeftHeadline() {
  return (
    <section id='product' className='section'>
      <div className='container'>
        <div className='twoCol'>
          <Reveal>
            <div className='iconCircle'>
              <div className='iconSquare' />
            </div>
          </Reveal>

          <div>
            <Reveal>
              <h2 className='h2'>
                Establish a
                <br />
                venture
                <br />
                valuable.
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className='subtext'>
                Build and ship your dream site to communicate your
                <br />
                product, all with no-code.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function PhotoFeature() {
  return (
    <section id='use-cases' className='section sectionPhoto'>
      <div className='container'>
        <Reveal>
          <div className='photoCard'>
            <div className='photoOverlay' />

            <div className='photoBadge'>
              <div className='badgeMark' />
            </div>

            <div className='photoText'>
              <h3 className='h3'>
                Interact with
                <br />
                individuals
                <br />
                worldwide
              </h3>
              <p className='subtext small'>
                Build and ship your dream site to communicate your
                <br />
                product, all with no-code.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function CenterStatement() {
  return (
    <section className='section'>
      <div className='container center'>
        <Reveal>
          <h2 className='h2 centerTitle'>
            Build for the new way of
            <br />
            the internet.
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className='subtext centerSub'>
            Meet the new standard for modern software development.
            <br />
            Streamline issues, sprints, and product roadmaps.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => ({
        name: 'Alex Smirnov',
        role: 'Co-founder at Storytail',
        text: 'As more people started using the product, Clover needed to become inherently more collaborative to encourage guest collaboration and drive organic user growth.',
        id: i,
      })),
    [],
  );

  const scrollerRef = useRef(null);

  const scrollBy = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.8) * dir;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <section className='section sectionTestimonials'>
      <div className='container'>
        <Reveal>
          <div className='kicker'>TESTIMONIALS</div>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className='h2 centerTitle'>
            Thousands of creators
            <br />
            already trust us
          </h2>
        </Reveal>

        <Reveal delay={0.12}>
          <div className='testimonialsTopBar'>
            <button
              className='miniBtn'
              onClick={() => scrollBy(-1)}
              aria-label='Scroll left'
            >
              ←
            </button>
            <button
              className='miniBtn'
              onClick={() => scrollBy(1)}
              aria-label='Scroll right'
            >
              →
            </button>
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <div ref={scrollerRef} className='testimonialRow'>
            {items.map((t) => (
              <div key={t.id} className='testimonialCard'>
                <div className='testimonialHeader'>
                  <div className='avatar' />
                  <div>
                    <div className='tName'>{t.name}</div>
                    <div className='tRole'>{t.role}</div>
                  </div>
                </div>
                <p className='tText'>{t.text}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function VideoPreview() {
  return (
    <section className='section'>
      <div className='container'>
        <Reveal>
          <div className='videoCard'>
            <div className='videoBg' />

            <div className='videoPill'>
              <div className='playBtn'>▶</div>
              <div className='videoMeta'>
                <div className='videoTitle'>Product overview</div>
                <div className='videoTime'>2mins</div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section id='pricing' className='section sectionCTA'>
      <div className='container center'>
        <Reveal>
          <h2 className='h2'>Get started today!</h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className='subtext centerSub'>
            Build and ship your dream site to communicate your product, all with
            no-code.
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <Button className='ctaBtn'>Get started</Button>
        </Reveal>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className='page'>
      <HeroV2 />
      <LogoStrip />
      <LeftHeadline />
      <PhotoFeature />
      <CenterStatement />
      <Testimonials />
      <VideoPreview />
      <FinalCTA />

      {/* Styles (keep in this file for easy copy/paste) */}
      <style>{css}</style>
    </div>
  );
}

const css = `
  :root{
    --bg:#050505;
    --text:#f3f3f3;
    --muted: rgba(255,255,255,.65);
    --soft: rgba(255,255,255,.08);
    --soft2: rgba(255,255,255,.12);
    --pill: rgba(255,255,255,.08);
    --accent: #f4b7b9; /* soft pink */
    --accent2: #ffced0;
    --radius: 18px;
    --radius2: 28px;
    --shadow: 0 24px 80px rgba(0,0,0,.55);
  }

  *{ box-sizing:border-box; }
  html, body{ height:100%; }
  body{
    margin:0;
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
    background: var(--bg);
    color: var(--text);
    overflow-x:hidden;
  }
  a{ color:inherit; text-decoration:none; }
  .page{ width:100%; }

  .container{
    width:min(1120px, calc(100% - 48px));
    margin:0 auto;
  }

  /* NAV */
  .navWrap{
    position:fixed;
    top:0; left:0; right:0;
    z-index:50;
    transition: all .25s ease;
  }
  .navWrapScrolled{
    backdrop-filter: blur(10px);
    background: rgba(0,0,0,.45);
    border-bottom: 1px solid rgba(255,255,255,.06);
  }
  .nav{
    height:72px;
    display:flex;
    align-items:center;
    justify-content:space-between;
  }
  .brand{ display:flex; align-items:center; gap:10px; font-weight:700; }
  .brandMark{
    width:18px; height:18px;
    border-radius:8px;
    background: linear-gradient(135deg, var(--accent), rgba(255,255,255,.15));
    box-shadow: 0 10px 24px rgba(244,183,185,.15);
  }
  .brandText{ letter-spacing:.2px; }
  .navLinks{ display:flex; gap:28px; font-weight:500; color: rgba(255,255,255,.75); }
  .navLinks a{ position:relative; padding:6px 0; }
  .navLinks a:after{
    content:"";
    position:absolute;
    left:0; bottom:-2px;
    width:0; height:1px;
    background: rgba(255,255,255,.55);
    transition: width .25s ease;
  }
  .navLinks a:hover:after{ width:100%; }
  .navCta{ margin-left:14px; }

  /* BUTTONS */
  .btn{
    border:0;
    cursor:pointer;
    padding:12px 18px;
    border-radius:999px;
    font-weight:700;
    letter-spacing:.1px;
    transition: transform .2s ease, opacity .2s ease, background .2s ease;
  }
  .btn:active{ transform: scale(.98); }
  .btnPrimary{
    background: var(--accent);
    color:#111;
  }
  .btnPrimary:hover{ background: var(--accent2); }
  .btnGhost{
    background: rgba(255,255,255,.08);
    color: var(--text);
  }
  .btnGhost:hover{ background: rgba(255,255,255,.12); }

  /* HERO */
  .hero{
    position:relative;
    min-height: 92vh;
    padding-top: 92px;
    overflow:hidden;
  }
  .heroBg{
    position:absolute; inset:0;
    background:
      radial-gradient(1200px 520px at 50% 10%, rgba(255,255,255,.10), transparent 55%),
      radial-gradient(800px 420px at 80% 10%, rgba(244,183,185,.10), transparent 50%),
      linear-gradient(180deg, #0a0a0a 0%, #2a0d06 52%, #7d2a10 100%);
    filter: saturate(1.05);
  }
  .heroInner{
    position:relative;
    height:100%;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:flex-start;
    padding-bottom: 120px;
  }

  .heroPillRow{ margin-top: 18px; }
  .pill{
    border:1px solid rgba(255,255,255,.18);
    background: rgba(0,0,0,.22);
    color: rgba(255,255,255,.90);
    padding: 10px 16px;
    border-radius:999px;
    cursor:pointer;
    display:flex;
    align-items:center;
    gap:10px;
    transition: background .2s ease, border-color .2s ease;
  }
  .pill:hover{
    background: rgba(0,0,0,.32);
    border-color: rgba(255,255,255,.28);
  }
  .pillArrow{ opacity:.85; }

  .heroTitle{
    margin: 22px 0 0;
    text-align:center;
    font-size: clamp(44px, 7.2vw, 104px);
    line-height: .92;
    letter-spacing: -1.4px;
    color: rgba(255,255,255,.9);
    font-weight: 800;
  }

  .plane{
    position:absolute;
    left: 9%;
    top: 38%;
    font-size: 20px;
    opacity:.6;
    transform: rotate(-10deg);
  }

  .cloud{
    position:absolute;
    width: 160px;
    height: 72px;
    border-radius: 999px;
    background: radial-gradient(circle at 30% 35%, rgba(255,255,255,.95), rgba(255,255,255,.65) 55%, rgba(255,255,255,.0) 78%);
    filter: blur(.2px);
    opacity:.85;
  }
  .cloud1{ right: 10%; top: 20%; transform: scale(1.25); }
  .cloud2{ left: 18%; top: 66%; transform: scale(1.15); opacity:.75; }

  .mountain{
    position:absolute;
    left:50%;
    bottom: -10px;
    transform: translateX(-50%);
    width: min(1100px, 112vw);
    height: 520px;
    border-radius: 40px;
    background:
      radial-gradient(420px 280px at 62% 28%, rgba(255, 189, 196,.55), transparent 62%),
      radial-gradient(820px 520px at 35% 58%, rgba(120, 170, 220,.22), transparent 60%),
      linear-gradient(180deg, rgba(255,255,255,.2) 0%, rgba(255,255,255,0) 35%),
      linear-gradient(135deg, rgba(70,80,95,.95), rgba(15,18,24,.98));
    clip-path: polygon(50% 0%, 66% 14%, 76% 34%, 92% 62%, 100% 100%, 0% 100%, 8% 68%, 18% 44%, 28% 26%, 40% 10%);
    box-shadow: var(--shadow);
    opacity: .95;
  }

  .heroFade{
    position:absolute; left:0; right:0; bottom:0;
    height: 160px;
    background: linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.9));
  }

  /* SECTIONS */
  .section{ padding: 84px 0; }
  .sectionTight{ padding: 44px 0; }
  .center{ text-align:center; }
  .h2{
    font-size: clamp(38px, 5.2vw, 70px);
    line-height: .95;
    letter-spacing: -1px;
    margin: 0 0 14px;
    font-weight: 850;
  }
  .h3{
    font-size: clamp(36px, 4.8vw, 64px);
    line-height: .95;
    letter-spacing: -1px;
    margin: 0 0 12px;
    font-weight: 850;
  }
  .subtext{
    margin: 0;
    color: rgba(255,255,255,.70);
    font-size: 15.5px;
    line-height: 1.6;
  }
  .subtext.small{ font-size: 14.5px; }

  /* LOGOS */
  .logos{
    display:flex;
    gap: 44px;
    justify-content:space-between;
    align-items:center;
    flex-wrap:wrap;
    opacity: .9;
    border-top: 1px solid rgba(255,255,255,.06);
    border-bottom: 1px solid rgba(255,255,255,.06);
    padding: 18px 0;
  }
  .logoItem{
    color: rgba(255,255,255,.78);
    letter-spacing: .8px;
    font-weight: 650;
    font-size: 14px;
    opacity:.9;
  }

  /* LEFT HEADLINE */
  .twoCol{
    display:grid;
    grid-template-columns: 70px 1fr;
    gap: 18px;
    align-items:flex-start;
  }
  .iconCircle{
    width: 54px;
    height: 54px;
    border-radius: 999px;
    background: rgba(255,255,255,.06);
    display:grid;
    place-items:center;
    border: 1px solid rgba(255,255,255,.08);
  }
  .iconSquare{
    width: 18px; height: 18px;
    border-radius: 6px;
    background: linear-gradient(135deg, var(--accent), rgba(255,255,255,.12));
  }

  /* PHOTO FEATURE */
  .sectionPhoto{ padding-top: 34px; }
  .photoCard{
    position:relative;
    border-radius: var(--radius2);
    overflow:hidden;
    min-height: 420px;
    box-shadow: var(--shadow);
    border: 1px solid rgba(255,255,255,.10);

    /* Replace this with your real image:
       background-image: url('/your-photo.jpg');
    */
    background:
      radial-gradient(900px 450px at 20% 30%, rgba(0,0,0,.15), rgba(0,0,0,.75) 70%),
      linear-gradient(180deg, rgba(0,0,0,.15), rgba(0,0,0,.75)),
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='700'%3E%3Cdefs%3E%3CradialGradient id='g' cx='30%25' cy='20%25'%3E%3Cstop offset='0%25' stop-color='%23ffffff' stop-opacity='0.15'/%3E%3Cstop offset='100%25' stop-color='%23000000' stop-opacity='0.1'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='1200' height='700' fill='%23101214'/%3E%3Crect width='1200' height='700' fill='url(%23g)'/%3E%3C/svg%3E");
    background-size: cover;
    background-position: center;
  }
  .photoOverlay{
    position:absolute; inset:0;
    background: linear-gradient(90deg, rgba(0,0,0,.68) 0%, rgba(0,0,0,.10) 55%, rgba(0,0,0,.00) 100%);
  }
  .photoBadge{
    position:absolute;
    left: 50%;
    top: 44%;
    transform: translate(-50%, -50%);
    width: 92px; height: 92px;
    border-radius: 999px;
    background: rgba(0,0,0,.55);
    border: 1px solid rgba(255,255,255,.12);
    display:grid;
    place-items:center;
    backdrop-filter: blur(10px);
  }
  .badgeMark{
    width: 38px; height: 38px;
    border-radius: 14px;
    background: linear-gradient(135deg, var(--accent), rgba(255,255,255,.12));
    transform: rotate(12deg);
  }
  .photoText{
    position:absolute;
    left: 44px;
    bottom: 34px;
    right: 44px;
    max-width: 620px;
  }

  /* CENTER STATEMENT */
  .centerTitle{ margin-top: 0; }
  .centerSub{ max-width: 640px; margin: 0 auto; }

  /* TESTIMONIALS */
  .sectionTestimonials{ padding-top: 74px; }
  .kicker{
    text-align:center;
    color: rgba(244,183,185,.95);
    letter-spacing: 2.6px;
    font-weight: 800;
    font-size: 12px;
    margin-bottom: 14px;
  }
  .testimonialsTopBar{
    display:flex;
    justify-content:flex-end;
    gap: 10px;
    margin: 16px 0 14px;
  }
  .miniBtn{
    width: 42px; height: 42px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,.12);
    background: rgba(255,255,255,.06);
    color: rgba(255,255,255,.85);
    cursor:pointer;
    transition: background .2s ease, transform .2s ease;
  }
  .miniBtn:hover{ background: rgba(255,255,255,.10); }
  .miniBtn:active{ transform: scale(.98); }

  .testimonialRow{
    display:flex;
    gap: 16px;
    overflow-x:auto;
    padding: 8px 2px 10px;
    scroll-snap-type: x mandatory;
  }
  .testimonialRow::-webkit-scrollbar{ height: 10px; }
  .testimonialRow::-webkit-scrollbar-thumb{
    background: rgba(255,255,255,.12);
    border-radius: 999px;
  }
  .testimonialCard{
    flex: 0 0 280px;
    scroll-snap-align: start;
    background: rgba(255,255,255,.06);
    border: 1px solid rgba(255,255,255,.10);
    border-radius: 16px;
    padding: 16px 16px 18px;
    box-shadow: 0 18px 55px rgba(0,0,0,.35);
  }
  .testimonialHeader{
    display:flex;
    gap: 12px;
    align-items:center;
    margin-bottom: 12px;
  }
  .avatar{
    width: 42px;
    height: 42px;
    border-radius: 999px;
    background: radial-gradient(circle at 30% 30%, rgba(255,255,255,.22), rgba(255,255,255,.05));
    border: 1px solid rgba(255,255,255,.10);
  }
  .tName{ font-weight: 800; font-size: 13.5px; color: rgba(255,255,255,.88); }
  .tRole{ font-size: 12px; color: rgba(255,255,255,.55); margin-top: 2px; }
  .tText{
    margin: 0;
    color: rgba(255,255,255,.72);
    font-size: 13.5px;
    line-height: 1.55;
  }

  /* VIDEO */
  .videoCard{
    position:relative;
    border-radius: var(--radius2);
    overflow:hidden;
    min-height: 360px;
    border: 1px solid rgba(255,255,255,.10);
    box-shadow: var(--shadow);
    background: rgba(255,255,255,.04);
  }
  .videoBg{
    position:absolute; inset:0;
    background:
      radial-gradient(420px 300px at 60% 45%, rgba(255,180,120,.18), transparent 62%),
      radial-gradient(520px 360px at 30% 35%, rgba(120,170,220,.18), transparent 62%),
      linear-gradient(135deg, rgba(25,30,40,.95), rgba(5,5,5,.98));
  }
  .videoPill{
    position:absolute;
    right: 18px;
    bottom: 18px;
    display:flex;
    align-items:center;
    gap: 12px;
    padding: 12px 14px;
    border-radius: 999px;
    background: rgba(0,0,0,.55);
    border: 1px solid rgba(255,255,255,.10);
    backdrop-filter: blur(10px);
  }
  .playBtn{
    width: 46px; height: 46px;
    border-radius: 999px;
    background: rgba(255,255,255,.08);
    border: 1px solid rgba(255,255,255,.10);
    display:grid;
    place-items:center;
    color: rgba(255,255,255,.9);
    font-size: 14px;
  }
  .videoMeta{ line-height: 1.15; }
  .videoTitle{ font-weight: 850; font-size: 13.5px; }
  .videoTime{ font-size: 12px; color: rgba(255,255,255,.60); margin-top: 4px; }

  /* CTA */
  .sectionCTA{
    padding: 110px 0 130px;
    border-top: 1px solid rgba(255,255,255,.06);
  }
  .ctaBtn{ margin-top: 18px; padding: 14px 22px; }

  /* Responsive */
  @media (max-width: 860px){
    .navLinks{ display:none; }
    .twoCol{ grid-template-columns: 60px 1fr; }
    .photoText{ left: 22px; right: 22px; bottom: 22px; }
    .photoBadge{ top: 34%; }
  }
`;
