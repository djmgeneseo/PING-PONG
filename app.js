//global variables
var canvas;
var canvasContext;
var ballX = 350;
var ballY = 300;
var ballSpeedX = 5;
var ballSpeedY = 5;


const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 15;
const BALL_RAD = 10;
var paddle1Y = 300-PADDLE_HEIGHT/2;
var paddle2Y = 300-PADDLE_HEIGHT/2;

var playerScore1 = 0;
var playerScore2 = 0;
const WINNING_SCORE = 3;

var showingWinScreen = false;

//main
window.onload = function () {
	console.log("Obligatory 'Hello World!'");
	canvas = document.getElementById('gameCanvas'); //fishes for html canvas element by id
	canvasContext = canvas.getContext('2d'); //can draw graphics 

	//Drawing graphics and adding movement
	var fps = 60;
	setInterval(function() {moveEverything(); drawEverything();} /* inline function*/, 1000/fps);

	//During Win Screen
	canvas.addEventListener('click', handleMouseClick);

	//Movement of paddles with mouse
	canvas.addEventListener('mousemove', 
		function(evt) {
			var mousePos = calculateMousePos(evt); 
			paddle1Y = mousePos.y - PADDLE_HEIGHT/2; // HEEEERE
		} /* inline function*/) // evt = mouse's movement, which is passed into the function below
} // main

function handleMouseClick(evt) {
	if(showingWinScreen) {
		playerScore1 = 0;
		playerScore2 = 0;
		showingWinScreen = false;
	}
} // handleMouseClick(evt)

function calculateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return {
		x:mouseX,
		y:mouseY
	};

} // calculateMousePos(evt)

function drawNet() {
	for(var i=10;i<canvas.height; i+=40) {
		colorRect(canvas.width/2-1,i,2,20,'white');
	}
} // drawNet()

//draws graphics
function drawEverything() {
	//Black screen
	canvasContext.fillStyle = 'black';
	canvasContext.fillRect(0,0,canvas.width,canvas.height);

	// If player wins
	if(showingWinScreen) {
		canvasContext.fillStyle = 'white';
		if(playerScore1 >= WINNING_SCORE) {
			canvasContext.fillText("Left Player Won!", canvas.width/2-30, canvas.height/2-50);
		}
		else if(playerScore2 >= WINNING_SCORE) {
			canvasContext.fillText("Right Player Won!", canvas.width/2-30, canvas.height/2-50);
		}
		
		canvasContext.fillText("Click To Continue", canvas.width/2-29, canvas.height/2+50);
		return; //exits moveEverything function
	}  // if
	
	drawNet();

	// draw Paddle 1
	colorRect(10, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');

	// draw Paddle 2
	colorRect(canvas.width-25, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');

	// draw Ball
	colorCircle(ballX, ballY, BALL_RAD, 'white'); 

	// draw score stuff
	canvasContext.fillText(playerScore1, 175, 100);
	canvasContext.fillText(playerScore2, canvas.width-175, 100);
} // drawEverything()

function computerMovement() {
	var paddle2YCenter = paddle2Y+PADDLE_HEIGHT/2;

	// Attempt at smoothing: the -35 and +35 creates a 70 pixel span between the top and bottom of the paddle at which - if the ball is within this range - the paddle will not move.
	if(paddle2YCenter < ballY-35) {
		paddle2Y = paddle2Y + 7;
	}

	else if(paddle2YCenter > ballY+35) {
		paddle2Y = paddle2Y - 7;
	}
} // computerMovement()

function moveEverything() {
	if(showingWinScreen) {
		return; //exits moveEverything function
	}
	computerMovement();

	ballX = ballX + ballSpeedX; 
	ballY = ballY + ballSpeedY;

	// Where's the ball on the x-axis towards the RIGHT?
	if(ballX > canvas.width-25) {
		if(ballY > paddle2Y+2 /*below top of paddle*/ && ballY < paddle2Y+PADDLE_HEIGHT+2 /*above bottom of paddle1*/) {
			ballSpeedX = -ballSpeedX;

			//Incentivize the player to take risks by allowing them to control the Y velocity of the ball, depending on where the ball hits the paddle.
			//console.log("(ballY)", ballY, " - ", paddle2Y+PADDLE_HEIGHT/2, "(Middle of Paddle)");
			var deltaY = ballY-(paddle2Y+PADDLE_HEIGHT/2);
			//console.log("deltaY = ",  deltaY);
			ballSpeedY = deltaY * .35;
			//console.log("deltaY * .45 = ", ballSpeedY);
		}
		//It didn't hit paddle 2; score paddle 1!
		else {playerScore1++ /* Must be before ballReset */; ballReset();}
	} // if

	// Where's the ball on the x-axis towards the LEFT?
	if(ballX < 25) {
		if(ballY > paddle1Y+2 /*below top of paddle1*/ && ballY < paddle1Y+PADDLE_HEIGHT+2 /*above bottom of paddle1*/) {
			ballSpeedX = -ballSpeedX;

			//Incentivize the player to take risks by allowing them to control the Y velocity of the ball, depending on where the ball hits the paddle.
			var deltaY = ballY-(paddle1Y+PADDLE_HEIGHT/2);
			//console.log("deltaY = ",  deltaY);
			ballSpeedY = deltaY * .35;
			
		}
		// It didn't hit a paddle; score paddle 2!
		else{playerScore2++ /* Must be before ballReset */; ballReset();}
	} // if

	// Where's the ball on the y-coordinate?
	if(ballY < BALL_RAD || ballY > canvas.height-BALL_RAD) {
		ballSpeedY = -ballSpeedY;
	}
} // moveEverything()

function colorRect(leftX, topY, width, height, drawColor) {
	canvasContext.fillStyle = 'white';
	canvasContext.fillRect(leftX, topY, width, height, drawColor); //uses newly made variables. 
} // colorRect(leftX, topY, width, height, drawColor)

function colorCircle (centerX, centerY, radius, drawColor) {
	canvasContext.fillstyle = 'drawColor';
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true); //x and y coordinates start at center of the circle, 3rd number is the radius; so a 20 pixel diameter ball. drawing the arc in radians; Pi is half the circle, 2 Pi is the whole circle. True for false concerns whether its drawn clockwise or counter-clockwise.
	canvasContext.fill();
} // colorCircle (centerX, centerY, radius, drawColor)

function ballReset() {
	// Win Condition
	if(playerScore1 >= WINNING_SCORE || playerScore2 >= WINNING_SCORE) {
		showingWinScreen = true; 
	}

	ballX = canvas.width/2;
	ballY = canvas.height/2;

	if (ballSpeedY > 0) {
		ballSpeedY = 5;
	} else{ballSpeedY = -5}

	if(ballSpeedX > 0) {
		ballSpeedX = -5
	} else{ballSpeedX = 5}

	ballSpeedX = -ballSpeedX;
} // ballReset()