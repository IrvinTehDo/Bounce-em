"use strict";
var app = app || {};

window.onload = function(){
    app.main.init();
};

window.onblur = function(){
    app.main.pauseGame();
};

window.onfocus = function(){
    app.main.unpauseGame();
};
