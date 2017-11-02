"use strict";

var app = app || {};

app.main = {
    WIDTH: 800,
    HEIGHT: 600,
    
    canvas: undefined,
    ctx: undefined,
    animationID: 0 ,
    
    GAME_STATE: Object.freeze({
        BEGIN: 0,
        DEFAULT: 1,
        MOVING: 2,
        ROUND_OVER: 3,
        REPEAT_LEVEL: 4,
        END: 5
    }),
    
    ball: {
        x: 0,
        y: 0,
        r: 0,
        speed: 5,
        velocityX:0,
        velocityY:0,
        rotationX: 1, // -1 = left, 1 = right
        rotationY: 1, // -1 = down, 1 = up
    },
    
    //MARK - Initializers
    
    init: function(){
        this.canvas = document.querySelector('canvas');
        this.canvas.width = this.WIDTH;
        this.canvas.height = this.HEIGHT;
        this.ctx = this.canvas.getContext('2d');
        
        this.canvas.onmousedown  = this.doMouseDown.bind(this);
        this.canvas.onmouseup = this.doMouseUp.bind(this);
        this.canvas.onmousemove = this.doMouseMove.bind(this);
        
        this.ball.x = this.canvas.width/2;
        this.ball.y = this.canvas.height/2;
        this.ball.r = 10;
        
        this.update();
    },
    
    //MARK - Update Loop
    update: function(){
        this.animationID = requestAnimationFrame(this.update.bind(this));
        
        var dt = this.calculateDeltaTime();
        
        //Update Loop
        //this.moveBall();
        
        // Draw Loop
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0,0,this.WIDTH,this.HEIGHT);
        
        this.drawBall(this.ctx);
    },
    
    // MARK - Listener Events
    doMouseDown: function(e){
        //Mouse Functions
        var mouse = getMouse(e);
        console.dir(mouse);
        console.log(angleBetweenTwoPoints(mouse.x, mouse.y, this.ball.x, this.ball.y));
    },
    
    doMouseUp: function(e){
        
    },
    
    doMouseMove: function(e){
        
    },
    
    // MARK - Helper Functions
    calculateDeltaTime: function(){
        var now, fps
        now = performance.now();
        fps = 1000/ (now - this.lastTime);
        fps = clamp(fps, 12, 60); 
        this.lastTime = now;
        return 1/fps;
    },
    
    moveBall: function(){
        if(this.ball.x + this.ball.r > this.canvas.width || this.ball.x - this.ball.r < 0){
            this.ball.rotationX *= -1;
        }
        
        if(this.ball.y + this.ball.r > this.canvas.height || this.ball.y - this.ball.r < 0){
            this.ball.rotationY *= -1;
        }
        
        this.ball.velocityX = this.ball.speed * this.ball.rotationX;
        this.ball.velocityY = this.ball.speed * this.ball.rotationY;
        
        this.ball.x += this.ball.velocityX;
        this.ball.y += this.ball.velocityY;
        
    },
    
    drawBall: function(ctx){
        ctx.save();
        ctx.fillStyle = makeColor(255,0,0,1);
        ctx.beginPath();
        ctx.arc(this.ball.x, this.ball.y, this.ball.r, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    },
    
    checkCollision: function(obj1, obj2){
        //Check Collision between two objects or bounds  
    },
}; // END app.main