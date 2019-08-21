
function history() {
		
	this.show=function() {
		var c = $('history-content-frame');
		if(c) {
			c.style.display='block';
			adjustHistoryFramePosition();
		}
	};
	
	this.hide=function() {
		var c = $('history-content-frame');
		if(c) {
			c.style.display='none';
		}
	};
	
	this.create = function (parent) {
		var contentBlock = this.makeContentBlock(parent);
		// на всякий случай генерируемый результат прячем в див
		var reswrapper = document.createElement('div');
		contentBlock.appendChild(reswrapper);
		// вывод содержимого
		this.makeDatesList(reswrapper);
		// вывод кнопок
		this.makeButtonsBlock(contentBlock);
		
		adjustHistoryFramePosition();
	}
	
	this.makeContentBlock = function (parent) {
		// в первую очередь очищаем содержимое родителя от хлама
		parent=$(parent);
		parent.innerHTML='';
		// выводим главное окно
		var topDiv=document.createElement('div');
		topDiv.id='history-content-frame';
		topDiv.className='history-content-frame';
		parent.appendChild(topDiv);
		// выводим блок заголовка
		var titleDiv=document.createElement('div');
		titleDiv.id='history-content-title';
		titleDiv.className='history-content-title';
		topDiv.appendChild(titleDiv);
		// таблица, формирующая содержимое заголовка
		var titleTable=document.createElement('table');
		titleTable.className='history-content-title-table';
		titleDiv.appendChild(titleTable);
		// тело таблицы
		var titleTableBody=document.createElement('tbody');
		titleTable.appendChild(titleTableBody);
		// строка таблицы
		var titleTableRow=document.createElement('tr');
		titleTableBody.appendChild(titleTableRow);
		// первый столбец таблицы
		var titleTableCell=document.createElement('td');
		titleTableCell.className='history-content-title-table-cell';
		titleTableRow.appendChild(titleTableCell);
		// подумать что сюда поставить: 
		titleTableCell.title="Напечатать список";
		titleTableCell.innerHTML='<svg onclick="play(\'multimedia/buttonClick.wav\'); window.print();" onmouseover="play(\'multimedia/buttonOver.wav\');" style="cursor:pointer;" height="16px" version="1.1" viewBox="0 0 16 16" width="16px" xmlns="http://www.w3.org/2000/svg" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" xmlns:xlink="http://www.w3.org/1999/xlink"><title/><defs/><g fill="none" fill-rule="evenodd" id="Icons with numbers" stroke="none" stroke-width="1"><g fill="#000000" id="Group" transform="translate(-576.000000, -48.000000)"><path class="resault-printer-icon" d="M576,54 C576,53 577,52 578,52 L579,52 L579,54 L579,55 L589,55 L589,54 L589,52 L590,52 C591,52 592,53 592,54 L592,59 C592,60 591,61 590,61 L589,61 L589,59 L589,58 L579,58 L579,59 L579,61 L578,61 C577,61 576,60 576,59 L576,54 L576,54 Z M580,61 L580,59 L588,59 L588,61 L588,64 L580,64 L580,61 L580,61 Z M588,52 L588,54 L580,54 L580,52 L580,49 L588,49 L588,52 L588,52 Z M588,52" id="Shape"/></g></g></svg>';
		// второй столбец таблицы
		var titleTableCell=document.createElement('td');
		titleTableCell.className='resault=content-title-table-cell';
		titleTableCell.width='100%';
		titleTableRow.appendChild(titleTableCell);
		// просто строка заголовка
		var titleBarText=document.createElement('div');
		titleBarText.className='history-content-title-text';
		titleBarText.innerHTML='История';
		titleTableCell.appendChild(titleBarText);
		// третий столбец таблицы
		var titleTableCell=document.createElement('td');
		titleTableCell.className='history-content-title-table-cell';
		titleTableRow.appendChild(titleTableCell);
		// кнопка закрытия
		titleTableCell.title="Возврат в главное меню";
		titleTableCell.innerHTML='<svg onclick="play(\'multimedia/buttonClick.wav\');pm.showOnly(\'mainMenu\');" onmouseover="play(\'multimedia/buttonOver.wav\');" style="cursor:pointer;" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" height="22" version="1.1" viewBox="0 0 22 22" width="22"><metadata id="metadata12"/> <path sodipodi:type="arc" class="close-button-circle" id="resault-back-button-circle" sodipodi:cx="10.975136" sodipodi:cy="11.387405" sodipodi:rx="10.480761" sodipodi:ry="10.480761" d="m 21.455896,11.387405 a 10.480761,10.480761 0 1 1 -20.96152077,0 10.480761,10.480761 0 1 1 20.96152077,0 z" transform="matrix(1,0,0,0.99332918,0.06591674,-0.31154005)" fill="#ffffff" stroke="#000200" color="#000000"/> <path d="M 12.853763,16.067494 7.8111327,11.024864 12.425304,6.4106929" id="path2984" inkscape:connector-curvature="0" fill="none" stroke="#000000" color="#000000" stroke-width="2"/></svg>';
		// div, содержащий список
		var contentBlock=document.createElement('div');
		contentBlock.id='history-content-content';
		contentBlock.className='history-content-content';
		topDiv.appendChild(contentBlock);
		// теперь осталось наполнить contentBlock содержимым
		return contentBlock;
	}
	
	// ▷▶▸▹▼▽▾▿►▻
	this.makeDatesList = function(parent){
		parent=$(parent);
		parent.innerHTML="";
		// таблица
		var table = document.createElement('table');
		table.className='history-main-table';
		parent.appendChild(table);
		// tablebody
		var tbody = document.createElement('tbody');
		table.appendChild(tbody);
		// цикл по датам когда вообще было тестирование
		var dates=loadHistoryDates();
		for(var i=0; i<dates.length; i++) {
			var row = document.createElement('tr');
			row.className = 'history-date-row';
			// сохраняем данные в элементе строки
			row.date = dates[i];
			row.expanded=false;
			row.subelements=new Array();
			row.onclick = function(e) {historyDateExpand(this);};
			tbody.appendChild(row);
			var cell = document.createElement('td');
			cell.className = 'history-date-triangle-cell';
			cell.innerHTML='▶';
			row.appendChild(cell);
			var cell = document.createElement('td');
			cell.className = 'history-date-text-cell';
			cell.colSpan=testbase.historyLine.length + 1;
			cell.innerHTML = dates[i];
			row.appendChild(cell);
		}
	}
	
	this.makeButtonsBlock = function(parent) {
		// Добавляем div для кнопок "Далее" и "Печатать"
		var buttonBox=document.createElement('div');
		buttonBox.className="history-content-button-box";
		parent.appendChild(buttonBox);
		// Таблица, содержащая кнопки
		var table=document.createElement('table');
		table.className="history-content-button-table";
		buttonBox.appendChild(table);
		// Тело таблицы. Спешиал фор IE
		var tableBody=document.createElement('tbody');
		table.appendChild(tableBody);
		// Строка и ячейка для текста вопроса
		var row=document.createElement('tr');
		row.className="history-content-button-table-row";
		tableBody.appendChild(row);		
		// Ячейка для первой кнопки
		var cell=document.createElement('td');
		cell.className="history-content-button-table-l-cell";
		row.appendChild(cell);
		// Кнопка "Далее"
		var nextButton=document.createElement('div');
		nextButton.className="history-content-l-button";
		nextButton.innerHTML='Вернуться в главное меню';
		nextButton.question=this;
		nextButton.onmouseover = function (e) 	{ play('multimedia/buttonOver.wav') };
		nextButton.onclick=function (event) { 
			play('multimedia/buttonClick.wav');
			// Возврат в главное меню
			pm.showOnly('mainMenu');
		}
		cell.appendChild(nextButton);
		// Ячейка для второй кнопки
		var cell=document.createElement('td');
		cell.className="history-content-button-table-r-cell";
		row.appendChild(cell);
		// Кнопка "Печатать"
		var nextButton=document.createElement('div');
		nextButton.className="history-content-r-button";
		nextButton.innerHTML='Печатать список';
		nextButton.question=this;
		nextButton.onmouseover = function (e) 	{ play('multimedia/buttonOver.wav') };
		nextButton.onclick=function (event) { 
			play('multimedia/buttonClick.wav');
			// Напечатать документ
			window.print();
		}
		cell.appendChild(nextButton);
		return buttonBox;
	}
}

