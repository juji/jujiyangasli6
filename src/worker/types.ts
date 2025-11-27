export type PayloadResize = {
  width: number;
  height: number;
};

export type PayloadInit = PayloadResize & {
  canvas: OffscreenCanvas;
};

export type Ball = {
  x: number;
  y: number;
  yInit: number;
  xInit: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
  radius: number;
  translateEffect: number;
  color: [number, number, number];
  colorIndex?: number;
};
