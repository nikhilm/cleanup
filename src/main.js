var Game = Class.create();

Object.extend(Game.prototype, {
    running : false,
    canvas : null,
    paused : false,
               
    state : null,
    nextState : null,
    
    lives : 3,
    
    initialize : function() {
        this.setupCanvas();
        this.attachEvents();
        
        setInterval(this.gameLoop.bind(this), 35);
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
        var elem = document.getElementById('game-canvas');
        elem.onclick = (function(evt) {
            this.nextState = new Level(30);
            //this.startTime = new Date().getTime();
            this.running = evt.button == 0;
        }).bind(this);
    },
               
    update : function() {
        if( this.paused )
            return;
        
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
        canvas.fillRect(0, 0, 600, 480);
        this.drawGrid(this.canvas);
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
        if( !this.running )
            return;
        
        var accepted = true;
        
        accepted = this.state.keyPressed(evt)
                    
        if( accepted ) {
            evt.stopPropagation();
            evt.preventDefault();
        }
    },
    
    // TODO: Simple and stupid for now
    drawGrid : function(canvas) {
        canvas.fillStyle = 'maroon';
        for( var i = 0; i < 14 ; i++ )
            for( var j = 0; j < 14; j++ )
                canvas.fillRect(90+i*30, 30+j*30, 30, 30);
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
    document.onkeypress = g.keyPressed.bind(g);
};
