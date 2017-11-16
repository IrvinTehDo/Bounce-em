// The myKeys object will be in the global scope - it makes this script 
// really easy to reuse between projects

"use strict";

var myKeys = {};

myKeys.KEYBOARD = Object.freeze({
    "KEY_R": 82
});

// myKeys.keydown array to keep track of which keys are down
// this is called a "key daemon"
// main.js will "poll" this array every frame
// this works because JS has "sparse arrays" - not every language does
myKeys.keydown = [];


// event listeners
window.addEventListener("keydown",function(e){
	console.log("keydown=" + e.keyCode);
	myKeys.keydown[e.keyCode] = true;
});
	
window.addEventListener("keyup",function(e){
	console.log("keyup=" + e.keyCode);
	

	var char = String.fromCharCode(e.keyCode);

    //Quick Repeat
    if((char == "r" || char == "R") && (app.main.curMenuState == app.main.MENU_STATE.PLAYING)){
        app.main.loadLevel(app.main.currentLevel);
    }
    
    //Quit out of level
    if((char == "q" || char == "Q") && (app.main.curMenuState == app.main.MENU_STATE.PLAYING)){
        app.main.curMenuState = app.main.MENU_STATE.MAIN;
        app.main.curGameState = app.main.GAME_STATE.BEGIN;
    }
    
    if(myKeys.keydown[65] && myKeys.keydown[68] && myKeys.keydown[70]){
        initLocalStorage();
    }
    
    myKeys.keydown[e.keyCode] = false;
});
