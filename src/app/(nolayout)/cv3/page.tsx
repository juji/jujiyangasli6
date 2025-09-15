import styles from "./page.module.css";

export default function CV3Page() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerBackground}></div>
        <img
          src="/images/juji-face.jpg"
          alt="Tri Rahmat Gunadi"
          className={styles.profileImage}
        />
        <div>
          <h1 className={styles.name}>Tri Rahmat Gunadi</h1>
          <p className={styles.location}>Tangerang, Indonesia</p>
          <div className={styles.contactLinks}>
            <a
              href="https://jujiyangasli.com"
              className={styles.contactLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              jujiyangasli.com
            </a>
            <a
              href="mailto:him@jujiyangasli.com"
              className={styles.contactLink}
            >
              him@jujiyangasli.com
            </a>
            <a
              href="https://github.com/juji"
              className={styles.contactLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/juji
            </a>
          </div>
        </div>
      </div>

      <div className={styles.bio}>
        Full Stack Developer with 8+ years of experience building scalable web
        applications using React, Next.js, Node.js, and TypeScript. Passionate
        about creating exceptional user experiences and implementing performant,
        clean code.
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Technical Skills</h2>
        <div className={styles.skillsContainer}>
          <div className={styles.skillGroup}>
            <h3 className={styles.skillGroupTitle}>Frontend</h3>
            <ul className={styles.skillsList}>
              <li className={styles.skillItem}>JavaScript/TypeScript</li>
              <li className={styles.skillItem}>React.js</li>
              <li className={styles.skillItem}>Next.js</li>
              <li className={styles.skillItem}>Svelte</li>
              <li className={styles.skillItem}>HTML5/CSS3</li>
              <li className={styles.skillItem}>TailwindCSS</li>
              <li className={styles.skillItem}>Responsive Design</li>
              <li className={styles.skillItem}>Redux</li>
            </ul>
          </div>

          <div className={styles.skillGroup}>
            <h3 className={styles.skillGroupTitle}>Backend</h3>
            <ul className={styles.skillsList}>
              <li className={styles.skillItem}>Node.js</li>
              <li className={styles.skillItem}>Express</li>
              <li className={styles.skillItem}>MongoDB</li>
              <li className={styles.skillItem}>PostgreSQL</li>
              <li className={styles.skillItem}>GraphQL</li>
              <li className={styles.skillItem}>RESTful APIs</li>
              <li className={styles.skillItem}>AWS</li>
            </ul>
          </div>

          <div className={styles.skillGroup}>
            <h3 className={styles.skillGroupTitle}>Tools & Methods</h3>
            <ul className={styles.skillsList}>
              <li className={styles.skillItem}>Git/GitHub</li>
              <li className={styles.skillItem}>CI/CD</li>
              <li className={styles.skillItem}>Docker</li>
              <li className={styles.skillItem}>Jest/Testing Library</li>
              <li className={styles.skillItem}>Agile/Scrum</li>
              <li className={styles.skillItem}>Performance Optimization</li>
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Experience</h2>

        <div className={styles.experienceItem}>
          <h3 className={styles.experienceTitle}>jujiyangasli.com</h3>
          <p className={styles.experienceDuration}>2017 - Present</p>
          <div className={styles.experienceDescription}>
            <p>
              Creating web applications as a Freelance or monthly retainer.
              Notable projects were:
            </p>

            <div className={styles.projectContainer}>
              <div className={styles.project}>
                <h4 className={styles.projectTitle}>WheelEasy</h4>
                <p className={styles.projectDuration}>2019 - 2025</p>
                <p>
                  <a
                    href="https://wheeleasy.org"
                    className={styles.projectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    wheeleasy.org
                  </a>{" "}
                  is an access information web app for people with mobility
                  needs, their families and friends.
                </p>
                <ul className={styles.bulletList}>
                  <li>
                    Convert the site from SPA (Created using Create React App)
                    into an SEO-Friendly site using Next.js and Material-UI.
                  </li>
                  <li>
                    Integrate{" "}
                    <a
                      href="https://algolia.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Algolia
                    </a>{" "}
                    for faster search result in the `explore` page.
                  </li>
                  <li>
                    Migrate DNS entries to{" "}
                    <a
                      href="https://cloudflare.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Cloudflare
                    </a>
                    . Added a few security settings to prevent a generic DOS
                    attack.
                  </li>
                  <li>
                    Use a self-hosted{" "}
                    <a
                      href="https://www.min.io"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      minio
                    </a>{" "}
                    to separate load from image uploads and serving.
                  </li>
                  <li>
                    Convert images to webp on client-side (pre-upload) for
                    faster uploads and lower server-space requirements.
                  </li>
                  <li>
                    Implement role-based user auth mechanism and Access Controls
                    to the site.
                  </li>
                  <li>
                    Update/Created Admin Sections to manage users, data, and
                    events.
                  </li>
                  <li>
                    Created mechanisms for Volunteers to be tracked based on
                    participation in place-data collection.
                  </li>
                  <li>
                    Created Hotspot sections as a way to group places based on
                    custom polygonal-area, and the admin interface to manage
                    them.
                  </li>
                  <li>
                    Improve uploading mechanism to prevent long waiting time, by
                    implementing eager-upload.
                  </li>
                </ul>
              </div>

              <div className={styles.project}>
                <h4 className={styles.projectTitle}>Amber Video</h4>
                <p className={styles.projectDuration}>2017</p>
                <p>
                  <a
                    href="https://www.linkedin.com/company/ambervideo"
                    className={styles.projectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ambervideo
                  </a>{" "}
                  is a platform to detect fake videos.
                </p>
                <ul className={styles.bulletList}>
                  <li>
                    Created the UI to detect the difference between edited and
                    Original video, with visual cues depicting the difference in
                    the frame.
                  </li>
                  <li>Manage Auth using Auth0 with RBAC.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.experienceItem}>
          <h3 className={styles.experienceTitle}>bridestory.com</h3>
          <p className={styles.experienceDuration}>2014 - 2017</p>
          <div className={styles.experienceDescription}>
            <p>Internal-Application developer & Data engineer</p>
            <p>
              Responsible in developing and maintaining internal applications
              like HR- employee application, Investor and Management Report App,
              and Bridestory's career page.
            </p>
            <p>
              As a Data Engineer, I develop and maintain data warehouse,
              creating data pipeline to support operational aspects in finance,
              e-mail marketing, sales.
            </p>
          </div>
        </div>

        <div className={styles.experienceItem}>
          <h3 className={styles.experienceTitle}>VISIOUS Graphic Studio</h3>
          <p className={styles.experienceDuration}>2011-2014</p>
          <div className={styles.experienceDescription}>
            <p>Responsible for Web Development Projects.</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Education</h2>

        <div className={styles.education}>
          <h3 className={styles.educationTitle}>University Of Indonesia</h3>
          <p className={styles.educationDuration}>2011-2015</p>
          <p className={styles.educationDegree}>
            Master of Information Technology
          </p>
          <p>Faculty of Computer Science</p>
          <a
            href="https://cs.ui.ac.id/en/magister-teknologi-informasi/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.projectLink}
          >
            cs.ui.ac.id/en/magister-teknologi-informati/
          </a>
        </div>

        <div className={styles.education}>
          <h3 className={styles.educationTitle}>University Of Indonesia</h3>
          <p className={styles.educationDuration}>2003-2009</p>
          <p className={styles.educationDegree}>
            Undergraduate Program in Accounting
          </p>
          <p>Faculty of Economics</p>
          <a
            href="https://feb.ui.ac.id/en/accounting/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.projectLink}
          >
            feb.ui.ac.id/en/accounting/
          </a>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Last Updated: September 2025</p>
      </footer>
    </div>
  );
}
