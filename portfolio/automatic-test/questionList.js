// вывод списка вопросов

"use strict";

// через этот глобальный объект передаются данные для вывода
// вопросов раздела в обработчике таймера
var gCurrentDivisionData=null;

function questionList() {
	
	// общий счетчик вопросов
	this.currentQuestionNumber=1;
	
	// счетчик ошибок/попаданий
	this.wf=null;
	
	this.show=function() {
		var c = $('content-frame');
		if(c) {
			c.style.display='block';
			adjustContentFramePosition();
		}
	};
	
	this.hide=function() {
		var c = $('content-frame');
		if(c) {
			c.style.display='none';
		}
	};
	
	this.create = function (parent, testset, testnumber) {
		// сбрасываем счетчик вопросов
		this.currentQuestionNumber=1;
		// в первую очередь очищаем содержимое родителя от хлама
		parent=$(parent);
		parent.innerHTML='';
		// выводим главное окно
		var topDiv=document.createElement('div');
		topDiv.id='content-frame';
		topDiv.className='content-frame';
		parent.appendChild(topDiv);
		// выводим блок заголовка
		var titleDiv=document.createElement('div');
		titleDiv.id='content-title';
		titleDiv.className='content-title';
		topDiv.appendChild(titleDiv);
		// таблица, формирующая содержимое заголовка
		var titleTable=document.createElement('table');
		titleTable.className='content-title-table';
		titleDiv.appendChild(titleTable);
		// тело таблицы
		var titleTableBody=document.createElement('tbody');
		titleTable.appendChild(titleTableBody);
		// строка таблицы
		var titleTableRow=document.createElement('tr');
		titleTableBody.appendChild(titleTableRow);
		// первый столбец таблицы
		var titleTableCell=document.createElement('td');
		titleTableCell.className='content-title-table-cell';
		titleTableRow.appendChild(titleTableCell);
		// индикатор удач/промахов
		titleTableCell.title="Индикатор успехов";
		this.wf = new WFBar(10);
		this.wf.backcolor = 'rgba(0,0,0,0)';
		this.wf.wincolor='#008000';
		//this.wf.failcolor=
		this.wf.insert(titleTableCell);
		// второй столбец таблицы
		var titleTableCell=document.createElement('td');
		titleTableCell.className='content-title-table-cell';
		titleTableCell.width='100%';
		titleTableRow.appendChild(titleTableCell);
		// просто строка заголовка
		var titleBarText=document.createElement('div');
		titleBarText.className='content-title-text';
		titleBarText.innerHTML='Перечень вопросов';
		titleBarText.ondblclick = function (e) {window.print()};
		titleTableCell.appendChild(titleBarText)
		// третий столбец таблицы
		var titleTableCell=document.createElement('td');
		titleTableCell.className='content-title-table-cell';
		titleTableRow.appendChild(titleTableCell);
		// кнопка выбора раздела
		var titleBarMenuButton=document.createElement('input');
		titleBarMenuButton.type='button';
		titleBarMenuButton.value='Перейти к разделу...';
		titleBarMenuButton.className='content-title-button';
		titleBarMenuButton.onmouseover = function (e) 	{ play('multimedia/buttonOver.wav') };
		titleBarMenuButton.onclick=function (e) {
			if (!e) var e = window.event;
			$('navigationMenuBackground').style.display='block';
			var m=$('navigationMenuFrame');
			m.style.right='10px';
			m.style.top=e.clientY + 10 + 'px';
			play('multimedia/buttonClick.wav');
		}
		titleTableCell.appendChild(titleBarMenuButton);
		// блок меню
		this.createNavigationMenu($('contextMenu'), testset, testnumber);
		// четверты столбец таблицы
		var titleTableCell=document.createElement('td');
		titleTableCell.className='content-title-table-cell';
		titleTableRow.appendChild(titleTableCell);
		// кнопка закрытия
		titleTableCell.title='Вернуться в главное меню';
		titleTableCell.innerHTML='<svg onclick="play(\'multimedia/buttonClick.wav\');if(gCurrentDivisionData){clearTimeout(gCurrentDivisionData.timerID)};pm.showOnly(\'mainMenu\');" onmouseover="play(\'multimedia/buttonOver.wav\');" style="cursor:pointer;" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" height="22" version="1.1" viewBox="0 0 22 22" width="22"><metadata id="metadata12"/> <path sodipodi:type="arc" class="close-button-circle" id="resault-back-button-circle" sodipodi:cx="10.975136" sodipodi:cy="11.387405" sodipodi:rx="10.480761" sodipodi:ry="10.480761" d="m 21.455896,11.387405 a 10.480761,10.480761 0 1 1 -20.96152077,0 10.480761,10.480761 0 1 1 20.96152077,0 z" transform="matrix(1,0,0,0.99332918,0.06591674,-0.31154005)" fill="#ffffff" stroke="#000200" color="#000000"/> <path d="M 12.853763,16.067494 7.8111327,11.024864 12.425304,6.4106929" id="path2984" inkscape:connector-curvature="0" fill="none" stroke="#000000" color="#000000" stroke-width="2"/></svg>';
		// div, содержащий список вопросов
		var contentBlock=document.createElement('div');
		contentBlock.id='content-content';
		contentBlock.className='content-content';
		topDiv.appendChild(contentBlock);
		// теперь осталось наполнить contentBlock содержимым
		this.createDivisions(contentBlock, testset, testnumber);
	};
	
	this.createDivisions = function (parent, testset, testnumber) {
		test=testset.tests[testnumber];
		// Вначале выводим общий заголовок теста
		var head = document.createElement('h1');
		head.className='QuestionListTopTitle';
		head.innerHTML=test.title;
		parent.appendChild(head);
		// сбрасываем массив мест под вопросы
		var divisionPlaceholders = new Array();
		// Цикл по разделам
		for(var div=0; div<test.divisions.length; div++) {
			// заголовок раздела
			var head = document.createElement('h2');
			head.id='division:' + div + ':list';
			head.className='QuestionListDivisionTitle';
			head.innerHTML=test.divisions[div].title;
			parent.appendChild(head);
			// пояснительный текст к разделам
			for(var line=0; line<test.divisions[div].text.length; line++) {
				var p = document.createElement('p');
				p.className = 'QuestionListText';
				p.innerHTML = test.divisions[div].text[line];
				parent.appendChild(p);
			};
			// а тут выводим список вопросов
			// this.createDivisionQuestionList(parent, testset, testnumber, div);
			var divContent = document.createElement('div');
			parent.appendChild(divContent);
			divisionPlaceholders.push(divContent);
		}
		// Подготавливаем данные для вывода первого раздела в обработчике таймера
		// Остальные разделы выводятся установкой обработчика в этом обработчике 
		gCurrentDivisionData={};
		gCurrentDivisionData.questionListObject = this;
		gCurrentDivisionData.testset=testset;
		gCurrentDivisionData.testnumber=testnumber;
		gCurrentDivisionData.divnumber=0;
		gCurrentDivisionData.divisionPlaceholders=divisionPlaceholders;
		gCurrentDivisionData.timerID=setTimeout(showDivQuestions, 0);
	}
	
	// вывод списка вопросов раздела
	this.createDivisionQuestionList = function(parent, testset, testnumber, divnumber) {
		var questions = testset.tests[testnumber].divisions[divnumber].questions;
		for(var q=0; q<questions.length; q++) {
			var temp = new Question(testset, testnumber, divnumber, q);
			temp.map2dom(parent, this.currentQuestionNumber, 'List');
			temp.showCheckButton();
			temp.showTheoryButton();
			this.currentQuestionNumber++;
		}
	}
	
	// Вывод меню перехода по разделам
	this.createNavigationMenu = function(parent, testset, testnumber) {
		// для начала чистим блок
		parent.innerHTML="";
		// блок, закрывающий всё пространство страницы и ловящий клики
		var menuBackground = document.createElement('div');
		menuBackground.id='navigationMenuBackground';
		menuBackground.className = 'navigationMenuBackground';
		menuBackground.style.left=0;
		menuBackground.style.top=0;
		menuBackground.style.width=currentScreenWidth() + 'px';
		menuBackground.style.height=currentScreenHeight() + 'px';
		menuBackground.onclick = function (e) {
			this.style.display='none';
		}
		parent.appendChild(menuBackground);
		// основное меню
		var menuFrame = document.createElement('div');
		menuFrame.id = "navigationMenuFrame";
		menuFrame.className = "navigationMenuFrame";
		menuBackground.appendChild(menuFrame);
		// цикл по разделам
		for(var i=0; i<testset.tests[testnumber].divisions.length; i++) {
			var line = document.createElement('div');
			line.className="navigationMenuItem";
			line.innerHTML=testset.tests[testnumber].divisions[i].title;
			line.targedID='division:' + i + ':list';
			line.onmouseover = function (e) 	{ play('multimedia/buttonOver.wav') };
			line.onclick=function(e) {
				$(this.targedID).scrollIntoView(true);
				play('multimedia/buttonClick.wav');
				return false;
			}
			menuFrame.appendChild(line);
		}
		
	}
}

