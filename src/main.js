var Game = Class.create();

Object.extend(Game.prototype, {
    running : false,
    canvas : null,
    paused : false,
               
    state : null,
    nextState : null,
    
    lives : 3,
               
    bg : null,
    
    initialize : function() {
        this.bg = document.getElementById('background');
        this.setupCanvas();
        this.attachEvents();
        
        setInterval(this.gameLoop.bind(this), 35);
        
        this.nextState = new MenuState();
        this.running = true;
    },
    
    setupCanvas : function() {
        var elem = document.getElementById('game-canvas');
        if (elem && elem.getContext) {
            // Get the 2d context.
            // Remember: you can only initialize one context per element.
            this.canvas = elem.getContext('2d');
            if (!this.canvas) {
                console.log("Error setting up canvas");
            }
        }
        this.canvas.fillRect(0, 0, 600, 480);
        
    },
    
    attachEvents : function() {
        
        document.onkeypress = this.keyPressed.bind(this);
        
        var elem = document.getElementById('game-canvas');
    },
               
    update : function() {
        if( this.state != this.nextState ) {
            this.state = this.nextState;
            this.state.draw(this.canvas);
        }
        
        /*this.sprites.each( (function(grp) {
            grp.each( (function(sprite) {
                //this.canvas.fillStyle = 'black';
                //this.canvas.fillRect(sprite.rect.x, sprite.rect.y, sprite.rect.width, sprite.rect.height);
                sprite.erase(this.canvas);
            }).bind(this));
        }).bind(this));*/
        
        this.state.update(this);
    },
                      
    draw : function(canvas) {
        canvas.fillStyle = 'black';
        canvas.drawImage(this.bg, 0, 0, 600, 480);
        this.state.draw(canvas);
    },
    
    gameLoop : function() {
        if(this.running) {
            
            this.update();
            this.draw(this.canvas);
            
        }
    },
               
    toString : function () {
        return "Game";
    },
    
    keyPressed : function(evt) {
        var accepted = true;
        
        accepted = this.state.keyPressed(evt);
                    
        if( accepted || this.paused ) {
            evt.stopPropagation();
            evt.preventDefault();
        }
    },
                          
    pause : function() {
        this.paused = true;
    },
                      
    unpause : function() {
        this.paused = false;
    },
               
    togglePause : function() {
        if( this.paused )
            this.unpause();
        else
            this.pause();
    }
});

g = null;

window.onload = function() {
    g = new Game();
};
