// инициализация при запуске.
"use strict";

var pm=null;	

// глобальная переменная для доступа к функциям NW
if(isNodeWebkit()) {
	var gui = require('nw.gui');
} else {
	var gui=null;
}

function initialize() {
	// Задание заголовка окна
	document.title=testbase.title;
	// глобальный объект, управляющий html-окнами.
    pm = new pageManager();
    // настройка размера окна
    
	// Настройка размера обоины
	adjustWallpaperSize();
	// Создание меню
	pm.add(new mainMenuController('mainMenuWrapper', testbase),'mainMenu');
	// Создание объекта списка вопросов
	pm.add(new questionList(),'questionList');
	// Создание объекта-анкеты
	pm.add(new questionnaire(), 'questionnaire');
	// Создание объекта-теста
	pm.add(new test(), 'test');
	// Создание объекта-протокола
	pm.add(new resaultProtocol(), 'resaultProtocol');
	// Создание объекта-истории
	pm.add(new history(), 'history');
	// действия на изменение размеров окна
	window.addEventListener('resize', 
		function(event){ 
			adjustWallpaperSize(); 
			adjustMenuPosition();
			adjustContentFramePosition();
			adjustTestContentFramePosition();
			adjustNavigationMenuBackgroundSize();
			adjustQuestionnaireFramePosition();
			adjustResaultFramePosition();
			adjustHistoryFramePosition();
		});

	if(isCurrentTestSaved()) {
		// продолжаем незаконченный в прошлый раз экзамен
		var testset = loadCurrentTest();
		pm.take('test').create($('content'), testset);
		pm.showOnly('test');
	} else {
		// отображаем главное меню. Таким образом меньше мельканий на экране при старте.
		setTimeout(function(){pm.showOnly('mainMenu');}, 1);
		//pm.showOnly('mainMenu');
	}
}
