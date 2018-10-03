/*

Все объекты имеют методы:
get(лицо, число)              // возвращает требуемую форму глагола
                              // get(0) возвращает инфинитив
set(падеж, число, значение)   // устанавливает указанную форму глагола в заданное значение
test(падеж, число, значение)  // возвращает исину или ложь в зависимости от того верное ли значение или нет.
description()                 // возвращает описание типа спряжения
getCorrectAnswerString()      // возвращает строку "Правильный(е) ответ(ы) ответ, (ответ)... для "неверного ответа"
getAlternateAnswerString()    // возвращает строку с вариантами правильных ответов для "верного ответа"
summary                       // возвращает варианты изменения слова по формам. Используется в подсказках и списке слов

*/

////////////////////////////////////////////////////////////////////////////////////////////////////////
// Базовый объект, реализующий общую для всех глаголов функциональность
function VERB() {

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
  
  // Возвращает требуемую форму глагола
  // инфинитив, если person==0
  this.get=function(person, cislo) {
    if(person==0) return this.infinitiv;
    return this._verbForms[person-1][cislo-1];
  }
  
  // Устанавливает требуемую форму глагола. Дабы иметь дело с исключениями
  this.set=function(person, cislo, form) {
    if(person==0) {
      this.infinitiv=form;
      return this;
    }
    this._verbForms[person-1][cislo-1]=form;
    return this;
  }
  
  // добавляет еще одно возможное значение для заданной формы
  this.append=function(person, cislo, form) {
    var oldValue=this.get(person, cislo);
    if(oldValue!=form) {              // Если значение другое
      if(isArray(oldValue)) {         // Там уже массив. Просто добавляем значение
        oldValue.push(form);
      } else {                        // Меняем значение на массив значений
        var a=new Array();
        a.push(oldValue, form);
        this.set(person, cislo, a);
      }
    }
    return this;
  }
  
  // добавляет еще один вариант спряжения (из объекта аналогичного)
  this.merge=function(verb, remark) {
    for(var p=1; p<=3; p++) {
      for(var c=1; c<=2; c++) {
        this.append(p, c, verb.get(p, c));
      }
    }
    if(remark) this.remark=remark;
    return this;
  }
  
  // добавляет возвратную частицу к глаголу. Добавлять надо до того, как
  // объединялись/добавлялись значения, ибо массивов не понимает...
  this.se=function(se) {
    se = se ? se : 'se';
    this.infinitiv+= " " + se;
    for(var p=0; p<3; p++) {
      for(var c=0; c<2; c++) {
        this._verbForms[p][c]+= " " + se;
      }
    }
    return this;
  }
  
  
  // Возвращает строку, описывающую тип спряжения глагола
  this.description=function() {
    return this.remark;
  }
  
  // Вызывается когда дан неверный ответ
  // возвращает строку типа "правильный ответ ...
  this.getCorrectAnswerString=function(person, cislo) {
    // Добавить вариант с несколькими правильными ответами.
    var val=this.get(person, cislo);
    if(isArray(val)) {
      var res="Правильные варианты ответа: "

      for(var i=0; i<val.length-1; i++) {
        res+="<span class='correct-answer'>" + insertWordWithHint(val[i], this.get(0)) + "</span>, ";
      }
      res+="<span class='correct-answer'>" + insertWordWithHint(val[val.length-1], this.get(0)) + "</span>.";
      return res;
    } else {
      return "Правильный ответ <span class='correct-answer'>" + insertWordWithHint(val, this.get(0)) + ".</span> ";
    }
  }
  
  // Вызывается когда дан верный ответ.
  // Если есть несколько вариантов ответа, то возвращает строку с их описанием. Иначе возвращает пустую строку
  this.getAlternateAnswerString=function(person, cislo) {
    // Возвращает строку, если есть несколько вариантов для данной формы слова
    var val=this.get(person, cislo);
    if(isArray(val)) {
      var res="Допустимые варианты ответа: ";
      for(var i=0; i<val.length-1; i++) {
        res+="<span class='correct-answer'>" + insertWordWithHint(val[i], this.get(0)) + "</span>, ";
      }
      res+="<span class='correct-answer'>" + insertWordWithHint(val[val.length-1], this.get(0)) + "</span>.";
      return res;
    } else {
      return '';
    }
  }
  
  // возвращает строку с табличкой, используемой во всплывающих подсказках и списке слов
  this.summary=function() {
    var prefix=[0, ['-','já','ty','on'],['-','my','vy','oni']];
    var str='<table>';
    str+='<tr><td></td><td></td><td style="font-weight:bold;">е.ч.</td><td></td><td style="font-weight:bold;">м.ч.</td></tr>'
    for(var p=1; p<=3; p++) {
      str+='<tr><td style="font-weight:bold;">' + p + '.</td>';
      for(var n=1; n<=2; n++) {
        str+='<td style="text-align:right;padding-left:1em;">(' + prefix[n][p] + ')</td><td>';
        if(isArray(this.get(p,n))) {
          str+=this.get(p,n).join(" / ");
        } else {
          str+=this.get(p,n);
        }
        str+='</td>';
      }
      str+='</tr>';
    }
    str+='</table>';
    return str;
  }
  
  // определяет правильный ли ответ дал пользователь.
  this.test=function(person, cislo, form) {
    // Вспомогательная функция. Удаляет лишние пробелы вначале, вконце и в середине
    var trim=function(str) {
      return str.replace(/^\s*/,'').replace(/\s*$/,'').replace(/\s+/g,' ');
    }
    var correctForm=this.get(person, cislo);
    if(isArray(correctForm)) {
      // несколько вариантов ответа правильные
      for(var i=0; i<correctForm.length; i++) {
        if( trim(correctForm[i])==trim(form)) return true;
      }
      return false;
      
    } else {
      // существует один правильный вариант ответа
      return trim(correctForm)==trim(form);
    }
  }
}


