'use strict';

// поскольку при выполнении этого кода на сервере ДОМ будет  недоступна
// все данные берем только из testbase и переданного объекта

// проверить все ответы в тесте
function checkAllAnswers(data) {
	return checkAllAnswersLocal(testbase, data);
}

// проверить все ответы в тесте не обращаясь к серверу
function checkAllAnswersLocal(testbase, data) {
	var resault={};
// debug.writeln(Object.toJSON(resault))
// debug.writeln(data.answers.toJSON())
	resault.correctness = new Array();
	var n=0; // счетчик вопросов
	for(var div=0; div<data.testset.length; div++) {
		for(var q=0; q<data.testset[div].length; q++) {
			resault.correctness.push(checkOneAnswer(testbase, data.testnumber, div, data.testset[div][q], data.answers[n]));
			n++;
//debug.writeln(Object.toJSON(n))
		}
	}
	resault.answersTrue=count(true, resault.correctness);
	resault.answersFalse=count(false, resault.correctness);
	resault.answersNone=count(null, resault.correctness);
	resault.mark = apriciateTest(testbase, data.testnumber, resault.answersFalse+resault.answersNone);
	return resault;
}

// проверить правильность одного вопроса
function checkOneAnswer(testbase, testnumber, div, q, answers) {

	var question=testbase.tests[testnumber].divisions[div].questions[q];
	var answerOk=true;
	var anyChecked=false;
//debug.writeln('-----')
//debug.writeln(answers.toJSON())
	for(var a=0; a<question.answers.length; a++) {
//debug.writeln(answers[a])
//debug.writeln(question.answers[a].correctness)
		if(answers[a]) {anyChecked=true};
		if(xor(answers[a], question.answers[a].correctness)) {
			// зарегестрирована ошибка
			answerOk=false;
		}
//debug.writeln(answerOk)
	}
	if(!anyChecked) answerOk=null;
	return answerOk;
}

function apriciateTest(testbase, testnumber, answersFalse) {
	var grades=testbase.tests[testnumber].grades;
	var resault="Ошибка определения оценки";
	var max=0;
	for(var i=0; i<grades.length; i++) {
		if(grades[i].faults >= max && grades[i].faults <= answersFalse) {
			max=grades[i].faults;
			resault=grades[i].grade;
		}
	}
	return resault;
}

function xor(a, b) {
	return (a && !b) || (!a && b);
}

function count(val, array) {
	var resault=0;
	for(var i=0; i<array.length; i++) {
		if(val===array[i]) resault++;
	}
	return resault;
}
