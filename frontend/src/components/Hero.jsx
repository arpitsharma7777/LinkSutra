

function Hero() {
  return (
    <section className="hero">
      <div className="hero-left">
        <h1>
          Own your <br />
          link page.
        </h1>

        <p>
          No tracking. No lock-in. Open-source, privacy-first,
          self-hostable link-in-bio platform for developers.
        </p>

        
      </div>

      <div className="hero-right">
        <div className="card">
          <div className="profile">
           
            <h1>Alex Rivet</h1>
            <p>@alex_dev</p>
          </div>

          <div className="links">
            <button>My Github</button>
            <button>Latest Project</button>
            <button>Read Blog</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;