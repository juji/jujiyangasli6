import { readFileSync } from "fs";
import { join } from "path";
import ReactMarkdown from "react-markdown";
import rehypeExternalLinks from "rehype-external-links";
import styles from "./page.module.css";

export default function CV2Page() {
  const cvPath = join(process.cwd(), "public", "cv.md");
  const cvContent = readFileSync(cvPath, "utf8");

  return (
    <div className={styles.container}>
      <img
        src="/images/juji-face.jpg"
        alt="Juji Face"
        className={styles.profileImage}
      />
      <div className={styles.cvContent}>
        <ReactMarkdown rehypePlugins={[rehypeExternalLinks]}>
          {cvContent}
        </ReactMarkdown>
      </div>
    </div>
  );
}
