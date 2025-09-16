import styles from "./page.module.css";

export default function CV3Page() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
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
                    into SEO-Friendly pages using Next.js and Material-UI.
                  </li>
                  <li>
                    Integrate{" "}
                    <a
                      href="https://algolia.com"
                      className={styles.projectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Algolia
                    </a>{" "}
                    for faster search result in the `explore` page,
                    significantly reducing server load by offloading complex
                    search operations to Algolia's dedicated infrastructure.
                  </li>
                  <li>
                    Enhanced site security and performance by migrating DNS to{" "}
                    <a
                      href="https://cloudflare.com"
                      className={styles.projectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Cloudflare
                    </a>
                    , implementing WAF rules to protect against DDoS attacks
                    while improving global content delivery.
                  </li>
                  <li>
                    Designed scalable media infrastructure using self-hosted{" "}
                    <a
                      href="https://www.min.io"
                      className={styles.projectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      MinIO
                    </a>{" "}
                    as an S3-compatible object storage solution, decoupling
                    media handling from the application server to improve
                    performance and reliability while enabling horizontal
                    scaling.
                  </li>
                  <li>
                    Engineered client-side image optimization using the WebP
                    format with browser-native compression APIs, reducing
                    bandwidth usage by up to 70%, decreasing storage costs, and
                    improving page load times across the application.
                  </li>
                  <li>
                    Implement role-based user auth mechanism and Access Controls
                    for the site.
                  </li>
                  <li>
                    Update/Created Admin Sections to manage users, data, and
                    events. Empowering non-technical staff to efficiently manage
                    user accounts, content moderation, and event management
                    without developer intervention.
                  </li>
                  <li>
                    Created mechanisms for Volunteers to be tracked based on
                    participation in data collection, by assigning points as
                    rewards for successful contributions.
                  </li>
                  <li>
                    Created Hotspot sections as a way to group places based on
                    custom polygonal-area, and the admin interface to manage
                    them.
                  </li>
                  <li>
                    Enhanced the user experience by implementing an asynchronous
                    eager-upload system with progress tracking, reducing
                    perceived waiting times by 90%.
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
            <br />
            <p>
              Responsible in developing and maintaining internal applications
              like HR-employee application, Investor and Management Report App,
              and Bridestory's career page.
            </p>
            <br />
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

      <p className={styles.lastUpdated}>Last Updated: September 2025</p>
    </div>
  );
}
