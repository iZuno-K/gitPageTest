alert('!!!!!!!!!!!!!!1');

//for debug
var count  = new Object();
count.i = 0;
count.f  = function() {
  this.i++;
  var html = this.i;
  document.getElementById("counter").innerHTML=html;
}


var audioContext = null;
var analyser = null;
var mediaStreamSource = null;
var width = 256;
var height = 256;



// window.onload: HTMLの読み込みが完了してから実行する
window.onload = function() {
  //AudioContextをインスタンス化
  audioContext = new (window.AudioContext||window.webkitAudioContext)();
}
//表示
var ctx =document.getElementById("graph").getContext("2d");
ctx.width = width;
ctx.height = height;
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
  count.f(); //debug

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
  var data = new Uint8Array(ctx.width);
  analyser.getByteTimeDomainData(data); //Waveform Data
  // analyser.getByteFrequencyData(data);
  for(var i = 0; i < ctx.width; ++i) {
    ctx.fillStyle = gradline[data[i]];
    ctx.fillRect(i*step, 256 - data[i], step, data[i]);
  }

  if (!window.requestAnimationFrame) window.requestAnimationFrame = window.webkitRequestAnimationFrame;
  rafID = window.requestAnimationFrame(DrawGraph);
}

// setInterval(DrawGraph, 100);
