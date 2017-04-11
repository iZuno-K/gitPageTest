var WIDTH = window.innerWidth, HEIGHT = window.innerHeight;
var renderer, scene, camera, light;
var ground;

initScene();
createGround();
animate();

function initScene(){
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( WIDTH, HEIGHT );
    renderer.setClearColorHex( 0xAA9966, 1 );
    document.body.appendChild( renderer.domElement );

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0xAA9966, 0.015 );

    camera = new THREE.PerspectiveCamera( 60, WIDTH / HEIGHT, 1, 1000 );
    camera.position.set( 0, 10, 0 );

    light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 20, 40, -15 );
    light.target.position.copy( scene.position );
    light.castShadow = true;
    light.shadowCameraLeft = -60;
    light.shadowCameraTop = -60;
    light.shadowCameraRight = 60;
    light.shadowCameraBottom = 60;
    light.shadowCameraNear = 20;
    light.shadowCameraFar = 200;
    light.shadowBias = -.0001
    light.shadowMapWidth = light.shadowMapHeight = 2048;
    light.shadowDarkness = .7;
    scene.add( light );
}

function createGround(){
    var i;
    var simplexNoise = new SimplexNoise;
    var geometry = new THREE.PlaneGeometry( 150, 150, 64, 64 );

    for ( i = 0; i < geometry.vertices.length; i++ ) {
        var vertex = geometry.vertices[i];
        vertex.z = simplexNoise.noise( vertex.x / 10, vertex.y / 10 );
    }
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    var map1 = THREE.ImageUtils.loadTexture( 'map1.jpg' );
    map1.wrapS = map1.wrapT = THREE.RepeatWrapping;
    map1.repeat.set( 4, 4 );

    ground = new THREE.Mesh(
        geometry,
        new THREE.MeshLambertMaterial( { map: map1 } )
        //new THREE.MeshLambertMaterial( { color: 0xff0000, wireframe: true } )
    );

    ground.rotation.x = Math.PI / -2;
    ground.castShadow = true;
    ground.receiveShadow = true;
    scene.add( ground );
}

function animate() {
    var timer = Date.now();
    requestAnimationFrame( animate );
    camera.position.x = 50 * Math.sin( timer / 100 * Math.PI / 360 );
    camera.position.z = 50 * Math.cos( timer / 100 * Math.PI / 360 );
    camera.lookAt( scene.position );
    renderer.render( scene, camera );
}

