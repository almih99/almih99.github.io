/*
 * Объект создает и представляет клавиатуру экранную
 */

kbID=1;

function keyboard(parent, entry) {
/* 
объект, создающий клавиатуру и представляющий её в дальнейшем

Создание объекта. Необязательные аргументы -- ID элемента, куда будет встроена клавиатура и области ввода, куда будет вводиться информация.
Если entry не задано, то не используется до явного задания (что в общем и не обязательно - можно пользоваться callback-функциями)
Если parent не задано, то клавиатура не отображается до явного вызова mapto()

  k=new keyboard(parent, entry);

Отображение на страницу в указанный родительский элемент

  k.mapto(parentID);
  
Скрывают/показывают клавиатуру. Которая должна быть уже отображена на страницу.
  k.hide();
  k.show();

Привязка поля ввода. Если задается null, то привязка снимается

  k.setEntry(entryID);

Установка раскладки без шифта и с шифтом

  k.setLayout(`1234567890-=qwertyuiop[]asdfghjkl;'zxcvbnm,./", '~!@#$%^&*()_+QWERTYUIOP{}ASDFGHJKL:"ZXCVBNM<>?')

обработчики событий:

При нажатии на обычную кнопку

  k.onKey=function() {....}
  


Специальные кнопки

  k.onEnter=function() {....}
  k.onBS=function() {....}
  k.onShift=function() {....}
  k.onTab=function() {....}
  k.onCaps=function() {....}
  
Доступ к элементам

Получить объект кнопки (input) по символу.

  k.getKeyObjectByChar('Tab');
  
Получить доступ к таблице содержащей кнопки

  k.keyboardTabe
  
Пройтись по всем кнопкам в цикле

  k.forEachButton(function(button){})
  
*/

  // Обработчики событий, которые при необходимости могут быть заменены на что-нибудь приличное
  
  this.onKey=function (input) {
    if (input.keyboard.entry) {
    // setText(this.entry, input.value);
       this.insertChar(input.value);
       input.keyboard.entry.focus();
    }
    if(input.keyboard.isShift) {
      // вернуть нормальную раскладку и сбрость флаг
      this.isShift=false;
      this.applyLayout(this.layout);
    }
  }
  
  this.onSpace=function (input) {
    // по умолчанию вызываем onKey
    this.onKey(input);
  }
  
  this.onEnter=function (input) {
    // по умолчанию ничего не делаем
  }
  
  this.onBS=function (input) {
    // удаляем символ перед курсором, если есть привязка к полю ввода
    this.backSpace();
  }
  
  this.onShift=function (input) {
    // подмена изображений на клавиатуре до следующего нажатия
    if(this.isShift) {
      this.isShift=false;
      this.applyLayout(this.layout);
    } else {
      this.isShift=true;
      this.applyLayout(this.LAYOUT);
    }
  }
  
  this.onTab=function (input) {
    // по умоляанию передаем 4 пробела
    var tmp=new Object;
    tmp.keyboard=this;
    tmp.value='    ';
    this.onKey(tmp);
  }
  
  this.onCaps=function (input) {
    // просто меняем местами раскладки
    var tmp=this.layout;
    this.layout=this.LAYOUT;
    this.LAYOUT=tmp;
    this.isShift=false;
    this.applyLayout(this.layout);
  }
  
  // Привязанный объект ввода строки
  this.entry=null;
  
  // Флаг регистра
  this.isShift=false;

  // Идентификатор клавиатуры
  this.id='kb-' + kbID;
  kbID++;

  // Массив из всех кнопочек
  this.keylist=Array();

  // раскладки по умолчанию для нижнего и верхнего регистров
  this.layout="`1234567890-=\\qwertyuiop[]asdfghjkl;'zxcvbnm,./";
  this.LAYOUT='~!@#$%^&*()_+|QWERTYUIOP{}ASDFGHJKL:"ZXCVBNM<>?';

  this._showrow=function(row, fromC, toC) {
    for(var i=fromC; i<toC; i++) {
      var cell=document.createElement('td');
      cell.setAttribute('colSpan',2);
      row.appendChild(cell);
      var button=document.createElement('input');
      button.type='button';
      button.value=this.layout.charAt(i);
      button.id=this.id + '-' + i;
      button.style.width="2.5em";
      button.onclick=function () {this.keyboard.onKey(this);};
      button.keyboard=this;
      cell.appendChild(button);
      this.keylist.push(button);
    }
  }

  this.mapto=function(parentID) {
      // длинная и ужасная функция, которая выводит на экран клавиатуру.
      // я знаю, что так нельзя делать, но ведь очень хочется...
      var keyboardContainer=document.createElement('div');
      keyboardContainer.id=this.id;
      document.getElementById(parentID).appendChild(keyboardContainer);
      var keyboardTable=document.createElement('table');
      keyboardTable.style.backgroundColor="#eeeeee";
      keyboardTable.style.borderStyle="solid";
      keyboardTable.style.borderWidth="2px";
      this.keyboardTabe=keyboardTable;
      keyboardContainer.appendChild(keyboardTable);
      var tbody=document.createElement('tbody');
      keyboardTable.appendChild(tbody);
      var row=document.createElement('tr');
      tbody.appendChild(row);
      // первый ряд клавиатуры
      this._showrow(row, 0, 14);
      // специальная клавиша backspace
      var cell=document.createElement('td');
      cell.setAttribute('colSpan',2);
      row.appendChild(cell);
      var button=document.createElement('input');
      button.type='button';
      button.value='BS';
      button.id=this.id + '-bs';
      button.style.width="100%";
      button.onclick=function () {this.keyboard.onBS(this);};
      button.keyboard=this;
      cell.appendChild(button);
      this.keylist.push(button);
      // второй ряд клавиатуры
      var row=document.createElement('tr');
      tbody.appendChild(row);
      // специальная клавиша tab
      var cell=document.createElement('td');
      cell.setAttribute('colSpan',3);
      row.appendChild(cell);
      var button=document.createElement('input');
      button.type='button';
      button.value='Tab';
      button.id=this.id + '-tab';
      button.style.width="100%";
      button.onclick=function () {this.keyboard.onTab(this);};
      button.keyboard=this;
      cell.appendChild(button);
      this.keylist.push(button);
      // обычные клавиши
      this._showrow(row, 14, 26);
      // специальная клавиша ENTER
      var cell=document.createElement('td');
      cell.setAttribute('colSpan',4);
      cell.setAttribute('rowSpan',2);
      row.appendChild(cell);
      var button=document.createElement('input');
      button.type='button';
      button.value='\nEnter\n ';
      button.id=this.id + '-enter';
      button.style.width="100%";
      button.onclick=function () {this.keyboard.onEnter(this);};
      button.keyboard=this;
      cell.appendChild(button);
      this.keylist.push(button);
      // третий ряд клавиатуры
      var row=document.createElement('tr');
      tbody.appendChild(row);
      // специальная клавиша CapsLock
      var cell=document.createElement('td');
      cell.setAttribute('colSpan',4);
      row.appendChild(cell);
      var button=document.createElement('input');
      button.type='button';
      button.value='Caps';
      button.id=this.id + '-caps';
      button.style.width="100%";
      button.onclick=function () {this.keyboard.onCaps(this);};
      button.keyboard=this;
      cell.appendChild(button);
      this.keylist.push(button);
      // обычные клавиши
      this._showrow(row, 26, 37);
      // четвертый ряд клавиатуры
      var row=document.createElement('tr');
      tbody.appendChild(row);
      // специальная клавиша Shift
      var cell=document.createElement('td');
      cell.setAttribute('colSpan',5);
      row.appendChild(cell);
      var button=document.createElement('input');
      button.type='button';
      button.value='Shift';
      button.id=this.id + '-lshift';
      button.style.width="100%";
      button.onclick=function () {this.keyboard.onShift(this);};
      button.keyboard=this;
      cell.appendChild(button);
      this.keylist.push(button);
      // обычные клавиши
      this._showrow(row, 37, 47);
      // специальная клавиша shift
      var cell=document.createElement('td');
      cell.setAttribute('colSpan',5);
      row.appendChild(cell);
      var button=document.createElement('input');
      button.type='button';
      button.value='Shift';
      button.id=this.id + '-rshift';
      button.style.width="100%";
      button.onclick=function () {this.keyboard.onShift(this);};
      button.keyboard=this;
      cell.appendChild(button);
      this.keylist.push(button);
      // последний ряд клавиатуры
      var row=document.createElement('tr');
      tbody.appendChild(row);
      // иммитация клавиши ctrl
      var cell=document.createElement('td');
      cell.setAttribute('colSpan',3);
      row.appendChild(cell);
      var button=document.createElement('input');
      button.type='button';
      button.value='Ctrl';
      button.disabled=true;
      button.style.width="100%";
      cell.appendChild(button);
      this.keylist.push(button);
      // иммитация клавиши alt
      var cell=document.createElement('td');
      cell.setAttribute('colSpan',3);
      row.appendChild(cell);
      var button=document.createElement('input');
      button.type='button';
      button.value='Alt';
      button.disabled=true;
      button.style.width="100%";
      cell.appendChild(button);
      this.keylist.push(button);
      // клавиша пробела
      var cell=document.createElement('td');
      cell.setAttribute('colSpan',18);
      row.appendChild(cell);
      var button=document.createElement('input');
      button.type='button';
      button.value=' ';
      button.id=this.id + '-space';
      button.style.width="100%";
      button.onclick=function () {this.keyboard.onSpace(this);};
      button.keyboard=this;
      cell.appendChild(button);
      this.keylist.push(button);
      // иммитация клавиши alt
      var cell=document.createElement('td');
      cell.setAttribute('colSpan',3);
      row.appendChild(cell);
      var button=document.createElement('input');
      button.type='button';
      button.value='Alt';
      button.disabled=true;
      button.style.width="100%";
      cell.appendChild(button);
      this.keylist.push(button);
      // иммитация клавиши ctrl
      var cell=document.createElement('td');
      cell.setAttribute('colSpan',3);
      row.appendChild(cell);
      var button=document.createElement('input');
      button.type='button';
      button.value='Ctrl';
      button.disabled=true;
      button.style.width="100%";
      cell.appendChild(button);
      this.keylist.push(button);
  }
  
  this.hide=function() {
    document.getElementById(this.id).style.display='none';
  }
  
  this.show=function() {
    document.getElementById(this.id).style.display='block';
  }
  
  this.applyLayout=function(layoutString) {
    for(var i=0; i<47; i++) {
      var id=this.id + '-' + i;
      var key=document.getElementById(id);
      key.value=layoutString.charAt(i);
    }
  }
  
  this.setLayout=function(lowcase, uppercase) {
    if(lowcase.length<47 || uppercase.length<47) { alert("Не удается установить раскладку: недостаточно символов") };
    this.layout=lowcase;
    this.LAYOUT=uppercase;
    this.isShift=false;
    this.applyLayout(this.layout);
  }
  
  this.setEntry=function(entryID) {
    if(entryID) {
      this.entry=document.getElementById(entryID);
    } else {
      this.entry=none;
    }
  }
  
  this.getKeyObjectByChar=function(val) {
    for(var i=0; i<this.keylist.length; i++) {
      if(this.keylist[i].value==val) {
        return this.keylist[i];
      }
    }
    return null;
  }
  
  this.theCursorPosition = function(ofThisInput) {
    // set a fallback cursor location
    var theCursorLocation = 0;
    // find the cursor location via IE method...
    if (document.selection) {
      ofThisInput.focus( );
      var theSelectionRange = document.selection.createRange( );
      theSelectionRange.moveStart('character', - ofThisInput.value.length);
      theCursorLocation = theSelectionRange.text.length;
    } else if (ofThisInput.selectionStart || ofThisInput.selectionStart == '0' ) {
      // or the FF way
      theCursorLocation = ofThisInput.selectionStart;
    }
    return theCursorLocation;
  }
  
  this.setCaretPosition=function(ctrl, pos){
    if(ctrl.setSelectionRange){
      ctrl.focus();
      ctrl.setSelectionRange(pos,pos);
    }
    else if (ctrl.createTextRange) {
      var range = ctrl.createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
  }
  
  this.insertChar=function(thisChar) {
    if(this.entry) {
      var currentPos = this.theCursorPosition (this.entry);
      var origValue = this.entry.value ;
      var newValue = origValue.substr(0, currentPos) + thisChar + origValue.substr(currentPos);
      this.entry.value = newValue;
      this.setCaretPosition(this.entry, currentPos+thisChar.length);
    }
  }
  
  this.backSpace=function() {
    if(this.entry) {
      var currentPos=this.theCursorPosition (this.entry);
      if (currentPos>=1) {
        var origValue = this.entry.value ;
        var newValue = origValue.substr(0, currentPos-1) + origValue.substr(currentPos);
        this.entry.value = newValue;
        this.setCaretPosition(this.entry, currentPos-1);
      }
    }
  }
  
  this.forEachButton=function(callbackFunction) {
    for(var i=0; i< this.keylist.length; i++) {
      callbackFunction(this.keylist[i]);
    }
  }
  
  // отображение и привязка
  if(parent) {
    this.mapto(parent);
  }
  
  if(entry) {
    this.setEntry(entry);
  }

}