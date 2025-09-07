export {};

type PayloadResize = {
  width: number;
  height: number;
};

type PayloadInit = PayloadResize & {
  canvas: OffscreenCanvas;
};

type Ball = {
  x: number;
  y: number;
  yInit: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
  radius: number;
  translateEffect: number;
  color: [number, number, number];
  colorIndex?: number;
};

let notifiedInit = false;
let offscreen: OffscreenCanvas | null = null;
let width: number | null = null;
let height: number | null = null;
let gl: WebGL2RenderingContext | null = null;
let program: WebGLProgram | null = null;
let vertexBuffer: WebGLBuffer | null = null;
let instanceBuffer: WebGLBuffer | null = null;
let indexBuffer: WebGLBuffer | null = null;
let animationId: number | null = null;
let u_screen_size: WebGLUniformLocation | null = null;
let u_draw_box: WebGLUniformLocation | null = null;
let u_draw_canvas_outline: WebGLUniformLocation | null = null;
let u_canvas_size: WebGLUniformLocation | null = null;
let u_box_size: WebGLUniformLocation | null = null;
let u_outline_color: WebGLUniformLocation | null = null;
let u_outline_width: WebGLUniformLocation | null = null;
let u_outline_opacity: WebGLUniformLocation | null = null;
let u_white_balance_temp: WebGLUniformLocation | null = null;
let u_white_balance_tint: WebGLUniformLocation | null = null;
let u_contrast: WebGLUniformLocation | null = null;
let u_brightness: WebGLUniformLocation | null = null;
let u_gamma: WebGLUniformLocation | null = null;
let u_saturation: WebGLUniformLocation | null = null;
let u_vibrance: WebGLUniformLocation | null = null;
let u_lift: WebGLUniformLocation | null = null;
let u_gain: WebGLUniformLocation | null = null;
let u_exposure: WebGLUniformLocation | null = null;
let u_clarity: WebGLUniformLocation | null = null;
let a_position: number;
let a_instance_pos: number;
let a_radius: number;
let a_color: number;

// [0, 1]
let translateY = 0;
let ready = false;
const maxVelocity = 3;
const radiusRange = [0, 0];

// Image adjustment controls
let contrast = 1.0;
let brightness = 1.0;
let gamma = 1.0;

// White balance controls (0.0 = neutral, range: -1.0 to 1.0)
let whiteBalanceTemp = 0.0; // Temperature: negative = cooler, positive = warmer
let whiteBalanceTint = 0.0; // Tint: negative = green, positive = magenta

// Advanced color correction controls
let saturation = 1.0; // 0.0 = grayscale, 1.0 = normal, >1.0 = oversaturated
let vibrance = 0.0; // Smart saturation that preserves skin tones (-1.0 to 1.0)
let lift = 0.0; // Shadow adjustment (-1.0 to 1.0)
let gain = 1.0; // Highlight adjustment (0.0 to 2.0)
let exposure = 0.0; // Overall exposure adjustment (-4.0 to 4.0)
let clarity = 0.0; // Local contrast enhancement (-1.0 to 1.0)

const turnAccelDelta = 0.09;
const blurWidth = 1200;
const velocityRange = [-3, 3];
const enableBlending = true;
const drawBox = false;
const outline = {
  color: [23, 23, 23],
  width: 5,
  opacity: 1, // 0 - 1
};

