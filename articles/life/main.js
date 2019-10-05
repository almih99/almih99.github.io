"use strict";

(function () {
  let position=0;
  function rotate() {
    let items=Array.from(
        document.querySelectorAll("#day li")
    );
    for(let i=0; i<items.length; i++) {
      if(position == i) {
        items[i].classList.add("now");
      } else {
        items[i].classList.remove("now")
      }
    }
    position=(position+1) % items.length;
  }
  // born
  setInterval(rotate, 1000);
})();


