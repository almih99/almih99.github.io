// подсказки

mouseX = 0;
mouseY = 0;

IE = document.all?true:false;

function getMouseXY(e) {
    if (IE) {
        var docElem = document.documentElement || {}, body = document.body || {};
        mouseX = event.clientX + (window.pageXOffset || docElem.scrollLeft || body.scrollLeft || 0) - (docElem.clientLeft || 0);
        mouseY = event.clientY  + (window.pageYOffset || docElem.scrollTop || body.scrollTop || 0) - (docElem.clientTop || 0);
    } else {
        mouseX = e.pageX;
        mouseY = e.pageY;
    } 
}

function showHint(word) {
  for(var i=0; i<wordlist.length; i++) {
    if(wordlist[i].get(0)==word) {
      var hint=document.getElementById('hint');
      hint.innerHTML=wordlist[i].summary();
      hint.style.display='block';
      hint.style.top=mouseY+10;
      if(mouseX<(document.compatMode=='CSS1Compat' && !window.opera?document.documentElement.clientWidth:document.body.clientWidth)/2) {
         hint.style.left=mouseX;
      } else {
         hint.style.left=mouseX-hint.offsetWidth;
      }
      return;
    }
  }
}

function hideHint() {
  document.getElementById('hint').style.display='none';
}

function insertWordWithHint(word, nominativ) {
  if(!nominativ) nominativ=word;
  return "<span style='cursor:pointer;' onclick='showHint(\"" + nominativ + "\");' onmouseout='hideHint();'>" + word + "</span>";
}