const colors = [
  [237, 76, 103], // '#ED4C67',
  [163, 203, 56], // '#A3CB38',
  [238, 90, 36], // '#EE5A24',
  [0, 148, 50], // '#009432',
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
  for (let i = 0; i < 7; i++) {
    balls.push(createBall(balls, i >= 3, i + 1));
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
      ? Math.min(width ?? 0, height ?? 0)
      : Math.max(width ?? 0, height ?? 0) * 0.85;
  const radiusMin = radius;
  const radiusMax = radius + 50;
  radiusRange[0] = radiusMin;
  radiusRange[1] = radiusMax;
}

function update() {
  // Update all balls within box boundaries
  for (const ball of balls) {
    if (ball.x <= box.x) {
      ball.ax += turnAccelDelta;
    }

    if (ball.x > box.x + box.width) {
      ball.ax -= turnAccelDelta;
    }

    if (ball.yInit >= box.y + box.height) {
      ball.ay -= turnAccelDelta;
    }

    if (ball.yInit < box.y) {
      ball.ay += turnAccelDelta;
    }

    let speedX = ball.vx + ball.ax;
    let speedY = ball.vy + ball.ay;
    if (Math.abs(speedX) > maxVelocity) {
      speedX = (speedX > 0 ? 1 : -1) * maxVelocity;
    }
    if (Math.abs(speedY) > maxVelocity) {
      speedY = (speedY > 0 ? 1 : -1) * maxVelocity;
    }

    // Update position
    ball.x += speedX;
    ball.yInit += speedY;
    ball.y = ball.yInit - ball.translateEffect * translateY * 500;
  }
}

async function createPipeline() {
  if (!gl) return;

  // Vertex shader for drawing circles and rectangles
  const vertexShaderCode = `
    attribute vec2 a_position;
    attribute vec2 a_instance_pos;
    attribute float a_radius;
    attribute vec3 a_color;
    uniform vec2 u_screen_size;
    uniform bool u_draw_box;
    uniform bool u_draw_canvas_outline;
    uniform mediump vec2 u_canvas_size;
    uniform mediump vec2 u_box_size;
    varying vec2 v_uv;
    varying float v_radius;
    varying vec3 v_color;

    void main() {

      vec2 pos = a_position;
      if (a_radius == 0.0) {
        if (u_draw_canvas_outline) {
          // Scale quad to canvas size minus 4 pixels to ensure outline is within bounds
          pos *= (u_canvas_size - vec2(4.0)) / 2.0;
        } else {
          // Scale quad to box size for box drawing
          pos *= u_box_size;
        }
      } else {
        // Scale quad to ball radius
        pos *= a_radius;
      }

      // Convert pixel coordinates to clip space (-1 to 1)
      vec2 clipPos = (pos + a_instance_pos) / u_screen_size * 2.0 - vec2(1.0, 1.0);
      gl_Position = vec4(clipPos.x, -clipPos.y, 0.0, 1.0); // Flip Y for canvas coordinates
      v_uv = pos; // Use scaled position for UV
      v_radius = a_radius;
      v_color = a_color;
    }
  `;

  // Fragment shader for drawing circles (balls) and rectangles (box/canvas outline)
  const fragmentShaderCode = `
    precision mediump float;
    uniform bool u_draw_box;
    uniform bool u_draw_canvas_outline;
    uniform vec2 u_canvas_size;
    uniform mediump vec2 u_box_size;
    uniform vec3 u_outline_color;
    uniform float u_outline_width;
    uniform float u_outline_opacity;
    uniform float u_white_balance_temp;
    uniform float u_white_balance_tint;
    uniform float u_contrast;
    uniform float u_brightness;
    uniform float u_gamma;
    uniform float u_saturation;
    uniform float u_vibrance;
    uniform float u_lift;
    uniform float u_gain;
    uniform float u_exposure;
    uniform float u_clarity;
    varying vec2 v_uv;
    varying float v_radius;
    varying vec3 v_color;

    void main() {
      if (v_radius > 0.0) {
        // Draw circle for balls with blur
        float dist = length(v_uv);
        float blurWidth = ${blurWidth}.0; // Adjust this value to control blur intensity
        float alpha = 1.0 - smoothstep(v_radius - blurWidth, v_radius, dist);
        if (alpha <= 0.0) {
          discard;
        }
        vec4 color = vec4(v_color, alpha);

        // Apply white balance adjustments
        float r = color.r;
        float g = color.g;
        float b = color.b;

        // Temperature adjustment (warmer/cooler)
        // Positive temp = warmer (more red/yellow), negative = cooler (more blue)
        r += u_white_balance_temp * 0.1;
        b -= u_white_balance_temp * 0.1;

        // Tint adjustment (green/magenta)
        // Positive tint = magenta (more red/blue), negative = green (more green)
        r += u_white_balance_tint * 0.05;
        b += u_white_balance_tint * 0.05;
        g -= u_white_balance_tint * 0.1;

        // Clamp values to valid range
        r = clamp(r, 0.0, 1.0);
        g = clamp(g, 0.0, 1.0);
        b = clamp(b, 0.0, 1.0);

        vec4 balancedColor = vec4(r, g, b, color.a);

        // Apply exposure
        vec4 exposedColor = vec4(
          balancedColor.r * pow(2.0, u_exposure),
          balancedColor.g * pow(2.0, u_exposure),
          balancedColor.b * pow(2.0, u_exposure),
          balancedColor.a
        );

        // Apply lift/gain (shadows/highlights adjustment)
        vec4 liftGainColor = vec4(
          exposedColor.r * (1.0 - u_lift) + u_gain * u_lift,
          exposedColor.g * (1.0 - u_lift) + u_gain * u_lift,
          exposedColor.b * (1.0 - u_lift) + u_gain * u_lift,
          exposedColor.a
        );

        // Apply saturation
        float luminance = dot(liftGainColor.rgb, vec3(0.299, 0.587, 0.114));
        vec4 saturatedColor = vec4(
          mix(vec3(luminance), liftGainColor.rgb, u_saturation),
          liftGainColor.a
        );

        // Apply vibrance (smart saturation that preserves skin tones)
        float maxColor = max(max(saturatedColor.r, saturatedColor.g), saturatedColor.b);
        float minColor = min(min(saturatedColor.r, saturatedColor.g), saturatedColor.b);
        float colorSaturation = maxColor - minColor;
        float vibranceAdjustment = u_vibrance * (1.0 - colorSaturation);
        vec4 vibrancedColor = vec4(
          saturatedColor.r + vibranceAdjustment * (saturatedColor.r - luminance),
          saturatedColor.g + vibranceAdjustment * (saturatedColor.g - luminance),
          saturatedColor.b + vibranceAdjustment * (saturatedColor.b - luminance),
          saturatedColor.a
        );

        // Apply clarity (local contrast enhancement)
        vec4 clarityColor = vibrancedColor;
        if (u_clarity != 0.0) {
          // Simple clarity approximation using midtone contrast
          float midtone = dot(clarityColor.rgb, vec3(0.333));
          clarityColor.rgb = mix(clarityColor.rgb, clarityColor.rgb * (1.0 + u_clarity * (midtone - 0.5) * 2.0), abs(u_clarity));
        }

        // Apply brightness, gamma, and contrast
        vec4 newColor = vec4(
          pow(clarityColor.r * u_brightness, u_gamma) * u_contrast,
          pow(clarityColor.g * u_brightness, u_gamma) * u_contrast,
          pow(clarityColor.b * u_brightness, u_gamma) * u_contrast,
          clarityColor.a
        );

        gl_FragColor = newColor;
      } else {
        // Draw rectangle outline for box or canvas
        if (u_draw_canvas_outline) {
          float halfWidth = u_canvas_size.x / 2.0;
          float halfHeight = u_canvas_size.y / 2.0;
          float thickness = u_outline_width;
          if (abs(v_uv.x) >= halfWidth - thickness - 1.0 ||
              abs(v_uv.y) >= halfHeight - thickness - 1.0) {
            vec3 color = u_outline_color / 255.0;
            gl_FragColor = vec4(color, u_outline_opacity);
          } else {
            discard;
          }
        } else if (u_draw_box) {
          float halfWidth = u_box_size.x;
          float halfHeight = u_box_size.y;
          float thickness = 2.0; // Pixel thickness
          if (abs(v_uv.x) >= halfWidth - thickness ||
              abs(v_uv.y) >= halfHeight - thickness) {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); // White color for box outline
          } else {
            discard;
          }
        } else {
          discard;
        }
      }
    }
  `;

  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  if (!vertexShader) return;
  gl.shaderSource(vertexShader, vertexShaderCode);
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error(
      "Vertex shader compile error:",
      gl.getShaderInfoLog(vertexShader),
    );
    return;
  }

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  if (!fragmentShader) return;
  gl.shaderSource(fragmentShader, fragmentShaderCode);
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error(
      "Fragment shader compile error:",
      gl.getShaderInfoLog(fragmentShader),
    );
    return;
  }

  program = gl.createProgram();
  if (!program) return;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program));
    return;
  }

  // Get attribute locations
  a_position = gl.getAttribLocation(program, "a_position");
  a_instance_pos = gl.getAttribLocation(program, "a_instance_pos");
  a_radius = gl.getAttribLocation(program, "a_radius");
  a_color = gl.getAttribLocation(program, "a_color");
  u_screen_size = gl.getUniformLocation(program, "u_screen_size");
  u_draw_box = gl.getUniformLocation(program, "u_draw_box");
  u_draw_canvas_outline = gl.getUniformLocation(
    program,
    "u_draw_canvas_outline",
  );
  u_canvas_size = gl.getUniformLocation(program, "u_canvas_size");
  u_box_size = gl.getUniformLocation(program, "u_box_size");
  u_outline_color = gl.getUniformLocation(program, "u_outline_color");
  u_outline_width = gl.getUniformLocation(program, "u_outline_width");
  u_outline_opacity = gl.getUniformLocation(program, "u_outline_opacity");
  u_white_balance_temp = gl.getUniformLocation(program, "u_white_balance_temp");
  u_white_balance_tint = gl.getUniformLocation(program, "u_white_balance_tint");
  u_contrast = gl.getUniformLocation(program, "u_contrast");
  u_brightness = gl.getUniformLocation(program, "u_brightness");
  u_gamma = gl.getUniformLocation(program, "u_gamma");
  u_saturation = gl.getUniformLocation(program, "u_saturation");
  u_vibrance = gl.getUniformLocation(program, "u_vibrance");
  u_lift = gl.getUniformLocation(program, "u_lift");
  u_gain = gl.getUniformLocation(program, "u_gain");
  u_exposure = gl.getUniformLocation(program, "u_exposure");
  u_clarity = gl.getUniformLocation(program, "u_clarity");

  // Create vertex buffer for quad
  const vertices = new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]);
  vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  // Create index buffer for quad
  const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);
  indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
}

