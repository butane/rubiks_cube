import { IAdjacentFaceMap } from './types/IAdjacentFaceMap';
import { ICubeFaceNames } from './types/ICubeFaceNames';
import { ICubeFaces } from './types/ICubeFaces';

class Cube {
  #faces: ICubeFaces;
  static #adjacentFaceMap: IAdjacentFaceMap = {
    F: [
      ['U', [0, 1, 2]],
      ['R', [0, 1, 2]],
      ['D', [0, 1, 2]],
      ['L', [0, 1, 2]],
    ],
    B: [
      ['U', [4, 5, 6]],
      ['L', [4, 5, 6]],
      ['D', [4, 5, 6]],
      ['R', [4, 5, 6]],
    ],
    R: [
      ['U', [6, 7, 0]],
      ['B', [6, 7, 0]],
      ['D', [2, 3, 4]],
      ['F', [2, 3, 4]],
    ],
    L: [
      ['U', [2, 3, 4]],
      ['F', [6, 7, 0]],
      ['D', [6, 7, 0]],
      ['B', [2, 3, 4]],
    ],
    U: [
      ['F', [0, 1, 2]],
      ['L', [6, 7, 0]],
      ['B', [0, 1, 2]],
      ['R', [2, 3, 4]],
    ],
    D: [
      ['F', [4, 5, 6]],
      ['R', [6, 7, 0]],
      ['B', [4, 5, 6]],
      ['L', [2, 3, 4]],
    ],
  };

  constructor() {
    this.reset();
  }

  reset(): void {
    this.#faces = {
      F: ['F', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
      B: ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
      R: ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
      L: ['L', 'L', 'L', 'L', 'L', 'L', 'L', 'L'],
      U: ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U'],
      D: ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D'],
    };
  }

  serialize(): ICubeFaces {
    return {
      F: this.#serializeFace('F'),
      B: this.#serializeFace('B'),
      R: this.#serializeFace('R'),
      L: this.#serializeFace('L'),
      U: this.#serializeFace('U'),
      D: this.#serializeFace('D'),
    };
  }

  #serializeFace(faceName: ICubeFaceNames): ICubeFaceNames[] {
    const face = this.#faces[faceName];
    return [
      face[0],
      face[1],
      face[2],
      face[7],
      faceName,
      face[3],
      face[6],
      face[5],
      face[4],
    ];
  }

  static #rotateCount(count: number): number {
    const actualCount = count % 4;
    if (actualCount === 3) return -1;
    if (actualCount === -3) return 1;
    if (actualCount === -2) return 2;
    return actualCount;
  }

  #rotateFace(faceName: ICubeFaceNames, count: number): void {
    let actualCount = Cube.#rotateCount(count);
    if (actualCount === -1) {
      this.#rotateFaceCounterClockWise(faceName);
    } else {
      while (actualCount > 0) {
        actualCount--;
        this.#rotateFaceClockWise(faceName);
      }
    }
  }

  #rotateFaceClockWise(faceName: ICubeFaceNames): void {
    const face = this.#faces[faceName];
    const adjacentFaces = Cube.#adjacentFaceMap[faceName];
    this.#faces[faceName] = [...face.slice(6), ...face.slice(0, 6)];

    const temp = [
      this.#faces[adjacentFaces[3][0]][adjacentFaces[3][1][0]],
      this.#faces[adjacentFaces[3][0]][adjacentFaces[3][1][1]],
      this.#faces[adjacentFaces[3][0]][adjacentFaces[3][1][2]],
    ];

    for (let i = 3; i > 0; i--) {
      for (let j = 0; j < 3; j++) {
        this.#faces[adjacentFaces[i][0]][adjacentFaces[i][1][j]] =
          this.#faces[adjacentFaces[i - 1][0]][adjacentFaces[i - 1][1][j]];
      }
    }

    for (let i = 0; i < 3; i++) {
      this.#faces[adjacentFaces[0][0]][adjacentFaces[0][1][i]] = temp[i];
    }
  }

  #rotateFaceCounterClockWise(faceName: ICubeFaceNames): void {
    const face = this.#faces[faceName];
    const adjacentFaces = Cube.#adjacentFaceMap[faceName];
    this.#faces[faceName] = [...face.slice(2), ...face.slice(0, 2)];

    const temp = [
      this.#faces[adjacentFaces[0][0]][adjacentFaces[0][1][0]],
      this.#faces[adjacentFaces[0][0]][adjacentFaces[0][1][1]],
      this.#faces[adjacentFaces[0][0]][adjacentFaces[0][1][2]],
    ];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        this.#faces[adjacentFaces[i][0]][adjacentFaces[i][1][j]] =
          this.#faces[adjacentFaces[i + 1][0]][adjacentFaces[i + 1][1][j]];
      }
    }

    for (let i = 0; i < 3; i++) {
      this.#faces[adjacentFaces[3][0]][adjacentFaces[3][1][i]] = temp[i];
    }
  }

  static #randomNumber(start: number, end: number): number {
    return Math.floor(Math.random() * (end - start + 1) + start);
  }

  randomize(count: number): void {
    const faceNames: ICubeFaceNames[] = ['F', 'B', 'R', 'L', 'U', 'D'];
    for (let i = 0; i < count; i++) {
      this.#rotateFace(
        faceNames[Cube.#randomNumber(0, 5)],
        Cube.#randomNumber(-1, 2)
      );
    }
  }

  /**
   * Rotate Front face count times.
   *
   * @param {number} count Number of rotations clockwise. Negative number for counter clockwise.
   */
  F(count: number): Cube {
    this.#rotateFace('F', count);
    return this;
  }

  /**
   * Rotate Back face count times.
   *
   * @param {number} count Number of rotations clockwise. Negative number for counter clockwise.
   */
  B(count: number): Cube {
    this.#rotateFace('B', count);
    return this;
  }

  /**
   * Rotate Right face count times.
   *
   * @param {number} count Number of rotations clockwise. Negative number for counter clockwise.
   */
  R(count: number): Cube {
    this.#rotateFace('R', count);
    return this;
  }

  /**
   * Rotate Left face count times.
   *
   * @param {number} count Number of rotations clockwise. Negative number for counter clockwise.
   */
  L(count: number): Cube {
    this.#rotateFace('L', count);
    return this;
  }

  /**
   * Rotate Upper face count times.
   *
   * @param {number} count Number of rotations clockwise. Negative number for counter clockwise.
   */
  U(count: number): Cube {
    this.#rotateFace('U', count);
    return this;
  }

  /**
   * Rotate Down face count times.
   *
   * @param {number} count Number of rotations clockwise. Negative number for counter clockwise.
   */
  D(count: number): Cube {
    this.#rotateFace('D', count);
    return this;
  }
}

export default Cube;
