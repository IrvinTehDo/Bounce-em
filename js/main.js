"use strict";

var app = app || {};

app.main = {
    WIDTH: 800,
    HEIGHT: 600,
    
    canvas: undefined,
    ctx: undefined,
    animationID: 0 ,
    
    objects: [],
    
    GAME_STATE: Object.freeze({
        BEGIN: 0,
        DEFAULT: 1,
        MOVING: 2,
        ROUND_OVER: 3,
        REPEAT_LEVEL: 4,
        END: 5
    }),
    
    MENU_STATE: Object.freeze({
        MAIN: 0,
        PLAYING: 1,
        GAME_OVER: 2,
    }),
    
    OBJ_TYPE: Object.freeze({
        PLAYER: 0,
        BLOCK: 1,
        GOAL: 2,
        HORMOVING: 3,
        VERMOVING: 4,
    }),
    
    curGameState: null,
    curMenuState: null,
    ball: {},
    
    //MARK - Initializers
    
    init: function(){
        this.canvas = document.querySelector('canvas');
        this.canvas.width = this.WIDTH;
        this.canvas.height = this.HEIGHT;
        this.ctx = this.canvas.getContext('2d');
        
        this.canvas.onmousedown  = this.doMouseDown.bind(this);
        this.canvas.onmouseup = this.doMouseUp.bind(this);
        this.canvas.onmousemove = this.doMouseMove.bind(this);
        
        this.loadLevel1();
        
        this.curGameState = this.GAME_STATE.DEFAULT;
        this.curMenuState = this.MENU_STATE.MAIN;
        
        this.update();
    },
    
    //MARK - Update Loop
    update: function(){
        this.animationID = requestAnimationFrame(this.update.bind(this));
        var dt = this.calculateDeltaTime();
        
        //Update Loop
        //this.moveBall();
        
        if((this.curGameState == this.GAME_STATE.DEFAULT || this.curGameState == this.GAME_STATE.MOVING) && this.curMenuState == this.MENU_STATE.PLAYING){
            this.moveObj();
        }
        
        if(this.curGameState == this.GAME_STATE.MOVING && this.curMenuState == this.MENU_STATE.PLAYING){
            this.moveBall(); 
            
        }
        
        
        this.draw();
       
    },
    
    draw: function(){
        // Draw Loop
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0,0,this.WIDTH,this.HEIGHT);
        
        if(this.curMenuState == this.MENU_STATE.PLAYING){
            this.drawGame();
        }
        
        else if(this.curMenuState == this.MENU_STATE.MAIN){
            this.drawMenu();
        }
        
        else if(this.curMenuState == this.MENU_STATE.GAME_OVER){
            this.drawGameOver();
        }
    },
    
    drawGame: function(){
        this.ctx.save();
        
        for(var i = 0; i < this.objects.length; i++){
            if(this.objects[i].type == this.OBJ_TYPE.BLOCK || this.objects[i].type == this.OBJ_TYPE.HORMOVING || this.objects[i].type == this.OBJ_TYPE.VERMOVING){
                this.ctx.fillStyle = makeColor(0,255,0,1); 
                this.ctx.fillRect(this.objects[i].x,this.objects[i].y, this.objects[i].w, this.objects[i].h);
            }
            
            else if(this.objects[i].type == this.OBJ_TYPE.GOAL){
                this.ctx.fillStyle = makeColor(0,0,255,1);
                this.ctx.fillRect(this.objects[i].x,this.objects[i].y, this.objects[i].w, this.objects[i].h);
            }
                
        }  
        this.ctx.restore();
        this.drawBall(this.ctx);
    },
    
    drawMenu: function(){
        this.ctx.save();
        this.ctx.fillStyle = "Red";
        this.ctx.font = '48px Serif';
        this.ctx.fillText("Main Menu", this.canvas.width/2 - 125, this.canvas.height/2);
        this.ctx.font = '24px Serif';
        this.ctx.fillText("Click anywhere to play", this.canvas.width/2 - 125, this.canvas.height/2 + 50);
        this.ctx.restore();
    },
    
    drawGameOver: function(){
        this.ctx.save();
        this.ctx.fillStyle = "Red";
        this.ctx.font = '48px Serif';
        this.ctx.fillText("Game Over", this.canvas.width/2 - 125, this.canvas.height/2);
        this.ctx.font = '24px Serif';
        this.ctx.fillText("Click anywhere to go to main menu", this.canvas.width/2 - 175, this.canvas.height/2 + 50);
        this.ctx.restore();
        
    },
    
    // MARK - Listener Events
    doMouseDown: function(e){
        //Mouse Functions
        var mouse = getMouse(e);
        
        if(this.curMenuState == this.MENU_STATE.MAIN){
            this.loadLevel1();
            this.curMenuState = this.MENU_STATE.PLAYING;
            this.curGameState = this.GAME_STATE.DEFAULT; // Change this to "Start" when releasing finished product.
        }
        
        else if(this.curMenuState == this.MENU_STATE.GAME_OVER){
            this.curMenuState = this.MENU_STATE.MAIN;
        }
        
        else if(this.curMenuState == this.MENU_STATE.PLAYING && this.curGameState == this.GAME_STATE.DEFAULT){
            this.curGameState = this.GAME_STATE.MOVING;
            this.ball.rotationX = angleBetweenTwoPoints(mouse.x, mouse.y, this.ball.x, this.ball.y).x * -1;
            this.ball.rotationY = angleBetweenTwoPoints(mouse.x, mouse.y, this.ball.x, this.ball.y).y * -1;   
        }       
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
    
    
    makeObj: function(x, y, w, h, type){
        
        var speedX = 0;
        var speedY = 0;
        if(type == this.OBJ_TYPE.HORMOVING){
            speedX = 4;
        }
        
        else if(type == this.OBJ_TYPE.VERMOVING){
            speedY = 4;
        }
        
        return {x, y, w, h, type, speedX, speedY};
    },
    
    moveObj: function(){
        for(var i = 0; i < this.objects.length; i++){
            if(this.objects[i].type == this.OBJ_TYPE.HORMOVING || this.objects[i].type == this.OBJ_TYPE.VERMOVING){
                if(this.objects[i].x + this.objects[i].w > this.canvas.width || this.objects[i].x < 0){
                    this.objects[i].speedX *= -1;
                }
                
                if(this.objects[i].y + this.objects[i].h > this.canvas.height || this.objects[i].y <0){
                    this.objects[i].speedY *= -1;
                }
        
                this.objects[i].x += this.objects[i].speedX;
                this.objects[i].y += this.objects[i].speedY;
            }
        }
        
    },
    
    moveBall: function(){
        if(this.ball.x + this.ball.r > this.canvas.width || this.ball.x - this.ball.r < 0){
            this.ball.rotationX *= -1;
        }
        
        if(this.ball.y + this.ball.r > this.canvas.height || this.ball.y - this.ball.r < 0){
            this.ball.rotationY *= -1;
        }
        
        //If hit a block,
        for(var i = 0; i < this.objects.length; i++){
            if(this.objects[i].type == this.OBJ_TYPE.BLOCK || this.objects[i].type == this.OBJ_TYPE.HORMOVING || this.objects[i].type == this.OBJ_TYPE.VERMOVING){
                if(this.C2RCollides(this.ball, this.objects[i].x, this.objects[i].y, -4, this.objects[i].h)) //left
                    {
                        this.ball.rotationX *= -1;
                    }
            
                else if(this.C2RCollides(this.ball, this.objects[i].x, this.objects[i].y, this.objects[i].w, -4)) //top
                    {
                        this.ball.rotationY *= -1;
                    }
                else if(this.C2RCollides(this.ball, this.objects[i].x + this.objects[i].w, this.objects[i].y, 4, this.objects[i].h)) // right
                    {
                        this.ball.rotationX *= -1;
                    }
                        
                else if(this.C2RCollides(this.ball, this.objects[i].x, this.objects[i].y + this.objects[i].h, this.objects[i].w, 4)) // bottom
                    {
                        this.ball.rotationY *= -1;
                    }
            }
            
            else if(this.objects[i].type == this.OBJ_TYPE.GOAL && this.C2RCollides(this.ball, this.objects[i].x, this.objects[i].y, this.objects[i].w, this.objects[i].h)){
                this.curGameState = this.GAME_STATE.END;
                this.curMenuState = this.MENU_STATE.GAME_OVER;
            }
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
    
    makeBall: function(x, y, r, type, speed){
        
        var velocityX = 0;
        var velocityY = 0;
        var rotationX = 0;
        var rotationY = 0;
        
        return{x,y,r,type,speed,velocityX, velocityY, rotationX, rotationY};
    },
    
    C2RCollides: function(circle, rX, rY, rW, rH){
        //Check Collision between two objects or bounds  
        var distX = Math.abs(circle.x + circle.velocityX - rX-rW/2);
        var distY = Math.abs(circle.y + circle.velocityY - rY-rH/2);
        var dist = Math.sqrt(distX - rW/2) - Math.sqrt(distY - rH/2);
        
        if (distX >(rW/2 + circle.r)){return false;}
        if(distY > (rH/2 + circle.r)){return false;}  
        if(distX <= (rW/2)){return true;}
        if(distY <= (rH/2)){return true;}

        return ((distX * distX) + (distY * distY) <= (circle.r * circle.r));
    },
    
    loadLevel1: function(){
        this.objects = [];
        this.ball = {};
        
        this.objects.push(this.makeObj(this.canvas.width -300, this.canvas.height/2 - 100, 50, 100, this.OBJ_TYPE.BLOCK));
        this.objects.push(this.makeObj(25, 25, 25, 25, this.OBJ_TYPE.GOAL));       
        this.objects.push(this.makeObj(25, this.canvas.height - 100, 100, 25, this.OBJ_TYPE.HORMOVING));
        
        this.ball = this.makeBall(this.canvas.width/2, this.canvas.height/2, 10, this.OBJ_TYPE.PLAYER, 5);
    },
    
}; // END app.main