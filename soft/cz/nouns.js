/*

Все объекты имеют методы:
get(падеж, число)             // возвращает требуемую форму существительного
                              // get(0) возвращает иминительный падеж единственного числа
set(падеж, число, значение)   // устанавливает указанную форму глагола в заданное значение
test(падеж, число, значение)  // возвращает исину или ложь в зависимости от того верное ли значение или нет.
description()                 // возвращает описание типа спряжения
getCorrectAnswerString        // возвращает строку "Правильный(е) ответ(ы) ответ, (ответ)...
summary                       // возвращает варианты изменения слова по формам. Используется в подсказках и списке слов
*/



// Базовый объект для всех существительных
// реализуем многократно используемые методы
function NOUN() {

  // Возвращает массив с формами слов на основании таблицы преобразований и образца
  this.mapTransform=function(table, form) {
    var res=Array(table.length);
    for(var i=0; i<table.length; i++) {
      if(isArray(table[i])) {
        // рекурсивно вызываем себя
        res[i]=this.mapTransform(table[i], form);
      } else if(typeof(table[i])=='function') {
        res[i]=table[i].call(this, form);
      } else {
        // предполагаем, что объект вида  {'f':/..$/, 't':'ám'}
        res[i]=form.replace(table[i].f, table[i].t);
      }
    }
    return res;
  }
  
  // возвращает соответствующую форму существительного.
  // Если pad=0, то возвращает именительный падеж, единственное число.
  this.get=function(pad, cislo) {
    if(pad==0) return this.get(1, 1);
    return this._nounForms[pad-1][cislo-1];
  }
  
  // устанавливает соответствующее значение для заданной формы
  // для исключений и случаев, которые проще сделать вручную, чем описывать алгоритм
  this.set=function(pad, cislo, form) {
    this._nounForms[pad-1][cislo-1]=form;
    return this;
  }
  
  // возвращает тип склонения существительного.
  this.description=function() {
    return this.remark;
  }
  
  // возвращает строку, описывающую правильный ответ.
  this.getCorrectAnswerString=function(pad, cislo) {
    return "Правильный ответ <span class='correct-answer'>" + insertWordWithHint(this.get(pad, cislo), this.get(0)) + ".</span> ";
  }
  
  // возвращает строку с таблицей для всплывающей подсказки и списка существительных.
  this.summary=function() {
    var prefix=['-','','bez','k','pro','','o','s'];
    var postfix=['-','','','','','!&nbsp;','',''];
    var padNames=['*', 'И', 'Р', 'Д', 'В', 'З', 'П', 'Т']
    var str='<table>';
    str+='<tr><td></td><td></td><td style="font-weight:bold;">е.ч.</td><td></td><td style="font-weight:bold;">м.ч.</td></tr>'
    for(var p=1; p<=7; p++) {
      str+='<tr><td style="font-weight:bold;">' + padNames[p] + '.</td>';
      for(var n=1; n<=2; n++) {
        str+='<td style="text-align:right;padding-left:1em;">' + prefix[p] + '</td><td>' + this.get(p,n) + postfix[p] + '</td>';
      }
      str+='</tr>';
    }
    str+='</table>';
    return str;
  }
  
  // Определяет правельный ли ответ был дан.
  this.test=function(pad, cislo, form) {
    return this.get(pad, cislo)==form;
  }
  
}



// Объект, используемый когда существительных не выбрано
function FALLBACK() {
  this.get=function(){return "-";};
  this.test=function(){return false;};
  this.description=function(){return "Попробуйте выбрать один или несколько образцов в верхней части страницы.";};
  this.getCorrectAnswerString=function() {return "Не выбран ни один образец.";};
  this.set=function(){};
}