function historyDateExpand(row) {
	//alert(row.date);
	if(row.expanded) {
		// свернуть
		row.immediateDescendants()[0].innerHTML='▶';
		row.className='history-date-row';
		for(var i=0; i<row.subelements.length; i++) {
			if(row.subelements[i].expanded) historyItemExpand(row.subelements[i]);
			hide(row.subelements[i]);
		}
		row.expanded = false;
	} else {
		// console.log();
		row.immediateDescendants()[0].innerHTML='▼';
		row.className='history-date-row-expanded';
		if(row.subelements.length>0) {
			// уже отображали, достаточно сделать видимыми
			for(var i=0; i<row.subelements.length; i++) {
				show(row.subelements[i]);
			}
		} else {
			var elm = loadHistoryFor(row.date);
			for(var i=elm.length-1; i>=0; i--) { // добавляем в обратном порядке
				var r = document.createElement('tr')
				r.className = 'history-resault-row';
				row.parentNode.insertBefore(r, row.nextSibling);
				// сохраняем в элементе данные
				r.expanded = false;
				r.data = elm[i];
				r.datarow = null;
				r.onclick = function (e) {historyItemExpand(this);}
				row.subelements.push(r);
				// пустая ячейка
				var c = document.createElement('td');
				c.className = 'history-date-empty-triangle-cell';
				c.innerHTML = '&nbsp';
				r.appendChild(c);
				var c = document.createElement('td');
				c.className = 'history-record-triangle-cell';
				c.innerHTML='▶';
				r.appendChild(c);
				var templates = testbase.historyLine;
				for(var j=0; j<templates.length; j++) {
					var c = document.createElement('td');
					c.className = 'history-record-cell';
					c.innerHTML = processPattern(templates[j], elm[i]);
					r.appendChild(c);
				}
				
			}
		}
		row.expanded = true;
	}
}

