import './style.scss'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const canvas = document.querySelector("#experience-canvas");
const sizes = {
    height: window.innerHeight,
    width: window.innerWidth
};

// Scene Created
const scene = new THREE.Scene();
scene.background = new THREE.Color("#ffd6e4");

//for toggle
let theme = "day"

//Loaders
const textureLoader = new THREE.TextureLoader();

//Model Loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

const textureMap = {
    bookshelf_decor: {
        day: "/textures/room/day/bookshelves_decor.webp",
        night: "/textures/room/night/bookshelves_decor_night.webp"
    },
    desktop: {
        day: "/textures/room/day/desk.webp",
        night: "/textures/room/night/desk_night.webp"
    },
    LAPTOP: {
        day: "/textures/room/day/laptop.webp",
        night: "/textures/room/night/laptop_night.webp"
    },
    Mouse_Bluetooth: {
        day: "/textures/room/day/mouse.webp",
        night: "/textures/room/night/mouse_night.webp"
    },
    plank_shelf_sign: {
        day: "/textures/room/day/plank_shelf_sign.webp",
        night: "/textures/room/night/plank_shelf_sign_night.webp"
    },
    Snake_plant_in_a_pot: {
        day: "/textures/room/day/plant.webp",
        night: "/textures/room/night/plant_night.webp"
    },
    roomshell: {
        day: "/textures/room/day/room_shell.webp",
        night: "/textures/room/night/room_shell_night.webp"
    },
    gaming_char: {
        day: "/textures/room/chair.webp",
        night: "/textures/room/chair.webp"
    },
    Table_Lamp001: {
        day: "/textures/room/lamp_new.webp",
        night: "/textures/room/lamp_new.webp"
    },
}

const loadedTextures = {
    day: {},
    night: {},
}

function loadTexture(path){
    const texture = textureLoader.load(
        path,
        undefined,
        undefined,
        () => console.error("Texture failed to load:", path)
    );
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    return texture;
}

Object.entries(textureMap).forEach(([key, paths]) => {
    loadedTextures.day[key] = loadTexture(paths.day);
    loadedTextures.night[key] = loadTexture(paths.night);
});

function findTextureKey(obj){
    for (let o = obj; o; o = o.parent){
        if(textureMap[o.name]) return o.name;
    }

    return null;
}

loader.load("/models/Room_Port.glb", (glb) => {
    const unmatched = [];

    glb.scene.traverse(child => {
        if (child.isMesh) return;

        const key = findTextureKey(child);

        if (!key){
            unmatched.push(child.name);
            child.material = new THREE.MeshBasicMaterial({color: 0xff00ff});
            return;
        }

        child.material = new THREE.MeshBasicMaterial({
            map: loadedTextures[theme][key],
        });
    });
    console.log("Meshes with no texture mapping:", unmatched);

    scene.add(glb.scene);
});

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.set(2.993404098317449, 2.1276482774042678, 3.236747612767926);

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(-0.48877394905076893, 0.8665067719254403, -0.17530934682540358);
controls.update();


//Event Listeners
window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    //Update Camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    //Update Render
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

const render = () => {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(render);
}

render()