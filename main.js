

////////////////////////////////////////////////////////////////////////////
// обработка движений паучка...
////////////////////////////////////////////////////////////////////////////
cobControl = {
  timer: undefined,		// Объект таймера после первого вызова будет...
  delay: 5,		        // задержка между вызовами в нормальном режиме
  position: 50,		    // Текущая точка
  speed: 3,		        // со знаком определяет скорость и направление перемещения
  nestPos: 50,		    // Гнездо -- домашняя позиция
  topEvalution: 200,	// Верхняя точка перемещения
  buttomEvalution: 550,	// Нижняя точка перемещения
  goalPoint: 400,	    // Текущая точка назначения
  cob: undefined,
  thread: undefined,
  // this function makes one step and set next step in a queue
  move: function() {
    this.position+=this.speed;
    this.cob.style.top = this.position + "px";
    this.thread.style.height = this.position>50 ? (this.position-50) + "px" : "0px";
    // Определяемся куда хотим дальше двигаться...
    if((this.goalPoint-this.position)*this.speed<0)
    { // тут мы оказались если пересекли точку назначения
      // определяем куда и с какой скоростью драпать далее
      this.goalPoint=Math.round(Math.random()*(this.buttomEvalution-this.topEvalution)+this.topEvalution);
      this.speed=Math.round(Math.random()*5+1);
      if((this.goalPoint-this.position)<0) {this.speed=-this.speed;}
      // И планируем следующее движение через какое-то время...
      this.timer=setTimeout(function(){cobControl.move();},Math.round(1000+Math.random()*10000));
      //Дальше нам ничего не требуется...
      return;
    }
    // Тут мы оказались если продолжаем обычное движение...
    this.timer=setTimeout(function(){cobControl.move();},this.delay);
  },
  // режим убегания
  escape: function() {
    this.goalPoint=this.nestPos;
    this.speed=-10;
    clearTimeout(this.timer);
    this.timer=setTimeout(function(){cobControl.move();},this.delay);
  },
  // инициализация и запуск
  start: function() {
    if(this.cob) return;
    this.thread=document.createElement('div');
    this.thread.className="cobthread";
    document.body.appendChild(this.thread);
    this.cob=document.createElement('div');
    this.cob.className="cob";
    this.cob.addEventListener("mouseover", function(){cobControl.escape();});
    document.body.appendChild(this.cob);
    this.timer=setTimeout(function(){cobControl.move();},1000);
  }
}

////////////////////////////////////////////////////////////////////////////
// Вызывается по событию onLoad
////////////////////////////////////////////////////////////////////////////

function initialize()
{
  cobControl.start();
  printVerse("motto");
}
