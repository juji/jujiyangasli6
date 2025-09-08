import type { Ball } from "./types";

export class WebGLHandler {
  // gl context and program variables
  private gl: WebGL2RenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private vertexBuffer: WebGLBuffer | null = null;
  private instanceBuffer: WebGLBuffer | null = null;
  private indexBuffer: WebGLBuffer | null = null;
  private animationId: number | null = null;
  private u_screen_size: WebGLUniformLocation | null = null;
  private u_draw_box: WebGLUniformLocation | null = null;
  private u_draw_canvas_outline: WebGLUniformLocation | null = null;
  private u_canvas_size: WebGLUniformLocation | null = null;
  private u_box_size: WebGLUniformLocation | null = null;
  private u_outline_color: WebGLUniformLocation | null = null;
  private u_outline_width: WebGLUniformLocation | null = null;
  private u_outline_opacity: WebGLUniformLocation | null = null;
  private u_white_balance_temp: WebGLUniformLocation | null = null;
  private u_white_balance_tint: WebGLUniformLocation | null = null;
  private u_contrast: WebGLUniformLocation | null = null;
  private u_brightness: WebGLUniformLocation | null = null;
  private u_gamma: WebGLUniformLocation | null = null;
  private u_saturation: WebGLUniformLocation | null = null;
  private u_vibrance: WebGLUniformLocation | null = null;
  private u_lift: WebGLUniformLocation | null = null;
  private u_gain: WebGLUniformLocation | null = null;
  private u_exposure: WebGLUniformLocation | null = null;
  private u_clarity: WebGLUniformLocation | null = null;
  private a_position: number = 0;
  private a_instance_pos: number = 0;
  private a_radius: number = 0;
  private a_color: number = 0;

  // Other properties that the methods depend on
  private offscreen: OffscreenCanvas | null = null;
  private width: number | null = null;
  private height: number | null = null;
  private balls: Ball[];
  private box: { width: number; height: number; x: number; y: number };
  private translateY: number;
  private ready: boolean;
  private notifiedInit: boolean;
  private blurWidth: number;
  private drawBox: boolean;
  private outline: { color: number[]; width: number; opacity: number };
  private whiteBalanceTemp: number;
  private whiteBalanceTint: number;
  private contrast: number;
  private brightness: number;
  private gamma: number;
  private saturation: number;
  private vibrance: number;
  private lift: number;
  private gain: number;
  private exposure: number;
  private clarity: number;

  constructor(
    balls: Ball[],
    box: { width: number; height: number; x: number; y: number },
    translateY: number,
    ready: boolean,
    notifiedInit: boolean,
  ) {
    this.balls = balls;
    this.box = box;
    this.translateY = translateY;
    this.ready = ready;
    this.notifiedInit = notifiedInit;
    this.blurWidth = 1200;
    this.drawBox = false;
    this.outline = { color: [23, 23, 23], width: 5, opacity: 1 };
    this.whiteBalanceTemp = 0.0;
    this.whiteBalanceTint = 0.0;
    this.contrast = 1.0;
    this.brightness = 1.0;
    this.gamma = 1.0;
    this.saturation = 1.0;
    this.vibrance = 0.0;
    this.lift = 0.0;
    this.gain = 1.0;
    this.exposure = 0.0;
    this.clarity = 0.0;
  }

  setOffscreen(offscreen: OffscreenCanvas | null) {
    this.offscreen = offscreen;
  }

  setDimensions(width: number | null, height: number | null) {
    this.width = width;
    this.height = height;
  }

  setTranslateY(translateY: number) {
    this.translateY = translateY;
  }

  setReady(ready: boolean) {
    this.ready = ready;
  }

  setNotifiedInit(notifiedInit: boolean) {
    this.notifiedInit = notifiedInit;
  }

  updateParams(params: any) {
    if (params.temperature !== undefined)
      this.whiteBalanceTemp = params.temperature;
    if (params.tint !== undefined) this.whiteBalanceTint = params.tint;
    if (params.contrast !== undefined) this.contrast = params.contrast;
    if (params.brightness !== undefined) this.brightness = params.brightness;
    if (params.gamma !== undefined) this.gamma = params.gamma;
    if (params.saturation !== undefined) this.saturation = params.saturation;
    if (params.vibrance !== undefined) this.vibrance = params.vibrance;
    if (params.lift !== undefined) this.lift = params.lift;
    if (params.gain !== undefined) this.gain = params.gain;
    if (params.exposure !== undefined) this.exposure = params.exposure;
    if (params.clarity !== undefined) this.clarity = params.clarity;
  }

