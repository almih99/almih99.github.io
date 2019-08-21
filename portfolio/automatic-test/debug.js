/* Для вывода отладочной информации.
 * Вначале нужно выбрать место в html коде (по возможности в конце страницы) и выполнить:
 * 	debug.map2html();
 * После чего можно вводить данные с помощью методов:
 * 	debug.write('string');
 * 	debug.writeln('string');
 * 	debug.writeEval('expression');
 * 	debug.writeObject(object);
 * Остальные методы выполняют вспомогательные функции, и ими можно не озадачиваться.
*/
var debug = new Object();

debug.enabled=false;
debug.rposition=true;

debug.map2html=function() {
	document.write('<div id="debugWin" style="display:block; position:absolute; top:7px; right:7px; width:300px; background:white; color:black; border:solid 1px black;">');
	document.write('<table style="background-color:blue; color:white;font-weight:bold;">');
	document.write('<tr>');
	document.write('<td style="background-color:gray;padding:3px; cursor:pointer;"');
	document.write('onMouseOver="debug.help(\'Спрятать окно отладочного вывода до появления новых сообщений\');"');
	document.write('onMouseOut="debug.helpoff();"');
	document.write('onClick="debug.hide();">X</td>');
	document.write('<td id="debugTitleText" width="100%" style="text-align:center;">DEBUG</td>');
	document.write('<td style="background-color:gray;padding:3px; cursor:pointer;"');
	document.write('onMouseOver="debug.help(\'Переместить окно отладочного вывода в другое место\');"');
	document.write('onMouseOut="debug.helpoff();"');
	document.write('onClick="debug.move();">M</td>');
	document.write('<td style="background-color:gray;padding:3px; cursor:pointer;"');
	document.write('onMouseOver="debug.help(\'Остановить/возобновить прием отладочных сообщений\');" ');
	document.write('onMouseOut="debug.helpoff();"');
	document.write('onClick="debug._triggerEnable();">S</td>');
	document.write('<td style="background-color:gray;padding:3px; cursor:pointer;" ');
	document.write('onMouseOver="debug.help(\'Очистить окно отладочного вызова\');" ');
	document.write('onMouseOut="debug.helpoff();"');
	document.write('onClick="debug.clear();">C</td>');
	document.write('</tr>');
	document.write('</table>');
	document.write('<div id="debugTooltip" style="display:none;position:absolute;background-color:#FFFFC0;color:black;border-color:black;border-style:solid;border-width:1px;font-size:small;font-weight:normal;padding:.3em;margin:.3em;right:0;"></div>');
	document.write('<div id="debugContent" style="padding:10px;"></div>');
	document.write('</div>');
	this.enable();
}

debug.help=function (text) {
	var ttw=document.getElementById("debugTooltip");
	if(ttw) {
		ttw.innerHTML=text;
		ttw.style.display="block";
	}
}

debug.helpoff=function() {
	document.getElementById("debugTooltip").style.display="none";
}

debug.move=function() {
	win=document.getElementById('debugWin');
	if(win) {
		if(this.rposition) {
			win.style.right='';
			win.style.left=7;
		} else {
			win.style.left='';
			win.style.right=7;
		}
		this.rposition=!this.rposition;
	}
}


debug.clear=function() {
	var cb=document.getElementById("debugContent");
	if(cb) {
		cb.innerHTML="";
	}
}


debug.hide=function() {
	var win=document.getElementById("debugWin");
	if(win) {
		win.style.display="none";
	}
}

debug.show=function() {
	var win=document.getElementById("debugWin");
	if(win) {
		win.style.display="block";
	}
}

debug.disable=function() {
	this.enabled=false;
	var tt=document.getElementById('debugTitleText');
	if(tt) {
		tt.innerHTML="DEBUG <span style=\"color:#FF6C73;\">(OFF)</span>";
	}
}

debug.enable=function() {
	if(document.getElementById("debugWin")) {
		this.enabled=true;
	}
	var tt=document.getElementById('debugTitleText');
	if(tt) {
		tt.innerHTML="DEBUG <span style=\"color:#73FF6C;\">(ON)</span>";
	}
}

debug._triggerEnable=function() {
	if(this.enabled) {
		this.disable();
	} else {
		this.enable();
		this.write('<hr/>');
	}
}

debug.write=function(str) {
	if(!this.enabled) return;
	var cb=document.getElementById("debugContent");
	if(cb) {
		cb.innerHTML += str;
		this.show();
	}
}


debug.writeln=function(str) {
	if(!this.enabled) return;
	var cb=document.getElementById("debugContent");
	if(cb) {
		cb.innerHTML += str + "<br/>";
		this.show();
	}
}

debug.writeEval=function(code) {
	  this.writeln(code + " = " + eval(code));
}

debug.writeObject=function(obj) {
	this.write('<hr/>OBJECT:<hr/>');
	for (property in obj)
		this.writeln(property);
	this.write('<hr/>');
}