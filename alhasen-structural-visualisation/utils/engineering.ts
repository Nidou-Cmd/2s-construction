import { HangarDimensions, ProfileDimensions, StructuralAnalysis, STEEL_DENSITY, STEEL_PRICE_PER_KG, YIELD_STRENGTH, WIND_RAIN_LOAD, DEAD_LOAD } from '@/types';

export const calculateStructure = (
  dims: HangarDimensions,
  profiles: ProfileDimensions
): StructuralAnalysis => {
  const { width, length, height, roofPitch, baySpacing } = dims;
  const { type, columnWidth, rafterDepth, flangeThickness } = profiles;

  // Geometry calculations
  const numFrames = Math.floor(length / baySpacing) + 1;
  const roofAngleRad = (roofPitch * Math.PI) / 180;
  const roofHeight = (width / 2) * Math.tan(roofAngleRad);
  const rafterLength = (width / 2) / Math.cos(roofAngleRad);

  // 1. Area & Volume
  const totalArea = width * length;
  const totalVolume = (width * length * height) + (0.5 * width * roofHeight * length);

  // 2. Weight Estimation (Simplified shape calculation)
  let columnSectionArea = 0;
  let rafterSectionArea = 0;
  let Wx_Column = 0;
  let Wx_Rafter = 0;

  const calcWx = (depth: number, w: number, tw: number, tf: number) => {
    const outerInertia = (w * Math.pow(depth, 3)) / 12;
    const innerInertia = ((w - tw) * Math.pow(depth - 2 * tf, 3)) / 12;
    const I = outerInertia - innerInertia;
    return I / (depth / 2); // W = I / y
  };

  if (type === 'PRS') {
    const webThickness = flangeThickness * 0.6;
    columnSectionArea = (2 * columnWidth * flangeThickness) + ((columnWidth - 2 * flangeThickness) * webThickness);
    rafterSectionArea = (2 * rafterDepth * flangeThickness) + ((rafterDepth - 2 * flangeThickness) * webThickness);
    Wx_Column = calcWx(columnWidth, columnWidth, webThickness, flangeThickness);
    Wx_Rafter = calcWx(rafterDepth, rafterDepth, webThickness, flangeThickness);
  } else if (type === 'HEA') {
    // HEA standard rough approx: width ~ height, flanges wider
    const webThickness = flangeThickness * 0.55;
    const flangeW = columnWidth * 0.95;
    columnSectionArea = (2 * flangeW * flangeThickness) + ((columnWidth - 2 * flangeThickness) * webThickness);
    rafterSectionArea = (2 * (rafterDepth * 0.95) * flangeThickness) + ((rafterDepth - 2 * flangeThickness) * webThickness);
    Wx_Column = calcWx(columnWidth, flangeW, webThickness, flangeThickness);
    Wx_Rafter = calcWx(rafterDepth, rafterDepth * 0.95, webThickness, flangeThickness);
  } else if (type === 'IPE') {
    // IPE standard rough approx: width ~ 0.5 * height
    const webThickness = flangeThickness * 0.5;
    const flangeWCol = columnWidth * 0.5;
    const flangeWRaf = rafterDepth * 0.5;
    columnSectionArea = (2 * flangeWCol * flangeThickness) + ((columnWidth - 2 * flangeThickness) * webThickness);
    rafterSectionArea = (2 * flangeWRaf * flangeThickness) + ((rafterDepth - 2 * flangeThickness) * webThickness);
    Wx_Column = calcWx(columnWidth, flangeWCol, webThickness, flangeThickness);
    Wx_Rafter = calcWx(rafterDepth, flangeWRaf, webThickness, flangeThickness);
  } else if (type === 'TREILLIS') {
    // Treillis (Truss) approx
    // Lighter weight, much higher inertia equivalent
    columnSectionArea = columnWidth * 0.09;
    rafterSectionArea = rafterDepth * 0.04;
    Wx_Column = (columnSectionArea * Math.pow(columnWidth, 2)) / 6;
    Wx_Rafter = (rafterSectionArea * Math.pow(rafterDepth, 2)) / 6;
  }

  const oneFrameWeight = (2 * height * columnSectionArea + 2 * rafterLength * rafterSectionArea) * STEEL_DENSITY;
  let totalSteelWeight = oneFrameWeight * numFrames;
  if (type === 'TREILLIS') totalSteelWeight *= 0.75; // Truss is lighter

  // 3. Load Analysis (Tributary Area Method)
  const tributaryWidth = baySpacing;
  const totalLineLoad = (WIND_RAIN_LOAD + DEAD_LOAD) * tributaryWidth; // kN/m

  // 4. Stress / Moment Calculation (Simplified)
  const span = width;
  let momentDivider = 14;
  if (type === 'TREILLIS') momentDivider = 10; // Truss pinned joints

  const maxMoment = (totalLineLoad * Math.pow(span, 2)) / momentDivider; // kN.m

  // Stress = Moment / W (in MPa)
  // maxMoment is in kN.m. -> N.mm = maxMoment * 10^6
  // Wx is in m^3. -> mm^3 = Wx * 10^9
  // Stress (MPa) = N.mm / mm^3
  const bendingStressColumnMPa = (maxMoment * 1e6) / (Wx_Column * 1e9 || 1);
  const bendingStressRafterMPa = (maxMoment * 1e6) / (Wx_Rafter * 1e9 || 1);

  // Normalize Stress (Ratio 1.0 means Yield Strength reached)
  const yieldStrength = YIELD_STRENGTH || 275;
  let columnStressRatio = bendingStressColumnMPa / yieldStrength;
  let rafterStressRatio = bendingStressRafterMPa / yieldStrength;

  // Add realistic self-weight compression to column
  const selfWeightForceN = (totalSteelWeight / numFrames) * 9.81;
  const areaRatioColumn = columnSectionArea * 1e6; // m^2 to mm^2
  const compStressMPa = selfWeightForceN / areaRatioColumn;
  columnStressRatio += compStressMPa / yieldStrength;

  // Cost
  const costEstimate = totalSteelWeight * STEEL_PRICE_PER_KG;

  return {
    totalArea,
    totalVolume,
    steelWeight: totalSteelWeight,
    costEstimate,
    maxMoment,
    columnStress: Math.min(columnStressRatio, 2.0),
    rafterStress: Math.min(rafterStressRatio, 2.0),
    deflectionRatio: span / 200 // Mock deflection
  };
};
