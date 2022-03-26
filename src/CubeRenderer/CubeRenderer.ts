class CubeRenderer {
  #svgTemplate: string;
  #cubeColors: { [key: string]: string };

  constructor() {
    this.#init();
  }

  #init(): void {
    this.#svgTemplate = `<svg class="cube" width="425" height="490" viewBox="0 0 425 490" xmlns="http://www.w3.org/2000/svg">
      <metadata>C2S2 Rubik's cube. 2020-08-11T17:00:00 Rubik's cube for C2S2 programming test.</metadata>
      <g>
      <title>background</title>
      <rect fill="none" id="canvas_background" height="492" width="427" y="-1" x="-1"/>
      </g>
      <g>
      <title>Layer 1</title>
      <g id="g3263">
        <path stroke="#000000" stroke-width="5" fill="{{COLOR_01}}" d="m4.282,124.36l69.278,40l0,80l-69.278,-40l0,-80z" id="path3265"/>
        <path stroke="#000000" stroke-width="5" fill="{{COLOR_02}}" d="m73.56,164.36l69.29,40l0,80l-69.29,-40l0,-80z" id="path3267"/>
        <path stroke="#000000" stroke-width="5" fill="{{COLOR_03}}" d="m142.85,204.36l69.28,40l0,80l-69.28,-40l0,-80z" id="path3269"/>
        <path stroke="#000000" stroke-width="5" fill="{{COLOR_04}}" d="m4.282,204.36l69.278,40l0,80l-69.278,-40l0,-80z" id="path3271"/>
        <path stroke="#000000" stroke-width="5" fill="{{COLOR_05}}" d="m73.56,244.36l69.29,40l0,80l-69.29,-40l0,-80z" id="path3273"/>
        <path stroke="#000000" stroke-width="5" fill="{{COLOR_06}}" d="m142.85,284.36l69.28,40l0,80l-69.28,-40l0,-80z" id="path3275"/>
        <path stroke="#000000" stroke-width="5" fill="{{COLOR_07}}" d="m4.282,284.36l69.278,40l0,80l-69.278,-40l0,-80z" id="path3277"/>
        <path stroke="#000000" stroke-width="5" fill="{{COLOR_08}}" d="m73.56,324.36l69.29,40l0,80l-69.29,-40l0,-80z" id="path3279"/>
        <path stroke="#000000" stroke-width="5" fill="{{COLOR_09}}" d="m142.85,364.36l69.28,40l0,80l-69.28,-40l0,-80z" id="path3281"/>
        <path stroke="#000000" stroke-width="5" fill="{{COLOR_10}}" d="m212.13,484.36l0,-80l69.28,-40l0,80l-69.28,40z" id="path3283"/>
        <path stroke="#000000" stroke-width="5" fill="{{COLOR_11}}" d="m212.13,404.36l0,-80l69.28,-40l0,80l-69.28,40z" id="path3285"/>
        <path stroke="#000000" stroke-width="5" fill="{{COLOR_12}}" d="m212.13,324.36l0,-80l69.28,-40l0,80l-69.28,40z" id="path3287"/>
        <path stroke="#000000" stroke-width="5" fill="{{COLOR_13}}" d="m281.41,444.36l0,-80l69.28,-40l0,80l-69.28,40z" id="path3289"/>
        <path stroke="#000000" stroke-width="5" fill="{{COLOR_14}}" d="m281.41,364.36l0,-80l69.28,-40l0,80l-69.28,40z" id="path3291"/>
        <path stroke="#000000" stroke-width="5" fill="{{COLOR_15}}" d="m281.41,284.36l0,-80l69.28,-40l0,80l-69.28,40z" id="path3293"/>
        <path stroke="#000000" stroke-width="5" fill="{{COLOR_16}}" d="m350.69,404.36l0,-80l69.28,-40l0,80l-69.28,40z" id="path3295"/>
        <path stroke="#000000" stroke-width="5" fill="{{COLOR_17}}" d="m350.69,324.36l0,-80l69.28,-40l0,80l-69.28,40z" id="path3297"/>
        <path stroke="#000000" stroke-width="5" fill="{{COLOR_18}}" d="m350.69,244.36l0,-80l69.28,-40l0,80l-69.28,40z" id="path3299"/>
        <path stroke="#000000" stroke-width="5" fill="{{COLOR_19}}" d="m4.282,124.36l69.278,-40l69.29,40l-69.29,40l-69.278,-40z" id="path3301"/>
        <path stroke="#000000" stroke-width="5" fill="{{COLOR_20}}" d="m73.56,84.36l69.29,-40l69.28,40l-69.28,40l-69.29,-40z" id="path3303"/>
        <path stroke="#000000" stroke-width="5" fill="{{COLOR_21}}" d="m142.85,44.36l69.28,-40l69.28,40l-69.28,40l-69.28,-40z" id="path3305"/>
        <path stroke="#000000" stroke-width="5" fill="{{COLOR_22}}" d="m73.56,164.36l69.29,-40l69.28,40l-69.28,40l-69.29,-40z" id="path3307"/>
        <path stroke="#000000" stroke-width="5" fill="{{COLOR_23}}" d="m142.85,124.36l69.28,-40l69.28,40l-69.28,40l-69.28,-40z" id="path3309"/>
        <path stroke="#000000" stroke-width="5" fill="{{COLOR_24}}" d="m212.13,84.36l69.28,-40l69.28,40l-69.28,40l-69.28,-40z" id="path3311"/>
        <path stroke="#000000" stroke-width="5" fill="{{COLOR_25}}" d="m142.85,204.36l69.28,-40l69.28,40l-69.28,40l-69.28,-40z" id="path3313"/>
        <path stroke="#000000" stroke-width="5" fill="{{COLOR_26}}" d="m212.13,164.36l69.28,-40l69.28,40l-69.28,40l-69.28,-40z" id="path3315"/>
        <path stroke="#000000" stroke-width="5" fill="{{COLOR_27}}" d="m281.41,124.36l69.28,-40l69.28,40l-69.28,40l-69.28,-40z" id="path3317"/>
      </g>
      </g>
    </svg>`;

    this.#cubeColors = {
      r: '#ff0000',
      g: '#00aa00',
      b: '#0000ff',
      y: '#ffff00',
      o: '#ff8800',
      w: '#ffffff',
    };
  }

  #get3FaceSVG(cube3face: string): string {
    if (cube3face.length !== 27) {
      throw new Error('ERROR: Invalid cube color representation.');
    }
    let svg = this.#svgTemplate;
    for (let i = 1; i <= 27; i++) {
      const colorId = '{{COLOR_' + (i < 10 ? '0' : '') + i + '}}';
      const color = this.#cubeColors[cube3face.charAt(i - 1)];
      svg = svg.replace(colorId, color);
    }
    return svg;
  }

  getSVG(cube: string): string[] {
    if (cube.length !== 54) {
      throw new Error('ERROR: Invalid cube color representation.');
    }
    return [
      this.#get3FaceSVG(cube.substring(0, 27)),
      this.#get3FaceSVG(cube.substring(27)),
    ];
  }
}

export default CubeRenderer;