// данная функция отображает список вопросов раздела, вызывается из обработчика таймера
// и берет параметры из глобальной переменной gCurrentDivisionData
function showDivQuestions() {
	var d=gCurrentDivisionData;
	var questions = d.testset.tests[d.testnumber].divisions[d.divnumber].questions;
	for(var q=0; q<questions.length; q++) {
		var temp = new Question(d.testset, d.testnumber, d.divnumber, q);
		temp.map2dom(d.divisionPlaceholders[d.divnumber], d.questionListObject.currentQuestionNumber, 'List');
		temp.showCheckButton();
		temp.showTheoryButton();
		d.questionListObject.currentQuestionNumber++;
	}
	// Проверяем следует ли нам продолжить, остались ли еще разделы не выведенные
	if(d.divnumber < d.testset.tests[d.testnumber].divisions.length - 1) {
		d.divnumber++;
		d.timerID=setTimeout(showDivQuestions, 100);
	} else {
		gCurrentDivisionData=null;
		//play('multimedia/ding.wav');
	}
}


function adjustContentFramePosition() {
	var frame = $('content-frame');
	var title = $('content-title');
	var content = $('content-content');
	if(frame && title && content) {
		// настройка внешнего блока
		var screenSize=currentScreenDimension();
		if(screenSize.width > 920) {
			frame.style.width = 900 + 'px';
			frame.style.left = (screenSize.width - 900)/2 + 'px';
		} else {
			frame.style.width = screenSize.width -20 + 'px';
			frame.style.left = '10px';
		}
		frame.style.bottom='10px';
		frame.style.top='10px';
		// настройка внутреннего блока
		content.style.top = title.getHeight()+20+'px';
	}
}