// Объект, представляющий образец žena
// nominativ - именительный падеж, единственное число
// _E_ - true означает наличие беглой гласной -е в форме родительного падежа множественного числа. fase (по умолчанию) -- отсутствие.
// remark -- текст, выводимый при ошибке. Как правило что-то вроде "Склоняется по образцу ..."
function ZENA(nominativ, _E_, remark) {
  // Наличие беглого гласного в РП
  this.nominativ=nominativ;
  this.hazE=_E_;
  this.remark = remark ? remark : "Склоняется по образцу <span class='pattern'>" + insertWordWithHint('žena') + "</span>.";

  // Чередование согласных и выбор e/ě в дательном и предложном падежах единственного числа
  this.pad31=function(nominativ) {
    // чередование согласной
    var tmp=nominativ.replace(/ch.$/, 'š-').replace(/h.$/, 'z-').replace(/g.$/, 'z-').replace(/k.$/, 'c-').replace(/r.$/, 'ř-');
    // замена окончания
    if((/[ntdmbpvf].$/).test(tmp)) {
      // ě
      tmp=tmp.replace(/.$/, 'ě');
    } else {
      // e
      tmp=tmp.replace(/.$/, 'e');
    }
    return tmp;
  }
  
  // подстановка беглой гласной и замена окончания для родительного падежа, множественного числа
  this.pad22=function(nominativ) {
    // замена окончания и подстановка беглой гласной
    if(this.hazE) {
      return nominativ.replace(/(.).$/, 'e$1');
    } else {
      return nominativ.replace(/.$/, '');
    }
  }
  
  // табллица преобразований
  this.transform= [[{'f':/$/, 't':''},     {'f':/.$/, 't':'y'}],
                   [{'f':/.$/, 't':'y'},   this.pad22],
                   [this.pad31,            {'f':/.$/, 't':'ám'}],
                   [{'f':/.$/, 't':'u'},   {'f':/.$/, 't':'y'}],
                   [{'f':/.$/, 't':'o'},   {'f':/.$/, 't':'y'}],
                   [this.pad31,            {'f':/.$/, 't':'ách'}],
                   [{'f':/.$/, 't':'ou'},  {'f':/.$/, 't':'ami'}]
                  ];
  // Применяем таблицу преобразований
  this._nounForms=this.mapTransform(this.transform, this.nominativ);
}
ZENA.prototype = new NOUN();




// Объект, представляющий образец růže
// nominativ - именительный падеж, единственное число
// zeroend - true означает принудительное нулевое окончание в родительном падеже, множественного числа
// remark -- текст, выводимый при ошибке. Как правило что-то вроде "Склоняется по образцу ..."
function RUZE(nominativ, zeroend, remark) {
  // Наличие беглого гласного в РП
  this.nominativ=nominativ;
  this.zeroend=zeroend;
  this.remark = remark ? remark : "Склоняется по образцу <span class='pattern'>" + insertWordWithHint('růže') + "</span>.";
  
  // Родительный падеж множественного числа - беглая гласная
  this.pad22=function(nominativ) {
    // замена окончания и подстановка беглой гласной. Для -ice  -yně автоматически. Для остальных вариантов -- устанавливать zeroend!
    if(this.zeroend || /(ice$)|(yně$)/.test(nominativ)) {
      return nominativ.replace(/.$/, '');
    } else {
      return nominativ.replace(/.$/, 'í');
    }
  }
  
  // табллица преобразований
  this.transform= [[{'f':/$/, 't':''},     {'f':/$/, 't':''}],
                   [{'f':/$/, 't':''},     this.pad22],
                   [{'f':/.$/, 't':'i'},   {'f':/.$/, 't':'ím'}],
                   [{'f':/.$/, 't':'i'},   {'f':/$/, 't':''}],
                   [{'f':/$/, 't':''},     {'f':/$/, 't':''}],
                   [{'f':/.$/, 't':'i'},   {'f':/.$/, 't':'ích'}],
                   [{'f':/.$/, 't':'í'},   {'f':/$/, 't':'mi'}]
                  ];
  // Применяем таблицу преобразований
  this._nounForms=this.mapTransform(this.transform, this.nominativ);
}
RUZE.prototype = new NOUN();





