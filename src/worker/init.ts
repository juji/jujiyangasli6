type PayloadResize = {
  width: number;
  height: number;
};

type PayloadInit = PayloadResize & {
  canvas: OffscreenCanvas;
};

let offscreen: OffscreenCanvas | null = null;
let width: number | null = null;
let height: number | null = null;
let device: GPUDevice | null = null;
let context: GPUCanvasContext | null = null;
let pipeline: GPURenderPipeline | null = null;
let vertexBuffer: GPUBuffer | null = null;
let instanceBuffer: GPUBuffer | null = null;
let indexBuffer: GPUBuffer | null = null;
let animationId: number | null = null;
let uniformBuffer: GPUBuffer | null = null;
let bindGroup: GPUBindGroup | null = null;

let ready = false;

const turnAccelDelta = 0.09;
const radiusRange = [100, 300];

const box = {
  width: 100,
  height: 100,
  x: 500,
  y: 500,
};

let balls = [
  {
    x: 150,
    y: 150,
    vx: Math.random() - 1, // velocity x
    vy: Math.random() - 1, // velocity y
    ax: 0.01, // acceleration x
    ay: 0.005, // acceleration y
    radius: radiusRange[0] + Math.random() * radiusRange[1],
    color: [1.0, 0.5, 0.0], // Orange
  },
  {
    x: 250,
    y: 150,
    vx: Math.random() - 1, // velocity x
    vy: Math.random() - 1, // velocity y
    ax: -0.01, // acceleration x
    ay: 0.005, // acceleration y
    radius: radiusRange[0] + Math.random() * radiusRange[1],
    color: [0.0, 1.0, 0.5], // Cyan
  },
  {
    x: 150,
    y: 250,
    vx: Math.random() - 1, // velocity x
    vy: Math.random() - 1, // velocity y
    ax: 0.01, // acceleration x
    ay: -0.005, // acceleration y
    radius: radiusRange[0] + Math.random() * radiusRange[1],
    color: [0.5, 0.0, 1.0], // Purple
  },
  {
    x: 250,
    y: 250,
    vx: Math.random() - 1, // velocity x
    vy: Math.random() - 1, // velocity y
    ax: -0.01, // acceleration x
    ay: -0.005, // acceleration y
    radius: radiusRange[0] + Math.random() * radiusRange[1],
    color: [1.0, 1.0, 0.0], // Yellow
  },
];

function initializePositions() {
  // shuffle balls array
  for (let i = balls.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [balls[i], balls[j]] = [balls[j], balls[i]];
  }

  // make the balls be inside the box
  for (const ball of balls) {
    ball.x = Math.random() * box.width + box.x;
    ball.y = Math.random() * box.height + box.y;
  }
}

initializePositions();

function update() {
  // Update all balls within box boundaries
  for (const ball of balls) {
    if (ball.x <= box.x) {
      ball.ax += turnAccelDelta;
    }

    if (ball.x > box.x + box.width) {
      ball.ax -= turnAccelDelta;
    }

    if (ball.y >= box.y) {
      ball.ay -= turnAccelDelta;
    }

    if (ball.y < box.y - box.width) {
      ball.ay += turnAccelDelta;
    }

    // Update position
    ball.x += ball.vx + ball.ax;
    ball.y += ball.vy + ball.ay;
  }
}