/////////////////////////////////////////////////////////////////////////////////////////////////////
// Объект, представляющий глагол по образцу dělat
function DELAT(infinitiv, remark) {
  this.infinitiv=infinitiv;
  this.remark = remark ? remark : "Cпрягается по образцу <span class='pattern'>"  + insertWordWithHint("dělat") + "</span>.";
  // табллица преобразований
  this.transform= [[{'f':/..$/, 't':'ám'}, {'f':/..$/, 't':'áme'}],
                   [{'f':/..$/, 't':'áš'}, {'f':/..$/, 't':'áte'}],
		   [{'f':/..$/, 't':'á'},  {'f':/..$/, 't':'ají'}]
		  ];
  // Применяем таблицу преобразований
  this._verbForms=this.mapTransform(this.transform, this.infinitiv);
}
DELAT.prototype = new VERB();


////////////////////////////////////////////////////////////////////////////////////////////////////
// Объект, представляющий глагол по образцу prosit
function PROSIT(infinitiv, remark) {
  this.infinitiv=infinitiv;
  this.remark = remark ?  remark : "Cпрягается по образцу <span class='pattern'>" + insertWordWithHint("prosit") + "</span>.";
  // табллица преобразований
  this.transform= [[{'f':/..$/, 't':'ím'}, {'f':/..$/, 't':'íme'}],
                   [{'f':/..$/, 't':'íš'}, {'f':/..$/, 't':'íte'}],
                   [{'f':/..$/, 't':'í'},  {'f':/..$/, 't':'í'}]
                  ];
  // Применяем таблицу преобразований
  this._verbForms=this.mapTransform(this.transform, this.infinitiv);
}
PROSIT.prototype = new VERB();


