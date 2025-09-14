import styles from "@/app/page.module.css";
// import { FpsChecker } from "@/components/global/fps-checker";
import { BgCanvas } from "@/components/bg-canvas";
// import { GrainyThing } from "@/components/grainy-thing";
import { Hero } from "@/components/sections/hero";
import { Play } from "@/components/sections/play";
import { Works } from "@/components/sections/works";

export default function Home() {
  return (
    <>
      {/* <FpsChecker /> */}
      <BgCanvas />
      {/* <GrainyThing /> */}
      <main className={styles.main}>
        <Hero />
        <Works />
        <Play />
        {/* <p>More content coming soon...</p> */}
      </main>
    </>
  );
}
