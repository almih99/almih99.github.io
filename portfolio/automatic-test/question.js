
"use strict";

/*
Стили:
div.#####QuestionFrame
div.#####QuestionFrameWrong
div.#####QuestionFrameOk
table.#####QuestionTable
tr.#####QuestionTableQuestionRow
td.#####QuestionTableQuestionCell
div.#####QuestionTextLine
span.#####QuestionNumber
tr.#####QuestionTableAnswerRow
td.#####QuestionTableSelectorCell
td.#####QuestionTableAnswerCell
label.#####QuestionAnswerLabel
label.#####QuestionAnswerLabelOk
div.#####QuestionAnswerTextLine
div.#####QuestionCheckButton
*/


/* 
 * Объект вопроса. При создании следует передать объект вопроса.
*/
var QuestionID=0; // Глобальная переменная - для уникального идентификатора вопроса.


function Question(testbase, testnumber, divnumber, questionnumber) {
	// сохраняем для последующего доступа из функций
	this.testset=testbase;
	this.testnumber=testnumber;
	this.divnumber=divnumber;
	this.questionnumber=questionnumber;
	// Упрощение доступа
	this.source=testbase.tests[testnumber].divisions[divnumber].questions[questionnumber];
	// идентификатор вопроса
	this.id="q:" + QuestionID;
	QuestionID++;
	// заполняются при отображении объекта
	this.mapped=false;
	this.questionFrameElement=null;
	this.buttonBox=null;
	this.checkButton=null;
	this.theoryButton=null;
	this.answerButtonElements=new Array();
	this.answerTextElements=new Array();
	this.stylePrefix=null;
	
	/*
	Метод отображает вопрос в указанный родительский элемент.
	questionNumber - число, отображаемое перед текстом вопроса. Всего навсего.
	*/ 
	this.map2dom=function (parent, questionNumber, stylePrefix) {
		this.stylePrefix=stylePrefix;
		// рамка вокруг вопроса
		var questionFrame=document.createElement('div');
		questionFrame.id=this.id;
		questionFrame.className=stylePrefix + "QuestionFrame";
		this.questionFrameElement=questionFrame;
		parent.appendChild(questionFrame);
		// Начало таблицы
		var table=document.createElement('table');
		table.className=stylePrefix + "QuestionTable";
		questionFrame.appendChild(table);
		// Тело таблицы. Спешиал фор IE
		var tableBody=document.createElement('tbody');
		table.appendChild(tableBody);
		// Строка и ячейка для текста вопроса
		var row=document.createElement('tr');
		row.className=stylePrefix + "QuestionTableQuestionRow";
		tableBody.appendChild(row);
		var cell=document.createElement('td');
		cell.className=stylePrefix + "QuestionTableQuestionCell";
		cell.colSpan="2";
		row.appendChild(cell);
		// текст вопроса
		for(var lineNumber=0; lineNumber<this.source.question.length;lineNumber++) {
			var questionTextLine=document.createElement('div');
			questionTextLine.className=stylePrefix + "QuestionTextLine";
			if(lineNumber==0) {
				// для первой строки выводим номер вопроса
				var questionNumberSpan=document.createElement('span');
				questionNumberSpan.className=stylePrefix + "QuestionNumber";
				questionNumberSpan.innerHTML=questionNumber + ".&nbsp;";
				questionTextLine.appendChild(questionNumberSpan);
				// и, собственно, сам вопрос в спане без затей и даже стиля
				var questionTextSpan=document.createElement('span');
				questionTextSpan.innerHTML=this.source.question[lineNumber];
				questionTextLine.appendChild(questionTextSpan);
			} else {
				// строка не первая, потому без выпендрёжа
				questionTextLine.innerHTML=this.source.question[lineNumber];
			}
			cell.appendChild(questionTextLine)
		}
		// если для вопроса указано, что в нем есть формулы, то применить их
		if(this.source.useMath) {
		  mTextToHtml(cell);
		}
		// цикл по вариантам ответа
		for(var answerNumber=0; answerNumber<this.source.answers.length; answerNumber++) {
			var currentAnswer=this.source.answers[answerNumber];
			// создание строки таблицы
			var row=document.createElement('tr');
			row.className=stylePrefix + "QuestionTableAnswerRow";
			tableBody.appendChild(row);
			// создание ячейки под кнопку
			var cell=document.createElement('td');
			cell.className=stylePrefix + "QuestionTableSelectorCell";
			cell.width="0%";
			row.appendChild(cell);
			// создание кнопки checkbox/radiobutton
			var selector=document.createElement('input');
			if(this.source.multipleChoise) {
				selector.type='checkbox';
			} else {
				selector.type='radio';
			}
			selector.id='selector.' + this.id + '.' + answerNumber;
			selector.name='selector.' + this.id;
			selector.value=currentAnswer.correctness;
			this.answerButtonElements.push(selector);
			cell.appendChild(selector);
			// создание ячейки под текст варианта ответа
			var cell=document.createElement('td');
			cell.className=stylePrefix + "QuestionTableAnswerCell";
			cell.width="100%";
			row.appendChild(cell);
			// создание элемента label
			var answerLabel= document.createElement('label');
			answerLabel.setAttribute('for', 'selector.' + this.id + '.' + answerNumber);
			answerLabel.id='answertext.' + this.id + '.' + answerNumber;
			answerLabel.className=stylePrefix + "QuestionAnswerLabel";
			this.answerTextElements.push(answerLabel);
			cell.appendChild(answerLabel);
			// текст ответа
			for(var lineNumber=0; lineNumber<currentAnswer.answer.length; lineNumber++) {
				var answerTextLine=document.createElement('div');
				answerTextLine.className=stylePrefix + "QuestionAnswerTextLine";
				answerTextLine.innerHTML=currentAnswer.answer[lineNumber];
				answerLabel.appendChild(answerTextLine);
				// если для вопроса указано, что в нем есть формулы, то применить их
		        if(this.source.useMath) {
		          mTextToHtml(answerTextLine);
		        }
			}
		}
		// Добавляем div для кнопок "проверить ответ" и "показать теорию"
		var buttonBox=document.createElement('div');
		buttonBox.className=stylePrefix + "QuestionCheckButtonsDiv";
		this.buttonBox=buttonBox;
		questionFrame.appendChild(buttonBox);
		// Таблица, содержащая кнопки
		var table=document.createElement('table');
		table.className=stylePrefix + "QuestionCheckButtonTable";
		buttonBox.appendChild(table);
		// Тело таблицы. Спешиал фор IE
		var tableBody=document.createElement('tbody');
		table.appendChild(tableBody);
		// Строка и ячейка для текста вопроса
		var row=document.createElement('tr');
		row.className=stylePrefix + "QuestionCheckButtonTableRow";
		tableBody.appendChild(row);		
		// Ячейка для первой кнопки
		var cell=document.createElement('td');
		cell.className=stylePrefix + "QuestionCheckButtonTableLCell";
		row.appendChild(cell);
		// Кнопка "Проверить ответ"
		var checkButton=document.createElement('div');
		checkButton.className=stylePrefix + "QuestionCheckButton";
		checkButton.innerHTML='Проверить ответ';
		checkButton.question=this;
		checkButton.onmouseover = function (e) 	{ play('multimedia/buttonOver.wav') };
		checkButton.onclick=function (event) { 
			// при вызове мы в контексте кнопки
			this.question.checkAnswer(); 
			play('multimedia/buttonClick.wav');
		}
		this.checkButton=checkButton;
		cell.appendChild(checkButton);
		// Ячейка для второй кнопки
		var cell=document.createElement('td');
		cell.className=stylePrefix + "QuestionCheckButtonTableRCell";
		row.appendChild(cell);
		// Кнопка "Показать теорию"
		if(this.source.explication) {
			var checkButton=document.createElement('div');
			checkButton.className=stylePrefix + "QuestionInfoButton";
			checkButton.innerHTML='Показать теорию';
			checkButton.question=this;
			checkButton.onmouseover = function (e) 	{ play('multimedia/buttonOver.wav') };
			checkButton.onclick=function (event) { 
				// при вызове мы в контексте кнопки
				this.question.showTheory();
				play('multimedia/buttonClick.wav');
			}
			this.theoryButton = checkButton;
			cell.appendChild(checkButton);
		}
		
		// Сообщаем всем и себе, что отображение выполнено
		this.mapped=true;
	}
	
	
	/*
	Проверяет правильность ответов и возвращает true, false или null в зависимости от оной правильности.
	Попутно меняет стили правильных ответов (зеленый цвет), стиль рамки (зеленый или красный цвет)
	и делает элементы disabled
	*/
	this.checkAnswer=function() {
		if(!this.mapped) {alert("Попытка проверить ответ еще не отображенного вопроса");return;}
		var answerOk=checkOneAnswer(this.testset, this.testnumber, this.divnumber, this.questionnumber,this.getAnswers());
		for(var answerNumber=0; answerNumber<this.answerButtonElements.length; answerNumber++) {
			// пометка зеленым правильных ответов
			if(this.source.answers[answerNumber].correctness) {
				this.answerTextElements[answerNumber].className = 
							this.stylePrefix+"QuestionAnswerLabelOk";
			}
		}
		// Делаем недоступным кнопки
		this.enable('false');
		// Отменить надо бы возможность повторного нажатия на кнопку проверить...
		this.checkButton.onclick=function(){};

		// Меняем цвет бордера
		if(answerOk) {
			this.markAsOk();
		} else {
			this.markAsWrong();
		}
		// Поскольку эта кнопка видна только тогда, когда отображается 
		// список вопросов, делаем несовсем красивую вещь с обращением
		// через голову... Ну не события же писать для этого случая!
		var ql=pm.take('questionList');
		try {
			if(answerOk) {
				ql.wf.addWin();
			} else {
				ql.wf.addFail();
			}
		} catch(e) {
			// ничего не делаем
		}
		// возвращаем true / false / null
		return answerOk;
	}
	
	this.markAsOk = function() {
		this.questionFrameElement.className=this.stylePrefix + 'QuestionFrameOk';
	}
	
	this.markAsWrong = function() {
		this.questionFrameElement.className=this.stylePrefix + 'QuestionFrameWrong';
	}
	
	
	/*
	Ставит или снимает точки в чекбоксах/радиобуттонах напротив правильных ответов. 
	*/
	this.markCorrect=function(markUnmark) {
		if(!this.mapped) {alert("Попытка пометить правильные варианты ответов для еще не отображенного вопроса"); return;}
		for(var answerNumber=0; answerNumber<this.answers.length; answerNumber++) {
			// кнопка (radio или checkbox) и соответствующая ей метка (то есть текст вопроса) в коде html
			var inputItem=document.getElementById('selector.' + this.id + '.' + answerNumber);
			if(this.answers[answerNumber].correctness && markUnmark){
				inputItem.checked=true;
			} else {
				inputItem.checked=false;
			};
		}
	}
	
	
	/*
	Переводит все чекбоксы/радиобуттоны в доступное/недоступное состояние.
	*/
	this.enable=function(disableEnable) {
		if(!this.mapped) {alert("Попытка манипуляций с доступностью/недоступностью еще не отображенного вопроса"); return; }
		for(var answerNumber=0; answerNumber<this.answerButtonElements.length; answerNumber++) {
			this.answerButtonElements[answerNumber].disabled=disableEnable;
		}
	}
	
	/*
	Возвращает список ответов пользователя. Для каждого варианта ответа 0 или 1
	*/
	this.getAnswers	= function() {
		var resault = new Array();
		for(var answerNumber=0; answerNumber<this.answerButtonElements.length; answerNumber++) {
			if(this.answerButtonElements[answerNumber].checked) {
				resault.push(1);
			} else {
				resault.push(0);
			}
		}
		return resault;
	}
	
	this.showTheory = function () {
		//var w = open();
		// поместить в него теорию
		//w.document.open("text/html","replace");
		//w.document.write(this.testset.explications[this.source.explication]);
		//w.document.close();
		var win = open('explications.html');
		win.page=this.source.explication;
		win.postMessage(this.source.explication, '*');
	}
	
	/* 
	Управление кнопками "проверить" и "показать теорию" 
	*/
	
	this.showTheoryButton = function() {
		if(this.buttonBox && this.theoryButton) {
			this.buttonBox.style.display = 'block';
			this.theoryButton.style.display = 'block';
		}
	}
	
	this.showCheckButton = function() {
		if(this.buttonBox && this.checkButton) {
			this.buttonBox.style.display = 'block';
			this.checkButton.style.display = 'block';
		}
	}
}
