export const DEFAULT_PARAMS = {
  temperature: 0,
  tint: 0,
  contrast: 1.6,
  brightness: 1.0,
  gamma: 2.5,
  // saturation: 1.0,
  saturation: 5.0,
  vibrance: 0.0,
  lift: 0.0,
  gain: 1.0,
  exposure: 0.0,
  // clarity: 0.0,
  clarity: 0.6,
} as const;

export type DefaultParams = typeof DEFAULT_PARAMS;