/////////////////////////////////////////////////////////////////////////////////////////////////////
// Объект, представляющий глагол по образцу rozumět
function ROZUMET(infinitiv, remark) {
  this.infinitiv=infinitiv;
  this.remark = remark ?  remark : "Cпрягается по образцу <span class='pattern'>" + insertWordWithHint("rozumět") + "</span>.";
  // табллица преобразований
  this.transform= [[{'f':/..$/, 't':'ím'}, {'f':/..$/, 't':'íme'}],
                   [{'f':/..$/, 't':'íš'}, {'f':/..$/, 't':'íte'}],
                   [{'f':/..$/, 't':'í'},  {'f':/.$/, 't':'jí'}]
                  ];
  // Применяем таблицу преобразований
  this._verbForms=this.mapTransform(this.transform, this.infinitiv);
}
ROZUMET.prototype = new VERB();


/////////////////////////////////////////////////////////////////////////////////////////////////////
// Объект, представляющий глагол по образцу děkovat
function DEKOVAT(infinitiv, remark) {
  this.infinitiv=infinitiv;
  this.remark = remark ?  remark : "Cпрягается по образцу <span class='pattern'>" + insertWordWithHint("děkovat") + "</span>.";
  // табллица преобразований
  this.transform= [[{'f':/....$/, 't':'uji'}, {'f':/....$/, 't':'ujeme'}],
                   [{'f':/....$/, 't':'uješ'}, {'f':/....$/, 't':'ujete'}],
                   [{'f':/....$/, 't':'uje'},  {'f':/....$/, 't':'ují'}]
                  ];
  // Применяем таблицу преобразований
  this._verbForms=this.mapTransform(this.transform, this.infinitiv);
}
DEKOVAT.prototype = new VERB();


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Объект, представляющий глагол по образцу žít
// по сути те-же окончания, что и děkovat, но применяются не к инфинитиву
// а к основе, которая задается отдельно
function ZIT(infinitiv, base, remark) {
  this.infinitiv=infinitiv;
  this.base=base;
  this.remark = remark ?  remark : "Cпрягается по образцу <span class='pattern'>" + insertWordWithHint("žít") + "</span>.";
  // табллица преобразований
  this.transform= [[{'f':/$/, 't':'ji'},  {'f':/$/, 't':'jeme'}],
                   [{'f':/$/, 't':'ješ'}, {'f':/$/, 't':'jete'}],
                   [{'f':/$/, 't':'je'},  {'f':/$/, 't':'jí'}]
                  ];
  // Применяем таблицу преобразований
  this._verbForms=this.mapTransform(this.transform, this.base);
}
ZIT.prototype = new VERB();


///////////////////////////////////////////////////////////////////////////////////////////////////////
// Объект, представляющий глагол по образцу číst
function CIST(infinitiv, base, remark) {
  this.infinitiv=infinitiv;
  this.base=base;
  this.remark = remark ?  remark : "Cпрягается по образцу <span class='pattern'>" + insertWordWithHint("číst") + "</span>.";
  // табллица преобразований
  this.transform= [[{'f':/$/, 't':'u'}, {'f':/$/, 't':'eme'}],
                   [{'f':/$/, 't':'eš'}, {'f':/$/, 't':'ete'}],
                   [{'f':/$/, 't':'e'},  {'f':/$/, 't':'ou'}]
                  ];
  // Применяем таблицу преобразований
  this._verbForms=this.mapTransform(this.transform, this.base);
}
CIST.prototype = new VERB();



///////////////////////////////////////////////////////////////////////////////////////////////////////
// Объект, представляющий глагол по образцу tisknout
function TISKNOUT(infinitiv, remark) {
  this.infinitiv=infinitiv;
  this.remark = remark ?  remark : "Cпрягается по образцу <span class='pattern'>" + insertWordWithHint("tisknout") + "</span>.";
  // табллица преобразований
  this.transform= [[{'f':/...$/, 't':'u'}, {'f':/...$/, 't':'eme'}],
                   [{'f':/...$/, 't':'eš'}, {'f':/...$/, 't':'ete'}],
                   [{'f':/...$/, 't':'e'},  {'f':/...$/, 't':'ou'}]
                  ];
  // Применяем таблицу преобразований
  this._verbForms=this.mapTransform(this.transform, this.infinitiv);
}
TISKNOUT.prototype = new VERB();



