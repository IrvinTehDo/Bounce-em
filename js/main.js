"use strict";

var app = app || {};

app.main = {
    WIDTH: 800,
    HEIGHT: 600,
    
    canvas: undefined,
    ctx: undefined,
    animationID: 0,
    
    //MARK - Initializers
    
    init: function(){
        this.canvas =document.querySelector('canvas');
        this.canvas.width = this.WIDTH;
        this.canvas.height = this.HEIGHT;
        this.ctx = this.canvas.getContext('2d');
        
        this.canvas.onmousedown  = this.doMouseDown.bind(this);
        
        this.update();
    },
    
    //MARK - Update Loop
    update: function(){
        this.animationID = requestAnimationFrame(this.update.bind(this));
        
        var dt = this.calculateDeltaTime();
        
        // Draw Loop
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0,0,this.WIDTH,this.HEIGHT);
    },
    
    // MARK - Listener Events
    doMouseDown: function(e){
        var mouse =getMouse(e);
        console.dir(mouse);
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
}; // END app.main