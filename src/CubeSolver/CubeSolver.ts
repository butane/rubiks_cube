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
    const MAX_STEP6_RETRY = 2;
    const MAX_STEP7_RETRY = 2;
    const MAX_STEP8_RETRY = 2;

    if (!this.#isStep8Complete()) {
      if (!this.#isStep7Complete()) {
        if (!this.#isStep6Complete()) {
          if (!this.#isStep5Complete()) {
            if (!this.#isStep4Complete()) {
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
                  if (!this.#isStep2Complete()) {
                    if (!this.#step2())
                      throw new Error('Step 2 failed to complete');
                  }
                }

                // Step 3
                if (!this.#isStep3Complete()) {
                  if (!this.#step3())
                    throw new Error('Step 3 failed to complete');
                }
              }

              // Step 4
              if (!this.#isStep4Complete()) {
                if (!this.#step4())
                  throw new Error('Step 4 failed to complete');
              }
            }

            // Step 5
            if (!this.#isStep5Complete()) {
              if (!this.#step5()) throw new Error('Step 5 failed to complete');
            }
          }

          // Step 6
          if (!this.#isStep6Complete()) {
            for (let i = 0; i < MAX_STEP6_RETRY; i++) {
              if (this.#step6()) break;
            }
            if (!this.#isStep6Complete())
              throw new Error('Step 6 failed to complete');
          }
        }

        // Step 7
        if (!this.#isStep7Complete()) {
          for (let i = 0; i < MAX_STEP7_RETRY; i++) {
            if (this.#step7()) break;
          }
          if (!this.#isStep7Complete())
            throw new Error('Step 7 failed to complete');
        }
      }

      // Step 8
      if (!this.#isStep8Complete()) {
        for (let i = 0; i < MAX_STEP8_RETRY; i++) {
          if (this.#step8()) break;
        }
        if (!this.#isStep8Complete())
          throw new Error('Step 8 failed to complete');
      }
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

  // Solve Mid Layer
  #step4(): boolean {
    let checkForMore = false;
    let foundEdgeCase = false;
    do {
      foundEdgeCase = false;
      do {
        checkForMore = false;
        const positions: [
          number,
          ICubeFaceNames,
          number,
          ICubeFaceNames,
          ICubeFaceNames
        ][] = [
          [1, 'F', 1, 'L', 'R'],
          [5, 'L', 3, 'B', 'F'],
          [7, 'B', 1, 'R', 'L'],
          [3, 'R', 5, 'F', 'B'],
        ];
        for (let i = 0; i < 4; i++) {
          positions.forEach((pos) => {
            if (
              this.#cubeFaces['U'][pos[0]] !== 'U' &&
              this.#cubeFaces[pos[1]][pos[2]] === pos[1]
            ) {
              checkForMore = true;
              if (this.#cubeFaces['U'][pos[0]] === pos[3]) {
                this.#rotateFace('U', -1)
                  .#rotateFace(pos[3], -1)
                  .#rotateFace('U', -1)
                  .#rotateFace(pos[3], 1)
                  .#rotateFace('U', 1)
                  .#rotateFace(pos[1], 1)
                  .#rotateFace('U', 1)
                  .#rotateFace(pos[1], -1)
                  .#rotateFace('U', -1);
              } else {
                this.#rotateFace('U', 1)
                  .#rotateFace(pos[4], 1)
                  .#rotateFace('U', 1)
                  .#rotateFace(pos[4], -1)
                  .#rotateFace('U', -1)
                  .#rotateFace(pos[1], -1)
                  .#rotateFace('U', -1)
                  .#rotateFace(pos[1], 1)
                  .#rotateFace('U', 1);
              }
            }
          });
          this.#rotateFace('U', 1);
        }
      } while (checkForMore);
      {
        const positions: [
          ICubeFaceNames,
          number,
          number,
          ICubeFaceNames,
          ICubeFaceNames
        ][] = [
          ['F', 3, 5, 'L', 'R'],
          ['R', 1, 7, 'F', 'B'],
          ['B', 3, 5, 'R', 'L'],
          ['L', 7, 1, 'B', 'F'],
        ];
        positions.forEach((pos) => {
          if (foundEdgeCase) return;
          if (this.#cubeFaces[pos[0]][pos[1]] !== pos[0]) {
            foundEdgeCase = true;
            this.#rotateFace('U', -1)
              .#rotateFace(pos[3], -1)
              .#rotateFace('U', -1)
              .#rotateFace(pos[3], 1)
              .#rotateFace('U', 1)
              .#rotateFace(pos[0], 1)
              .#rotateFace('U', 1)
              .#rotateFace(pos[0], -1)
              .#rotateFace('U', -1);
          } else if (this.#cubeFaces[pos[0]][pos[2]] !== pos[0]) {
            foundEdgeCase = true;
            this.#rotateFace('U', 1)
              .#rotateFace(pos[4], 1)
              .#rotateFace('U', 1)
              .#rotateFace(pos[4], -1)
              .#rotateFace('U', -1)
              .#rotateFace(pos[0], -1)
              .#rotateFace('U', -1)
              .#rotateFace(pos[0], 1)
              .#rotateFace('U', 1);
          }
        });
      }
    } while (foundEdgeCase);

    return this.#isStep4Complete();
  }

  #isStep4Complete(): boolean {
    return (
      this.#isStep3Complete() &&
      this.#cubeFaces['F'][3] === 'F' &&
      this.#cubeFaces['F'][5] === 'F' &&
      this.#cubeFaces['R'][1] === 'R' &&
      this.#cubeFaces['R'][7] === 'R' &&
      this.#cubeFaces['B'][3] === 'B' &&
      this.#cubeFaces['B'][5] === 'B' &&
      this.#cubeFaces['L'][7] === 'L' &&
      this.#cubeFaces['L'][1] === 'L'
    );
  }

  // Top face Cross
  #step5(): boolean {
    // No Top edge piece on top face
    if (
      this.#cubeFaces['U'][1] !== 'U' &&
      this.#cubeFaces['U'][5] !== 'U' &&
      this.#cubeFaces['U'][7] !== 'U' &&
      this.#cubeFaces['U'][3] !== 'U'
    ) {
      this.#rotateFace('F', 1)
        .#rotateFace('U', 1)
        .#rotateFace('R', 1)
        .#rotateFace('U', -1)
        .#rotateFace('R', -1)
        .#rotateFace('F', -1);
    }

    // Top Edge piece in a row on top face
    {
      let foundLine = false;
      const positions: [number, number, ICubeFaceNames, ICubeFaceNames][] = [
        [1, 7, 'F', 'R'],
        [3, 5, 'R', 'B'],
      ];
      positions.forEach((pos) => {
        if (foundLine) return;
        if (
          this.#cubeFaces['U'][pos[0]] === 'U' &&
          this.#cubeFaces['U'][pos[1]] === 'U'
        ) {
          foundLine = true;
          this.#rotateFace(pos[2], 1)
            .#rotateFace('U', 1)
            .#rotateFace(pos[3], 1)
            .#rotateFace('U', -1)
            .#rotateFace(pos[3], -1)
            .#rotateFace(pos[2], -1);
        }
      });
    }

    // Adjacent Top Edge piece on top face
    {
      let foundAdjacent = false;
      const positions: [number, number, ICubeFaceNames, ICubeFaceNames][] = [
        [5, 7, 'F', 'R'],
        [1, 5, 'R', 'B'],
        [3, 1, 'B', 'L'],
        [7, 3, 'L', 'F'],
      ];
      positions.forEach((pos) => {
        if (foundAdjacent) return;
        if (
          this.#cubeFaces['U'][pos[0]] === 'U' &&
          this.#cubeFaces['U'][pos[1]] === 'U'
        ) {
          foundAdjacent = true;
          this.#rotateFace(pos[2], 1)
            .#rotateFace('U', 1)
            .#rotateFace(pos[3], 1)
            .#rotateFace('U', -1)
            .#rotateFace(pos[3], -1)
            .#rotateFace(pos[2], -1);
        }
      });
    }
    return this.#isStep5Complete();
  }

  #isStep5Complete(): boolean {
    return (
      this.#isStep4Complete() &&
      this.#cubeFaces['U'][1] === 'U' &&
      this.#cubeFaces['U'][5] === 'U' &&
      this.#cubeFaces['U'][7] === 'U' &&
      this.#cubeFaces['U'][3] === 'U'
    );
  }

  // Upper face
  #step6(): boolean {
    const countUpCorners = () => {
      let count = 0;
      if (this.#cubeFaces['U'][0] === 'U') count++;
      if (this.#cubeFaces['U'][2] === 'U') count++;
      if (this.#cubeFaces['U'][8] === 'U') count++;
      if (this.#cubeFaces['U'][6] === 'U') count++;
      return count;
    };
    if (countUpCorners() === 4) return true;
    if (countUpCorners() === 3)
      throw new Error('Cube Error: Invalid Cube position');
    if (countUpCorners() === 0 || countUpCorners() === 2) {
      do {
        while (this.#cubeFaces['L'][0] !== 'U') {
          this.#rotateFace('U', 1);
        }
        this.#rotateFace('R', 1)
          .#rotateFace('U', 1)
          .#rotateFace('R', -1)
          .#rotateFace('U', 1)
          .#rotateFace('R', 1)
          .#rotateFace('U', 2)
          .#rotateFace('R', -1);
      } while (countUpCorners() !== 1);
    }
    if (countUpCorners() === 1) {
      while (this.#cubeFaces['U'][2] !== 'U') {
        this.#rotateFace('U', 1);
      }
      this.#rotateFace('R', 1)
        .#rotateFace('U', 1)
        .#rotateFace('R', -1)
        .#rotateFace('U', 1)
        .#rotateFace('R', 1)
        .#rotateFace('U', 2)
        .#rotateFace('R', -1);
    }

    return this.#isStep6Complete();
  }

  #isStep6Complete(): boolean {
    return (
      this.#isStep5Complete() &&
      this.#cubeFaces['U'][0] === 'U' &&
      this.#cubeFaces['U'][2] === 'U' &&
      this.#cubeFaces['U'][8] === 'U' &&
      this.#cubeFaces['U'][6] === 'U'
    );
  }

  // Matching Pairs
  #step7(): boolean {
    if (
      this.#cubeFaces['F'][0] !== this.#cubeFaces['F'][2] &&
      this.#cubeFaces['R'][2] !== this.#cubeFaces['R'][8] &&
      this.#cubeFaces['B'][0] !== this.#cubeFaces['B'][2] &&
      this.#cubeFaces['L'][6] !== this.#cubeFaces['L'][0]
    ) {
      this.#rotateFace('L', -1)
        .#rotateFace('U', 1)
        .#rotateFace('R', 1)
        .#rotateFace('U', -1)
        .#rotateFace('L', 1)
        .#rotateFace('U', 1)
        .#rotateFace('U', 1)
        .#rotateFace('R', -1)
        .#rotateFace('U', 1)
        .#rotateFace('R', 1)
        .#rotateFace('U', 2)
        .#rotateFace('R', -1);
    }
    if (this.#isStep7Complete()) return true;
    while (this.#cubeFaces['L'][6] !== this.#cubeFaces['L'][0]) {
      this.#rotateFace('U', 1);
    }
    this.#rotateFace('L', -1)
      .#rotateFace('U', 1)
      .#rotateFace('R', 1)
      .#rotateFace('U', -1)
      .#rotateFace('L', 1)
      .#rotateFace('U', 1)
      .#rotateFace('U', 1)
      .#rotateFace('R', -1)
      .#rotateFace('U', 1)
      .#rotateFace('R', 1)
      .#rotateFace('U', 2)
      .#rotateFace('R', -1);

    return this.#isStep7Complete();
  }

  #isStep7Complete(): boolean {
    return (
      this.#isStep6Complete() &&
      this.#cubeFaces['F'][0] === this.#cubeFaces['F'][2] &&
      this.#cubeFaces['R'][2] === this.#cubeFaces['R'][8] &&
      this.#cubeFaces['B'][0] === this.#cubeFaces['B'][2] &&
      this.#cubeFaces['L'][6] === this.#cubeFaces['L'][0]
    );
  }

  // Final step
  #step8(): boolean {
    while (this.#cubeFaces['F'][0] !== 'F') {
      this.#rotateFace('U', 1);
    }
    if (this.#isStep8Complete()) return true;
    if (
      this.#cubeFaces['F'][1] !== 'F' &&
      this.#cubeFaces['R'][5] !== 'R' &&
      this.#cubeFaces['B'][1] !== 'B' &&
      this.#cubeFaces['L'][3] !== 'L'
    ) {
      this.#rotateFace('F', 2)
        .#rotateFace('U', -1)
        .#rotateFace('R', -1)
        .#rotateFace('L', 1)
        .#rotateFace('F', 2)
        .#rotateFace('L', -1)
        .#rotateFace('R', 1)
        .#rotateFace('U', -1)
        .#rotateFace('F', 2);
    }

    let solvedFace: ICubeFaceNames;
    if (
      this.#cubeFaces['B'][0] === 'B' &&
      this.#cubeFaces['B'][1] === 'B' &&
      this.#cubeFaces['B'][2] === 'B'
    ) {
      solvedFace = 'B';
    } else if (
      this.#cubeFaces['L'][6] === 'L' &&
      this.#cubeFaces['L'][3] === 'L' &&
      this.#cubeFaces['L'][0] === 'L'
    ) {
      solvedFace = 'L';
    } else if (
      this.#cubeFaces['F'][0] === 'F' &&
      this.#cubeFaces['F'][1] === 'F' &&
      this.#cubeFaces['F'][2] === 'F'
    ) {
      solvedFace = 'F';
    } else if (
      this.#cubeFaces['R'][2] === 'R' &&
      this.#cubeFaces['R'][5] === 'R' &&
      this.#cubeFaces['R'][8] === 'R'
    ) {
      solvedFace = 'R';
    } else {
      throw new Error('Cube Error: Invalid Cube position');
    }

    const oppFaceMap: { [key in ICubeFaceNames]: ICubeFaceNames } = {
      F: 'B',
      R: 'L',
      B: 'F',
      L: 'R',
      U: 'D',
      D: 'U',
    };
    const adjacentFaceMap: { [key in ICubeFaceNames]: ICubeFaceNames[] } = {
      F: ['L', 'R'],
      R: ['F', 'B'],
      B: ['R', 'L'],
      L: ['B', 'F'],
      D: [],
      U: [],
    };

    const oppFace = oppFaceMap[solvedFace];
    const adjFace = adjacentFaceMap[oppFace];

    this.#rotateFace(oppFace, 2)
      .#rotateFace('U', -1)
      .#rotateFace(adjFace[1], -1)
      .#rotateFace(adjFace[0], 1)
      .#rotateFace(oppFace, 2)
      .#rotateFace(adjFace[0], -1)
      .#rotateFace(adjFace[1], 1)
      .#rotateFace('U', -1)
      .#rotateFace(oppFace, 2);

    return this.#isStep8Complete();
  }

  #isStep8Complete(): boolean {
    return (
      this.#isStep7Complete() &&
      this.#cubeFaces['F'][0] === 'F' &&
      this.#cubeFaces['F'][1] === 'F' &&
      this.#cubeFaces['R'][2] === 'R' &&
      this.#cubeFaces['R'][5] === 'R' &&
      this.#cubeFaces['B'][0] === 'B' &&
      this.#cubeFaces['B'][1] === 'B' &&
      this.#cubeFaces['L'][6] === 'L' &&
      this.#cubeFaces['L'][3] === 'L'
    );
  }
}

export default CubeSolver;
