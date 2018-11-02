

////////////////////////////////////////////////////////////////////////////
// обработка движений паучка...
////////////////////////////////////////////////////////////////////////////

function cobController()
{
  this.timer=0;		// Объект таймера после первого вызова будет...
  this.delay=5;		// задержка между вызовами в нормальном режиме
  this.position=10;		// Текущая точка
  this.speed=3;		// со знаком определяет скорость и направление перемещения
  this.nestPos=50;		// Гнездо -- домашняя позиция
  this.topEvalution=200;	// Верхняя точка перемещения
  this.buttomEvalution=550;	// Нижняя точка перемещения
  this.goalPoint=400;	// Текущая точка назначения
}

function cobController_start()
{
  this.timer=setTimeout('cc.move()',1000);
}

function cobController_move()
{
  this.position+=this.speed;
  document.getElementById("cob").style.top = this.position;
  document.getElementById("thread").style.height = this.position>50 ? this.position-50 : 0;
  // Определяемся куда хотим дальше двигаться...
  if((this.goalPoint-this.position)*this.speed<0)
  { // тут мы оказались если пересекли точку назначения
    // определяем куда и с какой скоростью драпать далее
    this.goalPoint=Math.round(Math.random()*(this.buttomEvalution-this.topEvalution)+this.topEvalution);
    this.speed=Math.round(Math.random()*5+1);
    if((this.goalPoint-this.position)<0) {this.speed=-this.speed;}
    // И планируем следующее движение через какое-то время...
    clearTimeout(this.timer);
    this.timer=setTimeout('cc.move()',Math.round(1000+Math.random()*10000));
    //Дальше нам ничего не требуется...
    return;
  }
  // Тут мы оказались если продолжаем обычное движение...
  clearTimeout(this.timer);
  this.timer=setTimeout('cc.move()',this.delay);
}

function cobController_escape()
{
  this.goalPoint=this.nestPos;
  this.speed=-10;
  clearTimeout(this.timer);
  this.timer=setTimeout('cc.move()',this.delay);
}

cobController.prototype.move=cobController_move;
cobController.prototype.escape=cobController_escape;
cobController.prototype.start=cobController_start;

cc = new cobController;



////////////////////////////////////////////////////////////////////////////
// Вызывается по событию onLoad
////////////////////////////////////////////////////////////////////////////

function initialize()
{
  cc.start();
  printVerse("motto");
}