///////////////////////////////////////////////////////////////////////////////////////////////////////
// Объект, представляющий глагол - исключение
function IRREGULAR(infinitiv, f11, f21, f31, f12, f22, f32, remark) {
  this.infinitiv=infinitiv;
  this.remark = remark ?  remark : "Является неправильным глаголом.";
  // напрямую заполняем таблицу форм глагола
  this._verbForms=[
                    [f11, f12],
                    [f21, f22],
                    [f31, f32]
                  ];
}
IRREGULAR.prototype = new VERB();





/*
фрмирует в блоке whereID под заголовком header список слов из wordlist, обработанных функцией showOneFunction()
*/
function mapWordList(whereID, header, wordlist) {
  var where=document.getElementById(whereID);
  var str='<h1>' + header + '</h1>';
  for(var i=0; i<wordlist.length; i++) {
    str+='<hr>' + (i+1) +'. Глагол <span class="pattern">' + insertWordWithHint(wordlist[i].get(0)) + "</span>. " + wordlist[i].description() + '<br>' + wordlist[i].summary();
  }
  str+="<div class='closebutton'><input type='button' value='Закрыть список' onclick='toggleWordlist()'></div>"
  where.innerHTML=str;
}


wordListNext="block";
function toggleWordlist() {
    mapWordList('wordList', 'Спряжение глаголов', wordlist);
    var d = document.getElementById('wordList');
    var tmp=d.style.display;
    d.style.display=wordListNext;
    wordListNext=tmp;
    d.scrollIntoView();
}

// ****************************************************************************************************************
// Сами глаголы



