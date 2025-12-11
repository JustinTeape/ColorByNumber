export interface ColorDefinition {
  id: number;
  hex: string;
  label: string;
}

export interface CellData {
  row: number;
  col: number;
  targetColorId: number;
  filledColorId: number | null;
}

export type GridMatrix = CellData[][];