// Объект, представляющий образец město
// nominativ - именительный падеж, единственное число
// asJablko - true означает принудительное склонение по типу Jablko
// remark -- текст, выводимый при ошибке. Как правило что-то вроде "Склоняется по образцу ..."
function MESTO(nominativ, asJablko, _E_, remark) {
  
  this.nominativ=nominativ;
  this.asJablko=asJablko;
  this.hazE=_E_;                // Наличие беглого гласного в РП
  this.remark = remark ? remark : "Склоняется по образцу <span class='pattern'>" + insertWordWithHint('město') + "</span>.";

  this.pad61=function(nominativ) {
    // Проверка окончания основы
    if(/(h|g|k).$/.test(nominativ) || this.asJablko) {
      return nominativ.replace(/.$/, 'u');
    } else {
      if (/[ntdmbpvf].$/.test(nominativ)) {
        return nominativ.replace(/.$/, 'ě');
      } else {
        return nominativ.replace(/.$/, 'e');
      }
    }
  }
  
  this.pad22=function(nominativ) {
    // замена окончания
    if(this.hazE){
      return nominativ.replace(/(.).$/, 'e$1');
    } else {
      return nominativ.replace(/.$/, '');
    }
  }
  
  this.pad62=function(nominativ) {
    // Проверка окончания основы
    if(/(h|g|k).$/.test(nominativ) || this.asJablko) {
      return nominativ.replace(/.$/, 'ách');
    } else {
      return nominativ.replace(/.$/, 'ech');
    }
  }
  
  // табллица преобразований
  this.transform= [[{'f':/$/, 't':''},     {'f':/.$/, 't':'a'}],
                   [{'f':/.$/, 't':'a'},   this.pad22],
                   [{'f':/.$/, 't':'u'},   {'f':/.$/, 't':'ům'}],
                   [{'f':/$/, 't':''},     {'f':/.$/, 't':'a'}],
                   [{'f':/$/, 't':''},     {'f':/.$/, 't':'a'}],
                   [this.pad61,            this.pad62],
                   [{'f':/.$/, 't':'em'},  {'f':/.$/, 't':'y'}]
                  ];
  // Применяем таблицу преобразований
  this._nounForms=this.mapTransform(this.transform, this.nominativ);
}
MESTO.prototype = new NOUN();



// Объект, представляющий образец moře
// nominativ - именительный падеж, единственное число
// asLetiste - особенность множественного числа родительного падежа
// remark -- текст, выводимый при ошибке. Как правило что-то вроде "Склоняется по образцу ..."
function MORE(nominativ, asLetiste, remark) {
  
  this.nominativ=nominativ;
  this.asLetiste=asLetiste;
  this.remark = remark ? remark : "Склоняется по образцу <span class='pattern'>" + insertWordWithHint('moře') + "</span>.";
  
  this.pad22=function(nominativ) {
    // замена окончания
    if(this.asLetiste || /iště$/.test(nominativ)){
      return nominativ.replace(/..$/, 'ť');
    } else {
      return nominativ.replace(/.$/, 'í');
    }
  }

  // табллица преобразований
  this.transform= [[{'f':/$/, 't':''},     {'f':/$/, 't':''}],
                   [{'f':/$/, 't':''},     this.pad22],
                   [{'f':/.$/, 't':'i'},   {'f':/.$/, 't':'ím'}],
                   [{'f':/$/, 't':''},     {'f':/$/, 't':''}],
                   [{'f':/$/, 't':''},     {'f':/$/, 't':''}],
                   [{'f':/.$/, 't':'i'},   {'f':/.$/, 't':'ích'}],
                   [{'f':/.$/, 't':'em'},  {'f':/.$/, 't':'i'}]
                  ];
  // Применяем таблицу преобразований
  this._nounForms=this.mapTransform(this.transform, this.nominativ);
}
MORE.prototype = new NOUN();





