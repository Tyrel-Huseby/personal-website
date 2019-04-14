function resize(){
var widthOne = document.getElementById('front-bars').offsetWidth;
document.getElementById("shadow-bars").style.width = `${widthOne}px`;
}
setInterval(resize, 10);