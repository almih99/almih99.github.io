/*
 * Инициализация страницы. Не зависит от того, какая страница
 */

function init() {
  adjustWidth();
  instaniateKeyboard();
  makeWordList();
  newTask();
  document.onmousemove = getMouseXY;
}

function instaniateKeyboard() {
  k=new keyboard('keyboard', 'entry');
  k.setLayout(";+ěščřžýáíé=´¨qwertyuiopú)asdfghjklů§zxcvbnm,.-", ';+ĚŠČŘŽÝÁÍÉ=´¨QWERTYUIOPÚ(ASDFGHJKLŮ!ZXCVBNM?:_');
  k.getKeyObjectByChar('Tab').disabled=true;
  // k.getKeyObjectByChar(' ').disabled=true;
  k.onEnter=checkAnswer;
  k.keyboardTabe.align='center';
  k.forEachButton(function(key){key.style.fontFamily='serif';});
}

function adjustWidth() {
  // в зависимости от ширины экрана выбираем отображать в блоке или занять всё пространство
  if((document.compatMode=='CSS1Compat' && !window.opera?document.documentElement.clientWidth:document.body.clientWidth)<900) {
    document.getElementById('content').className='narrow-content';
    document.getElementById('displacer').style.display='none';
    document.body.style.backgroundColor='white';
  }
}