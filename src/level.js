var Level = Class.create();
Object.extend( Level.prototype, State.prototype );
Object.extend( Level.prototype, {
    num : 1,
    name : "",
    timerCanvas : null,
    startTime : 0,
    skipTime : 10*1000, // 30 seconds
    skipNext : true,
    map : [], // will be an array of Plates
    monsters : [],
    bullets : [],
    chef : null,
    level : null,
    sprites : [],
    
    initialize : function(num) {
        this.num = num;
        this.setupMonsters();
        this.chef = new Chef(300, 300);
        this.chef.constraints = rect(C.GRID_LEFT, C.GRID_TOP, C.GRID_RIGHT-C.GRID_LEFT, C.GRID_BOTTOM-C.GRID_TOP);
      
               
        this.name = "Hi there";
        this.map = [ new Plate(1, 200, 200) ];
        this.sprites.push(this.map);

        this.sprites.push([this.chef]);
        
        this.startTime = new Date().getTime();
        this.setupTimer();
        comment(this.name);
        console.log("Fire pbb for level", this.num, "is", 0.01*(this.num/5+1));
        setInterval( (function(){console.log(this.bullets.length)}).bind(this), 1000);
    },
               
    setupTimer : function() {
        
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
               
    update : function(game) {
        this.updateCountdown();
        
        this.map.clone().each( (function(plate, i) {
            if( this.chef.collideRect(plate.rect) ) {
                plate.dead = true;
                this.map.remove(i);
            }
        }).bind(this) );
        // TODO: All collision detection and stuff
        
        var fire = Math.random() < 0.01*(this.num/5+1);
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
            if( game.lives > 0 ) {
                game.lives -= 1;
                var hud = document.getElementById('hud');
                hud.removeChild(hud.getElementsByTagName('img')[0]);
                this.chef.update();
                this.chef.dead = false;
                if( game.lives == 0 )
                    comment("Last life!");
                else if( game.lives == 1 )
                    comment("1 life");
                else
                    comment(game.lives + " lives to go");
                game.nextState = new Level(this.num);
            }
            else {
                comment("You're out");
                //actually go to next state
                game.pause();
            }
        }
        this.chef.update(this);
        
        for( var i = 0; i < this.map.length; i++ )
            this.map[i].update();
    },
               
    draw : function(canvas) {
        
        this.sprites.each( (function(grp) {
            grp.each( (function(sprite) {
                //this.canvas.fillStyle = 'black';
                //this.canvas.fillRect(sprite.rect.x, sprite.rect.y, sprite.rect.width, sprite.rect.height);
                sprite.draw(canvas);
            }).bind(this));
        }).bind(this));
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
               
    keyPressed : function(evt) {
        if( evt.keyCode == 38 ) // up arrow
            this.chef.move(C.TOP);
        else if( evt.keyCode == 40 )
            this.chef.move(C.BOTTOM);
        else if( evt.keyCode == 37 )
            this.chef.move(C.LEFT);
        else if( evt.keyCode == 39 )
            this.chef.move(C.RIGHT);
        else
            return false;
        return true;
    }
    
});
Object.inherits(Level, State);