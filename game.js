window.onload = function(){
	var canvas = document.getElementById("c"),
		c = canvas.getContext("2d"),
		height = canvas.height,
		width = canvas.width,
		key = [];
	
	document.addEventListener("keydown", function(e){
		key[e.keyCode] = true;
	});
	document.addEventListener("keyup", function(e){
		delete key[e.keyCode];
	});
	
	//sprite atlas
	img = document.getElementById("logoviejo");
	
	//keycodes
	RIGHT = 39;
	UP = 38;
	DOWN = 40;
	LEFT = 37;
	SPACE = 32;
	
	//stats
	score = 0;
	
	brick = [];
	for(var i=0; i<8; i++){
		brick[i] = new Array();
		for(var j=0; j<5; j++){
			brick[i][j]={
				tileWidth: 80,
				tileHeight: 45,
				x: (i*80),
				y: (j*45),
				broken: false,
				update:function(){
					if(!this.broken){
						if(ball.y < this.y + this.tileHeight && ball.x > this.x 
							&& ball.x < this.x + this.tileWidth && ball.y > this.y){
							ball.vy *= -1;
							this.broken = true;
							score += 10.5;
						}
					}
				},
				render: function(){
					if(!this.broken){
						c.drawImage(img,this.x,this.y,this.tileWidth,this.tileHeight,this.x,this.y,this.tileWidth,this.tileHeight);
					}
				}
			}
		}
	}
	
	player = {
		x: width*.5 - 32,
		y: height*.9,
		w: 64,
		h: 16,
	
		update: function(){
			if(key[RIGHT] && this.x + this.w < width){
				this.x += 4;
			}
			if(key[LEFT] && this.x > 0){
				this.x -= 4;
			}
		},
		render: function(){
			c.fillStyle = "green";
			c.strokeRect(this.x, this.y, this.w, this.h);
			c.fillRect(this.x,this.y,this.w,this.h);
		}
	}
	
	ball = {
		x: player.x + 32,
		y: player.y - 10,
		radius: 8,
		vx: 2,
		vy: -2,
		holding:true,
		
		reset: function(){
			this.holding = true;
			this.x = player.x + 32;
			this.y = player.y - 10;
		},
		
		update: function(){
			if(this.holding){
				this.x = player.x+32;
				if(key[SPACE]){
					this.holding = false;
				}
			}else{
				this.x += this.vx;
				this.y += this.vy;
			}
			
			if(this.y + this.radius >= player.y && this.y <= player.y + player.h &&
				(this.x + this.radius >= player.x && this.x - this.radius <= player.x + player.w && this.vy > 0)){
					this.vy *= -1;
			}
			
			if(this.x + this.radius >= width){
				this.vx *= -1;
			}
			else if(this.x - this.radius <= 0){
				this.vx *= -1;
			}
			else if(this.y + this.radius >= height + 50){
				this.reset();
			}
			else if(this.y - this.radius <= 0){
				this.vy *= -1;
			}
		},
		render: function(){
			c.fillStyle = "red";
			c.beginPath();
				c.arc(this.x, this.y, this.radius, 0,Math.PI*2);
			c.fill();
			c.stroke();
		}
	}
	
	function update(){
		player.update();
		ball.update();
		for(var i=0; i<8; i++){
			for(var j=0; j<5; j++){
			brick[i][j].update();
			}
		}
	}
	
	function render(){
		//c.fillStyle = "blue";
		var img = document.getElementById("logonuevo");
		var pat = c.createPattern(img,"no-repeat");
		c.fillStyle = pat;
		c.fillRect(0,0,width,height);
		c.fillStyle = "black";
		
		player.render();
		ball.render();
		for(var i=0; i<8; i++){
			for(var j=0; j<5; j++){
			brick[i][j].render();
			}
		}
		
		c.fillStyle = "white";
		c.fillText("Score: " + score, 16,height-16);
	}
	
	function run(){
		update();
		render();
		requestAnimationFrame(run);
	}
	
	run();
}