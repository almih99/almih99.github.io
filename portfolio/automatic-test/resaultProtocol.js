// Вывод результата и печать протокола

/* отладка была

testTestResault =
{
	"testversion": "75a0073c-a61b-11e3-9406-6c626dbc76e9", 
	"globaltitle": "Общее название тестов", 
	"localtitle": "Входные тесты по автоматическому управлению и регулированию", 
	"testnumber": "0", 
	"userdata": [
		{
			"name": "Учебное заведение", 
			"value": "Рыльско-нюхательское авиационное училище"
		},
		{
			"name": "Группа", 
			"value": "Е652"
		}, 
		{
			"name": "Фамилия, инициалы", 
			"value": "Иванов И. И."
		}, 
		{
			"name": "Номер зачетной книжки", 
			"value": "1325"
		}
	], 
	"starttime" : 1403165936260,
	"stoptime"  : 1403166108307,
	"testset": [[26], [24], [0], [7], [18]], 
	"answers": [[1, 0, 0], [0, 1, 0], [0, 0, 1, 0, 1, 0], [1, 0, 0, 0], [0, 1, 0, 0, 0]], 
	"resault": {
		"correctness": [false, true, false, false, false], 
		"answersTrue": 1, 
		"answersFalse": 4, 
		"answersNone": 0, 
		"mark": "Неудовлетворительно"
	}
};

*/

