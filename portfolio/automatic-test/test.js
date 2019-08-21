// Набор вопросов, отображаемый при тестировании

function test() {
	
	this.testset = null;			// Данное извне задание
	this.questions = new Array();	// Объекты вопросов
	
	this.show = function () {
		var c = $('test-content-frame');
		if(c) {
			c.style.display='block';
			adjustTestContentFramePosition();
		}
	}
	
	this.hide = function () {
		var c = $('test-content-frame');
		if(c) {
			c.style.display='none';
		}
	}
	
	this.create = function (parent, testset) {
		// в первую очередь очищаем содержимое родителя от хлама
		parent=$(parent);
		parent.innerHTML='';
		// сохраняем набор вопросов
		this.testset=testset;
		// выводим главное окно
		var topDiv=document.createElement('div');
		topDiv.id='test-content-frame';
		topDiv.className='test-content-frame';
		parent.appendChild(topDiv);
		// выводим блок заголовка
		var titleDiv=document.createElement('div');
		titleDiv.id='test-content-title';
		titleDiv.className='test-content-title';
		topDiv.appendChild(titleDiv);
		// таблица, формирующая содержимое заголовка
		var titleTable=document.createElement('table');
		titleTable.className='test-content-title-table';
		titleDiv.appendChild(titleTable);
		// тело таблицы
		var titleTableBody=document.createElement('tbody');
		titleTable.appendChild(titleTableBody);
		// строка таблицы
		var titleTableRow=document.createElement('tr');
		titleTableBody.appendChild(titleTableRow);
		// первый столбец таблицы
		var titleTableCell=document.createElement('td');
		titleTableCell.className='test-content-title-table-cell';
		titleTableRow.appendChild(titleTableCell);
		// Просто пустое место слева
		var placecholder=document.createElement('div');
		placecholder.className='empty';
		placecholder.innerHTML='empty';
		titleTableCell.appendChild(placecholder);
		// второй столбец таблицы
		var titleTableCell=document.createElement('td');
		titleTableCell.className='test-content-title-table-cell';
		titleTableCell.width='100%';
		titleTableRow.appendChild(titleTableCell);
		// просто строка заголовка
		var titleBarText=document.createElement('div');
		titleBarText.className='test-content-title-text';
		titleBarText.innerHTML='Тестирование';
		titleTableCell.appendChild(titleBarText)
		// третий столбец таблицы
		var titleTableCell=document.createElement('td');
		titleTableCell.className='test-content-title-table-cell';
		titleTableRow.appendChild(titleTableCell);
		// кнопка выбора раздела тут отсутствует.
		var placecholder=document.createElement('div');
		placecholder.className='empty';
		placecholder.innerHTML='empty';
		titleTableCell.appendChild(placecholder);
		// div, содержащий список вопросов
		var contentBlock=document.createElement('div');
		contentBlock.id='test-content-content';
		contentBlock.className='test-content-content';
		topDiv.appendChild(contentBlock);
		// теперь осталось наполнить contentBlock содержимым
		var contentTitle = document.createElement('h1');
		contentTitle.className='test-content-title';
		contentTitle.innerHTML=testset.globaltitle;
		contentBlock.appendChild(contentTitle);
		var contentTitle = document.createElement('h2');
		contentTitle.className='test-content-title';
		contentTitle.innerHTML=testset.localtitle;
		contentBlock.appendChild(contentTitle);
		// данные пользователя
		this.createUserDataBlock(contentBlock, testset);
		// собственно тест
		this.createTestQuestions(contentBlock, testset);
		// И добавляем кнопку "проверить"
		var buttonBox = document.createElement('div');
		buttonBox.id='test-button-box';
		buttonBox.className='test-button-box';
		contentBlock.appendChild(buttonBox);
		var readyButton = document.createElement('div');
		readyButton.className = 'test-ready-button';
		readyButton.innerHTML='Готово';
		readyButton.data=this;
		readyButton.onmouseover = function (e) 	{ play('multimedia/buttonOver.wav'); };
		readyButton.onclick = function (event) { 
			// при вызове мы в контексте кнопки
			play('multimedia/buttonClick.wav');
			// отмечаем время окончания теста
			testset.stoptime = new Date().getTime();
			// получаем пользовательский ввод и помещаем его в наш многострадальный объект
			testset.answers=this.data.getAnswers();
			// А теперь проверяем его. Поскольку в будущем проверка будет выполняться
			// на серверной части, вызываем функцию, которая при необходимости перенаправит
			// проверку теста на сервер, а при невозможности этого проверит локально
			testset.resault = checkAllAnswers(testset);
			// Сбрасываем текущий тест чтобы следующий запуск начался с главного меню.
			clearCurrentSavedTest();
			// Сохраняем результаты тестирования в истории
			saveHistoryItem(testset);
			// отображаем результат тестирования
			this.data.markAll();
			this.data.showResults(testset);
			// Скрываем нашу панель
			$('test-button-box').style.display='none';
			// скроллим до низу
			$('test-resault-block').scrollIntoView(true);
		};
		buttonBox.appendChild(readyButton);
		// место для вывода результатов тестирования
		var resaultBlock = document.createElement('div');
		resaultBlock.id = 'test-resault-block';
		resaultBlock.className = 'test-resault-block';
		contentBlock.appendChild(resaultBlock);
		
		// $('test-content-content').innerHTML=$('test-content-content').innerHTML+[testset].toJSON();
		
	}
	
	this.createUserDataBlock = function(parent, testset) {
		// всеохватывающая таблица
		var table = document.createElement('table');
		table.className='test-content-userdata';
		parent.appendChild(table);
		// тело таблицы
		var tableBody = document.createElement('tbody');
		table.appendChild(tableBody);
		// цикл по строкам
		for(var i=0; i<testset.userdata.length; i++) {
			// строка
			var tablerow = document.createElement('tr');
			tablerow.className='test-content-userdata-row';
			tableBody.appendChild(tablerow);
			// первая ячейка
			var tablecell = document.createElement('td');
			tablecell.className='test-content-userdata-cell-1';
			tablecell.innerHTML=testset.userdata[i].name;
			tablerow.appendChild(tablecell);
			// вторая ячейка
			var tablecell = document.createElement('td');
			tablecell.className='test-content-userdata-cell-2';
			tablecell.innerHTML=":";
			tablerow.appendChild(tablecell);
			// третья ячейка
			var tablecell = document.createElement('td');
			tablecell.className='test-content-userdata-cell-3';
			tablecell.innerHTML=testset.userdata[i].value;
			tablerow.appendChild(tablecell);
		}
	}
	
	this.createTestQuestions = function(parent, testset) {
		var test=testbase.tests[testset.testnumber];
		var qnum=1;
		this.questions = new Array(); // обнуляем список существующих вопросов
		// цикл по разделам
		for(var i=0; i<testset.testset.length; i++) {
			// цикл по вопросам в разделе
			for(j=0; j<testset.testset[i].length; j++) {
				// testbase, testnumber, divnumber, questionnumber
				var q = new Question(testbase, testset.testnumber, i, testset.testset[i][j]);
				this.questions.push(q);
			    q.map2dom(parent, qnum++, 'Test');
			}
		}
	}
	
	this.markAll = function() {
		for(var i=0; i<this.questions.length; i++) {
			this.questions[i].checkAnswer();
			this.questions[i].showTheoryButton();
		}
	}
	
	this.showResults = function(testset) {
		var parent=$('test-resault-block');
		// Заголовок результатов
		var header = document.createElement('h1');
		header.className='test-resault-header';
		header.innerHTML='Результаты тестирования';
		parent.appendChild(header);
		// Вывести таблицу с оценкой и результатами
		var table = document.createElement('table');
		table.className = 'test-resault-table';
		parent.appendChild(table);
		var tbody = document.createElement('tbody');
		table.appendChild(tbody);
		// строка 1
		var tr = document.createElement('tr');
		tr.className='test-resault-table-row';
		tbody.appendChild(tr);
		var td = document.createElement('td');
		td.className='test-resault-table-cell';
		td.innerHTML='Верных ответов:';
		tr.appendChild(td);
		var td = document.createElement('td');
		td.className='test-resault-table-cell';
		td.innerHTML=String(testset.resault.answersTrue);
		tr.appendChild(td);
		// строка 2
		var tr = document.createElement('tr');
		tr.className='test-resault-table-row';
		tbody.appendChild(tr);
		var td = document.createElement('td');
		td.className='test-resault-table-cell';
		td.innerHTML='Ошибочных ответов:';
		tr.appendChild(td);
		var td = document.createElement('td');
		td.className='test-resault-table-cell';
		td.innerHTML=String(testset.resault.answersFalse);
		tr.appendChild(td);
		// строка 3
		var tr = document.createElement('tr');
		tr.className='test-resault-table-row';
		tbody.appendChild(tr);
		var td = document.createElement('td');
		td.className='test-resault-table-cell';
		td.innerHTML='Не дано ответов:';
		tr.appendChild(td);
		var td = document.createElement('td');
		td.className='test-resault-table-cell';
		td.innerHTML=String(testset.resault.answersNone);
		tr.appendChild(td);
		// строка 4
		var tr = document.createElement('tr');
		tr.className='test-resault-table-row';
		tbody.appendChild(tr);
		var td = document.createElement('td');
		td.className='test-resault-table-cell';
		td.innerHTML='Оценка:';
		tr.appendChild(td);
		var td = document.createElement('td');
		td.className='test-resault-table-cell';
		td.innerHTML=String(testset.resault.mark);
		tr.appendChild(td);
		// вывести кнопку "показывать только ошибки"
		var hr = document.createElement('hr');
		parent.appendChild(hr);
		var cb = document.createElement('input');
		cb.type='checkbox';
		cb.id='test-resault-checkbox';
		cb.data=this;
		cb.onclick = function(e) {
			cb.data.showOnlyFails(this.checked, testset);
			$('test-resault-block').scrollIntoView(true);
		}
		parent.appendChild(cb);
		var txt = document.createElement('label');
		txt.setAttribute('for', 'test-resault-checkbox');
		txt.className='test-resault-checkbox-label';
		txt.innerHTML='Показывать только ошибки';
		parent.appendChild(txt);
		var hr = document.createElement('hr');
		parent.appendChild(hr);
		// Вывести кнопку "Продолжить"
		var continueButton = document.createElement('div');
		continueButton.className = 'test-resault-continue-button';
		continueButton.innerHTML='Продолжить';
		continueButton.title='Перейти к протоколу тестирования';
		continueButton.data=this;
		continueButton.onmouseover = function (e) 	{ play('multimedia/buttonOver.wav'); };
		continueButton.onclick = function (event) { 
			// при вызове мы в контексте кнопки
			play('multimedia/buttonClick.wav');
			// вывод протокола
			pm.hideAll();
			pm.take('resaultProtocol').create($('content'), testset);
			pm.show('resaultProtocol');
		};
		parent.appendChild(continueButton);
		// Сделать видимым
		parent.style.display='block';
//document.write('<div>' + Object.toJSON(testset) + '</div>')
	}
	
	// вызывается при нажатии на кнопку "показывать только ошибки"
	this.showOnlyFails = function(show, testset) {
		for(var i=0; i<this.questions.length; i++) {
			if(testset.resault.correctness[i]) {
				var display;
				if(!show) {display='block'} else {display='none'};
				this.questions[i].questionFrameElement.style.display=display;
			}
		}
	};
	
	// возвращает массив ответов пользователя [[], [2, 3], [1] ... ]
	// поскольку возможны вопросы с несколькими ответами, каждый элемент -- массив
	this.getAnswers = function() {
		var resault = new Array();
		for(var i=0; i<this.questions.length; i++) {
			resault.push(this.questions[i].getAnswers());
		}
		return resault;
	}
	
}

function adjustTestContentFramePosition() {
	var frame = $('test-content-frame');
	var title = $('test-content-title');
	var content = $('test-content-content');
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

// сохранить в локальном хранилище. Необходимо чтобы обеспечить восстановление
// теста после внезапного закрытия окна. Обломс для желающих выйти из программы.
// а так же восстановить и проверить наличие.
function saveCurrentTest(testset) {
	if(typeof(Storage)==='undefined') return;
	localStorage.CurrentTest=Object.toJSON(testset);
}

function loadCurrentTest() {
	if(typeof(Storage)==='undefined') return null;
	if(!localStorage.CurrentTest) return null;
	return localStorage.CurrentTest.evalJSON();
}

function clearCurrentSavedTest() {
	if(typeof(Storage)==='undefined') return;
	localStorage.CurrentTest="";
}

function isCurrentTestSaved() {
	if(typeof(Storage)==='undefined') return false;
	if(!localStorage.CurrentTest) return false;
	if(localStorage.CurrentTest=="") return false;
	return true;
}
