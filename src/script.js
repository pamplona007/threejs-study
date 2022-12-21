import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

import './style.scss';

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const fontLoader = new FontLoader();

const matcapTexture = textureLoader.load('textures/matcaps/3.png');
const material = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture,
});

fontLoader.load('fonts/helvetiker_regular.typeface.json', (font) => {
    const textGeometry = new TextGeometry('Lucas Pamplona', {
        font,
        size: 0.5,
        height: 0.2,
        curveSegments: 6,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 4,
    });

    const text = new THREE.Mesh(textGeometry, material);
    textGeometry.center();
    scene.add(text);
});

const donuts = [];
const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
for (let i = 0; 100 > i; i++) {
    const newDonut = new THREE.Mesh(torusGeometry, material);
    newDonut.position.x = (Math.random() - 0.5) * 20;
    newDonut.position.y = (Math.random() - 0.5) * 20;
    newDonut.position.z = (Math.random() - 0.5) * 20;

    newDonut.rotation.x = Math.random() * Math.PI;
    newDonut.rotation.y = Math.random() * Math.PI;

    const scale = (Math.random() + .3);
    newDonut.scale.set(scale, scale, scale);

    donuts.push(newDonut);
}
scene.add(...donuts);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const pointLight = new THREE.PointLight(0xffffff, 0.5);

pointLight.position.y = 2;
pointLight.position.z = 1;

scene.add(ambientLight, pointLight);

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 2;
scene.add(camera);
const controls = new TrackballControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const tick = () => {
    controls.update();

    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
};

tick();
