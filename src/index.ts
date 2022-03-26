import Cube from './Cube/Cube';
import CubeRenderer from './CubeRenderer/CubeRenderer';
import CubeSolver from './CubeSolver/CubeSolver';
import { cubeSerializeAdaptor } from './helpers/cubeSerializeAdapter';

(window as any).render = function () {
  document.getElementById('cube').innerHTML = CubeRenderer.getSVG(
    cubeSerializeAdaptor((window as any).cube)
  ).join(' ');
};

window.onload = function () {
  (window as any).cube = new Cube();
  (window as any).render();
};
