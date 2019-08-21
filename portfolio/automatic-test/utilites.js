/*
Набор вспомогательных функций
*/

"use strict";

function currentScreenDimension() {
	return {
		width:	currentScreenWidth(),
		height:	currentScreenHeight()
		};
}

function currentScreenWidth() {
	return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}

function currentScreenHeight() {
	return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}


function adjustWallpaperSize() {
  // определяем размеры области отображения
  var bodd = document.getElementsByTagName("body")[0];
  bodd.style.overflow="hidden";
  var h=currentScreenHeight();
  var w=currentScreenWidth();
  bodd.style.overflow="auto";
  // устанавливаем определенные размеры как размеры фона
  bodd.style.backgroundSize=w + 'px ' + h + 'px';
}

function adjustNavigationMenuBackgroundSize() {
	var m=$('navigationMenuBackground');
	if(m) {
		m.style.width=currentScreenWidth() + 'px';
		m.style.height=currentScreenHeight() + 'px';
	}
}

var audio=null;
var lastPlay=0;
var playEnabled=true;
function play(sound) {
	// случаи, когда мы игнорируем вызов
	if(!playEnabled) return;
	if((new Date().getTime() - lastPlay) < 200) {
		lastPlay=new Date().getTime();
		return;
	} else {
		lastPlay=new Date().getTime();
	}
	// играем.
	audio = new Audio(); // глобально! Без Var
    audio.setAttribute("src",sound);
    audio.load(); // required for 'older' browsers
    audio.play();
}

// для форматирования часов, секунд и минут с нулями лидирующими
function format00(n) {
	var resault;
	if(n<10) resault='0'; else resault='';
	return resault + n;
}

function isNodeWebkit() {
	return typeof(process)!=='undefined';
}

//////////////////////////////////////////////////////////////////////
// скрытие - показ элемента с учетом разных display
//////////////////////////////////////////////////////////////////////

function getRealDisplay(elem) {
	if (elem.currentStyle) {
		return elem.currentStyle.display
	} else if (window.getComputedStyle) {
		var computedStyle = window.getComputedStyle(elem, null )

		return computedStyle.getPropertyValue('display')
	}
}

function hide(el) {
	if (!el.getAttribute('displayOld')) {
		el.setAttribute("displayOld", el.style.display)
	}

	el.style.display = "none"
}

var displayCache = {}

function isHidden(el) {
	var width = el.offsetWidth, height = el.offsetHeight,
		tr = el.nodeName.toLowerCase() === "tr"

	return width === 0 && height === 0 && !tr ?
		true : width > 0 && height > 0 && !tr ? false :	getRealDisplay(el)
}

function toggle(el) {
	isHidden(el) ? show(el) : hide(el)
}


function show(el) {

	if (getRealDisplay(el) != 'none') return

	var old = el.getAttribute("displayOld");
	el.style.display = old || "";

	if ( getRealDisplay(el) === "none" ) {
		var nodeName = el.nodeName, body = document.body, display

		if ( displayCache[nodeName] ) {
			display = displayCache[nodeName]
		} else {
			var testElem = document.createElement(nodeName)
			body.appendChild(testElem)
			display = getRealDisplay(testElem)

			if (display === "none" ) {
				display = "block"
			}

			body.removeChild(testElem)
			displayCache[nodeName] = display
		}

		el.setAttribute('displayOld', display)
		el.style.display = display
	}
}