/*
фрмирует в блоке whereID под заголовком header список слов из wordlist, обработанных функцией showOneFunction()
*/

function mapWordList(whereID, header, wordlist) {
  var where=document.getElementById(whereID);
  var str='<h1>' + header + '</h1>';
  for(var i=0; i<wordlist.length; i++) {
    str+='<hr>' + (i+1) +'. Существительное <span class="pattern">' + insertWordWithHint(wordlist[i].get(0)) + "</span>. " + wordlist[i].description() + '<br>' + wordlist[i].summary();
  }
  str+="<div class='closebutton'><input type='button' value='Закрыть список' onclick='toggleWordlist()'></div>"
  where.innerHTML=str;
}

wordListNext="block";
function toggleWordlist() {
    mapWordList('wordList', 'Склонение имён существительных', wordlist);
    var d = document.getElementById('wordList');
    var tmp=d.style.display;
    d.style.display=wordListNext;
    wordListNext=tmp;
    d.scrollIntoView();
}




/*
 * Собственно, сами существительные
 */


  student = [];
  muz = [];
  predseda = [];
  soudce = [];
  hrad = [];
  stroj = [];
  
  zenaRukaRem="Исключение - склоняется по типу <span class='pattern'>" + insertWordWithHint("žena") +  "</span> с отличиями во множественном числе Именительного, Родительного, Предложного и Творительного падежей.";
  zena = [
    new ZENA('žena'),
    new ZENA('kniha'),
    new ZENA('Olga'),
    new ZENA('moucha'),
    new ZENA('matka'),
    new ZENA('Věra'),
    new ZENA('panna', true), // чередование -е-
    new ZENA('hra', true),
    new ZENA('ruka',false, zenaRukaRem).set(1,2,'ruce').set(2,2,'rukou').set(6,2,'rukou').set(7,2,'rukama'),
    new ZENA('noha',false, zenaRukaRem).set(1,2,'nohy').set(2,2,'nohou').set(6,2,'nohou').set(7,2,'nohama'),
    new ZENA('fakulta'),
    new ZENA('hodina')
  ];
  ruze = [
    new RUZE('růže'),
    new RUZE('ulice'),
    new RUZE('kolegyně'),
    new RUZE('chvíle', true), // нулевое окончание
    new RUZE('koleje'),
    new RUZE('ložnice'),
    new RUZE('pozice')
  ];
  pisen = [];
  kost = [];
  mesto = [
    new MESTO('město'),
    new MESTO('jablko', true, true), // как яблоко и беглый гласный
    new MESTO('okno', true, true),
    new MESTO('divadlo'),
    new MESTO('auto'),
    new MESTO('křeslo', true, true),
    new MESTO('kolo'),
    new MESTO('zrcadlo'),
    new MESTO('oko'),
    new MESTO('ucho'),
    new MESTO('mléko')
  ];
  more = [
    new MORE('moře'),
    new MORE('pole'),
    new MORE('slunce'),
    new MORE('vejce'),
    new MORE('pracoviště'),
    new MORE('ohniště'),
    new MORE('letiště')
  ];
  kure = [];
  staveni = [];
  
  
  
/*
 * формирование списка слов
 */
  
wordListList=[student, muz, predseda, soudce, hrad, stroj, zena, ruze, pisen, kost, mesto, more, kure, staveni];
checkboxList=['student', 'muz', 'predseda', 'soudce', 'hrad', 'stroj', 'zena', 'ruze', 'pisen', 'kost', 'mesto', 'more', 'kure', 'staveni'];
  
wordlist=[]; // отсюда берутся слова

// вызывается при загрузке страницы, а также при изменении списка используемых
// типов слов (то есть при изменении состояний чекбоксов вверху страницы).
function makeWordList() {
  wordlist=[]; // обнуляем
  for(var i=0; i<checkboxList.length; i++) {
    if(document.getElementById(checkboxList[i]).checked) {
      wordlist=wordlist.concat(wordListList[i]);
    }
  }
  newTask(true); // Новое задание на основе нового списка. notScroll=true препятствует прокрутке в конец страницы при работе с чекбоксами
}

