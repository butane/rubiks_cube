import { ICubeFaceNames } from '../../Cube/types/ICubeFaceNames';
import { IMoveHistory } from './IMoveHistory';

export interface ICubeSolver {
  solve(): boolean;
  getMoveHistory(): IMoveHistory;
}
