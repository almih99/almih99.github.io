// Создание набора вопросов
"use strict";

function makeTestSet(request) {
	// Пока только локальное создание набора тестов. В перспективе запрос у сервера.
	return makeTestSetLocal(request);
}

// получает запрос и возвращает его с заполненным полем testset
function makeTestSetLocal(request) {
	// создаем генератор случайных чисел
	var r=new Randu();
	// создаем массив, содержащий исключающие теги
	var expelList = new Array();
	// поскольку создаем локально, то никакого контроля не требуется. Просто берем testbase
	var currentTest=testbase.tests[request.testnumber];
	// цикл по разделам
	var testset=new Array();
	for(var i=0; i<currentTest.divisions.length; i++) {
		// цикл по количеству задаваемых вопросах
		var divisionTestset=new Array();
		if(currentTest.divisions[i].questions.length<currentTest.divisions[i].n) {
			alert("Тест " + request.testnumber + " раздел " + i + " содержит некорректное число вопросов.");
			currentTest.divisions[i].n=currentTest.divisions[i].questions.length; // корректируем
		}
		// ограничиваем максимально возможное количество вопросов размером раздела
		var n = Math.min(currentTest.divisions[i].questions.length, currentTest.divisions[i].n);
		for(var j=0; j<n; j++) {
			// заполнение раздела вопросами
			for(var t=0; t<5; t++) { // Пять попыток выбрать тест без исключающих тегов
				
				// выбор вопроса, который еще не встречался
				do {
				    var currentQuestion=r.random(currentTest.divisions[i].questions.length-1);
				} while(divisionTestset.indexOf(currentQuestion)!=-1)
				
				// Проверка на исключающие теги
				var currentExpels = currentTest.divisions[i].questions[currentQuestion].expel;
				if(!currentExpels) {break;} // Вопрос не имеет исключающих тегов. Можно использовать.
				var hasExpelCollision = false;
				for(var e=0; e<currentExpels.length; e++) {
					if(expelList.indexOf(currentExpels[e]) != -1) {
						hasExpelCollision = true;
						break;
					}
				}
				if(!hasExpelCollision) break; //else alert('collision: ' + currentExpels.toJSON() + ' в ' + expelList.toJSON());
			}
			// Здесь мы имеет текущий вопрос определенным с коллизиями или без.
			// Добавляем новые исключающие теги
			if(currentExpels) {
				for(var e=0; e<currentExpels.length; e++) {
					expelList.push(currentExpels[e]);
				}
			}
			// alert(currentQuestion);
			divisionTestset.push(currentQuestion);
		}
		testset.push(divisionTestset);
	}
	// alert([testset].toJSON());
	request.testset=testset;
	request.starttime = new Date().getTime();
	// alert(expelList.toJSON());
	return request;
}
