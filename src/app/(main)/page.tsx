import { BgCanvas } from "@/components/bg-canvas";
// import { FpsChecker } from "@/components/global/fps-checker";
// import { GrainyThing } from "@/components/grainy-thing";
import { Hero } from "@/components/sections/hero";
import { Play } from "@/components/sections/play";
import { Techs } from "@/components/sections/techs";
import { Works } from "@/components/sections/works";
import styles from "./page.module.css";

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
        <Techs />
      </main>
    </>
  );
}
