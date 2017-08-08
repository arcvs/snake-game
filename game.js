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
};

Field.prototype.generationMap = function() {
	for (var i = 0; i < this.numberSectors; i++) 
		$('#gameZone').append('<div>');

	$('#gameZone').css('width', this.cols * 15 + this.cols);
};

Field.prototype.generationMeat = function() {
	this.hunger = false;
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
	this.numberSectorMeat = getRandomInt(0, this.numberSectors - 1);
	$("#gameZone").children()[ this.numberSectorMeat ].className = 'pig';
};

function Pixel(x, y) {
	this.color = '#';
	this.x = x;
	this.y = y;
};

function Snake( field ) {

	var self = this;

	this.field = field;
	this.activity = true;
	this.speed = 200;

	this.body || this.startPositionBody();
	this.directionHead = { x : 0, y : 0 };
	this.numberSectorHead;

	this.stomach = [];

	this._tempPosition = {};
	this.visualization = function() {
		this.body.forEach( function(iteam, i) {
			if ( self.activity ) self._tempPosition = self._render( i );
		});
	};
	
	var fieldDOM = $("#gameZone").children();
	
	this._render = function(part) {

		if ( !this.directionHead.x && !this.directionHead.y ) {
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

			if ( !this.activity ) return;
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
	if ( this.numberSectorHead == this.field.numberSectorMeat ) {
		this.body.push( new Pixel( bodyTailX, bodyTailY ) );
		this.field.hunger = true;
		$("#gameZone").children()[this.field.numberSectorMeat].className = '';
		this.speed -= 100;
	}
};

Snake.prototype.throughFaces = function() {
	if ( this.body[0].x < 0 ) this.body[0].x = this.field.cols - 1;
	if ( this.body[0].x > this.field.cols - 1 ) this.body[0].x = 0;
	if ( this.body[0].y < 0 ) this.body[0].y = this.field.cols * this.field.rows - this.field.cols;
	if ( this.body[0].y > this.field.cols * this.field.rows - this.field.cols ) this.body[0].y = 0;
};

Snake.prototype.loop = function() {
	var self = this;
	this.body.forEach(function(partBody, i){
		if ( self.numberSectorHead == (partBody.x + partBody.y) && i != 0 )
			self.bloodyDeath();
	});
};

Snake.prototype.sleep = function() {
	//this.pauseSnake = ( this.pauseSnake ) ? false : this.directionHead;
	this.directionHead = {x: 0, y: 0};
};

Snake.prototype.bloodyDeath = function() {
	this.activity = false;
	$("#gameZone").children()[this.numberSectorHead].style.background = 'red';
};

Snake.prototype.startPositionBody = function() {
	var x = Math.floor( this.field.cols / 2 );
	var y = Math.floor( this.field.rows / 2 );
	this.body = [{ x: x, y: y * this.field.cols },{ x: x - 1, y: y * this.field.cols }];
};

Snake.prototype.noBackStep = function() {
};

Snake.prototype.upTimeInterval = function() {
};

Snake.prototype.run = function() {
	var self = this;
	var timerIteration = setInterval( function() {

		if ( self.field.hunger ) self.field.generationMeat(self.body);

		if ( self.status ) { 
			clearInterval( timerIteration ); 
		} else {
			self.visualization();
		}
	}, self.speed );
};

var field = new Field( 10, 8   );

field.generationMap();

var snake = new Snake( field );
snake.run();

function dispatcher(step) {
	switch ( step ) {
		case UP      : snake.directionHead = {x : 0, y : -1}; break;
		case DOWN    : snake.directionHead = {x : 0, y : +1}; break;
		case LEFT    : snake.directionHead = {x : -1, y : 0}; break;
		case RIGHT   : snake.directionHead = {x : +1, y : 0}; break;
		case PAUSE   : snake.sleep(); break;
	};
};

document.onkeydown = function(event) {
	if((event.keyCode >= 32) && (event.keyCode <= 40)) {
		dispatcher(event.keyCode);
	};
};
