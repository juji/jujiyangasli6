import { AnimDiv } from "@/components/anim";
import { play } from "@/data/play/data.server";
import styles from "./style.module.css";

export function Play() {
  return (
    <AnimDiv out={false}>
      <div className={styles.play} id="play">
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
        <br />
        <p>
          More on{" "}
          <a
            href="https://jujiplay.com"
            target="_blank"
            rel="noreferrer noopener"
          >
            https://jujiplay.com
          </a>
        </p>
      </div>
    </AnimDiv>
  );
}
