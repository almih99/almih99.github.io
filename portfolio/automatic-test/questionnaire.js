
"use strict"

// Объект, отображающий окно с запросом данных
function questionnaire () {
	
	this.fields = null;
	this.labels = null;
	
	this.show = function() {
		adjustQuestionnaireFramePosition()
	};
	
	this.hide = function() {
		var f=$('questionnaire-frame')
		if(f) {
			f.style.display='none';
		}
	};
	
	this.create = function(parent, testbase, testnumber) {
		// Сохраняем для дальнейшего использования
		this.currentQuesionnaire=testbase.questionnaire;
		// Очистка места
		parent=$(parent);
		parent.innerHTML='';
		this.fields=new Array();
		// Создаем общий для сбора данных об экзаменуемом div
		var topDiv=document.createElement('div');
		topDiv.id='questionnaire-frame';
		topDiv.className='questionnaire-frame';
		parent.appendChild(topDiv);
		// выводим блок заголовка
		var titleDiv=document.createElement('div');
		titleDiv.id='questionnaire-title';
		titleDiv.className='questionnaire-title';
		topDiv.appendChild(titleDiv);
		// таблица, формирующая содержимое заголовка
		var titleTable=document.createElement('table');
		titleTable.className='questionnaire-title-table';
		titleDiv.appendChild(titleTable);
		// тело таблицы
		var titleTableBody=document.createElement('tbody');
		titleTable.appendChild(titleTableBody);
		// строка таблицы
		var titleTableRow=document.createElement('tr');
		titleTableBody.appendChild(titleTableRow);
		// первый столбец таблицы
		var titleTableCell=document.createElement('td');
		titleTableCell.className='questionnaire-title-table-cell';
		titleTableRow.appendChild(titleTableCell);
		// пустое место
		var titleBarPlaceholder=document.createElement('div');
		titleBarPlaceholder.className='empty';
		titleBarPlaceholder.innerHTML="empty";
		titleTableCell.appendChild(titleBarPlaceholder);
		// второй столбец таблицы
		var titleTableCell=document.createElement('td');
		titleTableCell.className='questionnaire-title-table-cell';
		titleTableCell.width='100%';
		titleTableRow.appendChild(titleTableCell);
		// просто строка заголовка
		var titleBarText=document.createElement('div');
		titleBarText.className='questionnaire-title-text';
		titleBarText.innerHTML='Сбор данных о тестируемом';
		titleTableCell.appendChild(titleBarText);
		// третий столбец таблицы
		var titleTableCell=document.createElement('td');
		titleTableCell.className='questionnaire-title-table-cell';
		titleTableRow.appendChild(titleTableCell);
		// кнопка закрытия
		titleTableCell.title='Вернуться в главное меню';
		titleTableCell.innerHTML='<svg onclick="play(\'multimedia/buttonClick.wav\');pm.showOnly(\'mainMenu\');" onmouseover="play(\'multimedia/buttonOver.wav\');" style="cursor:pointer;" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" height="22" version="1.1" viewBox="0 0 22 22" width="22"><metadata id="metadata12"/> <path sodipodi:type="arc" class="close-button-circle" id="resault-back-button-circle" sodipodi:cx="10.975136" sodipodi:cy="11.387405" sodipodi:rx="10.480761" sodipodi:ry="10.480761" d="m 21.455896,11.387405 a 10.480761,10.480761 0 1 1 -20.96152077,0 10.480761,10.480761 0 1 1 20.96152077,0 z" transform="matrix(1,0,0,0.99332918,0.06591674,-0.31154005)" fill="#ffffff" stroke="#000200" color="#000000"/> <path d="M 12.853763,16.067494 7.8111327,11.024864 12.425304,6.4106929" id="path2984" inkscape:connector-curvature="0" fill="none" stroke="#000000" color="#000000" stroke-width="2"/></svg>';
		// div, содержащий анкету
		var contentBlock=document.createElement('div');
		contentBlock.id='questionnaire-content';
		contentBlock.className='questionnaire-content';
		topDiv.appendChild(contentBlock);
		// теперь общий блок, который перемещаем по вертикали по центру
		var innerContentBlock=document.createElement('div');
		innerContentBlock.id='questionnaire-content-inner-div';
		innerContentBlock.className='questionnaire-content-inner-div';
		contentBlock.appendChild(innerContentBlock);
		// Заголовок
		var header=document.createElement('div');
		header.className='questionnaire-content-head';
		header.innerHTML='Введите данные:';
		innerContentBlock.appendChild(header);
		// Таблица, содержащая поля и их описания
		var table=document.createElement('table');
		table.className='questionnaire-content-table';
		innerContentBlock.appendChild(table);
		var tableBody=document.createElement('tbody');
		table.appendChild(tableBody);
		// цикл по запрашиваемым полям
		this.fields = [];
		this.labels = [];
		for(var i=0; i<testbase.questionnaire.length; i++) {
			// создаем очередную строку
			var row=document.createElement('tr');
			tableBody.appendChild(row);
			// левая ячейка
			var cell=document.createElement('td');
			cell.className='questionnaire-content-table-left-cell';
			row.appendChild(cell);
			// span, содержащий текст. Для выделения ошибок (не заполненных полей)
			var span=document.createElement('span');
			span.className='questionnaire-content-label-ok';
			span.innerHTML=testbase.questionnaire[i].label;
			this.labels.push(span); // чтобы потом можно было менять цвет
			cell.appendChild(span);
			// правая ячейка
			var cell=document.createElement('td');
			cell.className='questionnaire-content-table-right-cell';
			row.appendChild(cell);
			// поле ввода в правой ячейке
			var field=document.createElement('input');
			field.type='text';
			if(testbase.questionnaire[i].maxlength) {
				field.maxLength=testbase.questionnaire[i].maxlength;
			}
			field.oninput=function(e) {
				if(this.size<this.value.length) this.size=this.value.length;
			};
			this.fields.push(field);
			cell.appendChild(field);
		}
		// Загружаем сохраняемые данные
		this.loadUserData();
		// строка с кнопкой "начать"
		var row=document.createElement('tr');
		tableBody.appendChild(row);
		var cell=document.createElement('td');
		cell.colSpan='2';
		cell.className='questionnaire-content-table-all-cell';
		row.appendChild(cell);
		var button=document.createElement('div');
		button.className='questionnaire-start-test-button';
		button.innerHTML='Начать тестирование';
		button.data=this;
		button.onmouseover = function (e) 	{ play('multimedia/buttonOver.wav') };
		button.onclick=function(e) {
			play('multimedia/buttonClick.wav');
			// Отсекаем в полях нежелательные символы
			this.data.escapeHTML();
			// Проверяем корректность введенных данных
			if(!this.data.checkFields()) return;
			// Выполняем сохранение введенных данных в local и session storage
			this.data.saveUserData();
			// Создание теста
			var testRequest = this.data.makeTestRequest(testbase, testnumber);
			var testset = makeTestSet(testRequest);
			// сохраняем текущий тест в LocalStorage дабы при закрытии программы не потерять
			saveCurrentTest(testset);
			// выводм тест
			pm.take('test').create($('content'), testset);
			pm.showOnly('test');
			//alert([makeTestSet(testRequest)].toJSON());
		}
		cell.appendChild(button);
	};
	
	// метод создаёт запрос, по которому создается тест
	this.makeTestRequest = function(testbase, testnumber) {
		var request={};
		request['testversion']=testbase.version.id;
		request['globaltitle']=testbase.title;
		request['localtitle']=testbase.tests[testnumber].title;
		request['testnumber']=testnumber;
		var userdata=new Array();
		for(var i=0; i<testbase.questionnaire.length; i++) {
			var item = {};
			item.name = testbase.questionnaire[i].label.strip();
			item.value = this.fields[i].value; // пробелы удалены и html символы заменены ранее
			userdata.push(item);
		}
		request['userdata']=userdata;
		return request;
	};
	
	// Удаление из текста полей нежелательных элементов
	this.escapeHTML = function () {
		for(var i=0; i<this.fields.length; i++) {
			this.fields[i].value = this.fields[i].value.strip().escapeHTML();
		}
	}
	
	// Проверка заполненности полей.
	this.checkFields = function () {
		var resault=true;
		for(var i=0; i<this.fields.length; i++) {
			if(this.fields[i].value.length <1) {
				resault = false;
				this.labels[i].className='questionnaire-content-label-error';
			} else {
				this.labels[i].className='questionnaire-content-label-ok';
			}
		}
		return resault;
	}
	
	// Загрузка полей чтобы каждый раз не набирать заново учебное заведение и группу
	this.loadUserData = function() {
		if(typeof(Storage)==='undefined') return;
		var lsData = (localStorage.userdata || '{}').evalJSON();
		var ssData = (sessionStorage.userdata || '{}').evalJSON();
		for(var i=0; i<this.fields.length; i++) {
			this.fields[i].value = (lsData[this.currentQuesionnaire[i].label] || ssData[this.currentQuesionnaire[i].label] || '');
			if(this.fields[i].size<this.fields[i].value.length) this.fields[i].size=this.fields[i].value.length;
		}
	};

	// Сохранение полей
	this.saveUserData = function() {
		if(typeof(Storage)==='undefined') return;
		var lsData = (localStorage.userdata || '{}').evalJSON();
		var ssData = (sessionStorage.userdata || '{}').evalJSON();
		for(var i=0; i<this.fields.length; i++) {
			if(this.currentQuesionnaire[i].persistent === "forever") {
				lsData[this.currentQuesionnaire[i].label] = this.fields[i].value;
			} else if(this.currentQuesionnaire[i].persistent === "session") {
				ssData[this.currentQuesionnaire[i].label] = this.fields[i].value;
			} else {
				lsData[this.currentQuesionnaire[i].label] = "";
			}
		}
		localStorage.userdata = Object.toJSON(lsData);
		sessionStorage.userdata = Object.toJSON(ssData);
	};
	
}

    

function adjustQuestionnaireFramePosition() {
	var frame = $('questionnaire-frame');
	var title = $('questionnaire-title');
	var content = $('questionnaire-content');
	var innercontent=$('questionnaire-content-inner-div');
	// настройка внешнего блока
	if (frame && title && content && innercontent) {
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
		// настройка самого внутреннего блока
		innercontent.style.top = Math.max((content.getHeight() - innercontent.getHeight())/2 - 40, 0) + 'px';
	}
}