function draw() {
  if (!ready) {
    // Continue animation
    animationId = requestAnimationFrame(draw);
    return;
  }

  if (
    !offscreen ||
    !gl ||
    !program ||
    !vertexBuffer ||
    !instanceBuffer ||
    !indexBuffer
  ) {
    return;
  }

  // Update box position
  update();

  // Update instance buffer with all ball data (position + radius + color)
  const instanceData = new Float32Array(
    balls.flatMap((ball) => [ball.x, ball.y, ball.radius, ...ball.color]),
  );
  gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, instanceData);

  // Set viewport to match canvas size
  if (width !== null && height !== null) {
    gl.viewport(0, 0, width, height);
  }

  // Clear the canvas
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Use the program
  // biome-ignore lint/correctness/useHookAtTopLevel: This is not a React component
  gl.useProgram(program);

  // Set uniform
  if (u_screen_size && width !== null && height !== null) {
    gl.uniform2f(u_screen_size, width, height);
  }
  if (u_draw_box) {
    gl.uniform1i(u_draw_box, drawBox ? 1 : 0);
  }
  if (u_box_size) {
    gl.uniform2f(u_box_size, box.width / 2, box.height / 2);
  }
  if (u_draw_canvas_outline) {
    gl.uniform1i(u_draw_canvas_outline, 0); // Default to false
  }
  if (u_white_balance_temp) {
    gl.uniform1f(u_white_balance_temp, whiteBalanceTemp);
  }
  if (u_white_balance_tint) {
    gl.uniform1f(u_white_balance_tint, whiteBalanceTint);
  }
  if (u_contrast) {
    gl.uniform1f(u_contrast, contrast);
  }
  if (u_brightness) {
    gl.uniform1f(u_brightness, brightness);
  }
  if (u_gamma) {
    gl.uniform1f(u_gamma, gamma);
  }
  if (u_saturation) {
    gl.uniform1f(u_saturation, saturation);
  }
  if (u_vibrance) {
    gl.uniform1f(u_vibrance, vibrance);
  }
  if (u_lift) {
    gl.uniform1f(u_lift, lift);
  }
  if (u_gain) {
    gl.uniform1f(u_gain, gain);
  }
  if (u_exposure) {
    gl.uniform1f(u_exposure, exposure);
  }
  if (u_clarity) {
    gl.uniform1f(u_clarity, clarity);
  }

  // Bind vertex buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.enableVertexAttribArray(a_position);
  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);

  // Bind instance buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);
  gl.enableVertexAttribArray(a_instance_pos);
  gl.vertexAttribPointer(a_instance_pos, 2, gl.FLOAT, false, 6 * 4, 0);
  gl.vertexAttribDivisor(a_instance_pos, 1);
  gl.enableVertexAttribArray(a_radius);
  gl.vertexAttribPointer(a_radius, 1, gl.FLOAT, false, 6 * 4, 2 * 4);
  gl.vertexAttribDivisor(a_radius, 1);
  gl.enableVertexAttribArray(a_color);
  gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, 6 * 4, 3 * 4);
  gl.vertexAttribDivisor(a_color, 1);

  // Bind index buffer
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // Enable blending with screen blend mode
  if (enableBlending) {
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  }

  // Draw balls
  gl.drawElementsInstanced(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0, balls.length);

  // Create temporary buffer for box
  const boxCenterX = box.x + box.width / 2;
  const boxCenterY = box.y + box.height / 2;
  const boxData = new Float32Array([boxCenterX, boxCenterY, 0, 0, 0, 0]);
  const boxBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, boxBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, boxData, gl.STATIC_DRAW);

  // Update attributes for box
  gl.vertexAttribPointer(a_instance_pos, 2, gl.FLOAT, false, 6 * 4, 0);
  gl.vertexAttribPointer(a_radius, 1, gl.FLOAT, false, 6 * 4, 2 * 4);
  gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, 6 * 4, 3 * 4);

  // Draw box
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

  // Clean up
  gl.deleteBuffer(boxBuffer);

  // Draw canvas outline
  const canvasCenterX = (width ?? 0) / 2;
  const canvasCenterY = height! / 2;
  const canvasOutlineData = new Float32Array([
    canvasCenterX,
    canvasCenterY,
    0,
    0,
    0,
    0,
  ]);
  const canvasOutlineBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, canvasOutlineBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, canvasOutlineData, gl.STATIC_DRAW);

  // Set uniforms for canvas outline
  if (u_draw_canvas_outline) {
    gl.uniform1i(u_draw_canvas_outline, 1);
  }
  if (u_canvas_size && width !== null && height !== null) {
    gl.uniform2f(u_canvas_size, width, height);
  }
  if (u_outline_color) {
    gl.uniform3f(
      u_outline_color,
      outline.color[0],
      outline.color[1],
      outline.color[2],
    );
  }
  if (u_outline_width) {
    gl.uniform1f(u_outline_width, outline.width);
  }
  if (u_outline_opacity) {
    gl.uniform1f(u_outline_opacity, outline.opacity);
  }

  // Update attributes for canvas outline
  gl.vertexAttribPointer(a_instance_pos, 2, gl.FLOAT, false, 6 * 4, 0);
  gl.vertexAttribPointer(a_radius, 1, gl.FLOAT, false, 6 * 4, 2 * 4);
  gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, 6 * 4, 3 * 4);

  // Draw canvas outline
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

  // Clean up
  gl.deleteBuffer(canvasOutlineBuffer);

  // Reset uniform
  if (u_draw_canvas_outline) {
    gl.uniform1i(u_draw_canvas_outline, 0);
  }

  // on initialization, notify main thread that we're ready
  if (!notifiedInit) {
    self.postMessage({ type: "started" });
    notifiedInit = true;
  }

  // Continue animation
  animationId = requestAnimationFrame(draw);
}

