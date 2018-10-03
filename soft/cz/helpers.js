/*
 *  Вспомогательные функции для вывода лицензии и списка слов
 */

eulNext="block";
function toggleEUL() {
    var d = document.getElementById('EUL');
    var tmp=d.style.display;
    d.style.display=eulNext;
    eulNext=tmp;
    d.scrollIntoView();
}

// функция вызывается при щелчке по начальной форме и вставляет в entry эту самую начальную форму
function copyToEntry() {
  var e=document.getElementById('entry');
  var w=CurrentTask.word.get(0);
  e.value=w;
  k.setCaretPosition(e, w.length); // пользуемся методом существующей клавиатуры для установки позиции
}

// Проверка является ли аргумент массивом
function isArray(a) {
  if(typeof(a)=='object')
    if(a instanceof Array) return true;
  return false;
}