function historyItemExpand(row) {
	if(row.expanded) {
		row.immediateDescendants()[1].innerHTML='▶';
		hide(row.datarow);
		row.expanded=false;
	} else {
		row.immediateDescendants()[1].innerHTML='▼';
		if(row.datarow) {
			show(row.datarow);
		} else {
			var r = document.createElement('tr');
			r.className = 'history-expaund-resault-row';
			row.parentNode.insertBefore(r, row.nextSibling);
			var c = document.createElement('td');
			c.className='history-date-empty-triangle-cell';
			c.innerHTML='&nbsp;';
			r.appendChild(c);
			var c = document.createElement('td');
			c.className='history-record-empty-triangle-cell';
			c.innerHTML='&nbsp;';
			r.appendChild(c);
			var c = document.createElement('td');
			c.className = 'history-expaund-resault-cell';
			c.colSpan = testbase.historyLine.length;
			c.innerHTML = processPattern(testbase.historyInfo,row.data);
			r.appendChild(c);
			// Сохраняем строку в как-бы родительской строке.
			row.datarow = r;
		}
		row.expanded=true;
	}
}

function adjustHistoryFramePosition() {
	var frame = $('history-content-frame');
	var title = $('history-content-title');
	var content = $('history-content-content');
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

function saveHistoryItem(testset) {
	if(typeof(Storage)==='undefined') return;
	var today=makeDateString(new Date(testset.stoptime));
	if(!localStorage[today]) {
		var da=loadHistoryDates();
		da.push(today);
		localStorage.historyDates=da.toJSON();
	}
	var tdl=loadHistoryFor(today);
	tdl.push(testset);
	localStorage[today]=tdl.toJSON();
}

// Возвращает массив дат, для которых существует история.
// Каждая дата - строка вида 'dd.mm.yyyy'
function loadHistoryDates() {
	if(typeof(Storage)==='undefined') return [];
	if(!localStorage.historyDates) return [];
	return localStorage.historyDates.evalJSON();
}

// Возвращает массив результатов тестирования для указанной даты
function loadHistoryFor(datestring) {
	if(typeof(Storage)==='undefined') return [];
	if(!localStorage[datestring]) return [];
	return localStorage[datestring].evalJSON();
}

// Для объекта даты выводит текстовое представление
function makeDateString(date) {
	return 	format00(date.getDate()) + "." + format00(date.getMonth()+1) + "." + format00(date.getFullYear());
}
