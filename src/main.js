var Game = Class.create();

Object.extend(Game.prototype, {
    running : false,
    canvas : null,
    timerCanvas : null,
    startTime : 0,
    skipTime : 10*1000, // 30 seconds
    skipNext : true,
    paused : false,
    
    monsters : [],
    bullets : [],
    chef : null,
    level : null,
    sprites : [],
    lives : 3,
    
    initialize : function() {
        this.setupCanvas();
        this.attachEvents();
        this.setupMonsters();
        this.setupLevel();
        
        this.chef = new Chef(300, 300);
        this.chef.constraints = rect(C.GRID_LEFT, C.GRID_TOP, C.GRID_RIGHT-C.GRID_LEFT, C.GRID_BOTTOM-C.GRID_TOP);
        
        this.sprites.push([this.chef]);
        
        this.startTime = new Date().getTime();
        this.comment('<b>Start</b> the game!');
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
        
        var timer = document.getElementById('time-canvas');
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
        var elem = document.getElementById('game-canvas');
        elem.onclick = (function(evt) {
            this.startTime = new Date().getTime();
            this.running = evt.button == 0;
        }).bind(this);
    },
               
    setupLevel : function() {
        this.level = new Level();
        this.level.name = "Hi there";
        this.level.map = [ new Plate(1, 200, 200) ];
        this.sprites.push(this.level.map);
    },
               
    update : function() {
        if( this.paused )
            return;
        
        this.updateCountdown();
        
        this.level.update();
        this.level.map.clone().each( (function(plate, i) {
            if( this.chef.collideRect(plate.rect) ) {
                plate.dead = true;
                this.level.map.remove(i);
            }
        }).bind(this) );
        // TODO: All collision detection and stuff
        
        var fire = Math.random() < 0.01;
        var fire_mon = this.monsters[parseInt(Math.random() * 4)];
        this.monsters.each((function(monster) {
            monster.update();
            if( fire && fire_mon === monster ) {
                this.bullets.push(monster.fire());
                fire = false;
            }
        }).bind(this));
        
        
        var bullets_cpy = this.bullets.clone();
        bullets_cpy.each( (function(bullet, i) {
            bullet.update();
            if( bullet.dead ) {
                this.bullets.remove(i);
                return;
            }
            // NOTE: it is important to call bullet.collideRect and not the other way round
            if( !this.chef.dead && bullet.collideRect(this.chef.rect) ) {
                this.chef.dead = true;
                this.bullets.remove(i);
                return;
            }
        }).bind(this));
        
        if( this.chef.dead ) {
            if( this.lives > 0 ) {
                this.lives -= 1;
                var hud = document.getElementById('hud');
                hud.removeChild(hud.getElementsByTagName('img')[0]);
                this.chef.update();
                this.chef.dead = false;
                console.log("Dead!");
            }
            else {
                console.log("Game over");
                //actually go to next state
                this.pause();
            }
        }
        this.chef.update(this);
    },
                      
    draw : function(canvas) {
        this.drawGrid(this.canvas);
        this.sprites.each( (function(grp) {
            grp.each( (function(sprite) {
                //this.canvas.fillStyle = 'black';
                //this.canvas.fillRect(sprite.rect.x, sprite.rect.y, sprite.rect.width, sprite.rect.height);
                sprite.draw(this.canvas);
            }).bind(this));
        }).bind(this));
    },
    
    gameLoop : function() {
        if(this.running) {
            
            this.update();
            this.draw(this.canvas);
            
        }
    },
    
    updateCountdown : function() {
        var time = new Date().getTime()-this.startTime;
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
        
        var accepted = true;
        
        if( evt.keyCode == 38 ) // up arrow
            this.chef.move(C.TOP);
        else if( evt.keyCode == 40 )
            this.chef.move(C.BOTTOM);
        else if( evt.keyCode == 37 )
            this.chef.move(C.LEFT);
        else if( evt.keyCode == 39 )
            this.chef.move(C.RIGHT);
        else if( evt.charCode == 112 )
            this.pause();
        else {
            accepted = false;
        }
            
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
    
    setupMonsters : function() {
        var mtop = new Monster(rpos(C.MONSTER_LEFT,  C.MONSTER_RIGHT - C.MONSTER_LEFT), 0,
                            'chef-bottom',
                            C.MONSTER_DELTA, 0,
                            rect(C.MONSTER_LEFT, 0, C.MONSTER_RIGHT - C.MONSTER_LEFT, C.SPRITE_SIZE));
        mtop.direction = C.TOP;
        
        var mright = new Monster(C.GRID_RIGHT, rpos(C.GRID_TOP, C.GRID_BOTTOM - C.GRID_TOP),
                             'chef-left',
                             0, C.MONSTER_DELTA,
                             rect(C.GRID_RIGHT, C.GRID_TOP, C.SPRITE_SIZE, C.GRID_BOTTOM - C.GRID_TOP));
        mright.direction = C.RIGHT;
                             
        var mbot = new Monster(rpos(C.MONSTER_LEFT, C.MONSTER_RIGHT - C.MONSTER_LEFT), C.GRID_BOTTOM,
                           'chef-top',
                           C.MONSTER_DELTA, 0,
                           rect(C.MONSTER_LEFT, C.GRID_BOTTOM, C.MONSTER_RIGHT - C.MONSTER_LEFT, C.SPRITE_SIZE));
        mbot.direction = C.BOTTOM;
                           
        var mleft = new Monster(C.GRID_LEFT - C.SPRITE_SIZE, rpos(C.GRID_TOP, C.GRID_BOTTOM - C.GRID_TOP),
                            'chef-right',
                            0, C.MONSTER_DELTA,
                            rect(C.GRID_LEFT - C.SPRITE_SIZE, C.GRID_TOP, C.SPRITE_SIZE, C.GRID_BOTTOM - C.GRID_TOP));
        mleft.direction = C.LEFT;
                            
        this.monsters = [mtop, mright, mbot, mleft];
        this.sprites.push(this.monsters);
        this.sprites.push(this.bullets);
    },
               
    comment : function(html) {
        document.getElementById('comments').innerHTML = html;
        setTimeout(function() { document.getElementById('comments').innerHTML = "" }, 5000);
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
