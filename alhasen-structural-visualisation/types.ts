export interface HangarDimensions {
  width: number; // meters
  length: number; // meters
  height: number; // meters (eave height)
  roofPitch: number; // degrees
  baySpacing: number; // meters (distance between frames)
}

export type StructureProfileType = 'PRS' | 'HEA' | 'IPE' | 'TREILLIS';

export interface ProfileDimensions {
  type: StructureProfileType;
  columnWidth: number; // meters (section height)
  rafterDepth: number; // meters (section height)
  flangeThickness: number; // meters
}

export interface StructuralAnalysis {
  totalArea: number;
  totalVolume: number;
  steelWeight: number;
  costEstimate: number;
  maxMoment: number;
  columnStress: number; // 0 to 1+ (normalized)
  rafterStress: number; // 0 to 1+ (normalized)
  deflectionRatio: number;
}

// Material Constants
export const STEEL_DENSITY = 7850; // kg/m3
export const STEEL_PRICE_PER_KG = 850; // FCFA/kg
export const YIELD_STRENGTH = 275; // MPa (S275)
export const WIND_RAIN_LOAD = 0.6; // kN/m2
export const DEAD_LOAD = 0.3; // kN/m2 (Structural self-weight approximation)
