var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
        75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

// Apply VR headset positional data to camera.
var controls = new THREE.VRControls(camera);
controls.standing = true;

// Apply VR stereo rendering to renderer.
var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

var manager = new WebVRManager(renderer, effect);

var text = '';

camera.position.z = 5;
// create a canvas element
var canvas1 = document.createElement('canvas');
canvas1.width = 512;
canvas1.height = 512;
var texture1 = new THREE.Texture(canvas1);

function render(time) {
  cube.rotation.x += 0.1;
  cube.rotation.y += 0.1;
  controls.update();
  requestAnimationFrame(render);
  updateCanvas(time, canvas1);
  manager.render(scene, camera, time);
  texture1.needsUpdate = true;
}
render();


function updateCanvas(time, canvas) {
  var xPosition = canvas.width - (parseInt(time) / 10) % (canvas.width + 1000);
  var context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "rgb(0, 0, 128)";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.font = "Bold 60px Arial";
  context.fillStyle = "rgba(255,0,0,0.95)";
  context.fillText(text, xPosition, 200);
}

var skyboxGeometry = new THREE.BoxGeometry(50, 50, 50);
var skyboxMaterial = new THREE.MeshBasicMaterial( {map: texture1, side: THREE.BackSide } );
skyboxMaterial.transparent = true;
var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
scene.add(skybox);

$.ajax({
  type: 'GET',
  url: 'http://b.hatena.ne.jp/entrylist/json',
  dataType: 'jsonp',
  jsonpCallback: 'android',
  data: {
    sort: 'count',
    url: encodeURI('http://d.hatena.ne.jp')
  },
  success: function(json){
    text = json[Math.floor(Math.random() * json.length)].title;
  }
});
window.addEventListener('resize', onResize, true);
window.addEventListener('vrdisplaypresentchange', onResize, true);
function onResize(e) {
  effect.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
