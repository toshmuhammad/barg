import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Barg bosh sahifasi">
          <span className="brand-mark" aria-hidden="true">
            <span />
          </span>
          <span>Barg</span>
        </Link>

        <nav className="main-nav" aria-label="Asosiy navigatsiya">
          <Link className="nav-link active" to="/">
            Bosh sahifa
          </Link>
          <a className="nav-link" href="#imkoniyatlar">
            Imkoniyatlar
          </a>
        </nav>

        <div className="header-actions">
          <Link className="text-link" to="/login">
            Kirish
          </Link>
          <Link className="button button-small" to="/register">
            Ro‘yxatdan o‘tish
          </Link>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Hammasi bir joyda</p>
            <h1>Kuningizni yengilroq boshqaring.</h1>
            <p className="hero-text">
              Muhim ishlarni rejalashtiring, tartibni saqlang va
              maqsadlaringiz tomon xotirjam harakat qiling.
            </p>
            <div className="hero-actions">
              <Link className="button" to="/register">
                Bepul boshlash
              </Link>
              <a className="inline-link" href="#imkoniyatlar">
                Batafsil ko‘rish
              </a>
            </div>
          </div>

          <div className="leaf-scene" aria-hidden="true">
            <div className="sun-disc" />
            <div className="leaf leaf-one" />
            <div className="leaf leaf-two" />
            <div className="leaf leaf-three" />
            <div className="leaf leaf-four" />
            <div className="scene-card">
              <span className="scene-card-line line-short" />
              <span className="scene-card-line" />
              <span className="scene-card-line" />
              <span className="scene-card-pill" />
            </div>
          </div>
        </section>

        <section
          className="features"
          id="imkoniyatlar"
          aria-labelledby="features-title"
        >
          <div className="section-heading">
            <p className="eyebrow">Imkoniyatlar</p>
            <h2 id="features-title">Tartib uchun kerakli asoslar</h2>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <span className="feature-number">01</span>
              <h3>Oddiy reja</h3>
              <p>
                Kundalik vazifalarni bir qarashda ko‘rinadigan qilib
                joylashtiring.
              </p>
            </article>
            <article className="feature-card featured">
              <span className="feature-number">02</span>
              <h3>Toza tartib</h3>
              <p>
                Muhim ishlarni ajrating va e’tiborni ayni vazifaga qarating.
              </p>
            </article>
            <article className="feature-card">
              <span className="feature-number">03</span>
              <h3>Barqaror odat</h3>
              <p>
                Kichik qadamlarni muntazam takrorlab, natijani kuzatib boring.
              </p>
            </article>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <Link className="brand brand-footer" to="/">
          <span className="brand-mark" aria-hidden="true">
            <span />
          </span>
          <span>Barg</span>
        </Link>
        <p>Rejalaringiz uchun sokin makon.</p>
      </footer>
    </div>
  );
}

export default Home;