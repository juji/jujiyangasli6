import Link from "next/link";
import { works } from "@/data/works";
import styles from "./style.module.css";
// import Image from "next/image";

export function Works() {
  return (
    <div className={styles.works} id="works">
      <h2>Works</h2>

      <div className={styles.worksContainer}>
        {works.map((work) => (
          <div key={work.id} className={styles.workItem}>
            <Link
              href={"/work/" + work.id}
              className={styles.workLink}
              aria-label={work.title}
            ></Link>
            <picture>
              <source
                media="(width < 500px)"
                srcSet={work.images[0].small}
                width={work.images[0].dimension.small.width}
                height={work.images[0].dimension.small.height}
              />
              <source
                media="(width < 700px)"
                srcSet={work.images[0].thumbnail}
                width={work.images[0].dimension.thumb.width}
                height={work.images[0].dimension.thumb.height}
              />
              <source
                media="(width >= 700px)"
                srcSet={work.images[0].url}
                width={work.images[0].dimension.image.width}
                height={work.images[0].dimension.image.height}
              />
              <img
                src={work.images[0].url}
                alt={work.title}
                loading="lazy"
                decoding="async"
              />
            </picture>
          </div>
        ))}
      </div>
    </div>
  );
}
