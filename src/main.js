var Game = Class.create();

Object.extend(Game.prototype, {
    running : false,
    canvas : null,
    timerCanvas : null,
    startTime : 0,
    skipTime : 10*1000, // 30 seconds
    skipNext : true,
    
    monsters : [],
    bullets : [],
    
    initialize : function() {
        this.setupCanvas();
        this.attachEvents();
        this.setupMonsters();
        
        this.startTime = new Date().getTime();
            
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
            
            this.drawGrid(this.canvas);
            
            fire = Math.random() < 0.01;
            fire_mon = parseInt(Math.random() * 4);
            for( i = 0; i < this.monsters.length; i++ ) {
                this.canvas.fillStyle = 'black';
                this.canvas.fillRect(this.monsters[i].rect.x, this.monsters[i].rect.y, this.monsters[i].rect.width, this.monsters[i].rect.height);
                this.monsters[i].update();
                if( fire && fire_mon == i ) {
                    this.bullets.push(this.monsters[i].fire());
                    fire = false;
                }
                this.monsters[i].draw(this.canvas);
            }
            
            bullets_cpy = this.bullets.clone();
            for( i = 0; i < bullets_cpy.length; i++ ) {
                bullets_cpy[i].update();
                bullets_cpy[i].draw(this.canvas);
                if( bullets_cpy[i].dead ) {
                    this.canvas.fillStyle = 'black';
                    this.canvas.fillRect(bullets_cpy[i].rect.x, bullets_cpy[i].rect.y, bullets_cpy[i].rect.width, bullets_cpy[i].rect.height);
                    delete this.bullets[i];
                    this.bullets = this.bullets.slice(0, i).concat(this.bullets.slice(i+1));
                    console.log(this.bullets);
                }
            }
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
        
        /*if( evt.keyCode == 38 ) // up arrow
            this.sprite.dy = -1;
        else if( evt.keyCode == 40 )
            this.sprite.dy = 1;
        else if( evt.keyCode == 37 )
            this.sprite.dx = -1;
        else if( evt.keyCode == 39 )
            this.sprite.dx = 1;
        else {
            this.sprite.dx = dx;
            this.sprite.dy = dy;
            accepted = false;
        }
            
        if( accepted ) {
            evt.stopPropagation();
            evt.preventDefault();
        }*/
    },
    
    // TODO: Simple and stupid for now
    drawGrid : function(canvas) {
        canvas.fillStyle = 'maroon';
        for( i = 0; i < 14 ; i++ )
            for( j = 0; j < 14; j++ )
                canvas.fillRect(90+i*30, 30+j*30, 30, 30);
    },
    
    setupMonsters : function() {
        mtop = new Monster(rpos(C.MONSTER_LEFT,  C.MONSTER_RIGHT - C.MONSTER_LEFT), 0,
                            'chef',
                            C.MONSTER_DELTA, 0,
                            rect(C.MONSTER_LEFT, 0, C.MONSTER_RIGHT - C.MONSTER_LEFT, C.SPRITE_SIZE));
        mtop.direction = C.MONSTER_TOP;
        
        mright = new Monster(C.GRID_RIGHT, rpos(C.GRID_TOP, C.GRID_BOTTOM - C.GRID_TOP),
                             'chef',
                             0, C.MONSTER_DELTA,
                             rect(C.GRID_RIGHT, C.GRID_TOP, C.SPRITE_SIZE, C.GRID_BOTTOM - C.GRID_TOP));
        mright.direction = C.MONSTER_RIGHT;
                             
        mbot = new Monster(rpos(C.MONSTER_LEFT, C.MONSTER_RIGHT - C.MONSTER_LEFT), C.GRID_BOTTOM,
                           'chef',
                           C.MONSTER_DELTA, 0,
                           rect(C.MONSTER_LEFT, C.GRID_BOTTOM, C.MONSTER_RIGHT - C.MONSTER_LEFT, C.SPRITE_SIZE));
        mbot.direction = C.MONSTER_BOTTOM;
                           
        mleft = new Monster(C.GRID_LEFT - C.SPRITE_SIZE, rpos(C.GRID_TOP, C.GRID_BOTTOM - C.GRID_TOP),
                            'chef',
                            0, C.MONSTER_DELTA,
                            rect(C.GRID_LEFT - C.SPRITE_SIZE, C.GRID_TOP, C.SPRITE_SIZE, C.GRID_BOTTOM - C.GRID_TOP));
        mleft.direction = C.MONSTER_LEFT;
                            
        this.monsters = [mtop, mright, mbot, mleft];
    }
});

g = null;

window.onload = function() {
    g = new Game();
    document.onkeypress = g.keyPressed.bind(g);
};
