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
        moving: false,
        isBall: true,
    },
    
    block: {
        x: 0,
        y: 0,
        w: 30,
        h: 100,
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
        
        this.block.x = this.canvas.width - 100;
        this.block.y = this.canvas.height/2 - this.block.h/2;
        
        
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
        if(this.ball.moving){
            this.moveBall();
        }
        
        // Draw Loop
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0,0,this.WIDTH,this.HEIGHT);
        
        this.ctx.save();
        this.ctx.fillStyle = makeColor(0,255,0,1);
        this.ctx.fillRect(this.block.x,this.block.y, this.block.w, this.block.h);
        this.ctx.restore();
        this.drawBall(this.ctx);
    },
    
    // MARK - Listener Events
    doMouseDown: function(e){
        //Mouse Functions
        this.ball.moving = true;
        var mouse = getMouse(e);
        //console.dir(mouse);
        //console.log(angleBetweenTwoPoints());
        this.ball.rotationX = angleBetweenTwoPoints(mouse.x, mouse.y, this.ball.x, this.ball.y).x * -1;
        this.ball.rotationY = angleBetweenTwoPoints(mouse.x, mouse.y, this.ball.x, this.ball.y).y * -1;        
        
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
        
        this.checkC2RCollision(this.ball, this.block);
        
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
    
    checkC2RCollision: function(circle, rect){
        //Check Collision between two objects or bounds  
        var distX = Math.abs(circle.x - rect.x-rect.w/2);
        var distY = Math.abs(circle.y - rect.y-rect.h/2);
        var dist = Math.sqrt(distX - rect.w/2) - Math.sqrt(distY - rect.h/2);
        
        if (distX >(rect.w/2 + circle.r)){return;}
        if(distY > (rect.h/2 + circle.r)){return;}
        
        if(distX <= (rect.w/2)){
            if(circle.isBall){
                this.ball.rotationX *= -1;
                return;
            }
        }
        if(distY <= (rect.h/2)){
            if(circle.isBall){
                this.ball.rotationY *= -1;
                return;
            }
        }
        
        if(distX * distX + distY * distY <= (circle.r * circle.r)){
            if(circle.isBall){
                this.ball.rotationX *= -1;
                this.ball.rotationY *= -1;
                
            }
        }
    },
}; // END app.main