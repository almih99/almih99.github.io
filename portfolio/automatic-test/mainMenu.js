////////////////////////////////////////////////////////////////////
// Главное меню
////////////////////////////////////////////////////////////////////

"use strict";

////////////////////////////////////////////////////////////////////
// центрирование главного меню
// вызывается как непосредственно, так и из обработчика onresize
function adjustMenuPosition() {
	var menu = $('mainMenu');
	var menuSize = menu.getDimensions();
	var screenSize = currentScreenDimension();
	menu.style.top = screenSize.height/2 - menuSize.height/2 + 'px';
	menu.style.left = screenSize.width/2 - menuSize.width/2 + 'px';
}

/////////////////////////////////////////////////////////////////////
// Обработчик меню второго уровня. Вызов соответствующего действия
function onActivateSubmenu(n, action) {
	// временно
	if(action=='Вопросы') {
		pm.hideAll();
		pm.take('questionList').create($('content'), testbase, n);
        pm.show('questionList');
	} else {
		pm.hideAll();
		pm.take('questionnaire').create($('content'), testbase, n);
		pm.show('questionnaire');
	}
	

	//alert('попытка запуска подпункта ' + action + ' для теста ' + n);
	
}

/////////////////////////////////////////////////////////////////////
// Объект, контролирующий поведение главного меню.
// Поддерживает интерфейс переключателя окон
function mainMenuController(parent, data) {
	this.mainMenu=null;
	this.menuItems=new Array();
	// отобразить контролируемый объект
	this.show = function () {
		this.mainMenu.style.display='block';
		adjustMenuPosition();
	};
	// спрятать контролируемый объект
	this.hide = function () {
		this.mainMenu.style.display='none';
	};
	
	// Создать меню в ДОМ
	this.create = function(parent, data) {
		//
		var p=$(parent);
		// создаем основной объект
		this.mainMenu = document.createElement('div');
		this.mainMenu.className = 'mainMenu';
		this.mainMenu.id = 'mainMenu';
		p.appendChild(this.mainMenu);
		// создаем заголовок меню
		var mainMenuTitle = document.createElement('div');
		mainMenuTitle.className = 'mainMenuTitle';
		// добавляем таблицу
		var headTable = document.createElement('table');
		headTable.className = 'mainMenuTitleTable';
		mainMenuTitle.appendChild(headTable);
		var headTableBody = document.createElement('tbody');
		headTable.appendChild(headTableBody);
		var headTableRow = document.createElement('tr');
		headTableRow.className = 'mainMenuTitleTableRow';
		headTableBody.appendChild(headTableRow);
		var headTableCell = document.createElement('td');
		headTableCell.className = 'mainMenuTitleLeftCell';
		headTableCell.title = 'Показать историю';
		headTableCell.innerHTML = '<svg onclick="play(\'multimedia/buttonClick.wav\'); pm.take(\'history\').create($(\'content\'));pm.showOnly(\'history\');" onmouseover="play(\'multimedia/buttonOver.wav\');" style="cursor:pointer;" height="21px" version="1.1" viewBox="0 0 22 21" width="22px" xmlns="http://www.w3.org/2000/svg" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" xmlns:xlink="http://www.w3.org/1999/xlink"><title/><defs/><g fill="none" fill-rule="evenodd" id="miu" stroke="none" stroke-width="1"><path class="main-menu-history-svg" d="M14,2.00000004 L8,2.00000002 L8,2.00000002 L8,3.8714459 C8,4.49876334 7.3280543,5 6.49916725,5 L5.50083275,5 C4.66951005,5 4,4.49472913 4,3.8714459 L3.99951172,2 L0,2 L0,20 C0,21 1.10000002,21 1.10000002,21 L21,21 C21,21 22,21 22,20 L22,2 L18,2.00000005 L18,3.8714459 C18,4.49876334 17.3280543,5 16.4991672,5 L15.5008328,5 C14.66951,5 14,4.49472913 14,3.8714459 L14,2.00000004 L14,2.00000004 Z M16,0 C15.4477152,0 15,0.447207592 15,0.999050678 L15,3.00094933 C15,3.55270978 15.448839,4 16,4 C16.5522847,4 17,3.5527924 17,3.00094933 L17,0.999050678 C17,0.447290222 16.5511609,0 16,0 Z M5,0.752369405 L5,3.2476306 C5,3.66315275 5.33475502,4 5.75041638,4 L6.24958362,4 C6.66402715,4 7,3.66584223 7,3.2476306 L7,0.752369405 C7,0.336847255 6.66524498,0 6.24958362,0 L5.75041638,0 C5.33597285,0 5,0.334157765 5,0.752369405 Z M2,6 L2,7 L20,7 L20,6 L2,6 L2,6 Z M6,11.345021 C6.73724376,11.2828421 7.2514163,11.1789395 7.54253307,11.0333099 C7.83364984,10.8876804 8.05103898,10.5432472 8.19470699,10 L9,10 L9,18 L8.02545166,18 L8.02545166,12.0224404 L6,12.0224404 L6,11.345021 Z M15.51417,11.2454113 C15.8380583,11.8871548 16,12.7663665 16,13.8830728 C16,14.9417683 15.8532403,15.8173543 15.5597166,16.5098572 C15.1346132,17.5032907 14.4396135,18 13.4746963,18 C12.6042467,18 11.9564798,17.5939311 11.5313765,16.7817811 C11.1771237,16.1037809 11,15.1937515 11,14.0516655 C11,13.1670022 11.1062742,12.4074358 11.3188259,11.7729436 C11.7169386,10.5909753 12.4372418,10 13.4797571,10 C14.4176835,10 15.0958144,10.415133 15.51417,11.2454113 C15.51417,11.2454113 15.0958144,10.415133 15.51417,11.2454113 L15.51417,11.2454113 Z M14.5843072,16.3502183 C14.8614371,15.9170284 15,15.1100496 15,13.9292576 C15,13.0768516 14.8998341,12.3755486 14.6994992,11.8253275 C14.4991643,11.2751064 14.1101865,11 13.5325543,11 C13.0016668,11 12.6135238,11.2611327 12.3681135,11.7834061 C12.1227033,12.3056795 12,13.0751041 12,14.0917031 C12,14.8567724 12.0784633,15.4716134 12.2353923,15.9362445 C12.4757942,16.6454184 12.8864746,17 13.4674457,17 C13.9348938,17 14.3071772,16.7834083 14.5843072,16.3502183 C14.5843072,16.3502183 14.3071772,16.7834083 14.5843072,16.3502183 L14.5843072,16.3502183 Z" fill="#000000" id="common_calendar_day_glyph"/></g></svg>';
		headTableRow.appendChild(headTableCell);
		var headTableCell = document.createElement('td');
		headTableCell.className = 'mainMenuTitleCenterCell';
		headTableCell.innerHTML = data.title;
		headTableRow.appendChild(headTableCell);
		var headTableCell = document.createElement('td');
		headTableCell.className = 'mainMenuTitleRightCell';
		if(isNodeWebkit()) {
			headTableCell.title = 'Выход из программы';
			headTableCell.innerHTML = '<svg onclick="play(\'multimedia/buttonClick.wav\'); try{saveWindowState()}catch(err){}; quitApplication();" onmouseover="play(\'multimedia/buttonOver.wav\');" style="cursor:pointer;" height="24px" id="Layer_1" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" width="24px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path class="main-menu-close-svg" d="M256,33C132.3,33,32,133.3,32,257c0,123.7,100.3,224,224,224c123.7,0,224-100.3,224-224C480,133.3,379.7,33,256,33z    M364.3,332.5c1.5,1.5,2.3,3.5,2.3,5.6c0,2.1-0.8,4.2-2.3,5.6l-21.6,21.7c-1.6,1.6-3.6,2.3-5.6,2.3c-2,0-4.1-0.8-5.6-2.3L256,289.8   l-75.4,75.7c-1.5,1.6-3.6,2.3-5.6,2.3c-2,0-4.1-0.8-5.6-2.3l-21.6-21.7c-1.5-1.5-2.3-3.5-2.3-5.6c0-2.1,0.8-4.2,2.3-5.6l75.7-76   l-75.9-75c-3.1-3.1-3.1-8.2,0-11.3l21.6-21.7c1.5-1.5,3.5-2.3,5.6-2.3c2.1,0,4.1,0.8,5.6,2.3l75.7,74.7l75.7-74.7   c1.5-1.5,3.5-2.3,5.6-2.3c2.1,0,4.1,0.8,5.6,2.3l21.6,21.7c3.1,3.1,3.1,8.2,0,11.3l-75.9,75L364.3,332.5z"/></g></svg>';
		} else {
			headTableCell.innerHTML = '&nbsp;';
		}
		headTableRow.appendChild(headTableCell);
		//mainMenuTitle.innerHTML = data.title;
		this.mainMenu.appendChild(mainMenuTitle);
		// в цикле добавляем блок для каждого теста
		for(var test=0; test<data.tests.length; test++) {
			// общий элемент пункта меню, создающий рамочку
			var menuItem = document.createElement('div');
			menuItem.className = 'mainMenuItem';
			this.mainMenu.appendChild(menuItem);
			// текст пункта меню
			var menuItemText = document.createElement('div');
			menuItemText.className = 'mainMenuItemText';
			menuItemText.innerHTML = data.tests[test].title;
			menuItem.appendChild(menuItemText);
			// блок, содержащий подменю
			var menuItemSubmenu = document.createElement('div');
			menuItemSubmenu.className = 'mainMenuSubitemHolderOn';
			menuItem.appendChild(menuItemSubmenu);
			// таблица, содержащая кнопки
			var menuTable = document.createElement('table');
			menuTable.className = 'mainMenuSubmenuTable';
			menuItemSubmenu.appendChild(menuTable);
			// тело таблицы
			var menuTableBody = document.createElement('tbody');
			menuTable.appendChild(menuTableBody);
			// строка таблицы
			var menuTableRow = document.createElement('tr');
			menuTableBody.appendChild(menuTableRow);
			// в цикле добавляем две ячейки, поскольку они отличаются лишь текстом
			var options = ['Вопросы', 'Тестирование'];
			for(var c=0; c<options.length; c++) {
				// ячейка таблицы
				var menuTableCell = document.createElement('td');
				menuTableCell.className = 'mainMenuSubmenuTable';
				menuTableRow.appendChild(menuTableCell);
				// текст подменю
				var submenuText = document.createElement('div');
				submenuText.className='mainMenuSubitem';
				submenuText.innerHTML=options[c];
				submenuText.setAttribute('date-test-index', test);
				submenuText.setAttribute('date-test-action', options[c]);
				submenuText.onclick = function (e) {
					play('multimedia/buttonClick.wav');
					onActivateSubmenu(	this.getAttribute('date-test-index'), 
										this.getAttribute('date-test-action'));
					};
				submenuText.onmouseover = function (e) 	{ play('multimedia/buttonOver.wav') };
				menuTableCell.appendChild(submenuText);
			}
		}
	};
	this.create(parent, data);
}

function quitApplication() {
	var gui = require('nw.gui');
	gui.App.quit();
}