/*
Собственно, сами глаголы
*/



  prosit=[
    new PROSIT('prosit'),
    new PROSIT('mluvit'),
    new PROSIT('chodit'),
    new PROSIT('nosit'),
    new PROSIT('myslit'),
    new PROSIT('jezdit'),
    new PROSIT('vodit'),
    new PROSIT('končit'),
    new PROSIT('zařídit'),
    new PROSIT('oslavit'),
    new PROSIT('oznámit'),
    new PROSIT('rozhlásit'),
    new PROSIT('připravit'),
    new PROSIT('nařídit'),
    new PROSIT('zdědit'),
    new PROSIT('strávit'),
    new PROSIT('zastavit'),
    new PROSIT('ručit'),
    new PROSIT('musit').append(3,2,'musejí')
  ];
  
  
  DELATandCISTremark="Спрягается по образцам <span class='pattern'>" + insertWordWithHint("dělat") + "</span> и <span class='pattern'>"  + insertWordWithHint("číst") +  "</span>.";
  delat=[
    new DELAT('dělat'),
    new DELAT('vstávat'),
    new DELAT('dávat'),
    new DELAT('obědvat'),
    new DELAT('konat'),
    new DELAT('skládat'),
    new DELAT('spěchat'),
    new DELAT('začínat'),
    new DELAT('otevírat'),
    new DELAT('líbat'),
    new DELAT('utíkat'),
    new DELAT('praskat'),
    new DELAT('vysílat'),
    new DELAT('kecat'),
    new DELAT('stoupat'),
    new DELAT('čekat'),
    // спрягаются двумя способами. Поместил в эту группу т.к. внешне похожи
    new DELAT('česat').merge(new CIST('česat','češ'), DELATandCISTremark),
    new DELAT('hryzat').merge(new CIST('hryzat','hryž'), DELATandCISTremark),
    new DELAT('křesat').merge(new CIST('křesat','křeš'), DELATandCISTremark),
    new DELAT('klusat').merge(new CIST('klusat','kluš'), DELATandCISTremark),
    new DELAT('kousat').merge(new CIST('kousat','kouš'), DELATandCISTremark),
    new DELAT('klouzat').merge(new CIST('klouzat','klouž'), DELATandCISTremark),
    new DELAT('lízat').merge(new CIST('lízat','líž'), DELATandCISTremark),
    new DELAT('řezat').merge(new CIST('řezat','řež'), DELATandCISTremark),
    new DELAT('vrzat').merge(new CIST('vrzat','vrž'), DELATandCISTremark),
    new DELAT('dloubat').merge(new CIST('dloubat','dloub'), DELATandCISTremark),
    new DELAT('sypat').merge(new CIST('sypat','syp'), DELATandCISTremark),
    new DELAT('tepat').merge(new CIST('tepat','tep'), DELATandCISTremark),
    new DELAT('třepat').merge(new CIST('třepat','třep'), DELATandCISTremark),
    new DELAT('kopat').merge(new CIST('kopat','kop'), DELATandCISTremark),
    new DELAT('kapat').merge(new CIST('kapat','kap'), DELATandCISTremark),
    new DELAT('klepat').merge(new CIST('klepat','klep'), DELATandCISTremark),
    new DELAT('šlapat').merge(new CIST('šlapat','šlap'), DELATandCISTremark)
  ];
  
  rozumet=[
    new ROZUMET('sázet'),
    new ROZUMET('rozumět'),
    new ROZUMET('muset').append(3,2,'musí'),
    new ROZUMET('zkoušet'),
    new ROZUMET('vyprávět'),
    new ROZUMET('odnášet'),
    new ROZUMET('přijíždět'),
    new ROZUMET('přicházet'),
    new ROZUMET('vyrábět'),
    new ROZUMET('omdlet').append(3,2,'omdlí'),
    new ROZUMET('mizet').append(3,2,'mizí'),
    new ROZUMET('večeřet').append(3,2,'večeří'),
    new ROZUMET('stavět'),
    new ROZUMET('úpět').append(3,2,'úpí'),
    new ROZUMET('čnět').append(3,2,'ční'),
    new ROZUMET('ztrácet')
  ];
  
  dekovat=[
    new DEKOVAT('kupovat'),
    new DEKOVAT('děkovat'),
    new DEKOVAT('studovat'),
    new DEKOVAT('milovat'),
    new DEKOVAT('pozdravovat'),
    new DEKOVAT('telefonovat'),
    new DEKOVAT('informovat'),
    new DEKOVAT('fungovat'),
    new DEKOVAT('nadiktovat'),
    new DEKOVAT('seřizovat'),
    new DEKOVAT('nafilmovat'),
    new DEKOVAT('sportovat'),
    new DEKOVAT('tancovat'),
    new DEKOVAT('lyžovat'),
    new DEKOVAT('oslabovat'),
    new DEKOVAT('roztahovat'),
    new DEKOVAT('okouzlovat'),
    new DEKOVAT('okřikovat'),
    new DEKOVAT('rýsovat'),
    new DEKOVAT('pamatovat'),
    new DEKOVAT('pracovat'),
    new DEKOVAT('diskutovat')
  ];
  
  cist=[
    new CIST('nést','nes'),
    new CIST('číst','čt'),
    new CIST('brát', 'ber'),
    new CIST('vést', 'ved'),
    new CIST('plést', 'plet'),
    new CIST('snést', 'snes'),
    new CIST('pást', 'pas'),
    new CIST('růst', 'rost'),
    new CIST('rvát', 'rv'),
    new CIST('smést', 'smet'),
    new CIST('prát','per'),
    new CIST('žrát','žer'),
    new CIST('cpát','cp'),
    new CIST('řvát','řv'),
    new CIST('štvát','štv'),
    new CIST('psát','píš'),
    new CIST('lhát','lž'),
    new CIST('stlát','stel'),
    new CIST('zvát','zv'),
    new CIST('hnát','žen'),
    new CIST('jet', 'jed'),
    new CIST('jít', 'jd'),
    new CIST('stát','stan').se(),
    new CIST('krást','krad'),
    new CIST('klást','klad'),
    new CIST('příst','před'),
    new CIST('hníst','hnět'),
    new CIST('mést','met'),
    new CIST('vézt','vez'),
    new CIST('třast','třes'),
    new CIST('mást','mat'),
    new CIST('lézt','lez'),
    new CIST('začít','začn'),
    new CIST('vzít','vezm'),
    new CIST('dojmout','dojm'),
    new CIST('najmout','najm'),
    new CIST('zajmout','zajm'),
    new CIST('dmout','dm'),
    new CIST('tít','tn'),
    new CIST('pnout','pn').se(),
    new CIST('umřít','umř').append(1,1,'umru').append(3,2,'umrou'),
    new CIST('dřít','dř'),
    new CIST('opřít','opř'),
    new CIST('třít','tř').append(1,1,'tru').append(3,2,'trou'),
    new CIST('mlít','mel'),
    new CIST('téci','teč'),
    new CIST('tlouci','tluč').append(1,1,'tluku').append(3,2,'tlukou'),
    new CIST('pěci','peč').append(1,1,'peku').append(3,2,'pekou'),
    new CIST('síci','seč').append(1,1,'seku').append(3,2,'sekou'),
    new CIST('říci','řekn').append(1,1,'řku').append(3,2,'řkou'),
    new CIST('vléci','vleč'),
    new CIST('obléci','obleč').se(),
    new CIST('převléci','převleč').se(),
    new CIST('moci','můž').append(1,1,'mohu').append(3,2,'mohou')
    ];
    
  tisknout=[  
    new TISKNOUT('tisknout'),
    new TISKNOUT('lehnout'),
    new TISKNOUT('sednout'),
    new TISKNOUT('minout'),
    new TISKNOUT('zvednout'),
    new TISKNOUT('zahnout'),
    new TISKNOUT('zmáčknout'),
    new TISKNOUT('zapomenout'),
    new TISKNOUT('mrznout')
  ];
  
  irregular=[
    new IRREGULAR('jíst', 'jím', 'jíš', 'jí', 'jíme', 'jíte', 'jedí'),
    new IRREGULAR('vědět', 'vím', 'víš', 'ví', 'víme', 'víte', 'vědí'),
    new IRREGULAR('chtít', 'chci', 'chceš', 'chce', 'chceme', 'chcete', 'chtějí'),
    new IRREGULAR('být', 'jsem', 'jsi', 'je', 'jsme', 'jste', 'jsou')
  ];

  PROSITremark="Cпрягается по образцу <span class='pattern'>" + insertWordWithHint("prosit") + "</span>.";
  DELATremark="Cпрягается по образцу <span class='pattern'>"  + insertWordWithHint("dělat") + "</span>.";
  DEKOVATremark="Cпрягается по образцу <span class='pattern'>" + insertWordWithHint("děkovat") + "</span>.";
  CISTremark="Cпрягается по образцу <span class='pattern'>" + insertWordWithHint("číst") + "</span>.";
  other=[
    // на -et, но спрягаются как prosit
    new PROSIT('běžet'),
    new PROSIT('letět'),
    new PROSIT('ležet'),
    new PROSIT('sedět'),
    new PROSIT('viset'),
    new PROSIT('vidět'),
    new PROSIT('slyšet'),
    new PROSIT('držet'),
    new PROSIT('hořet'),
    new PROSIT('křičet'),
    new PROSIT('mlčet'),
    new PROSIT('bydlet'),
    new PROSIT('trpět'),
    // разные, спрягаемые как prosit
    new PROSIT('spát'),
    new IRREGULAR('stát', 'stojím', 'stojíš', 'stojí', 'stojíme', 'stojite', 'stojí', PROSITremark),
    new IRREGULAR('bát se', 'bojím se', 'bojíš se', 'bojí se', 'bojíme se', 'bojite se', 'bojí se', PROSITremark),
    
    // по образцу dělat
    new IRREGULAR('mít', 'mám', 'máš', 'má', 'máme', 'máte', 'mají', DELATremark),
    new IRREGULAR('dívat se', 'dívám se', 'díváš se', 'dívá se', 'díváme se', 'díváte se', 'dívají se', DELATremark),
    new DELAT('dát'),
    new DELAT('ptát').se(),
    new DELAT('zeptat').se(),
    
    // разные глаголы, спрягающиеся по děkovat
    new ZIT('žít', 'ži'),
    new ZIT('pít', 'pi'),
    new ZIT('šít', 'ši'),
    new ZIT('lít', 'li'),
    new ZIT('bít', 'bi'),
    new ZIT('hnít', 'hni'),
    new ZIT('mýt', 'my'),
    new ZIT('krýt', 'kry'),
    new ZIT('rýt', 'ry'),
    new ZIT('výt', 'vy'),
    new ZIT('sít', 'se'),
    new ZIT('plít', 'ple'),
    new ZIT('klít', 'kle'),
    new ZIT('proklít', 'prokle'),
    new ZIT('zaklít', 'zakle'),
    new ZIT('hrát', 'hra'),
    new ZIT('lát', 'la'),
    new ZIT('sát', 'sa'),
    new ZIT('vát', 'vě'),
    new ZIT('tát', 'ta'),
    new ZIT('zrát', 'zra'),
    new ZIT('přát', 'pře'),
    new ZIT('hřát', 'hře'),
    new ZIT('okřát', 'okře'),
    new ZIT('plout', 'plu'),
    new ZIT('kout', 'ku'),
    new ZIT('obout', 'obu'),
    new ZIT('dout', 'du'),
    new ZIT('zet', 'ze'),
    new ZIT('přispět', 'přispě'),
    new IRREGULAR('podít se', 'poději se', 'poděješ se', 'poděje se', 'podějeme se', 'podějete se', 'podějí se', DEKOVATremark),
    new IRREGULAR('smát se', 'směji se', 'směješ se', 'směje se', 'smějeme se', 'smějete se', 'smějí se', DEKOVATremark),
    new IRREGULAR('chvět se', 'chvěji se', 'chvěješ se', 'chvěje se', 'chvějeme se', 'chvějete se', 'chvějí se', DEKOVATremark),
    
    // глаголы, спрягающиеся как číst
    new CIST('sebrat','seber'),
    new CIST('klamat','klam'),
    new CIST('zakázat','zakáž'),
    new CIST('mazat','maž'),
    new CIST('vázat','váž'),
    new CIST('chápat','cháp'),
    new CIST('lámat','lám'),
    new CIST('pozvat','pozv'),
    new CIST('chrápat','chráp'),
    new CIST('sehnat','sežen'),
    new CIST('vstat','vstan'),
    new CIST('zůstat','zůstan'),
    new CIST('přestat','přestan'),
    new CIST('dostat', 'dostan'),
    new CIST('skákat','skáč'),
    new CIST('plavat','plav'),
    new IRREGULAR('stonat','stůňu','stůněš','stůně','stůněme','stůněte','stůňou', CISTremark),
    new CIST('kašlat','kašl'),
    new CIST('hrabat','hrab'),
    new CIST('plakat','pláč')
  ];


