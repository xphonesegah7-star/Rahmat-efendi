
export interface FilterSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  grayscale: number;
  sepia: number;
  blur: number;
  hueRotate: number;
  sharpen: number;
}

export interface PrintFormat {
  name: string;
  width: number; // in inches
  height: number;
  aspectRatio: number;
}

export const PRINT_FORMATS: PrintFormat[] = [
  { name: '4x6 (Standard)', width: 4, height: 6, aspectRatio: 2/3 },
  { name: '5x7 (Portrait)', width: 5, height: 7, aspectRatio: 5/7 },
  { name: '8x10 (Large)', width: 8, height: 10, aspectRatio: 4/5 },
  { name: 'Square (1:1)', width: 10, height: 10, aspectRatio: 1/1 },
  { name: 'A4 (Document)', width: 8.27, height: 11.69, aspectRatio: 1/1.414 },
];

export const INITIAL_FILTERS: FilterSettings = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  grayscale: 0,
  sepia: 0,
  blur: 0,
  hueRotate: 0,
  sharpen: 0,
};
