import Cube from '../Cube/Cube';
import { ICubeFaceNames } from '../Cube/types/ICubeFaceNames';
import CubeRenderer from '../CubeRenderer/CubeRenderer';
import { ICubeColourNames } from '../CubeRenderer/types/ICubeColourNames';

export function cubeSerializeAdaptor(cube: Cube): ICubeColourNames[] {
  const allowedFaceColours = CubeRenderer.allowedFaceColours();
  const { U, L, B, ...cubeFaces } = cube.serialize();

  if (allowedFaceColours.length !== 6) {
    throw new Error('CubeRenderer Error: Cube should have 6 faces');
  }

  const faceMap: { [key in ICubeFaceNames]: ICubeColourNames } = {
    F: allowedFaceColours[0],
    R: allowedFaceColours[1],
    U: allowedFaceColours[2],
    L: allowedFaceColours[3],
    B: allowedFaceColours[4],
    D: allowedFaceColours[5],
  };

  return [
    ...cubeFaces.F,
    ...cubeFaces.R,
    ...[U[2], U[5], U[8], U[1], U[4], U[7], U[0], U[3], U[6]],
    ...[L[2], L[5], L[8], L[1], L[4], L[7], L[0], L[3], L[6]],
    ...[B[2], B[5], B[8], B[1], B[4], B[7], B[0], B[3], B[6]],
    ...cubeFaces.D,
  ].map((face) => faceMap[face]);
}
