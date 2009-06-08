var State = Class.create();
Object.extend( State.prototype, {
    name : "",
    nextState : null,

    initialize : function() {},
               
    update : function() {},
               
    draw : function(canvas) {},
    
    keyPressed : function(evt) {}
});
Object.inherits(State, Object);

var MenuState = Class.create();
Object.extend( MenuState.prototype, State.prototype );
Object.extend( MenuState.prototype, {
    name : "Menu",
    items : [],
    
    initialize : function() {
        //this._super.apply(this, arguments);
        
        var newGame = new MenuItem("new", 150, 150);
        newGame.activate = function() {
            g.nextState = new Level(0);
        };
        
        var loadGame = new MenuItem("load", 150, 250);
        loadGame.activate = function() {
            var c = new Cookie();
            
            var lives = c.get('lives');
            if( lives ) {
                for( var i = 0; i < parseInt(lives); i++ )
                    hudAddLife();
                g.lives = lives;
            }
            
            var lev = c.get('level');
            g.nextState = new Level( lev == null ? 0 : parseInt(lev) );
        }
                
        this.items = [ newGame, loadGame ];
        
        document.onmousemove = this.hover.bind(this);
        document.onclick = this.activate.bind(this);
    },
               
    belowMouse : function(evt) {
        var cvs = document.getElementById('game-canvas');
        for( var i = 0; i < this.items.length; i++ )
            if( this.items[i].collidePoint(evt.clientX - cvs.offsetLeft, evt.clientY - cvs.offsetTop) )
                return this.items[i];
        // dummy
        return new MenuItem(-100, -100);
    },
    
    hover : function(evt) {
        for( var i = 0; i < this.items.length; i++ )
            this.items[i].deselect();
        this.belowMouse(evt).select();
    },
               
    activate : function(evt) {
        this.belowMouse(evt).activate();
    },
    
    draw : function(canvas) {
        
        this.items.each( (function(it) {
            it.draw(canvas);
        }).bind(this) );
    },
               
    toString : function() {
        return this.name;
    }
});
Object.inherits( MenuState, State );