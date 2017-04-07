var audioContext = null;
var analyser = null;
var mediaStreamSource = null;
var mode = 0;
//  var wait = 100.0;
var fps,fpsInterval,then,now,elapsed;

// for draw graph
var fftSize = 2048;
var rafID = null;
var offset = 0;
var line_num = 25;
var geometrys,lines;
var material = new THREE.LineBasicMaterial({
  color: 0xffffff
});
var renderingCount = 0;
// window.onload: HTMLの読み込みが完了してから実行する
window.onload = function() {
  //AudioContextをインスタンス化
  audioContext = new (window.AudioContext||window.webkitAudioContext)();
}
//for display
// var drawSpace = document.getElementById("graph");
var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
var size = w < h ? w : h;

// drawSpace.width = size;
// drawSpace.height = size;

// var ctx =drawSpace.getContext("2d");
// ctx.width = size;
// ctx.height = size;


// Rendering settings
var renderer, scene;

scene = new THREE.Scene();

var fov = 60;
var aspect = 1.0; //size/size=1.0
var near = 1;
var far = 10;
var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0,2,5);
camera.lookAt(scene.position);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(size, size);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('container').appendChild(renderer.domElement);
ArrayInit();




//followings are functions used above
// ---------------------------------------------------------------------------------------
//エラー処理用の関数
function error() {
    alert('Stream generation failed.');
}

/*navigatorってのはブラウザに備え付けのもの。||でつながってるのは、ブラウザの種類ごとに名前が違うため、存在する名前を保存して使うようにしている。*/
function getUserMedia(dictionary, callback) {
    try {
        navigator.getUserMedia =
          navigator.getUserMedia ||
          navigator.webkitGetUserMedia ||
          navigator.mozGetUserMedia;
        navigator.getUserMedia(dictionary, callback, error);
    } catch (e) {
        alert('getUserMedia threw exception :' + e);
    }
}


//streamがおそらくマイクからとった音声データ
function gotStream(stream) {
  // Create an AudioNode from the stream
  //Set a microphone as a source of audio
  mediaStreamSource = audioContext.createMediaStreamSource(stream);

  // Connect it to the destination.
  analyser = audioContext.createAnalyser();
  analyser.fftSize = fftSize;
  mediaStreamSource.connect(analyser);

  document.getElementById("min").value = analyser.minDecibels;
  document.getElementById("max").value = analyser.maxDecibels;
  // Setup();  

  DrawGraph();
  // fpsControll();

}


function toggleLiveInput() {
  getUserMedia({
    "audio":{
      "mandatory":{
        "googEchoCancellation": "false",
        "googAutoGainControl": "false",
        "googNoiseSuppression": "false",
        "googHighpassFilter": "false"
      },
      //if possible, set this parameter
      "optional": []
    },
  },gotStream);
}


//init geometry and line arrays
function ArrayInit() {
  geometrys = new Array(line_num);
  lines = new Array(line_num);

  for (var i = 0; i < geometrys.length; i++) {
    geometrys[i] = new THREE.Geometry();
    for (var j = 0; j < fftSize / 2; j++) {
      geometrys[i].vertices.push(new THREE.Vector3(0, 0, 0));
    }
    lines[i] = new THREE.Line(geometrys[i], material);
  }
}

function DrawGraph() {
  var bufferLength = analyser.frequencyBinCount;
  var tuning_x = 4;
  var tuning_y = 5;
  var offset_x = 2.5;
  var offset_y = 2.5;
  var default_camera_z = 5;

  var data = new Uint8Array(bufferLength);
  if (mode == 0) analyser.getByteFrequencyData(data);
  else analyser.getByteTimeDomainData(data); //Waveform Data

  // var end = ctx.width < bufferLength ? ctx.width : bufferLength;

  //delete oldest line and geometry
  var oldest  = lines.pop();
  scene.remove(oldest);
  oldest.geometry.dispose();
  oldest.material.dispose();
  geometrys.pop();

  //add new geometry and line
  geometrys.unshift(new THREE.Geometry());
  for (var i = 0; i < fftSize / 2; i++) {
    geometrys[0].vertices.push(new THREE.Vector3(i/bufferLength*tuning_x - offset_x, data[i]/255*tuning_y- offset_y, offset));
  }
  lines.unshift(new THREE.Line( geometrys[0], material ));
  camera.position.set(0, 2, default_camera_z + offset);

  if (renderingCount < 150) {
    scene.add(lines[0]);
  }
  else {
    console.log('reflesh');
    renderingCount = 0;
    scene = new THREE.Scene();
    for (var i = 0; i < lines.length; i++){
      scene.add(lines[i]);
    }
  }

  

  offset += (far - default_camera_z) / line_num;

  renderer.render(scene, camera);
  renderingCount++;

  if (!window.requestAnimationFrame) window.requestAnimationFrame = window.webkitRequestAnimationFrame;
  rafID = window.requestAnimationFrame(DrawGraph);

}

function setParameter(){
  mode = document.getElementById("mode").selectedIndex;
  analyser.minDecibels = parseFloat(document.getElementById("min").value);
  analyser.maxDecibels = parseFloat(document.getElementById("max").value);
  analyser.smoothingTimeConstant = parseFloat(document.getElementById("smoothing").value);
  fps = parseFloat(document.getElementById("wait").value);
  fpsInterval = 1000.0/fps;
}


// setInterval(DrawGraph, 100);