/*
 * формирование списка слов
 */

// Отладочная функция, ругающаяся на повторы слов
function checkUnique(a) {
  for(var i=0; i<a.length; i++) {
    for(var j=i+1; j<a.length; j++) {
      if(a[i].get(0)==a[j].get(0)) {
        alert('Повторяется слово "' + a[i].get(0) + '"');
      }
    }
  }
}

wordListList=[prosit, delat, rozumet, dekovat, tisknout, cist, irregular, other];
checkboxList=['prosit', 'delat', 'rozumet', 'dekovat', 'tisknout', 'cist', 'irregular', 'other'];

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
  // DEBUG -- в результате стоит отключить
  checkUnique(wordlist);
}

// объект представляет текущую задачу
CurrentTask={
  word: null,
  person: null,
  cislo: null
  }

// fallback
byt=new IRREGULAR('být', 'jsem', 'jsi', 'je', 'jsme', 'jste', 'jsou');

// возвращает требуемую форму местоимения
function zajmeno(person, cislo, rod){
  var z=[['já', 'my'],['ty','vy'],[['on','ona','ono'],['oni','ony','ona']]];
  if(!rod) rod=1;
  if(person==3){
    return z[2][cislo-1][rod-1];
  } else {
    return z[person-1][cislo-1];
  }
}


