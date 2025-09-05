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
const raf: number | null = null;
let device: GPUDevice | null = null;
let context: GPUCanvasContext | null = null;
let pipeline: GPURenderPipeline | null = null;
// biome-ignore lint/suspicious/noExplicitAny: WebGPU types not available
let vertexBuffer: any = null;
// biome-ignore lint/suspicious/noExplicitAny: WebGPU types not available
let instanceBuffer: any = null;
// biome-ignore lint/suspicious/noExplicitAny: WebGPU types not available
let indexBuffer: any = null;

async function createPipeline() {
  if (!device) return;

  const shaderCode = `
    struct VertexInput {
      @location(0) position: vec2<f32>,
      @location(1) center: vec2<f32>,
    };

    struct VertexOutput {
      @builtin(position) position: vec4<f32>,
      @location(0) center: vec2<f32>,
    };

    @vertex
    fn vertexMain(input: VertexInput) -> VertexOutput {
      var output: VertexOutput;
      output.position = vec4<f32>(input.position, 0.0, 1.0);
      output.center = input.center;
      return output;
    }

    @fragment
    fn fragmentMain(input: VertexOutput) -> @location(0) vec4<f32> {
      let dist = distance(input.position.xy, input.center);
      if (dist < 50.0) {
        return vec4<f32>(1.0, 0.0, 0.0, 1.0); // Red circle
      }
      return vec4<f32>(0.0, 0.0, 0.0, 0.0); // Transparent
    }
  `;

  const shaderModule = device.createShaderModule({
    code: shaderCode,
  });

  const pipelineDescriptor = {
    layout: "auto",
    vertex: {
      module: shaderModule,
      entryPoint: "vertexMain",
      buffers: [
        {
          arrayStride: 8,
          attributes: [
            {
              shaderLocation: 0,
              offset: 0,
              format: "float32x2",
            },
          ],
        },
        {
          arrayStride: 8,
          stepMode: "instance",
          attributes: [
            {
              shaderLocation: 1,
              offset: 0,
              format: "float32x2",
            },
          ],
        },
      ],
    },
    fragment: {
      module: shaderModule,
      entryPoint: "fragmentMain",
      targets: [
        {
          // biome-ignore lint/suspicious/noExplicitAny: WebGPU types not available
          format: (navigator as any).gpu.getPreferredCanvasFormat(),
        },
      ],
    },
    primitive: {
      topology: "triangle-list",
    },
  };

  // biome-ignore lint/suspicious/noExplicitAny: WebGPU types not available
  pipeline = await (device as any).createRenderPipelineAsync(
    // biome-ignore lint/suspicious/noExplicitAny: WebGPU types not available
    pipelineDescriptor as any,
  );

  // Create vertex buffer for quad
  const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
  vertexBuffer = device.createBuffer({
    size: vertices.byteLength,
    usage: 0x20, // GPUBufferUsage.VERTEX
    mappedAtCreation: true,
  });
  new Float32Array(vertexBuffer.getMappedRange()).set(vertices);
  vertexBuffer.unmap();

  // Create instance buffer for 1 circle in center
  const centers = new Float32Array([(width || 800) / 2, (height || 600) / 2]);
  instanceBuffer = device.createBuffer({
    size: centers.byteLength,
    usage: 0x20, // GPUBufferUsage.VERTEX
    mappedAtCreation: true,
  });
  new Float32Array(instanceBuffer.getMappedRange()).set(centers);
  instanceBuffer.unmap();

  // Create index buffer for quad
  const indices = new Uint16Array([0, 1, 2, 2, 1, 3]);
  indexBuffer = device.createBuffer({
    size: indices.byteLength,
    usage: 0x10, // GPUBufferUsage.INDEX
    mappedAtCreation: true,
  });
  new Uint16Array(indexBuffer.getMappedRange()).set(indices);
  indexBuffer.unmap();
}

function draw() {
  if (
    !offscreen ||
    !device ||
    !context ||
    !pipeline ||
    !vertexBuffer ||
    !instanceBuffer ||
    !indexBuffer
  )
    return;

  if (raf) cancelAnimationFrame(raf);
  // Add your drawing logic here

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

  renderPass.setPipeline(pipeline);
  renderPass.setVertexBuffer(0, vertexBuffer);
  renderPass.setVertexBuffer(1, instanceBuffer);
  renderPass.setIndexBuffer(indexBuffer, "uint16");
  renderPass.drawIndexed(6, 1); // 6 indices, 1 instance

  renderPass.end();

  device.queue.submit([commandEncoder.finish()]);
}

async function init(payload: PayloadInit) {
  console.log("Worker initialized with payload:", payload);

  offscreen = payload.canvas;
  width = payload.width;
  height = payload.height;

  offscreen.width = width;
  offscreen.height = height;

  // Initialize WebGPU
  // biome-ignore lint/suspicious/noExplicitAny: WebGPU types not available
  if (!(navigator as any).gpu) {
    console.error("WebGPU not supported");
    return;
  }

  // biome-ignore lint/suspicious/noExplicitAny: WebGPU types not available
  const adapter = await (navigator as any).gpu.requestAdapter();
  if (!adapter) {
    console.error("No adapter found");
    return;
  }

  device = await adapter.requestDevice();
  context = offscreen.getContext("webgpu");
  if (!context) {
    console.error("Failed to get WebGPU context");
    return;
  }

  // biome-ignore lint/suspicious/noExplicitAny: WebGPU types not available
  const format = (navigator as any).gpu.getPreferredCanvasFormat();
  context.configure({
    // biome-ignore lint/suspicious/noExplicitAny: WebGPU types not available
    device: device as any,
    format,
    alphaMode: "premultiplied",
  });

  // Create shaders and pipeline
  await createPipeline();

  draw();
}

function resize(payload: PayloadResize) {
  console.log("Worker resized with payload:", payload);

  if (!offscreen) return;

  width = payload.width;
  height = payload.height;

  offscreen.width = width;
  offscreen.height = height;
  draw();
}

function closeOperation() {
  // Cleanup logic here
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
    return;
  }

  if (type === "stop") {
    return;
  }
});

// Optional: Handle worker termination
self.addEventListener("close", () => {
  closeOperation();
  console.log("Worker is terminating");
});

self.postMessage({ type: "init" });
