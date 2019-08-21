// Управление отображением "окон"

"use strict";

// объект-контроллер отображаемых объектов
// в основном необходим чтобы скрывать всё лишнее одним движением
// Управляемые объектыт должны поддерживать функции show и hide
function pageManager() {
	this.all = {};
	
	// добавить контоллер объекта
	this.add = function(controller, name) {
		this.all[name] = controller;
	};
	
	// получить контроллер объекта
	this.take = function(name) {
		return this.all[name];
	};
	
	// скрыть один объект
	this.hide = function(name) {
		this.all[name].hide();
	};
	
	// показать один объект
	this.show = function(name) {
		this.all[name].show();
	};
	
	// скрыть все объекты
	this.hideAll = function() {
		for(var n in this.all) {
			this.hide(n);
		}
	};
	
	// скрыть все объекты и показать заданный
	this.showOnly = function(name) {
		this.hideAll();
		this.show(name);
	};
}
