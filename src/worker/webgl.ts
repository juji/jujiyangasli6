import type { Ball, PayloadInit, PayloadResize } from "./types";
import { WebGLHandler } from "./WebGLHandler";

// WebGL Handler instance
let webglHandler: WebGLHandler | null = null;

// Initialize handler
function initializeHandler() {
  if (!webglHandler) {
    webglHandler = new WebGLHandler(
      balls,
      box,
      translateY,
      ready,
      notifiedInit,
    );
  }
}

// Global variables that need to be shared between functions
const notifiedInit = false;
let offscreen: OffscreenCanvas | null = null;
let width: number | null = null;
let height: number | null = null;

// [0, 1]
let translateY = 0;
let ready = false;
const radiusRange = [0, 0];
const velocityRange = [-3, 3];

const colors = [
  [237, 76, 103], // '#ED4C67',
  [163, 203, 56], // '#A3CB38',
  [238, 90, 36], // '#EE5A24',
  [234, 32, 39], // '#EA2027',
  [6, 82, 221], // '#0652DD',
  [217, 128, 250], // '#D980FA',
  [153, 128, 250], // '#9980FA',
];

const box = {
  width: 0,
  height: 0,
  x: 0,
  y: 0,
};

const balls: Ball[] = [
  // {"x":1019.5706044767663,"y":438.192647400654,"yInit":438.192647400654,"vx":-1.669198319132604,"vy":0.26029553680936246,"ax":-0.01,"ay":-0.01,"radius":829.4512132162898,"color":[0.9176470588235294,0.12549019607843137,0.15294117647058825],"colorIndex":4,"translateEffect":0},{"x":1270.3983753069715,"y":735.8526446472124,"yInit":735.8526446472124,"vx":2.9683667799690046,"vy":-0.8764287158035868,"ax":-0.01,"ay":-0.01,"radius":842.263273518769,"color":[0.9294117647058824,0.2980392156862745,0.403921568627451],"colorIndex":0,"translateEffect":1},{"x":1047.5046388433148,"y":663.0568886125682,"yInit":663.0568886125682,"vx":0.8791546093249947,"vy":1.0412336965114424,"ax":-0.01,"ay":-0.01,"radius":827.7206605374356,"color":[0.023529411764705882,0.3215686274509804,0.8666666666666667],"colorIndex":5,"translateEffect":2},{"x":837.2380260882485,"y":551.7837787706251,"yInit":551.7837787706251,"vx":-1.0101335351337053,"vy":1.4870102428971474,"ax":0.01,"ay":-0.01,"radius":536.7491560821566,"color":[0.9333333333333333,0.35294117647058826,0.1411764705882353],"colorIndex":2,"translateEffect":3}
];

function randomColor(current: Ball[]) {
  const index = Math.floor(Math.random() * colors.length);
  // check if the index is already used
  if (current.find((ball) => ball.colorIndex === index) !== undefined) {
    return randomColor(current);
  }
  return {
    color: colors[index],
    colorIndex: index,
  };
}

function createBall(
  current: Ball[],
  small?: boolean,
  translateEffect?: number,
): Ball {
  const colorData = randomColor(current);

  const radius =
    Math.random() * (radiusRange[1] - radiusRange[0]) +
    radiusRange[0] * (small ? 0.6 : 1);

  return {
    x: 150,
    y: 150,
    yInit: 150,
    vx:
      Math.random() * (velocityRange[1] - velocityRange[0]) + velocityRange[0],
    vy:
      Math.random() * (velocityRange[1] - velocityRange[0]) + velocityRange[0],
    ax: Math.random() < 0.5 ? 0.01 : -0.01, // acceleration x
    ay: Math.random() < 0.5 ? 0.01 : -0.01, // acceleration y
    radius,
    color: colorData.color.flatMap((v) => v / 255) as [number, number, number],
    colorIndex: colorData.colorIndex,
    translateEffect: translateEffect ?? 0,
  } as Ball;
}

function initializeBalls() {
  for (let i = 0; i < 3; i++) {
    balls.push(createBall(balls, i >= 2, i + 1));
  }

  // Position balls randomly within the box
  for (const ball of balls) {
    ball.x = Math.random() * box.width + box.x;
    ball.y = Math.random() * box.height + box.y;
    ball.yInit = ball.y;
  }
}

function initializeBoxLocation() {
  if (width === null || height === null) return;

  box.width = width * 0.5;
  box.height = height * 0.5;
  box.x = width - width / 2;
  box.y = height - height / 2;
}

function initializeBallRadius() {
  if (!width || !height) return;
  const radius =
    width > height
      ? // If the width is greater than the height, use the height to calculate the radius
        Math.min(width ?? 0, height ?? 0) * 1.1
      : // Otherwise, use the width to calculate the radius
        Math.max(width ?? 0, height ?? 0) * 0.85;
  const radiusMin = radius;
  const radiusMax = radius + 50;
  radiusRange[0] = radiusMin;
  radiusRange[1] = radiusMax;
}

async function init(payload: PayloadInit) {
  offscreen = payload.canvas;
  width = payload.width;
  height = payload.height;

  offscreen.width = width;
  offscreen.height = height;

  initializeBoxLocation();
  initializeBallRadius();
  initializeBalls();

  initializeHandler();
  if (webglHandler) {
    webglHandler.setOffscreen(offscreen);
    webglHandler.setDimensions(width, height);
    await webglHandler.initializeWebGL(offscreen);
    webglHandler.setReady(true);
  }

  ready = true;
}

function resize(payload: PayloadResize) {
  if (!offscreen || !webglHandler) return;

  width = payload.width;
  height = payload.height;

  offscreen.width = width;
  offscreen.height = height;

  webglHandler.setDimensions(width, height);
  webglHandler.resizeWebGL(width, height);

  // Restart animation with new dimensions
  webglHandler.stopAnimation();

  initializeBoxLocation();
  initializeBallRadius();

  webglHandler.draw();
}

function closeOperation() {
  // Stop animation
  if (webglHandler) {
    webglHandler.stopAnimation();
  }
  if (!self.closed) self.close();
}

// Initial Web Worker setup
self.addEventListener("message", (event: MessageEvent) => {
  const { type, payload } = event.data;

  if (type === "init") {
    init(payload);
    return;
  }

  if (type === "resize") {
    resize(payload);
    return;
  }

  if (type === "close") {
    closeOperation();
    return;
  }

  if (type === "start") {
    if (webglHandler) {
      webglHandler.stopAnimation();
      webglHandler.draw();
    }
    return;
  }

  if (type === "stop") {
    if (webglHandler) {
      webglHandler.stopAnimation();
    }
    return;
  }

  if (type === "scroll") {
    translateY = payload.scrollY;
    if (webglHandler) {
      webglHandler.setTranslateY(translateY);
    }
    return;
  }

  if (type === "params") {
    if (webglHandler) {
      webglHandler.updateParams(payload);
    }
    return;
  }
});

// Optional: Handle worker termination
self.addEventListener("close", () => {
  closeOperation();
});

self.postMessage({ type: "init" });
