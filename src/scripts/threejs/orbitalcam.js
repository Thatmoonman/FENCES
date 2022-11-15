import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default function renderCamera(camera, renderer) {
    //new orthographic camera
    const orbitControls = new OrbitControls(camera, renderer) 
    
    //limit range from going below deck
    orbitControls.maxPolarAngle = (Math.PI / 2.3) 
    
    //limit zoom range
    orbitControls.minDistance = 8;
    orbitControls.maxDistance = 75;

    return orbitControls
}

