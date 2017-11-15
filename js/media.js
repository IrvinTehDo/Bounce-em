'use strict';
var app = app || {};

app.media = {
    IMAGES: Object.freeze({
        LEVEL1: this.loadImage('media/level1.png'),
        LEVEL2: this.loadImage('media/level2.png'),
        LEVEL3: this.loadImage('media/level3.png')
    }),
        
    loadImage: function(src){
        var img = new Image();
        img.src = src;
        
        return img;
    },

}
    