async function init(payload: PayloadInit) {
  offscreen = payload.canvas;
  width = payload.width;
  height = payload.height;

  offscreen.width = width;
  offscreen.height = height;

  // Initialize WebGL
  gl = offscreen.getContext("webgl2");
  if (!gl) {
    console.error("WebGL2 not supported");
    return;
  }

  // Create shaders and program
  await createPipeline();

  initializeBoxLocation();
  initializeBallRadius();
  initializeBalls();

  // Create instance buffer after balls are initialized
  const instanceData = new Float32Array(
    balls.flatMap((ball) => [
      ball.x,
      ball.y,
      ball.radius,
      ...ball.color.map((c) => c / 255),
    ]),
  );
  instanceBuffer = gl!.createBuffer();
  gl!.bindBuffer(gl!.ARRAY_BUFFER, instanceBuffer);
  gl!.bufferData(gl!.ARRAY_BUFFER, instanceData, gl!.DYNAMIC_DRAW);

  ready = true;
}

function resize(payload: PayloadResize) {
  if (!offscreen || !gl) return;

  width = payload.width;
  height = payload.height;

  offscreen.width = width;
  offscreen.height = height;

  // Update WebGL viewport to match new canvas size
  gl.viewport(0, 0, width, height);

  // Restart animation with new dimensions
  if (animationId) cancelAnimationFrame(animationId);

  initializeBoxLocation();
  initializeBallRadius();

  draw();
}

function closeOperation() {
  // Stop animation
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
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
    if (animationId) cancelAnimationFrame(animationId);
    draw();
    return;
  }

  if (type === "stop") {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    return;
  }

  if (type === "scroll") {
    translateY = payload.scrollY;
    return;
  }

  if (type === "params") {
    // Update parameters if they are provided
    if (payload.temperature !== undefined)
      whiteBalanceTemp = payload.temperature;
    if (payload.tint !== undefined) whiteBalanceTint = payload.tint;
    if (payload.contrast !== undefined) contrast = payload.contrast;
    if (payload.brightness !== undefined) brightness = payload.brightness;
    if (payload.gamma !== undefined) gamma = payload.gamma;
    if (payload.saturation !== undefined) saturation = payload.saturation;
    if (payload.vibrance !== undefined) vibrance = payload.vibrance;
    if (payload.lift !== undefined) lift = payload.lift;
    if (payload.gain !== undefined) gain = payload.gain;
    if (payload.exposure !== undefined) exposure = payload.exposure;
    if (payload.clarity !== undefined) clarity = payload.clarity;
    return;
  }
});

// Optional: Handle worker termination
self.addEventListener("close", () => {
  closeOperation();
});

self.postMessage({ type: "init" });
