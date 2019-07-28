"use strict";

var viewportOffset = (document.body.clientWidth - 800) / 2;

(function(){
	var game = new Game();

	var previous = Date.now();
	var lag = 0;
	var frameTime = 1000 / 30;
	game.config = {};
	game.config.bulletSpeed = 10;
	game.config.maxEnemies = 50;
	game.enemies = [];
	game.config.enemiesSpawnRate = 20;
	game.config.enemySpeed = 5;

	document.onmousemove = handleMouseMove;

	game.spawner = setInterval(spawn, game.config.enemiesSpawnRate, game);
	

	setInterval(function(){
		var current = Date.now();
		var elapsed = current - previous;
		previous = current;
		lag += elapsed;

		var fps = 1000 / elapsed;

		devReport(lag, fps);

		//process input

		while(lag >= frameTime){
			update(game);
			lag -= frameTime;
		}

		//render
	}, frameTime, game);

})();

function devReport(lag, fps){
    document.getElementById("lag").innerHTML = Math.round(lag * 100) / 100;
    document.getElementById("fps").innerHTML = Math.round(fps * 100) / 100;
}

function update(game){
	for(var i = 0; i < game.enemies.length; i++){
		var enemy = game.enemies[i];
		var newY = enemy.position.y + game.config.enemySpeed;
		if(newY > game.world.height){
			game.enemies.splice(i, 1);
			var enGr = document.getElementsByClassName("enemy")[i];
			game.world.removeChild(enGr);
			i--;
			continue;
		}
		enemy.style.top = newY;
		enemy.position.y = newY;
	}
}

function spawn(game){
	if(game.config.maxEnemies === game.enemies.length){return;}
	var newEnemy = document.createElement("DIV");
	newEnemy.classList.add("enemy");
	newEnemy.classList.add("enemy-ship");
	game.world.appendChild(newEnemy);
	var left = game.world.leftOffset + Math.floor(Math.random() * game.world.width);
	newEnemy.style.left = left;
	newEnemy.position = { x: left, y: 0};
	game.enemies.push(newEnemy);
}

function Game(){
	this.world = document.getElementById("play-area");
	this.worldproperties = window.getComputedStyle(this.world);
	this.world.leftOffset = parseInt(this.worldproperties.left.slice(0, -2));
	this.world.width = parseInt(this.worldproperties.width.slice(0, -2));
	this.world.height = parseInt(this.worldproperties.height.slice(0, -2));
	return this;
};

function handleMouseMove(e) {
    var eDoc, doc, body;

    e = e || window.e;

    if (e.pageX == null && e.clientX != null) {
        eDoc = (e.target && e.target.ownerDocument) || document;
        doc = eDoc.documentElement;
        body = eDoc.body;

        e.pageX = e.clientX +
          (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
          (doc && doc.clientLeft || body && body.clientLeft || 0);
        e.pageY = e.clientY +
          (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
          (doc && doc.clientTop  || body && body.clientTop  || 0 );
    }

    // Use e.pageX / e.pageY here
    //var mouseXoutput = document.getElementById("mouseX");
    //var mouseYoutput = document.getElementById("mouseY");

   // mouseXoutput.innerHTML = e.pageX;
    //mouseYoutput.innerHTML = e.pageY;

    movePlayer(e.pageX - viewportOffset, e.pageY);
}

function movePlayer(x, y){
	var world = document.getElementById("play-area");
	var player = document.getElementById("player");
	var worldWidth = parseInt(window.getComputedStyle(world).width.slice(0, -2));
	var playerWidth = parseInt(window.getComputedStyle(player).width.slice(0, -2));
	var rightBound = worldWidth - playerWidth;

	//x adjust 
	x = x - playerWidth/2;
	if( x < 0 ){
		x = 0;	
	} 
	else if( x > rightBound - playerWidth/2 ){
		x = rightBound - playerWidth/2;
	}
	var string = "translate(" + x + "px," + y + "px)";//" rotateZ(45deg)";
	player.style.transform = string;
}