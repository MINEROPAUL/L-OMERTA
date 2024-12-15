// Sélectionner le conteneur pour le modèle 3D
const container = document.getElementById('3d-model-container');

// Créer la scène et la caméra
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Ajouter OrbitControls pour gérer la caméra avec la souris
const controls = new THREE.OrbitControls(camera, renderer.domElement);  // Crée les contrôles

// Paramétrer des options supplémentaires de OrbitControls (par exemple, la vitesse de rotation)
controls.enableDamping = true;  // Active l'effet de lissage des mouvements
controls.dampingFactor = 0.25;  // Réduit la vitesse de mouvement
controls.screenSpacePanning = false;  // Empêche le déplacement de la caméra sur l'axe Y
controls.maxPolarAngle = Math.PI / 2;  // Limite l'angle de la caméra pour qu'elle ne se retourne pas

// Lumières principales (Key Light)
const keyLight = new THREE.DirectionalLight(0xffffff, 2);  // Augmenter l'intensité de la lumière principale
keyLight.position.set(5, 5, 5);  // Positionner la lumière pour éclairer le modèle
keyLight.castShadow = true;  // Activer les ombres
scene.add(keyLight);

// Lumière d'appoint (Fill Light) - lumière douce pour adoucir les ombres
const fillLight = new THREE.AmbientLight(0xffffff, 0.5);  // Augmenter l'intensité de la lumière ambiante
scene.add(fillLight);

// Lumière d'arrière-plan (Back Light) - lumière douce derrière le modèle
const backLight = new THREE.PointLight(0xffffff, 1, 50);  // Augmenter l'intensité de la lumière de fond
backLight.position.set(-50, 50, -50);  // Positionner derrière le modèle
scene.add(backLight);

// Lumière pour le sol (Ground Light)
const groundLight = new THREE.PointLight(0xffffff, 0.3, 100);  // Lumière venant du bas pour éclairer le sol
groundLight.position.set(0, 2, 0);
scene.add(groundLight);

// Sol
const planeGeometry = new THREE.PlaneGeometry(35, 35);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.y = 0;  // Positionner le sol au niveau zéro
plane.position.x = 0;
plane.position.z = -2;
scene.add(plane);

// Chargement du modèle
const loader = new THREE.GLTFLoader();
let model;
loader.load(
  'MineropaulSkin3d.glb',  // Assurez-vous que le chemin du fichier est correct
  (gltf) => {
    console.log("Modèle 3D chargé avec succès !");
    model = gltf.scene;
    model.position.set(0, -3, 0); // Positionner le modèle au centre
    scene.add(model);

    // Désactivation de la transparence pour tous les matériaux du modèle
    model.traverse((child) => {
      if (child.isMesh) {
        child.material.transparent = false;
        child.material.opacity = 1;
      }
    });
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + '% chargé');
  },
  (error) => {
    console.error('Erreur lors du chargement du modèle:', error);
  }
);

// Animation
function animate() {
  requestAnimationFrame(animate);

  // Exemple de rotation du modèle
  if (model) {
    model.rotation.y += 0.01;
  }

  renderer.render(scene, camera);
}

// Position initiale de la caméra
camera.position.z = 5;  // Ajuster la position de la caméra pour voir le modèle

// Gestion du redimensionnement
window.addEventListener('resize', () => {
  const newWidth = container.clientWidth;
  const newHeight = container.clientHeight;

  // Ajuster la taille du renderer
  renderer.setSize(newWidth, newHeight);

  // Ajuster la caméra en fonction des nouvelles dimensions
  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();
});

animate();
