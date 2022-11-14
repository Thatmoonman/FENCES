import * as THREE from 'three';
import { GridHelper, Raycaster, SpotLight, SpotLightHelper, TextureLoader } from 'three';
import renderCamera from './orbitalcam';
import * as dat from 'dat.gui';
import milkyway from '../../assets/images/milkyway.jpg'
import desert from '../../assets/images/desert.jpg'
import sky from '../../assets/images/sky.jpg'

export default function renderThree() {

    const renderer = new THREE.WebGLRenderer();

    renderer.shadowMap.enabled = true;
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    
    // const threedee = document.getElementsByClassName("threedeeContainer")
    // threedee[0].appendChild(renderer.domElement);

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
    const planeMaterial = new THREE.MeshStandardMaterial({
        color: "orange",
        side: THREE.DoubleSide //Both sides of plane visible
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);
    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow = true;

    const gridHelper = new GridHelper(30, 17);
    scene.add(gridHelper);

    const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
    const sphereMaterial = new THREE.MeshStandardMaterial({
        color: "white",
        wireframe: false
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
    sphere.position.set(5, 20, 0);
    sphere.castShadow = true;

    const sphereId = sphere.id

    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
    scene.add(directionalLight);
    directionalLight.position.set(-30, 50, 0);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.bottom = 2;
    directionalLight.shadow.camera.top = 15;


    const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
    scene.add(dLightHelper);

    const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
    scene.add(dLightShadowHelper);

    const spotLight = new THREE.SpotLight(0xFFFFFF);
    scene.add(spotLight)
    spotLight.position.set(50, 100, 0)
    spotLight.castShadow = true;
    spotLight.angle = 0.05;


    const sLightHelper = new THREE.SpotLightHelper(spotLight);
    scene.add(sLightHelper)

    // scene.fog = new THREE.Fog(0xFFFFFF, 0, 200);
    // scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01);

    // renderer.setClearColor(0xFFEA00);

    const textureLoader = new THREE.TextureLoader();
    // scene.background = textureLoader.load(sky);
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    scene.background = cubeTextureLoader.load([
        sky,
        sky,
        sky,
        sky,
        sky,
        sky
    ]);

    const box2Geometry = new THREE.BoxGeometry(4, 4, 4);
    const box2Material = new THREE.MeshBasicMaterial({
        // color: 0x00FF00,
        // map: textureLoader.load(milkyway)
    });
    // const box2MultiMaterial = [
    //     new THREE.MeshBasicMaterial({map: textureLoader.load()})
    //     new THREE.MeshBasicMaterial({map: textureLoader.load()})
    //     new THREE.MeshBasicMaterial({map: textureLoader.load()})
    //     new THREE.MeshBasicMaterial({map: textureLoader.load()})
    //     new THREE.MeshBasicMaterial({map: textureLoader.load()})
    //     new THREE.MeshBasicMaterial({map: textureLoader.load()})
    // ]
    const box2 = new THREE.Mesh(box2Geometry, box2Material);
    scene.add(box2);
    box2.position.set(0, 15, 10)
    box2.material.map = textureLoader.load(milkyway)
    box2.name = "theBox";

    const plane2Geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
    const plane2Material = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        wireframe: true
    });
    const plane2 = new THREE.Mesh(plane2Geometry, plane2Material);
    scene.add(plane2);
    plane2.position.set(10, 10 ,15);

    plane2.geometry.attributes.position.array[0] -= 10 * Math.random();
    plane2.geometry.attributes.position.array[1] -= 10 * Math.random();
    plane2.geometry.attributes.position.array[2] -= 10 * Math.random();
    const lastPointZ = plane2.geometry.attributes.position.array.length - 1;
    plane2.geometry.attributes.position.array[lastPointZ] -= 10 * Math.random();

    const vShader = `
        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    const fShader = `
        void main() {
            gl_FragColor = vec4(0.5, 0.5, 1.0, 1.0);
        }
    `;

    const sphere2Geometery = new THREE.SphereGeometry(4);
    const sphere2Material = new THREE.ShaderMaterial({
        vertexShader: vShader,
        fragmentShader: fShader
    })
    const sphere2 = new THREE.Mesh(sphere2Geometery, sphere2Material);
    scene.add(sphere2);
    sphere2.position.set(-5, 10, 10);

    const gui = new dat.GUI()

    // dat.GUI.toggleHide()

    const options = {
        sphereColor: 'red',
        wireframe: false,
        speed: 0.01,
        angle: 0.05,
        penumbra: 0,
        intensity: 1
    }

    gui.add(options, 'sphereColor').onChange(function(e){
        sphere.material.color.set(e)
    });

    gui.add(options, 'wireframe').onChange(function(e){
        sphere.material.wireframe = e
    })

    gui.add(options, 'speed', 0, 0.1);

    gui.add(options, 'angle', 0, .1);
    gui.add(options, 'penumbra', 0, 1);
    gui.add(options, 'intensity', 0, 1);

    let step = 0;

    const mousePosition = new THREE.Vector2();
    window.addEventListener('mousemove', function(e) {
        mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
        mousePosition.y = - (e.clientY / window.innerHeight) * 2 + 1;
    });

    const rayCaster = new THREE.Raycaster();

    function animate() {
        box.rotation.x += 0.01;
        box.rotation.y += 0.01;

        step += options.speed;
        sphere.position.y = (10 * Math.abs(Math.sin(step)) + 4);

        spotLight.angle = options.angle;
        spotLight.penumbra = options.penumbra;
        spotLight.intensity = options.intensity;
        sLightHelper.update()

        rayCaster.setFromCamera(mousePosition, camera);
        const intersects = rayCaster.intersectObjects(scene.children);

        for (let i = 0; i < intersects.length; i++) {
            if (intersects[i].object.id === sphereId) {
                intersects[i].object.material.color.set("green");
            }
            if (intersects[i].object.name === "theBox") {
                intersects[i].object.rotation.x += 0.01;
                intersects[i].object.rotation.y += 0.01;
            }
        }

        plane2.geometry.attributes.position.array[0] = 10 * Math.random();
        plane2.geometry.attributes.position.array[1] = 10 * Math.random();
        plane2.geometry.attributes.position.array[2] = 10 * Math.random();
        plane2.geometry.attributes.position.array[lastPointZ] = 10 * Math.random();
        plane2.geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera)
    }

    renderer.setAnimationLoop(animate)

    window.addEventListener("resize", function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight)
    })
}

