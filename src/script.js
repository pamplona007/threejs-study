import { BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import './style.scss';

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight - 5,
};

const canvas = document.querySelector('canvas.webgl');

const scene = new Scene();

const mesh = new Mesh(
    new BoxGeometry(1, 1, 1, 5, 5, 5),
    new MeshBasicMaterial({ color: 0xff0000 }),
);
scene.add(mesh);

const camera = new PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
camera.lookAt(mesh.position);
scene.add(camera);

const renderer = new WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;

const tick = () => {
    renderer.render(scene, camera);
    controls.update();

    window.requestAnimationFrame(tick);
};

tick();
