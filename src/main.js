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
    
    initialize : function() {
        this.setupCanvas();
        this.attachEvents();
        this.setupMonsters();
        this.setupLevel();
        
        this.chef = new Sprite(300, 300, 'chef');
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
        this.level.map = [ new Plate(1, 300, 300) ];
        this.sprites.push(this.level.map);
        setInterval(this.level.map[0].touch.bind(this.level.map[0]), 2000);
    },
               
    update : function() {
        if( this.paused )
            return;
        
        this.level.update();
        if( this.level.map[0] && this.level.map[0].dead ) {
            this.level.map.remove(0);
        }
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
        bullets_cpy.each((function(bullet, i) {
            bullet.update();
            if( bullet.dead ) {
                this.canvas.fillStyle = 'black';
                this.canvas.fillRect(bullets_cpy[i].rect.x, bullets_cpy[i].rect.y, bullets_cpy[i].rect.width, bullets_cpy[i].rect.height);
                this.bullets.remove(i);
            }
        }).bind(this));
    },
                      
    draw : function(canvas) {
        this.drawGrid(this.canvas);
        this.sprites.each( (function(grp) {
            //console.log(grp, i, this.sprites.length);
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
            
            this.updateCountdown();
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
        for( var i = 0; i < 14 ; i++ )
            for( var j = 0; j < 14; j++ )
                canvas.fillRect(90+i*30, 30+j*30, 30, 30);
    },
    
    setupMonsters : function() {
        var mtop = new Monster(rpos(C.MONSTER_LEFT,  C.MONSTER_RIGHT - C.MONSTER_LEFT), 0,
                            'chef',
                            C.MONSTER_DELTA, 0,
                            rect(C.MONSTER_LEFT, 0, C.MONSTER_RIGHT - C.MONSTER_LEFT, C.SPRITE_SIZE));
        mtop.direction = C.MONSTER_TOP;
        
        var mright = new Monster(C.GRID_RIGHT, rpos(C.GRID_TOP, C.GRID_BOTTOM - C.GRID_TOP),
                             'chef',
                             0, C.MONSTER_DELTA,
                             rect(C.GRID_RIGHT, C.GRID_TOP, C.SPRITE_SIZE, C.GRID_BOTTOM - C.GRID_TOP));
        mright.direction = C.MONSTER_RIGHT;
                             
        var mbot = new Monster(rpos(C.MONSTER_LEFT, C.MONSTER_RIGHT - C.MONSTER_LEFT), C.GRID_BOTTOM,
                           'chef',
                           C.MONSTER_DELTA, 0,
                           rect(C.MONSTER_LEFT, C.GRID_BOTTOM, C.MONSTER_RIGHT - C.MONSTER_LEFT, C.SPRITE_SIZE));
        mbot.direction = C.MONSTER_BOTTOM;
                           
        var mleft = new Monster(C.GRID_LEFT - C.SPRITE_SIZE, rpos(C.GRID_TOP, C.GRID_BOTTOM - C.GRID_TOP),
                            'chef',
                            0, C.MONSTER_DELTA,
                            rect(C.GRID_LEFT - C.SPRITE_SIZE, C.GRID_TOP, C.SPRITE_SIZE, C.GRID_BOTTOM - C.GRID_TOP));
        mleft.direction = C.MONSTER_LEFT;
                            
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
    }
});

g = null;

window.onload = function() {
    g = new Game();
    document.onkeypress = g.keyPressed.bind(g);
};
