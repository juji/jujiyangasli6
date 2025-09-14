"use client";
import styles from "./page.module.css";
import "./print.css";

// Component for print settings
const PrintSettings = () => {
  return (
    <style jsx global>{`
        @page {
          margin: 0;
          size: auto;
        }
        
        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>
  );
};

export default function CV() {
  const handlePrint = () => {
    // Custom print settings
    const originalTitle = document.title;
    document.title = "CV - Tri Rahmat Gunadi";

    window.print();

    // Restore title
    setTimeout(() => {
      document.title = originalTitle;
    }, 100);
  };

  return (
    <main className={styles.main}>
      <PrintSettings />
      <div className={styles.cv}>
        {/* Header Section */}
        <header className={styles.header}>
          <div className={styles.headerNamePrint}>
            <h1>Tri Rahmat Gunadi</h1>
            <button
              type="button"
              onClick={handlePrint}
              className={styles.printButton}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <title>Print CV</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"
                />
              </svg>
              Print CV
            </button>
          </div>
          <div className={styles.contactInfo}>
            <div>jujiyangasli@gmail.com</div>
            <div>Tangerang, ID</div>
            <div>
              <a
                className={styles.linkItem}
                href="https://github.com/juji"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/juji
              </a>
            </div>
            <div>
              <a
                className={styles.linkItem}
                href="https://www.linkedin.com/in/jujiyangasli/"
                target="_blank"
                rel="noopener noreferrer"
              >
                linkedin.com/in/jujiyangasli
              </a>
            </div>
          </div>
          <div className={styles.summary}>
            Full Stack Developer with 8+ years of experience building scalable
            web applications using React, Next.js, Node.js, and TypeScript.
            Passionate about creating exceptional user experiences and
            implementing performant, clean code.
          </div>
        </header>

        {/* Experience Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Professional Experience</h2>

          <div className={styles.job}>
            <div className={styles.jobHeader}>
              <h3>Senior Frontend Engineer</h3>
              <div className={styles.jobInfo}>
                <span className={styles.company}>Tech Innovations Inc.</span>
                <span className={styles.location}>San Francisco, CA</span>
                <span className={styles.duration}>Jan 2023 - Present</span>
              </div>
            </div>
            <ul className={styles.jobResponsibilities}>
              <li>
                Lead a team of 5 developers in rebuilding the company's flagship
                product using Next.js, TypeScript, and TailwindCSS
              </li>
              <li>
                Improved site performance by 65% through code splitting, lazy
                loading, and image optimization
              </li>
              <li>
                Implemented CI/CD pipeline using GitHub Actions, reducing
                deployment time by 45%
              </li>
              <li>
                Collaborated with UX team to implement responsive design system
                used across multiple products
              </li>
              <li>
                Mentored junior developers through code reviews and pair
                programming sessions
              </li>
            </ul>
          </div>

          <div className={styles.job}>
            <div className={styles.jobHeader}>
              <h3>Frontend Developer</h3>
              <div className={styles.jobInfo}>
                <span className={styles.company}>Digital Solutions Ltd.</span>
                <span className={styles.location}>Boston, MA</span>
                <span className={styles.duration}>Mar 2020 - Dec 2022</span>
              </div>
            </div>
            <ul className={styles.jobResponsibilities}>
              <li>
                Developed and maintained multiple React applications for
                enterprise clients
              </li>
              <li>
                Built reusable component library that reduced development time
                by 30%
              </li>
              <li>
                Integrated REST and GraphQL APIs for data fetching and state
                management
              </li>
              <li>
                Implemented unit and integration tests using Jest and React
                Testing Library
              </li>
              <li>
                Optimized application state management using Redux and Context
                API
              </li>
            </ul>
          </div>

          <div className={styles.job}>
            <div className={styles.jobHeader}>
              <h3>Web Developer</h3>
              <div className={styles.jobInfo}>
                <span className={styles.company}>CreativeWeb Studios</span>
                <span className={styles.location}>Remote</span>
                <span className={styles.duration}>Jun 2017 - Feb 2020</span>
              </div>
            </div>
            <ul className={styles.jobResponsibilities}>
              <li>
                Developed responsive websites for SMB clients using JavaScript,
                HTML5, and CSS3
              </li>
              <li>
                Built backend services using Node.js, Express, and MongoDB
              </li>
              <li>
                Implemented e-commerce functionality with Stripe payment
                integration
              </li>
              <li>
                Improved website accessibility to meet WCAG 2.1 AA standards
              </li>
            </ul>
          </div>
        </section>

        {/* Skills Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Technical Skills</h2>
          <div className={styles.skillsContainer}>
            <div className={styles.skillCategory}>
              <h3>Frontend</h3>
              <ul className={styles.skillsList}>
                <li>JavaScript/TypeScript</li>
                <li>React.js</li>
                <li>Next.js</li>
                <li>Svelte</li>
                <li>HTML5/CSS3</li>
                <li>TailwindCSS</li>
                <li>Responsive Design</li>
                <li>Redux</li>
              </ul>
            </div>

            <div className={styles.skillCategory}>
              <h3>Backend</h3>
              <ul className={styles.skillsList}>
                <li>Node.js</li>
                <li>Express</li>
                <li>MongoDB</li>
                <li>PostgreSQL</li>
                <li>GraphQL</li>
                <li>RESTful APIs</li>
                <li>AWS</li>
              </ul>
            </div>

            <div className={styles.skillCategory}>
              <h3>Tools & Methods</h3>
              <ul className={styles.skillsList}>
                <li>Git/GitHub</li>
                <li>CI/CD</li>
                <li>Docker</li>
                <li>Jest/Testing Library</li>
                <li>Agile/Scrum</li>
                <li>Performance Optimization</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Education</h2>
          <div className={styles.education}>
            <h3>Bachelor of Science in Computer Science</h3>
            <div className={styles.educationInfo}>
              <span className={styles.institution}>
                University of Technology
              </span>
              <span className={styles.duration}>2013 - 2017</span>
            </div>
            <p>Graduated with Honors, GPA 3.8/4.0</p>
            <p>
              Relevant coursework: Data Structures, Algorithms, Web Development,
              Database Systems
            </p>
          </div>
        </section>

        {/* Projects Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Notable Projects</h2>
          <div className={styles.project}>
            <h3>E-commerce Platform Redesign</h3>
            <p>
              Led the complete redesign and rebuild of a high-traffic e-commerce
              platform using Next.js, resulting in a 40% increase in conversion
              rate and 25% reduction in bounce rate.
            </p>
            <div className={styles.projectTech}>
              <span>Next.js</span>
              <span>TypeScript</span>
              <span>Stripe</span>
              <span>MongoDB</span>
            </div>
          </div>
          <div className={styles.project}>
            <h3>Real-time Collaboration Tool</h3>
            <p>
              Developed a real-time document collaboration tool with live
              editing and commenting features using React, Socket.io, and
              Node.js.
            </p>
            <div className={styles.projectTech}>
              <span>React</span>
              <span>Socket.io</span>
              <span>Express</span>
              <span>Redis</span>
            </div>
          </div>
        </section>

        {/* Certifications Section */}
        {/* <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Certifications</h2>
          <div className={styles.certifications}>
            <div className={styles.certification}>
              <h3>AWS Certified Developer - Associate</h3>
              <div>Amazon Web Services, 2022</div>
            </div>
            <div className={styles.certification}>
              <h3>Professional Scrum Master I</h3>
              <div>Scrum.org, 2021</div>
            </div>
          </div>
        </section> */}

        {/* Languages Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Languages</h2>
          <div className={styles.languages}>
            <div className={styles.language}>
              <span className={styles.languageName}>Indonesian</span>
              <span className={styles.languageLevel}>Native</span>
            </div>
            <div className={styles.language}>
              <span className={styles.languageName}>English</span>
              <span className={styles.languageLevel}>Conversational</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
