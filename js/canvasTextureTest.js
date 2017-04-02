var ctx = null;
// size of canvas contrast to viewport
var ratio = 1.0;
var _canvas;

window.onload = function(){
  // Setting parameters of canvas
  _canvas = document.getElementById("canv");

  // var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  // var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  // var size = w < h ? w : h;
  // size = Math.round(size * ratio);

  size = 128;

  _canvas.width = size;
  _canvas.height = size;
  ctx = _canvas.getContext("2d");
  ctx.width = size;
  ctx.height = size;
  console.log('canvas-width,ctx-width: %d, %d',_canvas.width, ctx.width);

  // Draw
  createParticleTexture(_canvas,ctx);
}

function createParticleTexture(canvas, context) {
  // 128pxのサイズのcanvasを作ります。サイズは別に128pxじゃなくても
  // いいですが、テクスチャとして利用するため2のべき乗のサイズにして
  // おいた方が良いです。(32pxとか64pxとか256pxとか)
  var SIZE   = canvas.width;
  var HALF   = SIZE / 2;
  var CENTER = SIZE / 2;
  console.log('size,half,center: &d, %d, %d', SIZE, HALF, CENTER);
  ctx.fillStyle = 'rgb(0, 0, 0)';
  ctx.fillRect(0,0,ctx.width,ctx.height);

  // パーティクルの色にゆらぎを持たせるために色にランダム要素を与えます。
  // 基本色は青色にしたいのでHSLカラー空間で考えて
  // - 色相 : 200〜230の間
  // - 彩度 : 40〜60の間
  // - 輝度 : 50〜70の間
  // でランダムに色を作ります。
  var color = new THREE.Color();
  var h = 200 + 30 * Math.random();
  var s =  40 + 20 * Math.random();
  var l =  50 + 20 * Math.random();
  color.setHSL(h / 360, s / 100, l / 100);

  // 円を書いて中身を先ほど作った色で塗りつぶします。ただし、全てその色
  // で塗りつぶすわけではなく、暗闇にぼんやりと浮かぶ球のような演出をし
  // たいので中心から外側に向かってだんだん暗くなるような円形グラデーシ
  // ョンをかけます。
  // var context = canvas.getContext('2d');
  var grad    = context.createRadialGradient(CENTER, CENTER, 0, CENTER, CENTER, HALF);
  grad.addColorStop(0, 'rgb(218, 236, 254)');
  grad.addColorStop(1, 'rgb(21, 29, 98)');
  context.lineWidth = 0;
  context.beginPath();
  context.arc(CENTER, CENTER, HALF, 0, 2 * Math.PI, false);
  context.fillStyle = grad;
  context.fill();
  context.closePath();
  // return canvas;
}
