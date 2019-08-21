/*
Виджет предназначен для отображения соотношения успехов/неудач

Конструктор:
	b=new WFBar(widtht)
		в качестве аргумента получает количество отображаемых элементов (квадратов). По умолчанию 10.

Отображение на html страницу:
	b.write(to)
		в качестве аргумента получает объект, на который требуется выводить html содержимое.
		по умолчанию - это document. Может быть любой объект, поддерживающий метод write().
	b.insert(into)
		в качестве аргумента получает объект, внутри которого с помощью DOM стороит
		всё то же, что может сделать метод write.
	b.getID()
		возвращает уникальный идентификатор элемента, содержащего весь виджет.
Управление:
	b.reset()
		обнуление счета правильных/не правильных вариантов
	b.addWin()
		Добавить успех. Необязательный аргумент позволяет добавить несколько успехов сразу.
	b.addFail(num)
		Добавить неуспех. Необязательный аргумент позволяет добавить несколько неуспехов сразу.
	b.refresh(num)
		обновить изображение, применив новые значения цвета.
Атрибуты (задание цвета):
	b.wincolor
		цвет, которым отображаются успехи (lightgreen по умолчанию)
	b.failcolor
		цвет, которым отображаются неуспехи (red по умолчанию)
	b.neutralcolor
		цвет, которым отображается индикатор при счете 0:0 (gray по умолчанию)
	b.backcolor
		цвет фона (silver по умолчанию)
*/

"use strict";

// счетчик объектов для генерации идентификаторов
var __WFBarCounter=0;

// конструктор объекта
function WFBar(bwidth) {
  this.wincolor='lightgreen';
  this.failcolor='red';
  this.neutralcolor='gray';
  this.backcolor='silver';
  this.symbol='▊'

  __WFBarCounter+=1;
  this.__id=__WFBarCounter;
  this.__width=bwidth || 10;
  this.__wincount=0;
  this.__failcount=0;


  // Метод печатает на заданный объект на аргумент to (по умолчанию -- document)
  // отображение html кода, необходимого для изображения соответствующего виджета
  this.write = function(to) {
    to = to || document;
    to.write("<span id='WFBar" + this.__id + "' style='white-space:nowrap; background-color:" + this.backcolor +"; padding:.4em;'>");
    to.write("<span id='WFBarGood" + this.__id + "' style='color:" + this.wincolor + "; font-weight:bold; margin-right:.5em;'>" + this.__wincount + "</span>");
    for(i=0; i<this.__width; i++) {
      to.write("<span id='WFBbar" + this.__id + "b" + i + "' style='color:" + this.neutralcolor + "'>" + this.symbol + "</span>")
    }
    to.write("<span id='WFBarBad" + this.__id + "' style='color:" + this.failcolor + "; font-weight:bold; margin-left:.5em;'>" + this.__failcount + "</span>");
    to.write("</span>");
  };
  
  // Метод посредством работы с DOM выводит во внутрь заданного объекта
  // всё что нужно для отображения виджета. В отличии от write не привязан к месту использования.
  this.insert = function(into) {
    var outerSpan=document.createElement('span');
    outerSpan.id='WFBar' + this.__id;
    outerSpan.style.whiteSpace='nowrap';
    outerSpan.style.backgroundColor=this.backcolor;
    outerSpan.style.padding='.4em';
    into.appendChild(outerSpan);
    var goodSpan=document.createElement('span');
    goodSpan.id='WFBarGood' + this.__id;
    goodSpan.style.color=this.wincolor;
    goodSpan.style.fontWeight='bold';
    goodSpan.style.marginRight='.5em';
    goodSpan.innerHTML=this.__wincount;
    outerSpan.appendChild(goodSpan);
    for(var i=0; i<this.__width; i++) {
      var barSpan=document.createElement('span');
      barSpan.id='WFBbar' + this.__id + 'b' + i;
      barSpan.style.color=this.neutralcolor;
      barSpan.innerHTML=this.symbol;
      outerSpan.appendChild(barSpan);
    }
    var badSpan=document.createElement('span');
    badSpan.id='WFBarBad' + this.__id;
    badSpan.style.color=this.failcolor;
    badSpan.style.fontWeight='bold';
    badSpan.style.marginLeft='.5em';
    badSpan.innerHTML=this.__failcount;
    outerSpan.appendChild(badSpan);
  }

  // выбор цвета для текущего квадрата
  this.__selectColor=function(n) {
    if(this.__wincount==0 && this.__failcount==0) return this.neutralcolor;
    if(this.__wincount==0) return this.failcolor;
    if(this.__failcount==0) return this.wincolor;
    if(this.__wincount/(this.__wincount+this.__failcount) > (n+.5)/this.__width) {
      return this.wincolor;
    } else {
      return this.failcolor;
    }
  }

  // Метод обновляет изображение в соответствии с текущими значениями атрибутов (цвета и счетчик удач/неудач)
  this.refresh=function() {
    document.getElementById('WFBar' + this.__id).style.backgroundColor=this.backcolor;
    var good=document.getElementById('WFBarGood' + this.__id);
    good.style.color=this.wincolor;
    good.innerHTML=this.__wincount;
    var bad=document.getElementById('WFBarBad' + this.__id);
    bad.style.color=this.failcolor;
    bad.innerHTML=this.__failcount;
    for(var i=0; i<this.__width; i++) {
      document.getElementById('WFBbar' + this.__id + 'b' + i).style.color=this.__selectColor(i);
    }
  }

  // Добавить заданное количество "успехов". По умолчанию 1.
  this.addWin=function(val) {
    val = val || 1;
    this.__wincount+=val;
    this.refresh();
  }

  // Добавить заданное количество "неуспехов". По умолчанию 1.
  this.addFail=function(val) {
    val = val || 1;
    this.__failcount+=val;
    this.refresh();
  }


  // Обнулить счетчики успехов/неуспехов
  this.reset=function() {
    this.__wincount=0;
    this.__failcount=0;
    this.refresh();
  }

  // Вернуть идентификатор самого внешнего span объекта в html коде.
  this.getID=function() {
    return 'WFBar' + this.__id;
  }

  return this;
}
