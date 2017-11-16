"use strict";
var app = app || {};

window.onload = function(){
    //If player hasn't played, create save file.
    if(window.localStorage.getItem('firstTime') == null){
        //init local storage
        initLocalStorage();
    }

    app.sound.init();
    app.main.sound = app.sound;
    app.main.init();
};

window.onblur = function(){
    app.main.pauseGame();
};

window.onfocus = function(){
    app.main.unpauseGame();
};

//Resets all progress to inital state.
function initLocalStorage(){
    window.localStorage.setItem("level1","0");
    window.localStorage.setItem("level2","0");
    window.localStorage.setItem("level3","0");
    window.localStorage.setItem("firstTime","1");
}