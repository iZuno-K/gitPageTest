var audioContext = null;
var analyser = null;
var mediaStreamSource = null;
var mode = 0;


// window.onload: HTMLの読み込みが完了してから実行する
window.onload = function() {
  //AudioContextをインスタンス化
  audioContext = new (window.AudioContext||window.webkitAudioContext)();
}
//for display
var drawSpace = document.getElementById("graph");
var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
var size = w < h ? w : h;
// canvas1.style.width = size + 'px';
// canvas1.style.height = size + 'px';
drawSpace.width = size;
drawSpace.height = size;

var ctx =drawSpace.getContext("2d");
ctx.width = size;
ctx.height = size;
var gradbase = ctx.createLinearGradient(0, 0, 0,ctx.height);
gradbase.addColorStop(0, "rgb(20,22,20)");
gradbase.addColorStop(1, "rgb(20,20,200)");
var gradline = [];
for (var i=0; i<ctx.height; ++i) {
  gradline[i] = ctx.createLinearGradient(0, ctx.height -i, 0, ctx.height);
  gradline[i].addColorStop(0,"rgb(255,0,0)");
  gradline[i].addColorStop(1,"rgb(255," + i + ",0)");
}





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
  analyser.fftSize = 2048;
  mediaStreamSource.connect(analyser);
  // updatePitch();

  DrawGraph();

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

var rafID = null;

function DrawGraph() {
  var step = 3;
  ctx.fillStyle = gradbase;
  ctx.fillRect(0, 0, ctx.width, ctx.width);
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  var bufferLength = analyser.frequencyBinCount;

  var data = new Uint8Array(bufferLength);
  if (mode == 0) analyser.getByteFrequencyData(data);
  else analyser.getByteTimeDomainData(data); //Waveform Data

  var end  = ctx.width < bufferLength ? ctx.width : bufferLength;
  for(var i = 0; i < end; ++i) {
    ctx.fillStyle = gradline[data[i]];
    ctx.fillRect(i*step, ctx.height - data[i]*ctx.height/256, step, data[i]*ctx.height/256);
  }

  if (!window.requestAnimationFrame) window.requestAnimationFrame = window.webkitRequestAnimationFrame;
  rafID = window.requestAnimationFrame(DrawGraph);
}

function setParameter(){
  mode = document.getElementById("mode").selectedIndex;
}


// setInterval(DrawGraph, 100);
