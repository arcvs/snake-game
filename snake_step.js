"use strict"
var LEFT = 37;
var UP = 38;
var RIGHT = 39;
var DOWN = 40;

function Matrix(cols, rows) {
	this.cols = cols;
	this.rows = rows;
	this.sizeField = this.cols * this.rows;
	this.consturctField = function() {

		var field = [];
		var fieldDom = document.getElementById("field");

		for (var i = 0; i < this.cols; i++){
			field[i] = [];
			var p = document.createElement('p');
			fieldDom.appendChild(p);
			for (var j = 0; j < this.rows; j++){
				field[i][j] = j;
				var span = document.createElement('span');
				span.className = i + '-' + j;
				p.appendChild(span);
			}
		}
		return field; 
	};
};

function PartSnake(x, y) {
	this.color = '#';
	this.posX = x;
	this.posY = y;
};

function Snake() {

	this.bias = [{
		dir : 0,
		crd : 'x',
		x   : 2,
		y   : 1
	},{
		dir : 0,
		crd : 'x',
		x   : 1,
		y   : 1
	},{
		dir : 0,
		crd : 'x',
		x   : 0,
		y   : 1
	}];

	var self = this;

	this.visualization = function() {
		this.bias.forEach( function(iteam, i) {
			self.visual( i );
			//self.visual( i );
		});
	};

	this.visual = function (part) {

		var backX = this.bias[part].x;
		var backY = this.bias[part].y;

		if ( this.bias[part].crd == 'y' ) {
			this.bias[part].y += this.bias[part].dir;	
			var removeClass = backY + '-' + this.bias[part].x;
		} else {
			this.bias[part].x += this.bias[part].dir;	
			var removeClass = this.bias[part].y + '-' + backX;
		}

		$('.' + removeClass).removeClass('active'); 
		$('.' + this.bias[part].y + '-' + this.bias[part].x).addClass('active'); 

		return {dir: this.bias[part].dir, crd: this.bias[part].crd, x: backX, y: backY};
	};
}; 

var snake = new Snake();

function render( step ) {
	switch ( step ) {
		case UP    : snake.bias[0].dir = -1; snake.bias[0].crd = 'y'; break;
		case DOWN  : snake.bias[0].dir = +1; snake.bias[0].crd = 'y'; break;
		case LEFT  : snake.bias[0].dir = -1; snake.bias[0].crd = 'x'; break;
		case RIGHT : snake.bias[0].dir = +1; snake.bias[0].crd = 'x'; break;
	};
};

var field = new Matrix(7, 7);
var f = field.consturctField();

setInterval( function() {
	snake.visualization();
}, 1000 );

document.onkeydown = function(event) {
	if((event.keyCode >= 37) && (event.keyCode <= 40)) {
		render(event.keyCode);
	};
};
