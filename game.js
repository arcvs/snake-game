"use strict"

var LEFT    = 37;
var UP      = 38;
var RIGHT   = 39;
var DOWN    = 40;
var PAUSE   = 32;
var BUFFER_KEY;

var gameBlockId = $('#gameZone');
var statsBlockId = $('#stats');


function Field(cols, rows) {
  this.cols = cols;
  this.rows = rows;
  this.numberSectors = this.cols * this.rows;

  this.hunger = false;
  this.positionMeat;
  this.cells;
  this.generationMap();
};

Field.prototype.generationMap = function() {
  for (var i = 0; i < this.numberSectors; i++) {
    gameBlockId.append('<div>');
  }

  gameBlockId.css('width', this.cols * 15 + this.cols);

  this.cells = gameBlockId.children();
};

Field.prototype.generationMeat = function(python) {

  var self = this;

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  (function checkPositionPythonAndMeat() {
    self.positionMeat = getRandomInt(0, self.numberSectors - 1);
    python.forEach(function(item, i){
      if (item === self.positionMeat) {
        return checkPositionPythonAndMeat();
      }
    })
  })()

  this.hunger = false;
  this.cells[this.positionMeat].className = 'meat';
};

function converterPositionToAxes(field, a) {
  var x = a % field.cols;
  var y = Math.floor(a / field.cols);
  return {x: x, y: y};
};

function converterAxesToPosition(field, a, b) {
  var position = b * field.cols + a;
  return position;
};

function Python(game, field) {
  this.direction = {x : 0, y : 0};
  this.body = this.setStartPositionFild(field);
  this.nextPositionStep = NaN;

  this._step = function(i) {

    var backStep = this.body[i];

    if(i === 0) {
      var head = converterPositionToAxes(field, this.body[i]);
      head.x += this.direction.x;
      head.y += this.direction.y;
      this.throughWallsOn(head);
      this.body[i] = converterAxesToPosition(field, head.x, head.y);

      this.deadLoop(this.body[i]);
      this.eatsMeat(this.body[i]);
    } else {
      // NaN - обеспечивает правильную работу части тела в нулевой позиции 
      this.body[i] = isNaN(this.nextPositionStep) ? backStep : this.nextPositionStep;
    }

    if (game.gameover) { 
      return 0; 
    }

    field.cells[this.body[i]].className = 'active' + (!i?0:'');

    if (this.direction.x || this.direction.y) {
      field.cells[backStep].className = '';
      return backStep;
    }
  }
};

Python.prototype.render = function() {
  var self = this;
  this.body.forEach(function(iteam, i) {
    self.nextPositionStep = self._step(i);
  });
}

Python.prototype.throughWallsOn = function(head) {
  if (head.x < 0) head.x = field.cols - 1;
  if (head.y < 0) head.y = field.rows - 1;
  if (head.x >= field.cols) head.x = 0;
  if (head.y >= field.rows) head.y = 0;
};

Python.prototype.setStartPositionFild = function(field) {
  var position = field.cols * field.rows / 2 - field.cols / 2;
  return [position, position-1];
};

Python.prototype.deadLoop = function(positionHead) {
  this.body.forEach(function(posPart, i){
    if (positionHead === posPart && i !== 0) {
      game.gameover = 1;
      field.cells[posPart].style.background = 'red';
    }
  });
};

Python.prototype.eatsMeat = function(positionHead) {
  if (positionHead === field.positionMeat) {
    this.body.push(0);
    field.hunger = true;
  }
};

function Game(){
  this.speed = 200;
  this.active = 0;
  this.gameover = 0;
  //this.level = 1;
  this.life = 5;
}

Game.prototype.run = function(field, python) {

  var self = this;

  python.render();
  statsBlockId.text('Speed: ' + this.speed + 'ms');

  (function setTime(){
    field.generationMeat(python.body);
    var timerIteration = setInterval( function() {
      if (field.hunger) {
        self.speed -= 5;
        statsBlockId.text('Speed: ' + self.speed + 'ms');
        clearInterval( timerIteration );
        setTime();
      }
      if(self.active && !self.gameover) { 
        python.render();
      }
    }, self.speed);
  })()
};

Game.prototype.start = function() {
  this.active = 1;
}

Game.prototype.pause = function() {
  this.active = (this.active === 0) ? 1 : 0;
}

function dispatcherEventKey(keyCode) {

  if(BUFFER_KEY === DOWN && keyCode === UP || BUFFER_KEY === UP && keyCode === DOWN) {
    return 1;
  }

  if(BUFFER_KEY === RIGHT && keyCode === LEFT || BUFFER_KEY === LEFT && keyCode === RIGHT) {
    return 1;
  }

  BUFFER_KEY = keyCode;

  switch (keyCode) {
    case UP      : python.direction = {x : 0, y : -1}; game.start(); break;
    case DOWN    : python.direction = {x : 0, y : +1}; game.start(); break;
    case LEFT    : python.direction = {x : -1, y : 0}; game.start(); break;
    case RIGHT   : python.direction = {x : +1, y : 0}; game.start(); break;
    case PAUSE   : game.pause(); break;
  };
};

document.onkeydown = function(event) {
  if((event.keyCode >= 32) && (event.keyCode <= 40)) {
    dispatcherEventKey(event.keyCode);
  };
};

var game = new Game();
var field = new Field(28, 20);
var python = new Python(game, field);
game.run(field, python);
