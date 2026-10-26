import './style.scss'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

//there is something I am missing with the loading of the model
//need to fix whatever is causing some of the bookshelf decor not showing
const canvas = document.querySelector("#experience-canvas");
const sizes = {
    height: window.innerHeight,
    width: window.innerWidth
};

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
        night: "/textures/room/day/bookshelves_decor_night.webp"
    },
    desktop: {
        day: "/textures/room/day/desk.webp",
        night: "/textures/room/day/desk_night.webp"
    },
    LAPTOP: {
        day: "/textures/room/day/laptop.webp",
        night: "/textures/room/day/laptop_night.webp"
    },
    Mouse_Bluetooth: {
        day: "/textures/room/day/mouse.webp",
        night: "/textures/room/day/mouse_night.webp"
    },
    plank_shelf_sign: {
        day: "/textures/room/day/plank_shelf_sign.webp",
        night: "/textures/room/day/plank_shelf_sign_night.webp"
    },
    Snake_plant_in_a_pot: {
        day: "/textures/room/day/plant.webp",
        night: "/textures/room/day/plant_night.webp"
    },
    roomshell: {
        day: "/textures/room/day/room_shell.webp",
        night: "/textures/room/day/room_shell_night.webp"
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

Object.entries(textureMap).forEach(([key, paths]) => {
    const dayTexture = textureLoader.load(paths.day);
    dayTexture.flipY = false;
    dayTexture.colorSpace = THREE.SRGBColorSpace;
    loadedTextures.day[key] = dayTexture;

    const nightTexture = textureLoader.load(paths.night);
    nightTexture.flipY = false;
    nightTexture.colorSpace = THREE.SRGBColorSpace;
    loadedTextures.night[key] = nightTexture;
});

loader.load("/models/Room_Port.glb", (glb) => {
    glb.scene.traverse(child => {
        if (child.isMesh) {
            Object.keys(textureMap).forEach(key => {
                if (child.name.includes(key)) {
                    const material = new THREE.MeshBasicMaterial({
                        map: loadedTextures.day[key],
                    });

                    child.material = material;

                    if (child.material.map) {
                        child.material.map.minFilter = THREE.LinearFilter;
                    }
                }
            });
        }

        scene.add(glb.scene);
    });
});


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 5; 
camera.position.set(2.993404098317449, 2.1276482774042678, 3.236747612767926);

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.update();
controls.target.set(-0.48877394905076893, 0.8665067719254403, -0.17530934682540358);

//Event Listeners
window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    //Update Camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateMatrix();

    //Update Render
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

const render = () => {
    controls.update();
    console.log(camera.position);
    console.log("------------------");
    console.log(controls.target);
    renderer.render(scene, camera);

    window.requestAnimationFrame(render);
}

render()