import gsap from 'gsap';
import GUI from 'lil-gui';
import { BufferAttribute, BufferGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import './style.scss';

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

const canvas = document.querySelector('canvas.webgl');
const scene = new Scene();
const renderer = new WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const geometry = new BufferGeometry();
const count = 150;
const positionsArray = new Float32Array(count * 3 * 3);

for (let index = 0; index < (count * 3 * 3); index += 3) {
    const value = Math.random();

    const sin = Math.sin(value * Math.PI * 2);
    const cos = Math.cos(value * Math.PI * 2);

    positionsArray[index] = sin;
    positionsArray[index + 1] = cos;
    positionsArray[index + 2] = sin * cos;
}

const positionAttribute = new BufferAttribute(positionsArray, 3);
geometry.setAttribute('position', positionAttribute);

const material = new MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true,
});
const mesh = new Mesh(geometry, material);
scene.add(mesh);

const camera = new PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

const controls = new TrackballControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dynamicDampingFactor = .03;
controls.enablePan = false;

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
});

renderer.domElement.addEventListener('dblclick', () => {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;

    if (!fullscreenElement) {
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen();
        }

        if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen();
        }

        return;
    }

    if (document.exitFullscreen) {
        document.exitFullscreen();
    }

    if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
});

const debugParameters = {
    spin: () => {
        console.log(gsap);
        gsap.to(mesh.rotation, {
            duration: 1,
            y: mesh.rotation.y + (Math.PI * 2),
        });
    },
};

const gui = new GUI();
const guiMeshFolder = gui.addFolder('Mesh');
guiMeshFolder
    .add(mesh.position, 'x')
    .min(-3)
    .max(3)
    .step(0.01);
guiMeshFolder
    .add(mesh.position, 'y')
    .min(-3)
    .max(3)
    .step(0.01);
guiMeshFolder
    .add(mesh.position, 'z')
    .min(-3)
    .max(3)
    .step(0.01);
guiMeshFolder
    .add(mesh, 'visible');
guiMeshFolder
    .addColor(material, 'color');
guiMeshFolder
    .add(debugParameters, 'spin');

const tick = () => {
    renderer.render(scene, camera);
    controls.update();

    window.requestAnimationFrame(tick);
};

tick();
