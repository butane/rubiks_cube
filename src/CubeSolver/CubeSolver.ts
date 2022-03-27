import { ICube } from '../Cube/types/ICube';
import { ICubeFaceNames } from '../Cube/types/ICubeFaceNames';
import { ICubeFaces } from '../Cube/types/ICubeFaces';
import { ICubeSolver } from './types/ICubeSolver';
import { IMoveHistory } from './types/IMoveHistory';

class CubeSolver implements ICubeSolver {
  #cube: ICube;
  #cubeFaces: ICubeFaces;
  #moveHistory: IMoveHistory = [];

  constructor(cube: ICube) {
    this.#cube = cube;
    this.#cubeFaces = cube.serialize();
  }

  #rotateFace(face: ICubeFaceNames, count: number): CubeSolver {
    this.#cube[face](count);
    this.#pushToHistory(face, count);
    this.#cubeFaces = this.#cube.serialize();
    return this;
  }

  #pushToHistory(face: ICubeFaceNames, count: number) {
    const length = this.#moveHistory.length;
    if (length && this.#moveHistory[length - 1][0] === face) {
      this.#moveHistory[length - 1][1] += count;
      let totalCount = this.#moveHistory[length - 1][1];
      totalCount = totalCount > 3 ? totalCount % 4 : totalCount;
      totalCount = totalCount < -3 ? totalCount % 4 : totalCount;
      totalCount = totalCount === 3 ? -1 : totalCount;
      totalCount = totalCount === -3 ? 1 : totalCount;
      this.#moveHistory[length - 1][1] = totalCount;
      if (totalCount === 0) {
        this.#moveHistory.splice(length - 1, 1);
      }
    } else {
      this.#moveHistory.push([face, count]);
    }
  }

  getMoveHistory(): IMoveHistory {
    return this.#moveHistory;
  }

  /**
   * Solve using algorithm described here: https://www.youtube.com/watch?v=R-R0KrXvWbc
   *
   * @returns boolean
   */
  solve(): boolean {
    const MAX_STEP1_RETRY = 4;

    if (!this.#isStep3Complete()) {
      if (!this.#isStep2Complete()) {
        // Step 1
        if (!this.#isStep1Complete()) {
          for (let i = 0; i < MAX_STEP1_RETRY; i++) {
            if (this.#step1()) break;
          }
          if (!this.#isStep1Complete())
            throw new Error('Step 1 failed to complete');
        }

        // Step 2
        if (!this.#step2()) throw new Error('Step 2 failed to complete');
      }

      // Step 3
      if (!this.#step3()) throw new Error('Step 3 failed to complete');
    }

    return false;
  }

  // Make the Daisy
  #step1(): boolean {
    // Daisy petals at Down face (Down layer)
    {
      const positions: [number, number, ICubeFaceNames][] = [
        [1, 1, 'F'],
        [5, 3, 'R'],
        [3, 5, 'L'],
        [7, 7, 'B'],
      ];
      positions.forEach((pos) => {
        if (this.#cubeFaces['D'][pos[0]] === 'D') {
          while (this.#cubeFaces['U'][pos[1]] === 'D') {
            this.#rotateFace('U', 1);
          }
          this.#rotateFace(pos[2], 2);
        }
      });
    }

    // Daisy petals at Down layer (Not Down Face)
    {
      const positions: [number, number, ICubeFaceNames, ICubeFaceNames][] = [
        [5, 7, 'L', 'B'],
        [7, 3, 'B', 'R'],
        [3, 1, 'R', 'F'],
        [7, 5, 'F', 'L'],
      ];
      positions.forEach((pos) => {
        if (this.#cubeFaces[pos[2]][pos[0]] === 'D') {
          while (this.#cubeFaces['U'][pos[1]] === 'D') {
            this.#rotateFace('U', 1);
          }
          this.#rotateFace(pos[2], 1)
            .#rotateFace(pos[3], -1)
            .#rotateFace(pos[2], -1);
        }
      });
    }

    // Daisy petals at Mid Layer
    {
      const positions: [
        ICubeFaceNames,
        number,
        number,
        ICubeFaceNames,
        number
      ][] = [
        ['L', 1, 1, 'F', 1],
        ['L', 7, 7, 'B', -1],
        ['B', 5, 5, 'L', 1],
        ['B', 3, 3, 'R', -1],
        ['R', 7, 7, 'B', 1],
        ['R', 1, 1, 'F', -1],
        ['F', 5, 3, 'R', 1],
        ['F', 3, 5, 'L', -1],
      ];
      positions.forEach((pos) => {
        if (this.#cubeFaces[pos[0]][pos[1]] === 'D') {
          while (this.#cubeFaces['U'][pos[2]] === 'D') {
            this.#rotateFace('U', 1);
          }
          this.#rotateFace(pos[3], pos[4]);
        }
      });
    }

    // Daisy petals at Up layer (Not Up face)
    {
      const positions: [ICubeFaceNames, number, number, ICubeFaceNames][] = [
        ['L', 3, 1, 'F'],
        ['B', 1, 5, 'L'],
        ['R', 5, 7, 'B'],
        ['F', 1, 3, 'R'],
      ];
      positions.forEach((pos) => {
        if (this.#cubeFaces[pos[0]][pos[1]] === 'D') {
          this.#rotateFace(pos[0], 1);
          while (this.#cubeFaces['U'][pos[2]] === 'D') {
            this.#rotateFace('U', 1);
          }
          this.#rotateFace(pos[3], 1);
        }
      });
    }

    return this.#isStep1Complete();
  }

  /**
   * Checks if Daisy is formed in Up layer
   */
  #isStep1Complete(): boolean {
    return (
      this.#cubeFaces['U'][1] === 'D' &&
      this.#cubeFaces['U'][3] === 'D' &&
      this.#cubeFaces['U'][5] === 'D' &&
      this.#cubeFaces['U'][7] === 'D'
    );
  }

  // The White Cross
  #step2(): boolean {
    const positions: [number, number, ICubeFaceNames][] = [
      [1, 1, 'F'],
      [3, 5, 'R'],
      [7, 1, 'B'],
      [5, 3, 'L'],
    ];
    for (let i = 0; i < 4; i++) {
      positions.forEach((pos) => {
        if (
          this.#cubeFaces['U'][pos[0]] === 'D' &&
          this.#cubeFaces[pos[2]][pos[1]] === pos[2]
        ) {
          this.#rotateFace(pos[2], 2);
        }
      });
      this.#rotateFace('U', 1);
    }

    return this.#isStep2Complete();
  }

  /**
   * Checks if the White cross is formed in Down layer
   */
  #isStep2Complete(): boolean {
    return (
      this.#cubeFaces['D'][1] === 'D' &&
      this.#cubeFaces['D'][3] === 'D' &&
      this.#cubeFaces['D'][5] === 'D' &&
      this.#cubeFaces['D'][7] === 'D' &&
      this.#cubeFaces['F'][7] === 'F' &&
      this.#cubeFaces['R'][3] === 'R' &&
      this.#cubeFaces['B'][7] === 'B' &&
      this.#cubeFaces['L'][5] === 'L'
    );
  }

  // Solve Bottom Layer
  #step3(): boolean {
    let superEdgeCase = false;
    do {
      superEdgeCase = false;
      let foundEdgeCase2 = false;
      do {
        foundEdgeCase2 = false;
        let movedToTop = false;
        do {
          movedToTop = false;
          // Regular Trigger Step (from algorithm)
          {
            const positions: [
              ICubeFaceNames,
              number,
              ICubeFaceNames,
              number,
              string
            ][] = [
              ['F', 0, 'L', 0, 'leftTrigger'],
              ['F', 2, 'R', 2, 'rightTrigger'],
              ['R', 2, 'F', 2, 'leftTrigger'],
              ['R', 8, 'B', 0, 'rightTrigger'],
              ['B', 0, 'R', 8, 'leftTrigger'],
              ['B', 2, 'L', 6, 'rightTrigger'],
              ['L', 6, 'B', 2, 'leftTrigger'],
              ['L', 0, 'F', 0, 'rightTrigger'],
            ];
            let foundMatch = false;
            do {
              foundMatch = false;
              for (let i = 0; i < 4; i++) {
                positions.forEach((pos) => {
                  if (
                    this.#cubeFaces[pos[0]][pos[1]] === pos[0] &&
                    this.#cubeFaces[pos[2]][pos[3]] === 'D'
                  ) {
                    foundMatch = true;
                    if (pos[4] === 'leftTrigger') {
                      this.#rotateFace(pos[2], -1)
                        .#rotateFace('U', -1)
                        .#rotateFace(pos[2], 1);
                    } else {
                      this.#rotateFace(pos[2], 1)
                        .#rotateFace('U', 1)
                        .#rotateFace(pos[2], -1);
                    }
                  }
                });
                this.#rotateFace('U', 1);
              }
            } while (foundMatch);
          }

          // Edge case 1 (from algorithm)
          {
            const positions: [
              ICubeFaceNames,
              number,
              ICubeFaceNames,
              string
            ][] = [
              ['F', 6, 'L', 'leftTrigger'],
              ['F', 8, 'R', 'rightTrigger'],
              ['R', 0, 'F', 'leftTrigger'],
              ['R', 6, 'B', 'rightTrigger'],
              ['B', 6, 'R', 'leftTrigger'],
              ['B', 8, 'L', 'rightTrigger'],
              ['L', 8, 'B', 'leftTrigger'],
              ['L', 2, 'F', 'rightTrigger'],
            ];
            positions.forEach((pos) => {
              if (this.#cubeFaces[pos[0]][pos[1]] === 'D') {
                movedToTop = true;
                if (pos[3] === 'leftTrigger') {
                  this.#rotateFace(pos[2], -1)
                    .#rotateFace('U', -1)
                    .#rotateFace(pos[2], 1);
                } else {
                  this.#rotateFace(pos[2], 1)
                    .#rotateFace('U', 1)
                    .#rotateFace(pos[2], -1);
                }
              }
            });
          }
        } while (movedToTop);

        // Edge case 2 (from algorithm)
        {
          const positions: [number, number, ICubeFaceNames][] = [
            [0, 2, 'R'],
            [2, 0, 'F'],
            [8, 6, 'L'],
            [6, 8, 'B'],
          ];
          for (let i = 0; i < 4; i++) {
            positions.forEach((pos) => {
              if (
                this.#cubeFaces['U'][pos[0]] === 'D' &&
                this.#cubeFaces['D'][pos[1]] !== 'D'
              ) {
                foundEdgeCase2 = true;
                this.#rotateFace(pos[2], 1)
                  .#rotateFace('U', 2)
                  .#rotateFace(pos[2], -1);
              }
            });
            this.#rotateFace('U', 1);
          }
        }
      } while (foundEdgeCase2);

      // Super Edge case (not covered in the given algorithm)
      {
        const positions: [ICubeFaceNames, number, ICubeFaceNames, number][] = [
          ['F', 6, 'L', 2],
          ['R', 0, 'F', 8],
          ['B', 6, 'R', 6],
          ['L', 8, 'B', 8],
        ];
        positions.forEach((pos) => {
          if (
            this.#cubeFaces[pos[0]][pos[1]] !== pos[0] ||
            this.#cubeFaces[pos[2]][pos[3]] !== pos[2]
          ) {
            superEdgeCase = true;
            this.#rotateFace(pos[0], 1)
              .#rotateFace('U', 1)
              .#rotateFace(pos[0], -1);
          }
        });
      }
    } while (superEdgeCase);

    return this.#isStep3Complete();
  }

  #isStep3Complete(): boolean {
    return (
      this.#cubeFaces['D'][0] === 'D' &&
      this.#cubeFaces['D'][1] === 'D' &&
      this.#cubeFaces['D'][2] === 'D' &&
      this.#cubeFaces['D'][3] === 'D' &&
      this.#cubeFaces['D'][4] === 'D' &&
      this.#cubeFaces['D'][5] === 'D' &&
      this.#cubeFaces['D'][6] === 'D' &&
      this.#cubeFaces['D'][7] === 'D' &&
      this.#cubeFaces['D'][8] === 'D' &&
      this.#cubeFaces['F'][6] === 'F' &&
      this.#cubeFaces['F'][7] === 'F' &&
      this.#cubeFaces['F'][8] === 'F' &&
      this.#cubeFaces['R'][0] === 'R' &&
      this.#cubeFaces['R'][3] === 'R' &&
      this.#cubeFaces['R'][6] === 'R' &&
      this.#cubeFaces['B'][6] === 'B' &&
      this.#cubeFaces['B'][7] === 'B' &&
      this.#cubeFaces['B'][8] === 'B' &&
      this.#cubeFaces['L'][8] === 'L' &&
      this.#cubeFaces['L'][5] === 'L' &&
      this.#cubeFaces['L'][2] === 'L'
    );
  }
}

export default CubeSolver;
