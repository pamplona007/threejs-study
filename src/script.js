import gsap from 'gsap';
import { AxesHelper, BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import './style.scss';

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

const scene = new Scene();

const camera = new PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;

const box = new Mesh(
    new BoxGeometry(1, 1, 1),
    new MeshBasicMaterial({ color: 0xff0000 }),
);

scene.add(box);
scene.add(camera);

const canvas = document.querySelector('.webgl');
const renderer = new WebGLRenderer({
    canvas,
});

const axesHelper = new AxesHelper();
scene.add(axesHelper);

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

gsap.to(box.position, { duration: 1, delay: 1, x: 2 });
gsap.to(box.position, { duration: 1, delay: 2, x: 0 });

const animate = () => {
    camera.lookAt(box.position);
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

animate();
