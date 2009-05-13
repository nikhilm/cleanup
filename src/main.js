var Game = Class.create();

Object.extend(Game.prototype, {
    running : false,
    canvas : null,
    timerCanvas : null,
    startTime : 0,
    skipTime : 10*1000, // 30 seconds
    skipNext : true,
    
    initialize : function() {
        this.setupCanvas();
        this.attachEvents();
        
        this.startTime = new Date().getTime();
        this.sprite = new Sprite(0, 40, document.getElementById('chef'));
        this.sprite.dx = 2;
        
        this.sprite1 = new Sprite(0, 80, document.getElementById('chef'));
        
        setInterval(this.gameLoop.bind(this), 35);
    },
    
    setupCanvas : function() {
        elem = document.getElementById('game-canvas');
        if (elem && elem.getContext) {
            // Get the 2d context.
            // Remember: you can only initialize one context per element.
            this.canvas = elem.getContext('2d');
            if (!this.canvas) {
                console.log("Error setting up canvas");
            }
        }
        this.canvas.fillRect(0, 0, 600, 480);
        
        timer = document.getElementById('time-canvas');
        if (timer && timer.getContext) {
            // Get the 2d context.
            // Remember: you can only initialize one context per element.
            this.timerCanvas = timer.getContext('2d');
            if (!this.timerCanvas) {
                console.log("Error setting up timer canvas");
            }
        }
        this.timerCanvas.fillStyle = 'maroon';
        this.timerCanvas.fillRect(0, 0, 50, 300);
    },
    
    attachEvents : function() {
        elem = document.getElementById('game-canvas');
        elem.onclick = (function(evt) {
            this.startTime = new Date().getTime();
            this.running = evt.button == 0;
        }).bind(this);
    },
    
    gameLoop : function() {
        if(this.running) {
            this.sprite.animate(this.canvas);
            this.sprite1.animate(this.canvas);
            
            x = this.sprite1.rect().x;
            y = this.sprite1.rect().y;
            if( this.sprite.collidepoint(x, y) )
                console.log("HIT");
            this.updateCountdown();
        }
    },
    
    updateCountdown : function() {
        time = new Date().getTime()-this.startTime;
        if ( time > this.skipTime ) {
            this.skipNext = false;
        }
        else {
            frac = time/this.skipTime;
            this.timerCanvas.fillStyle = 'black';
            this.timerCanvas.fillRect(0, 0, 50, frac*300);
        }
    },
    
    toString : function () {
        return "Game";
    },
    
    keyPressed : function(evt) {
        if( !this.running )
            return;
        
        accepted = true;
        if( evt.keyCode == 38 ) // up arrow
            this.sprite.dy = -1;
        else if( evt.keyCode == 40 )
            this.sprite.dy = 1;
        else if( evt.keyCode == 37 )
            this.sprite.dx = -1;
        else if( evt.keyCode == 39 )
            this.sprite.dx = 1;
        else
            accepted = false;
            
        if( accepted ) {
            evt.stopPropagation();
            evt.preventDefault();
        }
    }
});

g = null;

window.onload = function() {
    g = new Game();
    document.onkeypress = g.keyPressed.bind(g);
};
