import * as THREE from 'three';
import { GridHelper } from 'three';
import renderCamera from './orbitalcam';

export default function renderThree() {

    const renderer = new THREE.WebGLRenderer();
    
    renderer.setSize(window.innerHeight, window.innerWidth)
    
    document.body.appendChild(renderer.domElement);
    
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        .1,
        1000
    );

    const orbit = renderCamera(camera, renderer.domElement)

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    
    // camera.position.z = 5;
    // camera.position.y = 2;
    camera.position.set(0, 20, 40);
    orbit.update();
    
    const boxGeometry = new THREE.BoxGeometry();
    const boxMaterial = new THREE.MeshBasicMaterial({color: "green"});
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    scene.add(box);

    const planeGeometry = new THREE.PlaneGeometry(30, 30)
    const planeMaterial = new THREE.MeshBasicMaterial({
        color: "orange",
        side: THREE.DoubleSide //Both sides of plane visible
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);

    plane.rotation.x = -0.5 * Math.PI;

    const gridHelper = new GridHelper(30, 17);
    scene.add(gridHelper);

    const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: "white",
        wireframe: false
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    sphere.position.set(10, 4, 0)

    function annimate() {
        box.rotation.x += 0.01;
        box.rotation.y += 0.01;
        renderer.render(scene, camera)
    }

    renderer.setAnimationLoop(annimate)
}

