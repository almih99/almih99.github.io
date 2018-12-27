'use strict';

var switchTo;
var isSwitching=false;

/*
loads all images and associate with thumbnail images
*/
function loadImages(root){
  var im=document.getElementById(root);
  var thumbnailImages = im.getElementsByTagName("img");
  for(var i=0; i<thumbnailImages.length; i++) {
    var imgTnFile=thumbnailImages[i].src;
    var imgBgFile=imgTnFile.replace(/(\.tn\.)(\w+)$/, ".$2");
    var img=new Image();
    imgTnFile=thumbnailImages[i].bigImage=img;
    img.thumbnailImage=imgTnFile=thumbnailImages[i];
    img.className='main-image';
    img.onload = function (e) {
      this.thumbnailImage.classList.remove("unloaded");
    }
    img.src=imgBgFile;
  }
}

/*
changes current image
*/
function onActivateThumbnail (e) {
  // find thumbnail image
  var li=e.target.closest("li");
  if(li) {
    var tnImg=li.querySelector("img");
  } else {
    return;
  }
  // if big image not loaded yet
  if(tnImg.classList.contains("unloaded")) return;
  // if is alrady current image or switching in process
  if(switchTo===tnImg.bigImage.src || isSwitching) {
    return;
  }
  // global flags
  switchTo = tnImg.bigImage.src;
  isSwitching=true;
  // switching to new image
  var imgPane=document.getElementById('imgPane');
  var imgCurrent=document.querySelector('.main-image')
  imgPane.insertAdjacentElement('afterBegin', tnImg.bigImage);
  // setting callback for transitionend
  imgCurrent.addEventListener("transitionend", function(e){
    e.target.remove();
    e.target.style.transition='none';
    e.target.style.opacity='1';
    isSwitching=false;
  });
  // start transition
  imgCurrent.style.transition='opacity 0.5s';
  imgCurrent.style.opacity='0';
}

function initialize() {
  loadImages("image-menu");
  var im=document.getElementById("image-menu");
  im.addEventListener("click", onActivateThumbnail);
  im.addEventListener("mouseover", onActivateThumbnail);
  im.addEventListener("mousemove", onActivateThumbnail);
}
