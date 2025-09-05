import { BgCanvas } from "@/components/bg-canvas";

export default function Home() {
  return (
    <>
      <BgCanvas />
      <div style={{ position: "relative", zIndex: 1, height: "300vh" }}>
        <p>first</p>
        <p>last</p>
      </div>
    </>
  );
}