  async createPipeline() {
    if (!this.gl) return;

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
          float blurWidth = ${this.blurWidth}.0; // Adjust this value to control blur intensity
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

    const vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
    if (!vertexShader) return;
    this.gl.shaderSource(vertexShader, vertexShaderCode);
    this.gl.compileShader(vertexShader);
    if (!this.gl.getShaderParameter(vertexShader, this.gl.COMPILE_STATUS)) {
      console.error(
        "Vertex shader compile error:",
        this.gl.getShaderInfoLog(vertexShader),
      );
      return;
    }

    const fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    if (!fragmentShader) return;
    this.gl.shaderSource(fragmentShader, fragmentShaderCode);
    this.gl.compileShader(fragmentShader);
    if (!this.gl.getShaderParameter(fragmentShader, this.gl.COMPILE_STATUS)) {
      console.error(
        "Fragment shader compile error:",
        this.gl.getShaderInfoLog(fragmentShader),
      );
      return;
    }

    this.program = this.gl.createProgram();
    if (!this.program) return;
    this.gl.attachShader(this.program, vertexShader);
    this.gl.attachShader(this.program, fragmentShader);
    this.gl.linkProgram(this.program);
    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.error(
        "Program link error:",
        this.gl.getProgramInfoLog(this.program),
      );
      return;
    }

    // Get attribute locations
    this.a_position = this.gl.getAttribLocation(this.program, "a_position");
    this.a_instance_pos = this.gl.getAttribLocation(
      this.program,
      "a_instance_pos",
    );
    this.a_radius = this.gl.getAttribLocation(this.program, "a_radius");
    this.a_color = this.gl.getAttribLocation(this.program, "a_color");
    this.u_screen_size = this.gl.getUniformLocation(
      this.program,
      "u_screen_size",
    );
    this.u_draw_box = this.gl.getUniformLocation(this.program, "u_draw_box");
    this.u_draw_canvas_outline = this.gl.getUniformLocation(
      this.program,
      "u_draw_canvas_outline",
    );
    this.u_canvas_size = this.gl.getUniformLocation(
      this.program,
      "u_canvas_size",
    );
    this.u_box_size = this.gl.getUniformLocation(this.program, "u_box_size");
    this.u_outline_color = this.gl.getUniformLocation(
      this.program,
      "u_outline_color",
    );
    this.u_outline_width = this.gl.getUniformLocation(
      this.program,
      "u_outline_width",
    );
    this.u_outline_opacity = this.gl.getUniformLocation(
      this.program,
      "u_outline_opacity",
    );
    this.u_white_balance_temp = this.gl.getUniformLocation(
      this.program,
      "u_white_balance_temp",
    );
    this.u_white_balance_tint = this.gl.getUniformLocation(
      this.program,
      "u_white_balance_tint",
    );
    this.u_contrast = this.gl.getUniformLocation(this.program, "u_contrast");
    this.u_brightness = this.gl.getUniformLocation(
      this.program,
      "u_brightness",
    );
    this.u_gamma = this.gl.getUniformLocation(this.program, "u_gamma");
    this.u_saturation = this.gl.getUniformLocation(
      this.program,
      "u_saturation",
    );
    this.u_vibrance = this.gl.getUniformLocation(this.program, "u_vibrance");
    this.u_lift = this.gl.getUniformLocation(this.program, "u_lift");
    this.u_gain = this.gl.getUniformLocation(this.program, "u_gain");
    this.u_exposure = this.gl.getUniformLocation(this.program, "u_exposure");
    this.u_clarity = this.gl.getUniformLocation(this.program, "u_clarity");

