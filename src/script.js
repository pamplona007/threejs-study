import GUI from 'lil-gui';
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import './style.scss';

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const colorDoorTexture = textureLoader.load('/textures/door/color.jpg');
colorDoorTexture.minFilter = THREE.NearestFilter;
const normalDoorTexture = textureLoader.load('/textures/door/normal.jpg');
const ambientOcclusionDoorTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const heightDoorTexture = textureLoader.load('/textures/door/height.jpg');
const metalnessDoorTexture = textureLoader.load('/textures/door/metalness.jpg');
const roughnessDoorTexture = textureLoader.load('/textures/door/roughness.jpg');
const alphaDoorTexture = textureLoader.load('/textures/door/alpha.jpg');

const environmentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/1/px.jpg',
    '/textures/environmentMaps/1/nx.jpg',
    '/textures/environmentMaps/1/py.jpg',
    '/textures/environmentMaps/1/ny.jpg',
    '/textures/environmentMaps/1/pz.jpg',
    '/textures/environmentMaps/1/nz.jpg',
]);

const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

const material = new THREE.MeshStandardMaterial({
    map: colorDoorTexture,
    aoMap: ambientOcclusionDoorTexture,
    displacementMap: heightDoorTexture,
    metalnessMap: metalnessDoorTexture,
    roughnessMap: roughnessDoorTexture,
    normalMap: normalDoorTexture,
    alphaMap: alphaDoorTexture,
    aoMapIntensity: .5,
    displacementScale: 0.05,
    transparent: true,
    envMap: environmentMap,
});

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 100, 100),
    material,
);

plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2));

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const pointLight = new THREE.PointLight(0xffffff, 0.5);

pointLight.position.y = 2;
pointLight.position.z = 1;

scene.add(plane, ambientLight, pointLight);

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

const gui = new GUI();
const materialFolder = gui.addFolder('Material');
materialFolder.add(material, 'metalness', 0, 1, 0.01);
materialFolder.add(material, 'roughness', 0, 1, 0.01);
materialFolder.add(material, 'aoMapIntensity', 0, 1, 0.01);
materialFolder.add(material, 'displacementScale', 0, 1, 0.01);

const clock = new THREE.Clock();
const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    controls.update();

    plane.rotation.y = 0.1 * elapsedTime;
    plane.rotation.x = 0.15 * elapsedTime;

    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
};

tick();