function resaultProtocol() {
		
	this.show=function() {
		var c = $('resault-content-frame');
		if(c) {
			c.style.display='block';
			adjustResaultFramePosition();
		}
	};
	
	this.hide=function() {
		var c = $('resault-content-frame');
		if(c) {
			c.style.display='none';
		}
	};
	
	this.create = function (parent, testResault) {
		var contentBlock = this.makeContentBlock(parent);
		// на всякий случай генерируемый результат прячем в див
		var reswrapper = document.createElement('div');
		reswrapper.innerHTML = processPattern(testbase.protocol, testResault);
		contentBlock.appendChild(reswrapper);
		// вывод кнопок
		this.makeButtonsBlock(contentBlock);
		
		adjustResaultFramePosition();
	}
	
	this.makeContentBlock = function (parent) {
		// в первую очередь очищаем содержимое родителя от хлама
		parent=$(parent);
		parent.innerHTML='';
		// выводим главное окно
		var topDiv=document.createElement('div');
		topDiv.id='resault-content-frame';
		topDiv.className='resault-content-frame';
		parent.appendChild(topDiv);
		// выводим блок заголовка
		var titleDiv=document.createElement('div');
		titleDiv.id='resault-content-title';
		titleDiv.className='resault-content-title';
		topDiv.appendChild(titleDiv);
		// таблица, формирующая содержимое заголовка
		var titleTable=document.createElement('table');
		titleTable.className='resault-content-title-table';
		titleDiv.appendChild(titleTable);
		// тело таблицы
		var titleTableBody=document.createElement('tbody');
		titleTable.appendChild(titleTableBody);
		// строка таблицы
		var titleTableRow=document.createElement('tr');
		titleTableBody.appendChild(titleTableRow);
		// первый столбец таблицы
		var titleTableCell=document.createElement('td');
		titleTableCell.className='resault-content-title-table-cell';
		titleTableRow.appendChild(titleTableCell);
		// подумать что сюда поставить: 
		titleTableCell.title="Напечатать результат тестирования";
		titleTableCell.innerHTML='<svg onclick="play(\'multimedia/buttonClick.wav\'); window.print();" onmouseover="play(\'multimedia/buttonOver.wav\');" style="cursor:pointer;" height="16px" version="1.1" viewBox="0 0 16 16" width="16px" xmlns="http://www.w3.org/2000/svg" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" xmlns:xlink="http://www.w3.org/1999/xlink"><title/><defs/><g fill="none" fill-rule="evenodd" id="Icons with numbers" stroke="none" stroke-width="1"><g fill="#000000" id="Group" transform="translate(-576.000000, -48.000000)"><path class="resault-printer-icon" d="M576,54 C576,53 577,52 578,52 L579,52 L579,54 L579,55 L589,55 L589,54 L589,52 L590,52 C591,52 592,53 592,54 L592,59 C592,60 591,61 590,61 L589,61 L589,59 L589,58 L579,58 L579,59 L579,61 L578,61 C577,61 576,60 576,59 L576,54 L576,54 Z M580,61 L580,59 L588,59 L588,61 L588,64 L580,64 L580,61 L580,61 Z M588,52 L588,54 L580,54 L580,52 L580,49 L588,49 L588,52 L588,52 Z M588,52" id="Shape"/></g></g></svg>';
		// второй столбец таблицы
		var titleTableCell=document.createElement('td');
		titleTableCell.className='resault=content-title-table-cell';
		titleTableCell.width='100%';
		titleTableRow.appendChild(titleTableCell);
		// просто строка заголовка
		var titleBarText=document.createElement('div');
		titleBarText.className='resault-content-title-text';
		titleBarText.innerHTML='Протокол тестирования';
		titleTableCell.appendChild(titleBarText)
		// третий столбец таблицы
		var titleTableCell=document.createElement('td');
		titleTableCell.className='resault-content-title-table-cell';
		titleTableRow.appendChild(titleTableCell);
		// кнопка закрытия
		titleTableCell.title="Возврат в главное меню";
		titleTableCell.innerHTML='<svg onclick="play(\'multimedia/buttonClick.wav\');pm.showOnly(\'mainMenu\');" onmouseover="play(\'multimedia/buttonOver.wav\');" style="cursor:pointer;" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" height="22" version="1.1" viewBox="0 0 22 22" width="22"><metadata id="metadata12"/> <path sodipodi:type="arc" class="close-button-circle" id="resault-back-button-circle" sodipodi:cx="10.975136" sodipodi:cy="11.387405" sodipodi:rx="10.480761" sodipodi:ry="10.480761" d="m 21.455896,11.387405 a 10.480761,10.480761 0 1 1 -20.96152077,0 10.480761,10.480761 0 1 1 20.96152077,0 z" transform="matrix(1,0,0,0.99332918,0.06591674,-0.31154005)" fill="#ffffff" stroke="#000200" color="#000000"/> <path d="M 12.853763,16.067494 7.8111327,11.024864 12.425304,6.4106929" id="path2984" inkscape:connector-curvature="0" fill="none" stroke="#000000" color="#000000" stroke-width="2"/></svg>';
		// div, содержащий список вопросов
		var contentBlock=document.createElement('div');
		contentBlock.id='resault-content-content';
		contentBlock.className='resault-content-content';
		topDiv.appendChild(contentBlock);
		// теперь осталось наполнить contentBlock содержимым
		return contentBlock;
	}
	
	this.makeButtonsBlock = function(parent) {
		// Добавляем div для кнопок "Далее" и "Печатать"
		var buttonBox=document.createElement('div');
		buttonBox.className="resault-content-button-box";
		parent.appendChild(buttonBox);
		// Таблица, содержащая кнопки
		var table=document.createElement('table');
		table.className="resault-content-button-table";
		buttonBox.appendChild(table);
		// Тело таблицы. Спешиал фор IE
		var tableBody=document.createElement('tbody');
		table.appendChild(tableBody);
		// Строка и ячейка для текста вопроса
		var row=document.createElement('tr');
		row.className="resault-content-button-table-row";
		tableBody.appendChild(row);		
		// Ячейка для первой кнопки
		var cell=document.createElement('td');
		cell.className="resault-content-button-table-l-cell";
		row.appendChild(cell);
		// Кнопка "Далее"
		var nextButton=document.createElement('div');
		nextButton.className="resault-content-l-button";
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
		cell.className="resault-content-button-table-r-cell";
		row.appendChild(cell);
		// Кнопка "Печатать"
		var nextButton=document.createElement('div');
		nextButton.className="resault-content-r-button";
		nextButton.innerHTML='Печатать протокол';
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

function processPattern(pattern, data) {
	// разбиваем на части
	var lst=pattern.split(/\$\{|\}/);
	var isText=true;
	for(var k=0; k<lst.length; k++) {
		if(!isText) {
			if(lst[k]=='global-title') lst[k] = data.globaltitle;
			else if (lst[k]=='local-title') lst[k] = data.localtitle;
			else if (lst[k]=='start-time') lst[k] = new Date(data.starttime).toLocaleTimeString();
			else if (lst[k]=='stop-time') lst[k] = new Date(data.stoptime).toLocaleTimeString();
			else if (lst[k]=='start-date') lst[k] = format00(new Date(data.starttime).getDate()) + "." + format00(new Date(data.starttime).getMonth()+1) + "." + format00(new Date(data.starttime).getFullYear());
			else if (lst[k]=='stop-date') lst[k] = format00(new Date(data.stoptime).getDate()) + "." + format00(new Date(data.stoptime).getMonth()+1) + "." + format00(new Date(data.stoptime).getFullYear());
			else if (lst[k]=='duration-time') lst[k] = format00(new Date(data.stoptime-data.starttime).getUTCHours()) + ":" + format00(new Date(data.stoptime-data.starttime).getUTCMinutes()) + ":" + format00(new Date(data.stoptime-data.starttime).getUTCSeconds());
			else if (lst[k]=='questions-count') lst[k] = data.resault.correctness.length;
			else if (lst[k]=='passed-answers-count') lst[k] = data.resault.answersTrue;
			else if (lst[k]=='failed-answers-count') lst[k] = data.resault.answersFalse;
			else if (lst[k]=='skipped-answers-count') lst[k] = data.resault.answersNone;
			else if (lst[k]=='mark-text') lst[k] = data.resault.mark;
			else if (lst[k]=='answers-table') {
				// создаем шаблон для замены таблицы
				var i=0;
				var t='';
				t+='<table class="resault-protocol-table"><tr class="resault-protocol-table"><th class="resault-protocol-table">№</th><th class="resault-protocol-table">Задан вопрос</th><th class="resault-protocol-table">Дан ответ</th><th class="resault-protocol-table">Оценка ответа</th></tr>';
				var ddisp=0;
				for(var d=0; d<data.testset.length; d++) {
					for(var q=0; q<data.testset[d].length; q++) {
						// столбец 1
						t+='<tr class="resault-protocol-table"><td class="resault-protocol-table resault-protocol-table-1">' + (i+1) + '</td>';
						// столбец 2
						t+='<td class="resault-protocol-table resault-protocol-table-2">' + (ddisp + data.testset[d][q]+1) + '</td>';
						// столбец 3
						t+='<td class="resault-protocol-table resault-protocol-table-3">';
						var delimeter=' ';
						for(var a=0; a<data.answers[i].length; a++) {
							if(data.answers[i][a]) {
								t+= delimeter + (a+1);
								delimeter=', ';
							}
						}
						t+='</td>';
						// столбец 4
						t+='<td class="resault-protocol-table resault-protocol-table-4">' + (data.resault.correctness[i] ? 'Правильно' : 'Ошибка') + '</td>';
						
						i++;
					}
					ddisp+=testbase.tests[data.testnumber].divisions[d].questions.length;
				}
				t+='</table>';
				lst[k] = t;
			}
			else {
				// Остались определенные пользователем поля.
				var founded=false;
				for(var i=0; i<data.userdata.length; i++) {
					if(data.userdata[i].name == lst[k]) {
						lst[k] = data.userdata[i].value;
						founded=true;
						break;
					}
				}
				if(!founded) {
					lst[k]='<span class="resault-protocol-undefined-field">${' + lst[k] + '}</span>';
				}
			}
		}
		isText=!isText;
	}
	return lst.join("");	
}

function adjustResaultFramePosition() {
	var frame = $('resault-content-frame');
	var title = $('resault-content-title');
	var content = $('resault-content-content');
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
