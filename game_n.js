"use strict"

var LEFT    = 37;
var UP      = 38;
var RIGHT   = 39;
var DOWN    = 40;
var PAUSE   = 32;

function pip(x,y){
  return x + y;
}

function Field(cols, rows) {
	this.cols = cols;
	this.rows = rows;
	this.numberSectors = this.cols * this.rows;

	this.hunger = true;
  this.numberSectorMeat;
  this.cells;
  this.generationMap();
};

Field.prototype.generationMap = function() {
	for (var i = 0; i < this.numberSectors; i++) 
		$('#gameZone').append('<div>');

  $('#gameZone').css('width', this.cols * 15 + this.cols);

  this.cells = $("#gameZone").children();
};

Field.prototype.generationMeat = function() {
	this.hunger = false;
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
	this.numberSectorMeat = getRandomInt(0, this.numberSectors - 1);
	this.cells[this.numberSectorMeat].className = 'pig';
};

function converterPositionToAxes(field, a) {
  var x = a % field.cols;
  var y = Math.floor(a / field.cols);
  //console.log({x: x, y: y});
  return {x: x, y: y};
}

function converterAxesToPosition(field, a, b) {
  var position = b * field.cols + a;
  //console.log(position);
  return position;
}

function Python(game, field) {

	this.direction = {x : 0, y : 0};
  this.body = this.setStartPositionFild(field);
  this.nextStepAxes;

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
      this.body[i] = this.nextStepAxes || backStep;
    }

    if (game.gameover) { 
      return 0; 
    }

    field.cells[this.body[i]].className = 'active';

    if (this.direction.x || this.direction.y) {
      field.cells[backStep].className = '';
      return backStep;
    }
  }
}

Python.prototype.render = function() {
  var self = this;
  this.body.forEach(function(iteam, i) {
    self.nextStepAxes = self._step(i);
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
  return [position, position-1, position-2, position-3, position-4, position-5];
}

Python.prototype.deadLoop = function(positionHead) {
  this.body.forEach(function(posPart, i){
    if (positionHead === posPart && i !== 0) {
      game.gameover = 1;
      field.cells[posPart].style.background = 'red';
    }
  });
}

Python.prototype.eatsMeat = function(positionHead) {
  if (positionHead === field.numberSectorMeat) {
    console.log('eat');
    this.body.push(new Pixel(bodyTailX, bodyTailY));
    this.field.hunger = true;
    field.cells[this.field.numberSectorMeat].className = '';
    this.speed -= 100;
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

  python.render();

  var self = this;

	var timerIteration = setInterval( function() {

    if ( field.hunger ) field.generationMeat(python.body);

		if(self.active && !self.gameover) { 
      python.render();
    } else {
      //clearInterval( timerIteration ); 
		}
	}, self.speed);
};

Game.prototype.start = function() {
  this.active = 1;
}
Game.prototype.pause = function() {
  this.active = (this.active === 0) ? 1 : 0;
}

var game = new Game();

var field = new Field(14, 10); //field.generationMap();
var python = new Python(game, field);

game.run(field, python);

function dispatcherEventKey(step) {
	switch ( step ) {
		case UP      : python.direction = {x : 0, y : -1}; game.start(); break;
		case DOWN    : python.direction = {x : 0, y : +1}; game.start(); break;
		case LEFT    : python.direction = {x : -1, y : 0}; game.start(); break;
		case RIGHT   : python.direction = {x : +1, y : 0}; game.start(); break;
		case PAUSE   : game.pause(); break;
	};
};

document.onkeydown = function(event) {
  //console.log(event.keyCode);
	if((event.keyCode >= 32) && (event.keyCode <= 40)) {
    dispatcherEventKey(event.keyCode);
	};
};









function Snake( field ) {

	var self = this;

	this.numberSectorHead;

  this.visualization = function() {
		this.body.forEach( function(iteam, i) {
			//if ( self.activity ) self._tempPosition = self._render( i );
    });
  };
	
	var fieldDOM = $("#gameZone").children();
	
	this._render = function(part) {

		if (!this.directionHead.x && !this.directionHead.y) {
			fieldDOM[ this.body[part].y  + this.body[part].x ].className = 'active';
			return false;
		}

		var lengthSnake = this.body.length - 1;

		var tempX = this.body[part].x;
		var tempY = this.body[part].y;

    if ( part == 0 ) {

			this.body[0].x += this.directionHead.x;
			this.body[0].y += this.directionHead.y * this.field.cols;

			this.throughFaces();
			this.numberSectorHead = this.body[0].x + this.body[0].y;
			this.loop();

			this.eatsMeat( this.body[lengthSnake].x, this.body[lengthSnake].y );

			//if ( !this.activity ) return;
		} else {
			this.body[part].x = this._tempPosition.x;
			this.body[part].y = this._tempPosition.y;
		}

		fieldDOM[ this.body[part].y  + this.body[part].x ].className = 'active';
		fieldDOM[ tempY + tempX ].className = '';
		
		return {x: tempX, y: tempY};
	};
}; 

Snake.prototype.eatsMeat = function(bodyTailX, bodyTailY) {
	if (this.numberSectorHead == this.field.numberSectorMeat) {
		this.body.push( new Pixel( bodyTailX, bodyTailY ) );
		this.field.hunger = true;
		$("#gameZone").children()[this.field.numberSectorMeat].className = '';
		this.speed -= 100;
	}
};

Snake.prototype.sleep = function() {
	//this.pauseSnake = ( this.pauseSnake ) ? false : this.directionHead;
	this.directionHead = {x: 0, y: 0};
};
