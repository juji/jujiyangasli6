import styles from "@/app/page.module.css";
import { BgCanvas } from "@/components/bg-canvas";
// import { FpsChecker } from "@/components/global/fps-checker";
import { Hero } from "@/components/sections/hero";
import { Works } from "@/components/sections/works";

export default function Home() {
  return (
    <>
      <BgCanvas />
      {/* <FpsChecker /> */}
      <main className={styles.main}>
        <Hero />
        <Works />
        {/* <p>More content coming soon...</p> */}
      </main>
    </>
  );
}
