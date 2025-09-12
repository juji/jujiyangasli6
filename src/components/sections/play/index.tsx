import { play } from "@/data/play/data.server";
import styles from "./style.module.css";

export function Play() {
  return (
    <div className={styles.play}>
      <h2>Play</h2>
      <div className={styles.playGrid}>
        {play.map((item) => (
          <a
            key={item.id}
            className={styles.playItem}
            href={item.url}
            target="_blank"
            rel="noreferrer noopener"
          >
            <img
              src={item.image}
              alt={item.title}
              width={item.width}
              height={item.height}
              loading="lazy"
              decoding="async"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
