export const DEFAULT_PARAMS = {
  temperature: 0,
  tint: 0,
  contrast: 1.0,
  brightness: 1.0,
  gamma: 1.0,
  saturation: 1.0,
  vibrance: 0.0,
  lift: 0.0,
  gain: 1.0,
  exposure: 0.0,
  clarity: 0.0,
} as const;

export type DefaultParams = typeof DEFAULT_PARAMS;
