import { ICubeFaceNames } from './ICubeFaceNames';

export type IAdjacentFaceMap = {
  [key in ICubeFaceNames]: [ICubeFaceNames, [number, number, number]][];
};
