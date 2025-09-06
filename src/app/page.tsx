import styles from "@/app/page.module.css";
import { BgCanvas } from "@/components/bg-canvas";
import { Hero } from "@/components/sections/hero";

export default function Home() {
  return (
    <>
      <BgCanvas />
      <main className={styles.main}>
        <Hero />
      </main>
    </>
  );
}