// объект представляет текущую задачу
CurrentTask={
  word: null,
  pad: null,
  cislo: null
  }

// генерация случайного задания
prefix=['-','','bez','k','pro','','o','s'];
postfix=['-','','','','','!&nbsp;','',''];
padGenetiv=['-','именительного','родительного','дательного','винительного','звательного','предложного','творительного'];
padNominativ=['-','Именительный','Родительный','Дательный','Винительный','Звательный','Предложный','Творительный'];
cisloGenetiv=['-','единственного','множественного'];
cisloNominativ=['-','единственное','множественное'];

// формирует задание
function newTask(notScroll) {
  // случайное существительное
  if(wordlist.length){
    CurrentTask.word=wordlist[Math.floor(Math.random()*wordlist.length)];
  } else {
    // fallback на случай, если список пустой
    CurrentTask.word=new FALLBACK();
  }
  // падеж и число
  CurrentTask.pad=Math.floor((Math.random()*7)+1);
  CurrentTask.cislo=Math.floor((Math.random()*2)+1);
  // устанавливаем значения на страничке
  document.getElementById("nominativ").innerHTML=CurrentTask.word.get(1,1);
  document.getElementById("prefix").innerHTML=prefix[CurrentTask.pad];
  document.getElementById("postfix").innerHTML=postfix[CurrentTask.pad];
  document.getElementById("pad").innerHTML=padGenetiv[CurrentTask.pad];
  document.getElementById("cislo").innerHTML=cisloGenetiv[CurrentTask.cislo];
  // устанавливаем состояние элементов.
  document.getElementById("entry").value="";
  if(!notScroll) {
    document.getElementById("entry").focus();
  }
}

// проверка ответа
function checkAnswer() {
  var markString = "";
  var answerString=document.getElementById("entry").value
  if(answerString=="") {answerString="[нет ответа]"};
  // создаем блок, во котором разместим объект
  var place=document.getElementById('resaults');
  var mark=document.createElement('div');
  place.appendChild(mark);
  // генерируем оценку. Правильность ответа определяет объект слова, ибо возможны варианты...
  if(CurrentTask.word.test(CurrentTask.pad, CurrentTask.cislo, answerString)) {
    mark.className='answer-ok';
    markString=  "<span class='answer-nominativ'>" + insertWordWithHint(CurrentTask.word.get(0)) + "</span> ";
    markString+= " → <span class='answer-grammar-form'>[" + padNominativ[CurrentTask.pad] + " падеж, " + cisloNominativ[CurrentTask.cislo] + " число]</span>";
    markString+= " → <span class='answer-ok'>" + insertWordWithHint(prefix[CurrentTask.pad] + " " + answerString + postfix[CurrentTask.pad], CurrentTask.word.get(0)) + "</span>";
    markString+= "<br><span class='ok-literal'>Ответ правильный</span>.";
  } else {
    mark.className='answer-error';
    markString= "<span class='answer-nominativ'>" + insertWordWithHint(CurrentTask.word.get(0)) + "</span> ";
    markString+= " → <span class='answer-grammar-form'>[" + padNominativ[CurrentTask.pad] + " падеж, " + cisloNominativ[CurrentTask.cislo] + " число]</span>";
    markString+= " → <span class='answer-error'>" +  insertWordWithHint(prefix[CurrentTask.pad] + " " + answerString + postfix[CurrentTask.pad], CurrentTask.word.get(0)) + "</span>";
    markString+= "<br><span class='error-literal'>Ошибка</span>. " + CurrentTask.word.getCorrectAnswerString(CurrentTask.pad, CurrentTask.cislo) + " " + CurrentTask.word.description();
  }
  // размещаем
  mark.innerHTML=markString;
  // автоматом новую задачу
  document.getElementById("keyboard").scrollIntoView();
  newTask();
}