async function createPipeline() {
  if (!device) return;

  // Vertex shader for drawing circles and rectangles
  const vertexShaderCode = `
    struct Uniforms {
      screen_size: vec2<f32>,
    };

    @group(0) @binding(0) var<uniform> uniforms: Uniforms;

    struct VertexInput {
      @location(0) position: vec2<f32>,
      @location(1) instance_pos: vec2<f32>,
      @location(2) radius: f32,
      @location(3) color: vec3<f32>,
    };

    struct VertexOutput {
      @builtin(position) position: vec4<f32>,
      @location(0) uv: vec2<f32>,
      @location(1) radius: f32,
      @location(2) color: vec3<f32>,
    };

    @vertex
    fn main(input: VertexInput) -> VertexOutput {
      var output: VertexOutput;
      var pos = input.position;
      if (input.radius == 0.0) {
        // Scale quad to box size for box drawing
        pos *= vec2<f32>(${box.width / 2}.0, ${box.height / 2}.0);
      } else {
        // Scale quad to ball radius
        pos *= input.radius;
      }
      // Convert pixel coordinates to clip space (-1 to 1)
      let clipPos = (pos + input.instance_pos) / uniforms.screen_size * 2.0 - vec2<f32>(1.0, 1.0);
      output.position = vec4<f32>(clipPos.x, -clipPos.y, 0.0, 1.0); // Flip Y for canvas coordinates
      output.uv = pos; // Use scaled position for UV
      output.radius = input.radius;
      output.color = input.color;
      return output;
    }
  `;

  // Fragment shader for drawing circles (balls) and rectangles (box)
  const fragmentShaderCode = `
    @fragment
    fn main(@location(0) uv: vec2<f32>, @location(1) radius: f32, @location(2) color: vec3<f32>) -> @location(0) vec4<f32> {
      if (radius > 0.0) {
        // Draw circle for balls with blur
        let dist = length(uv);
        let blurWidth = 200.0; // Adjust this value to control blur intensity
        let alpha = 1.0 - smoothstep(radius - blurWidth, radius, dist);
        if (alpha <= 0.0) {
          discard;
        }
        return vec4<f32>(color.r, color.g, color.b, alpha); // Use instance color for balls with alpha
      } else {
        // Draw rectangle outline for box
        let halfWidth = ${box.width / 2}.0;
        let halfHeight = ${box.height / 2}.0;
        let thickness = 2.0; // Pixel thickness
        if ((abs(uv.x) >= halfWidth - thickness) ||
            (abs(uv.y) >= halfHeight - thickness)) {
          return vec4<f32>(1.0, 1.0, 1.0, 1.0); // White color for box outline
        }
        discard;
      }
      return vec4<f32>(0.0, 0.0, 0.0, 0.0); // Default return (should not reach here)
    }
  `;

  const vertexShader = device.createShaderModule({
    code: vertexShaderCode,
  });

  const fragmentShader = device.createShaderModule({
    code: fragmentShaderCode,
  });

  // Create uniform buffer for screen size
  uniformBuffer = device.createBuffer({
    size: 2 * 4, // 2 floats * 4 bytes
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  // Create bind group layout
  const bindGroupLayout = device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.VERTEX,
        buffer: { type: "uniform" },
      },
    ],
  });

  // Create pipeline layout
  const pipelineLayout = device.createPipelineLayout({
    bindGroupLayouts: [bindGroupLayout],
  });

  // Create pipeline
  pipeline = device.createRenderPipeline({
    layout: pipelineLayout,
    vertex: {
      module: vertexShader,
      entryPoint: "main",
      buffers: [
        {
          arrayStride: 2 * 4, // 2 floats * 4 bytes
          attributes: [
            {
              shaderLocation: 0,
              offset: 0,
              format: "float32x2",
            },
          ],
        },
        {
          arrayStride: 6 * 4, // 6 floats * 4 bytes (x, y, radius, r, g, b)
          stepMode: "instance",
          attributes: [
            {
              shaderLocation: 1,
              offset: 0,
              format: "float32x2",
            },
            {
              shaderLocation: 2,
              offset: 2 * 4,
              format: "float32",
            },
            {
              shaderLocation: 3,
              offset: 3 * 4,
              format: "float32x3",
            },
          ],
        },
      ],
    },
    fragment: {
      module: fragmentShader,
      entryPoint: "main",
      targets: [
        {
          format: navigator.gpu.getPreferredCanvasFormat(),
          blend: {
            color: {
              srcFactor: "src-alpha",
              dstFactor: "one",
              operation: "add",
            },
            alpha: {
              srcFactor: "one",
              dstFactor: "one-minus-src-alpha",
              operation: "add",
            },
          },
        },
      ],
    },
    primitive: {
      topology: "triangle-list",
    },
  });

  // Create vertex buffer for quad (will be scaled by radius in shader)
  const vertices = new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]);
  vertexBuffer = device.createBuffer({
    size: vertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(vertexBuffer, 0, vertices);

  // Create index buffer for quad
  const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);
  indexBuffer = device.createBuffer({
    size: indices.byteLength,
    usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(indexBuffer, 0, indices);

  // Create bind group
  bindGroup = device.createBindGroup({
    layout: bindGroupLayout,
    entries: [
      {
        binding: 0,
        resource: { buffer: uniformBuffer },
      },
    ],
  });

  // Update uniform buffer with initial screen size
  if (uniformBuffer && width !== null && height !== null) {
    device.queue.writeBuffer(
      uniformBuffer,
      0,
      new Float32Array([width, height]),
    );
  }

  // Create instance buffer for balls
  const instanceData = new Float32Array(
    balls.flatMap((ball) => [ball.x, ball.y, ball.radius, ...ball.color]),
  );
  instanceBuffer = device.createBuffer({
    size: instanceData.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(instanceBuffer, 0, instanceData);
}

function draw() {
  console.log("Draw function called");

  if (!ready) {
    // Continue animation
    animationId = requestAnimationFrame(draw);
    return;
  }

  if (
    !offscreen ||
    !device ||
    !context ||
    !pipeline ||
    !vertexBuffer ||
    !instanceBuffer ||
    !indexBuffer ||
    !uniformBuffer ||
    !bindGroup
  ) {
    console.log("Missing required objects for drawing");
    return;
  }

  // Update box position
  update();

  // Update GPU buffer with all ball data (position + radius + color)
  const instanceData = new Float32Array(
    balls.flatMap((ball) => [ball.x, ball.y, ball.radius, ...ball.color]),
  );
  device.queue.writeBuffer(instanceBuffer, 0, instanceData);

  const commandEncoder = device.createCommandEncoder();
  const textureView = context.getCurrentTexture().createView();
  const renderPass = commandEncoder.beginRenderPass({
    colorAttachments: [
      {
        view: textureView,
        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
        loadOp: "clear",
        storeOp: "store",
      },
    ],
  });

  // Create a temporary buffer for box rendering (radius = 0, with color padding)
  const boxCenterX = box.x + box.width / 2;
  const boxCenterY = box.y + box.height / 2;
  const boxData = new Float32Array([boxCenterX, boxCenterY, 0, 0, 0, 0]); // x, y, radius = 0, color padding
  const boxBuffer = device.createBuffer({
    size: boxData.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    mappedAtCreation: true,
  });
  new Float32Array(boxBuffer.getMappedRange()).set(boxData);
  boxBuffer.unmap();

  // Update uniform buffer with current screen size
  if (uniformBuffer && width !== null && height !== null) {
    device.queue.writeBuffer(
      uniformBuffer,
      0,
      new Float32Array([width, height]),
    );
  }

  // First render the balls
  renderPass.setPipeline(pipeline);
  renderPass.setBindGroup(0, bindGroup);
  renderPass.setVertexBuffer(0, vertexBuffer);
  renderPass.setVertexBuffer(1, instanceBuffer);
  renderPass.setIndexBuffer(indexBuffer, "uint16");
  renderPass.drawIndexed(6, balls.length); // Draw balls

  // Then render the box
  renderPass.setVertexBuffer(1, boxBuffer);
  renderPass.drawIndexed(6, 1); // Draw box

  renderPass.end();

  device.queue.submit([commandEncoder.finish()]);

  // Continue animation
  animationId = requestAnimationFrame(draw);
}

async function init(payload: PayloadInit) {
  console.log("Worker initialized with payload:", payload);

  offscreen = payload.canvas;
  width = payload.width;
  height = payload.height;

  offscreen.width = width;
  offscreen.height = height;

  // Initialize WebGPU
  console.log("Initializing WebGPU");
  if (!navigator.gpu) {
    console.error("WebGPU not supported");
    return;
  }

  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    console.error("No adapter found");
    return;
  }

  device = await adapter.requestDevice();
  console.log("WebGPU device created");
  context = offscreen.getContext("webgpu");
  if (!context) {
    console.error("Failed to get WebGPU context");
    return;
  }
  console.log("WebGPU context created");

  const format = navigator.gpu.getPreferredCanvasFormat();
  context.configure({
    device,
    format,
    alphaMode: "premultiplied",
  });

  // Create shaders and pipeline
  await createPipeline();

  ready = true;
}

function resize(payload: PayloadResize) {
  console.log("Worker resized with payload:", payload);

  if (!offscreen) return;

  width = payload.width;
  height = payload.height;

  offscreen.width = width;
  offscreen.height = height;

  // Restart animation with new dimensions
  if (animationId) cancelAnimationFrame(animationId);
  draw();
}

function closeOperation() {
  // Stop animation
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  console.log("Worker closing");
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
    console.log("start animation");
    if (animationId) cancelAnimationFrame(animationId);
    draw();
    return;
  }

  if (type === "stop") {
    console.log("stop animation");
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    return;
  }
});

// Optional: Handle worker termination
self.addEventListener("close", () => {
  closeOperation();
  console.log("Worker is terminating");
});

self.postMessage({ type: "init" });
