// Простой и неприлично плохой генератор случайных числе
// зато предсказуем и работает с целыми числами

"use strict";

function Randu(startNumber) {

  // Инициализация генератора псевдослучайных чисел
  this.randomize = function(startNumber) {
    startNumber = startNumber || parseInt( Math.random()*65535+1 );
    if(!(startNumber%2)) {
      startNumber = (startNumber + 65537);
    }
    this.val=startNumber;
    return this;
  }

  // Собственно запуск инициализации
  this.randomize(startNumber);

  // очередное случайное число в заданном диапазоне
  this.random = function(max, min) {
    min= min || 0;
    max= max || 65535;
    this.val=parseInt((this.val*65539) % 2147483648);
    return parseInt(this.val/10) % (max-min+1) + min;
  }
  
}
