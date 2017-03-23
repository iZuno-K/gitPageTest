var ctx = null;
// size of canvas contrast to viewport
var ratio = 1.0;


window.onload = function(){
  // Setting parameters of canvas
  canvas1 = document.getElementById("graph");

  var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  var h
  var size = w < h ? w : h;

  size = Math.round(size * ratio);
  // canvas1.style.width = size + 'px';
  // canvas1.style.height = size + 'px';
  canvas1.width = size;
  canvas1.height = size;
  ctx = canvas1.getContext("2d");
  ctx.width = size;
  ctx.height = size;
  alert('2:now here we are:'+ctx.width+':'+ctx.height);
  // Draw
  var gradbase = ctx.createLinearGradient(0, 0, 0,ctx.height);
  gradbase.addColorStop(0, "rgb(20,22,20)");
  gradbase.addColorStop(1, "rgb(20,20,200)");
  ctx.fillStyle = gradbase;
  ctx.fillRect(0, 0, ctx.width, ctx.height);
  alert(ctx.width + ':' + ctx.height)
}
