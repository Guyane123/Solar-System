import * as THREE from "three";

import sun from "./assets/sun.jpg";
import mercury from "./assets/mercury.jpg";
import venus from "./assets/venus.jpg";
import moon from "./assets/moon.jpg";
import earth from "./assets/earth.jpg";
import mars from "./assets/mars.jpg";
import jupiter from "./assets/jupiter.jpg";
import saturn from "./assets/saturn.jpg";
import uranus from "./assets/uranus.jpg";
import neptune from "./assets/neptune.jpg";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";

const scale = 8 / 1400000;

// THREEJS

const canvas = document.querySelector("#bg");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    2,
    1000
);

camera.position.set(-100, 0, 0);

if (!canvas) {
    throw new Error("Canva is null.");
}
const renderer = new THREE.WebGLRenderer({
    canvas: canvas satisfies Element,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

// const pointLight = new THREE.PointLight(0xffffff);
// pointLight.position.set(5, 5, 5);

const ambienLight = new THREE.AmbientLight(0xffffff);

scene.add(ambienLight);

// const lightHelper = new THREE.PointLightHelper(pointLight);

// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);

// const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });

    const star = new THREE.Mesh(geometry, material);
    // scene.add(star)

    const [x, y, z] = Array(3)
        .fill(0)
        .map(() => THREE.MathUtils.randFloatSpread(150));

    star.position.set(x, y, z);

    scene.add(star);
}

const stars = Array(100).fill(0).forEach(addStar);
const planetsArray = [
    {
        name: "Sun",
        texture: new THREE.TextureLoader().load(sun),
        diameter: 1392000,
        distance: 0,
        rotation: 25,
    },
    {
        name: "Mercury",
        texture: new THREE.TextureLoader().load(mercury),
        diameter: 4879,
        distance: 58000000,
        rotation: 10.8,
    },
    {
        name: "Venus",
        texture: new THREE.TextureLoader().load(venus),
        diameter: 12104,
        distance: 108942000,
        rotation: 6.5,
    },
    {
        name: "Moon",
        texture: new THREE.TextureLoader().load(moon),
        diameter: 1080,
        distance: 160000000,
    },
    {
        name: "Earth",
        texture: new THREE.TextureLoader().load(earth),
        diameter: 12742,
        distance: 150000000,
        rotation: 1.574,
    },
    {
        name: "Mars",
        texture: new THREE.TextureLoader().load(mars),
        diameter: 6779,
        distance: 2250000,
        rotation: 866,
    },
    {
        name: "Jupiter",
        texture: new THREE.TextureLoader().load(jupiter),
        diameter: 138820,
        distance: 778300000,
        rotation: 45.583,
    },
    {
        name: "Saturn",
        texture: new THREE.TextureLoader().load(saturn),
        diameter: 116460,
        distance: 1427000000,
        rotation: 36.84,
    },
    {
        name: "Uranus",
        texture: new THREE.TextureLoader().load(uranus),
        diameter: 51118,
        distance: 2900000000,
        rotation: 14.794,
    },
    {
        name: "Neptune",
        texture: new THREE.TextureLoader().load(neptune),
        diameter: 49528,
        distance: 4500000000,
        rotation: 9.719,
    },
];

const planets = planetsArray.map((planet, k) =>
    createplanet(8, planet.texture, -100 + k * (200 / planetsArray.length))
);
planets.forEach((planet, k) => {
    document.querySelector<HTMLDivElement>("#planets")!.innerHTML += /*html*/ `
        <button class="planetBtn" x-x=${k}>
    `;

    planet.visible = false;
    scene.add(planet);
    console.log(k * 10 - 100);
});
const planetButton = document.querySelectorAll(".planetBtn");
planetButton.forEach((btn) => {
    btn.addEventListener("click", () => {
        moveCamera(Number(btn.getAttribute("x-x")));
    });
});

const prevButton = document.querySelector<HTMLButtonElement>("#prev")!;
const nextButton = document.querySelector<HTMLButtonElement>("#next")!;
const diameter = document.querySelector<HTMLSpanElement>(".diameter")!;
const distance = document.querySelector<HTMLSpanElement>(".distance")!;
const rotation = document.querySelector<HTMLSpanElement>(".rotation")!;
const name = document.querySelector<HTMLParagraphElement>(".name")!;

let index = 0;
let currentPlanet = planets[index];

currentPlanet.visible = true;

function moveCamera(planetIndex: number) {
    if (!planets[planetIndex]) {
        return null;
    }

    index = planetIndex;
    const nextX = planetIndex * 20 - 100;

    const currentPlanet = planets[planetIndex];
    const currentPlanetHTML = planetButton[planetIndex];

    planetButton.forEach((btn) => {
        btn.classList.remove("focus");
    });

    planets.forEach((planet) => {
        planet.visible = false;
    });

    currentPlanet.visible = true;
    currentPlanetHTML.classList.add("focus");

    if (!planets[index + 1]) {
        nextButton.style.scale = "0";
    } else {
        nextButton.style.scale = "1";
    }

    if (!planets[index - 1]) {
        prevButton.style.scale = "0";
    } else {
        prevButton.style.scale = "1";
    }

    if (currentPlanet) {
        const planetInfo = planetsArray[index];

        distance.innerText = `${planetInfo.distance}`;
        diameter.innerText = `${planetInfo.diameter}`;
        rotation.innerText = `${planetInfo.diameter}`;
        name.innerText = `${planetInfo.name}`;

        gsap.to(camera.position, {
            x: nextX,
            duration: 2,
        });
    }

    console.log(camera.position.x);
}

moveCamera(0);

nextButton.addEventListener("click", (e) => {
    if (planets[index + 1]) {
        index++;
        moveCamera(index);
    }

    currentPlanet = planets[index] ? planets[index] : planets[index - 1];

    let lastPlanet;

    if (planets[index - 1]) {
        lastPlanet = planets[index - 1];
        lastPlanet.visible = false;
    } else {
        currentPlanet;
    }

    currentPlanet.visible = true;
});

prevButton.addEventListener("click", (e) => {
    if (planets[index - 1]) {
        index--;
        moveCamera(index);
    }

    currentPlanet = planets[index] ? planets[index] : planets[index + 1];

    let lastPlanet;

    if (planets[index + 1]) {
        lastPlanet = planets[index + 1];
        lastPlanet.visible = false;
    } else {
        currentPlanet;
    }
    currentPlanet.visible = true;
});

function createplanet(
    radius: number,
    texture: THREE.Texture,
    distance: number
) {
    const geometry = new THREE.SphereGeometry(radius);
    const material = new THREE.MeshStandardMaterial({
        map: texture,
    });

    const planet = new THREE.Mesh(geometry, material);

    planet.position.x = distance;

    return planet;
}

const mainColor = new THREE.Color(0x0000000);
scene.background = mainColor;

function animate() {
    requestAnimationFrame(animate);

    planets.forEach((planet) => {
        planet.rotation.y += 0.0005;
    });

    renderer.render(scene, camera);
}

animate();
