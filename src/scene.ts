import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export let scene = new THREE.Scene()

let camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 5000)
camera.position.set(6, 2, 0)

let renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector('#bg'),
	antialias: true,
	alpha: true
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth,window.innerHeight)
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 2.3
renderer.shadowMap.enabled = true

let controls = new OrbitControls(camera, renderer.domElement)
controls.autoRotate = true
controls.enablePan = false
controls.maxPolarAngle = Math.PI / 1.9

let hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 4)
scene.add(hemiLight)
 
let spotLight = new THREE.SpotLight(0xffa95c, 4)
spotLight.castShadow = true
spotLight.shadow.bias = -0.0001
spotLight.shadow.mapSize.width = 1024*4
spotLight.shadow.mapSize.height = 1024*4
scene.add(spotLight)

let platform = new THREE.Mesh(
	new THREE.CylinderGeometry( 5, 5, 1, 128 ),
	new THREE.MeshStandardMaterial({ color: 0xffffff })
)
platform.position.y = -1.5
platform.castShadow = true
platform.receiveShadow = true
scene.add(platform)

const animate = () => {
	requestAnimationFrame(animate)
	spotLight.position.set(camera.position.x + 10, camera.position.y + 10, camera.position.z + 10)
	controls.update()
	renderer.render(scene,camera)
}

animate()

export const loadAll = (modelArray, baseUrl) => {

	modelArray.forEach(item => {
		new GLTFLoader().load(baseUrl + item, res => {
			let model = res.scene.children[0]
			model.scale.set(2, 2, 2)
			model.rotation.set(0, 0, - Math.PI / 2)

			model.traverse(i => {
				if (i.isMesh) {
					i.castShadow = true
					i.receiveShadow = true
					if (i.material.map) {
						i.material.map.anisotropy = 16	
					}
				}
			})

			model.visible = false
			model.name = item

			scene.add(model)
		})
	})
}