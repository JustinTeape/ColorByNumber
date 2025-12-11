// src/utils/imageProcessor.ts
import type { CellData, ColorDefinition, GridMatrix } from '../types';

// 1. Helper to calculate distance between two colors (Euclidean)
const colorDistance = (c1: number[], c2: number[]) => {
  return Math.sqrt(
    Math.pow(c1[0] - c2[0], 2) +
    Math.pow(c1[1] - c2[1], 2) +
    Math.pow(c1[2] - c2[2], 2)
  );
};

// 2. Helper to convert [r, g, b] to Hex string
const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

export const processImageToGrid = (
  imageSrc: string,
  rows: number = 15,
  cols: number = 15,
  maxColors: number = 8
): Promise<{ grid: GridMatrix; palette: ColorDefinition[] }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      // A. Draw image to a small canvas to "pixelate" it automatically
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = cols;
      canvas.height = rows;

      // Draw and resize
      ctx.drawImage(img, 0, 0, cols, rows);

      // Get raw pixel data
      const imgData = ctx.getImageData(0, 0, cols, rows).data;
      const pixels: number[][] = []; // Array of [r,g,b]

      // Extract RGB (ignore Alpha for now)
      for (let i = 0; i < imgData.length; i += 4) {
        pixels.push([imgData[i], imgData[i + 1], imgData[i + 2]]);
      }

      // B. K-MEANS CLUSTERING (Simplified)
      // 1. Initialize centroids with random pixels
      let centroids = pixels.slice(0, maxColors);
      
      // 2. Iterate to refine centroids (run 10 times for speed)
      for (let iter = 0; iter < 10; iter++) {
        const clusters: number[][][] = Array(maxColors).fill(0).map(() => []);
        
        // Assign each pixel to closest centroid
        pixels.forEach(p => {
          let minDist = Infinity;
          let idx = 0;
          centroids.forEach((c, i) => {
            const dist = colorDistance(p, c);
            if (dist < minDist) {
              minDist = dist;
              idx = i;
            }
          });
          clusters[idx].push(p);
        });

        // Recalculate centroids
        centroids = centroids.map((c, i) => {
          const cluster = clusters[i];
          if (cluster.length === 0) return c; // Avoid empty clusters
          const sum = cluster.reduce((acc, val) => [acc[0]+val[0], acc[1]+val[1], acc[2]+val[2]], [0,0,0]);
          return [sum[0]/cluster.length, sum[1]/cluster.length, sum[2]/cluster.length];
        });
      }

      // C. Generate Output Data
      // Create Palette
      const palette: ColorDefinition[] = centroids.map((c, index) => ({
        id: index + 1,
        hex: rgbToHex(c[0], c[1], c[2]),
        label: `Color ${index + 1}`
      }));

      // Create Grid mapped to Palette IDs
      const grid: GridMatrix = [];
      for (let r = 0; r < rows; r++) {
        const rowData: CellData[] = [];
        for (let c = 0; c < cols; c++) {
          const pixelIndex = r * cols + c;
          const pixel = pixels[pixelIndex];

          // Find closest color in our new palette
          let minDist = Infinity;
          let targetId = 1;
          
          centroids.forEach((cent, i) => {
            const dist = colorDistance(pixel, cent);
            if (dist < minDist) {
              minDist = dist;
              targetId = i + 1;
            }
          });

          rowData.push({
            row: r,
            col: c,
            targetColorId: targetId,
            filledColorId: null 
          });
        }
        grid.push(rowData);
      }

      resolve({ grid, palette });
    };
  });
};