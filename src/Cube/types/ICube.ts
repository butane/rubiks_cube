import { ICubeFaces } from './ICubeFaces';

export interface ICube {
  reset(): void;
  serialize(): ICubeFaces;
  randomize(count: number): void;
  F(count: number): ICube;
  B(count: number): ICube;
  R(count: number): ICube;
  L(count: number): ICube;
  U(count: number): ICube;
  D(count: number): ICube;
}
