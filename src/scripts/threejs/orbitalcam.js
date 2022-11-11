import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default function renderCamera(camera, renderer) {
    const orbitControls = new OrbitControls(camera, renderer)    
    return orbitControls
}

