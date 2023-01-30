//PlayingField.js
function main(){
	//Retrieve <canvas> element
	var canvas = document.getElementById('example');
	if (!canvas){
		console.log('Failed to retrieve the <canvas> element');
		return;
	}
	
	//Get the rendering context for 2DCG
	var ctx = canvas.getContext('2d');
	
	//Draw a black rectangle
	ctx.fillStyle = 'rgba(0,0,0,1.0)'; 	//Set a black colour
	ctx.fillRect(10,10,150,150); //Fill a rectangle with the colour
	
	//Draw white circle
	var X = canvas.width/2 + 5;
	var Y = canvas.height/2 + 5;
	var R = 55;
	ctx.beginPath();
	ctx.arc(X, Y, R, 0, 2*Math.PI, false);
	ctx.lineWidth=2;
	ctx.fillStyle='rgba(255,255,255,1.0)';
	ctx.fill();
	
	//Draw red circle on circumference of circle
	var X = canvas.width/3 - 15;
	var Y = canvas.height/3;
	var R = 5;
	ctx.beginPath();
	ctx.arc(X, Y, R, 0, 2*Math.PI, false);
	ctx.lineWidth=2;
	ctx.fillStyle='rgba(255,0,0,1.0)';
	ctx.fill();

	//Draw pink circle on circumference of circle
	var X = canvas.width - 50;
	var Y = canvas.height/4 - 10;
	var R = 5;
	ctx.beginPath();
	ctx.arc(X, Y, R, 0, 2*Math.PI, false);
	ctx.lineWidth=2;
	ctx.fillStyle='rgba(255,0,255,1.0)';
	ctx.fill();
	
	//Draw blue circle on circumference of circle
	var X = canvas.width - 20;
	var Y = canvas.height/3 + 10;
	var R = 5;
	ctx.beginPath();
	ctx.arc(X, Y, R, 0, 2*Math.PI, false);
	ctx.lineWidth=2;
	ctx.fillStyle='rgba(0,0,255,1.0)';
	ctx.fill();

	//Draw green circle on circumference of circle
	var X = canvas.width - 20;
	var Y = canvas.height/2 + 30;
	var R = 5;
	ctx.beginPath();
	ctx.arc(X, Y, R, 0, 2*Math.PI, false);
	ctx.lineWidth=2;
	ctx.fillStyle='rgba(0,255,0,1.0)';
	ctx.fill();

	//Draw yellow circle on circumference of circle
	var X = canvas.width/2 - 5;
	var Y = canvas.height - 17;
	var R = 5;
	ctx.beginPath();
	ctx.arc(X, Y, R, 0, 2*Math.PI, false);
	ctx.lineWidth=2;
	ctx.fillStyle='rgba(255,255,0,1.0)';
	ctx.fill();
}