// генерация случайного задания
cisloGenetiv=['-','единственного','множественного'];
cisloNominativ=['-','единственное','множественное'];
personGenetiv=['-', 'первого', 'второго', 'третьего'];
personNominativ=['-', 'первое', 'второе', 'третье'];

// генерация случайного задания
function newTask(notScroll) {
  // случайный глагол
  if(wordlist.length){
    CurrentTask.word=wordlist[Math.floor(Math.random()*wordlist.length)];
  } else {
    // fallback на случай, если нет глаголов
    CurrentTask.word=byt;
  }
  // лицо и число
  CurrentTask.person=Math.floor((Math.random()*3)+1);
  CurrentTask.cislo=Math.floor((Math.random()*2)+1);
  // устанавливаем значения на страничке
  document.getElementById("nominativ").innerHTML=CurrentTask.word.get(0);
  document.getElementById("prefix").innerHTML=zajmeno(CurrentTask.person, CurrentTask.cislo);
  document.getElementById("postfix").innerHTML='';
  document.getElementById("person").innerHTML=personGenetiv[CurrentTask.person];
  document.getElementById("cislo").innerHTML=cisloGenetiv[CurrentTask.cislo];
  // устанавливаем состояние элементов.
  document.getElementById("entry").value="";
  if(!notScroll) {
    document.getElementById("entry").focus();
  }
}


