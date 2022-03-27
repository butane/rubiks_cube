import Cube from './Cube/Cube';
import CubeRenderer from './CubeRenderer/CubeRenderer';
import CubeSolver from './CubeSolver/CubeSolver';
import { IMoveHistory } from './CubeSolver/types/IMoveHistory';
import { cubeSerializeAdaptor } from './helpers/cubeSerializeAdapter';

(window as any).render = function () {
  document.getElementById('cube').innerHTML = CubeRenderer.getSVG(
    cubeSerializeAdaptor((window as any).cube)
  ).join(' ');
};

(window as any).solveCube = function () {
  const cubeSolver = new CubeSolver((window as any).cube);
  cubeSolver.solve();
  const moves = cubeSolver.getMoveHistory();
  (window as any).renderSolution(moves);
  (window as any).render();
};

window.onload = function () {
  (window as any).cube = new Cube();
  (window as any).render();
  (window as any).CubeSolver = CubeSolver;
};

(window as any).renderSolution = function (moves: IMoveHistory) {
  const element = document.getElementById('solution');
  element.innerHTML = '';
  for (let i = moves.length - 1; i >= 0; i--) {
    const div = document.createElement('div');
    div.setAttribute('class', 'sol_panel');
    const titleDiv = document.createElement('div');
    titleDiv.innerHTML = `Step ${i + 1} - Move: ${moves[i][0]} (${
      moves[i][1]
    })`;
    const svg = CubeRenderer.getSVG(
      cubeSerializeAdaptor((window as any).cube)
    ).join(' ');
    div.innerHTML = svg;
    div.prepend(titleDiv);
    element.prepend(div);
    (window as any).cube[moves[i][0]](0 - moves[i][1]);
  }
  const div = document.createElement('div');
  div.setAttribute('class', 'sol_panel');
  const titleDiv = document.createElement('div');
  titleDiv.innerHTML = `Given Cube`;
  const svg = CubeRenderer.getSVG(
    cubeSerializeAdaptor((window as any).cube)
  ).join(' ');
  div.innerHTML = svg;
  div.prepend(titleDiv);
  element.prepend(div);
};
