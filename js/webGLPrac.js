function getDrawSpaceSize() {
  var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  var size = w < h ? w : h;
  return size;
}


//Make a scene
var _scene = new THREE.Scene();

//Setting of camera
var size = getDrawSpaceSize();
var fov = 60;
var aspect = 1.0; //size/size=1.0
var near = 1;
var far = 1000;
var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0,0,50);
camera.lookAt(_scene.position);

//Renderer
var _renderer = new THREE.WebGLRenderer();
_renderer.setSize(size, size);
_renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('container').appendChild(_renderer.domElement);

//Light
var directionaLight = new THREE.DirectionalLight(0xffffff);
directionaLight.position.set(0, 0.7, 0.7);
_scene.add(directionaLight);

//Object
// var geometry = new THREE.CubeGeometry(30,30,30);
// var material = new THREE.MeshPhongMaterial({color:0xff0000});
// var mesh = new THREE.Mesh(geometry, material);
// _scene.add(mesh);

var texture = createParticleTexture();
var particles;
createParticles(texture);
render();

function createParticleTexture() {
  //Create canva. Its size have to be Second power
  var canvas = document.createElement('canvas');
  var SIZE   = 128;
  var HALF   = SIZE / 2;
  var CENTER = SIZE / 2;
  canvas.width  = SIZE;
  canvas.height = SIZE;

  //Make gradient circle texture.
  var context = canvas.getContext('2d');
  var grad    = context.createRadialGradient(CENTER, CENTER, 0, CENTER, CENTER, HALF);
  grad.addColorStop(0, 'rgb(218, 236, 254)');
  grad.addColorStop(1, 'rgb(21, 29, 98)');
  context.lineWidth = 0;
  context.beginPath();
  context.arc(CENTER, CENTER, HALF, 0, 2 * Math.PI, false);
  context.fillStyle = grad;
  context.fill();
  context.closePath();
  return canvas;
}

function createParticles(_canvas) {
  var pGeometry;
  var pMaterial;
  var count = 2000;
  var i;

  pGeometry = new THREE.Geometry();
  for (var i = 0; i < count; i++) {
    pGeometry.vertices.push(
    	new THREE.Vector3(
        Math.random() * 200 - 100,
        Math.random() * 200 - 100,
        Math.random() * 200 - 100
      )
    );
  }

  var texture = new THREE.Texture(_canvas);
  texture.needsUpdate = true; //Important !!!!!!!!!!!!!!
  pMaterial = new THREE.PointsMaterial({
    //  color:0x888888,
    map: texture,
    size: 3, // サイズ
    blending: THREE.AdditiveBlending, // ブレンドモード(加算)
    transparent: true, // 透過true
    depthTest: false // 物体が重なった時に後ろにあるものを描画するかしないか
   });


  particles = new THREE.Points(pGeometry, pMaterial);
  _scene.add(particles);
  console.log(particles);
}

function render() {
  requestAnimationFrame(render);
  particles.rotation.y += 0.002;
  _renderer.render(_scene, camera);
}