function checkAnswer() {
  var markString = "";
  var answerString=document.getElementById("entry").value
  if(answerString=="") {answerString="[нет ответа]"};
  // создаем блок, во котором разместим объект
  var place=document.getElementById('resaults');
  var mark=document.createElement('div');
  place.appendChild(mark);
  // генерируем ответ
  if(CurrentTask.word.test(CurrentTask.person, CurrentTask.cislo, answerString)) {
    mark.className='answer-ok';
    markString=  "<span class='answer-nominativ'>" + insertWordWithHint(CurrentTask.word.get(0)) + "</span> ";
    markString+= " → <span class='answer-grammar-form'>[" + personNominativ[CurrentTask.person] + " лицо, " + cisloNominativ[CurrentTask.cislo] + " число]</span>";
    markString+= " → <span class='answer-ok'>" + insertWordWithHint("(" + zajmeno(CurrentTask.person, CurrentTask.cislo) + ") " + answerString, CurrentTask.word.get(0)) + "</span>";
    markString+= "<br><span class='ok-literal'>Ответ правильный</span>. " + CurrentTask.word.getAlternateAnswerString(CurrentTask.person, CurrentTask.cislo);

  } else {
    mark.className='answer-error';
    markString=  "<span class='answer-nominativ'>" + insertWordWithHint(CurrentTask.word.get(0)) + "</span> ";
    markString+= " → <span class='answer-grammar-form'>[" + personNominativ[CurrentTask.person] + " лицо, " + cisloNominativ[CurrentTask.cislo] + " число]</span>";
    markString+= " → <span class='answer-error'>" + insertWordWithHint("(" + zajmeno(CurrentTask.person, CurrentTask.cislo) + ") " + answerString, CurrentTask.word.get(0)) + "</span>";
    markString+= "<br><span class='error-literal'>Ошибка</span>. " + CurrentTask.word.getCorrectAnswerString(CurrentTask.person, CurrentTask.cislo) + " " + CurrentTask.word.description();
  }
  // размещаем
  mark.innerHTML=markString;
  // автоматом новую задачу
  document.getElementById("keyboard").scrollIntoView();
  newTask();
}