    // Create vertex buffer for quad
    const vertices = new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]);
    this.vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

    // Create index buffer for quad
    const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);
    this.indexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      indices,
      this.gl.STATIC_DRAW,
    );
  }

  draw() {
    if (!this.ready) {
      // Continue animation
      this.animationId = requestAnimationFrame(() => this.draw());
      return;
    }

    if (
      !this.offscreen ||
      !this.gl ||
      !this.program ||
      !this.vertexBuffer ||
      !this.instanceBuffer ||
      !this.indexBuffer
    ) {
      return;
    }

    // Update box position
    this.update();

    // Update instance buffer with all ball data (position + radius + color)
    const instanceData = new Float32Array(
      this.balls.flatMap((ball) => [
        ball.x,
        ball.y,
        ball.radius,
        ...ball.color,
      ]),
    );
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.instanceBuffer);
    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, instanceData);

    // Set viewport to match canvas size
    if (this.width !== null && this.height !== null) {
      this.gl.viewport(0, 0, this.width, this.height);
    }

    // Clear the canvas
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    // Use the program
    // biome-ignore lint/correctness/useHookAtTopLevel: This is not a React component
    this.gl.useProgram(this.program);

    // Set uniform
    if (this.u_screen_size && this.width !== null && this.height !== null) {
      this.gl.uniform2f(this.u_screen_size, this.width, this.height);
    }
    if (this.u_draw_box) {
      this.gl.uniform1i(this.u_draw_box, this.drawBox ? 1 : 0);
    }
    if (this.u_box_size) {
      this.gl.uniform2f(
        this.u_box_size,
        this.box.width / 2,
        this.box.height / 2,
      );
    }
    if (this.u_draw_canvas_outline) {
      this.gl.uniform1i(this.u_draw_canvas_outline, 0); // Default to false
    }
    if (this.u_white_balance_temp) {
      this.gl.uniform1f(this.u_white_balance_temp, this.whiteBalanceTemp);
    }
    if (this.u_white_balance_tint) {
      this.gl.uniform1f(this.u_white_balance_tint, this.whiteBalanceTint);
    }
    if (this.u_contrast) {
      this.gl.uniform1f(this.u_contrast, this.contrast);
    }
    if (this.u_brightness) {
      this.gl.uniform1f(this.u_brightness, this.brightness);
    }
    if (this.u_gamma) {
      this.gl.uniform1f(this.u_gamma, this.gamma);
    }
    if (this.u_saturation) {
      this.gl.uniform1f(this.u_saturation, this.saturation);
    }
    if (this.u_vibrance) {
      this.gl.uniform1f(this.u_vibrance, this.vibrance);
    }
    if (this.u_lift) {
      this.gl.uniform1f(this.u_lift, this.lift);
    }
    if (this.u_gain) {
      this.gl.uniform1f(this.u_gain, this.gain);
    }
    if (this.u_exposure) {
      this.gl.uniform1f(this.u_exposure, this.exposure);
    }
    if (this.u_clarity) {
      this.gl.uniform1f(this.u_clarity, this.clarity);
    }

    // Bind vertex buffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.enableVertexAttribArray(this.a_position);
    this.gl.vertexAttribPointer(this.a_position, 2, this.gl.FLOAT, false, 0, 0);

    // Bind instance buffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.instanceBuffer);
    this.gl.enableVertexAttribArray(this.a_instance_pos);
    this.gl.vertexAttribPointer(
      this.a_instance_pos,
      2,
      this.gl.FLOAT,
      false,
      6 * 4,
      0,
    );
    this.gl.vertexAttribDivisor(this.a_instance_pos, 1);
    this.gl.enableVertexAttribArray(this.a_radius);
    this.gl.vertexAttribPointer(
      this.a_radius,
      1,
      this.gl.FLOAT,
      false,
      6 * 4,
      2 * 4,
    );
    this.gl.vertexAttribDivisor(this.a_radius, 1);
    this.gl.enableVertexAttribArray(this.a_color);
    this.gl.vertexAttribPointer(
      this.a_color,
      3,
      this.gl.FLOAT,
      false,
      6 * 4,
      3 * 4,
    );
    this.gl.vertexAttribDivisor(this.a_color, 1);

    // Bind index buffer
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

    // Enable blending with screen blend mode
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE);

    // Draw balls
    this.gl.drawElementsInstanced(
      this.gl.TRIANGLES,
      6,
      this.gl.UNSIGNED_SHORT,
      0,
      this.balls.length,
    );

    // Create temporary buffer for box
    const boxCenterX = this.box.x + this.box.width / 2;
    const boxCenterY = this.box.y + this.box.height / 2;
    const boxData = new Float32Array([boxCenterX, boxCenterY, 0, 0, 0, 0]);
    const boxBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, boxBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, boxData, this.gl.STATIC_DRAW);

    // Update attributes for box
    this.gl.vertexAttribPointer(
      this.a_instance_pos,
      2,
      this.gl.FLOAT,
      false,
      6 * 4,
      0,
    );
    this.gl.vertexAttribPointer(
      this.a_radius,
      1,
      this.gl.FLOAT,
      false,
      6 * 4,
      2 * 4,
    );
    this.gl.vertexAttribPointer(
      this.a_color,
      3,
      this.gl.FLOAT,
      false,
      6 * 4,
      3 * 4,
    );

    // Draw box
    this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);

    // Clean up
    this.gl.deleteBuffer(boxBuffer);

    // Draw canvas outline
    const canvasCenterX = (this.width ?? 0) / 2;
    const canvasCenterY = (this.height ?? 0) / 2;
    const canvasOutlineData = new Float32Array([
      canvasCenterX,
      canvasCenterY,
      0,
      0,
      0,
      0,
    ]);
    const canvasOutlineBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, canvasOutlineBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      canvasOutlineData,
      this.gl.STATIC_DRAW,
    );

    // Set uniforms for canvas outline
    if (this.u_draw_canvas_outline) {
      this.gl.uniform1i(this.u_draw_canvas_outline, 1);
    }
    if (this.u_canvas_size && this.width !== null && this.height !== null) {
      this.gl.uniform2f(this.u_canvas_size, this.width, this.height);
    }
    if (this.u_outline_color) {
      this.gl.uniform3f(
        this.u_outline_color,
        this.outline.color[0],
        this.outline.color[1],
        this.outline.color[2],
      );
    }
    if (this.u_outline_width) {
      this.gl.uniform1f(this.u_outline_width, this.outline.width);
    }
    if (this.u_outline_opacity) {
      this.gl.uniform1f(this.u_outline_opacity, this.outline.opacity);
    }

    // Update attributes for canvas outline
    this.gl.vertexAttribPointer(
      this.a_instance_pos,
      2,
      this.gl.FLOAT,
      false,
      6 * 4,
      0,
    );
    this.gl.vertexAttribPointer(
      this.a_radius,
      1,
      this.gl.FLOAT,
      false,
      6 * 4,
      2 * 4,
    );
    this.gl.vertexAttribPointer(
      this.a_color,
      3,
      this.gl.FLOAT,
      false,
      6 * 4,
      3 * 4,
    );

    // Draw canvas outline
    this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);

    // Clean up
    this.gl.deleteBuffer(canvasOutlineBuffer);

    // Reset uniform
    if (this.u_draw_canvas_outline) {
      this.gl.uniform1i(this.u_draw_canvas_outline, 0);
    }

    // on initialization, notify main thread that we're ready
    if (!this.notifiedInit) {
      self.postMessage({ type: "started" });
      this.notifiedInit = true;
    }

    // Continue animation
    this.animationId = requestAnimationFrame(() => this.draw());
  }

  async initializeWebGL(offscreen: OffscreenCanvas | null) {
    if (!offscreen) return;

    // Initialize WebGL
    this.gl = offscreen.getContext("webgl2");
    if (!this.gl) {
      console.error("WebGL2 not supported");
      return;
    }

    // Create shaders and program
    await this.createPipeline();

    // Create instance buffer after balls are initialized
    const instanceData = new Float32Array(
      this.balls.flatMap((ball) => [
        ball.x,
        ball.y,
        ball.radius,
        ...ball.color.map((c) => c / 255),
      ]),
    );
    this.instanceBuffer = this.gl?.createBuffer();
    this.gl?.bindBuffer(this.gl?.ARRAY_BUFFER, this.instanceBuffer);
    this.gl?.bufferData(
      this.gl?.ARRAY_BUFFER,
      instanceData,
      this.gl?.DYNAMIC_DRAW,
    );
  }

  async resizeWebGL(width: number, height: number) {
    if (!this.gl) return;

    // Update WebGL viewport to match new canvas size
    this.gl.viewport(0, 0, width, height);
  }

  private update() {
    // Update all balls within box boundaries
    for (const ball of this.balls) {
      if (ball.x <= this.box.x) {
        ball.ax += 0.09;
      }

      if (ball.x > this.box.x + this.box.width) {
        ball.ax -= 0.09;
      }

      if (ball.yInit >= this.box.y + this.box.height) {
        ball.ay -= 0.09;
      }

      if (ball.yInit < this.box.y) {
        ball.ay += 0.09;
      }

      let speedX = ball.vx + ball.ax;
      let speedY = ball.vy + ball.ay;
      if (Math.abs(speedX) > 3) {
        speedX = (speedX > 0 ? 1 : -1) * 3;
      }
      if (Math.abs(speedY) > 3) {
        speedY = (speedY > 0 ? 1 : -1) * 3;
      }

      // Update position
      ball.x += speedX;
      ball.yInit += speedY;
      ball.y = ball.yInit - ball.translateEffect * this.translateY * 500;
    }
  }

  stopAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}
