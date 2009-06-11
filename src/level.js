var Level = Class.create();
Object.extend( Level.prototype, State.prototype );
Object.extend( Level.prototype, {
    num : 1,
    name : "",
    timerCanvas : null,
    startTime : 0,
    skipTime : 10*1000, // 10 seconds
    frac : 0,
    skipNext : true,
    skipThis : false,
    chefStartX : 0,
    chefStartY : 0,
    powerupCount : 0,
    map : [], // will be an array of Plates
    monsters : [],
    bullets : [],
    powerups : [],
    chef : null,
    level : null,
    sprites : [],
    
    initialize : function(num) {
        document.onclick = null;
        this.num = num;
      
        this.setupMap();
        this.monsters = this.setupMonsters();
        this.powerups = [];
        this.reset();
               
        this.name = Levels[this.num].name;
        
        // setup lives in the first level, then watch the player lose them
        if( this.num == 0 ) {
            hudAddLife();
            hudAddLife();
            hudAddLife();
            g.lives = 3;
        }
        
        this.startTime = new Date().getTime();
        this.setupTimer();
        comment(this.name, 1800);
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
    },
               
    setupMap : function() {
        var lev = createLevel(Levels[this.num]);
        
        if( lev.startX == -1 ) {
            console.log("Error in parsing level");
            return;
        }
        
        this.chefStartX = lev.startX;
        this.chefStartY = lev.startY;
        
        this.map = lev.map;
    },
               
    update : function(game) {
        
        this.updateCountdown();
        
        if( game.paused )
            return;
        
        if( this.map.allNull() || this.skipThis ) {
            // we're done with the game
            // TODO: go to highscore/congrats state
            if( this.num+1 == Levels.length ) {
                game.nextState = new FinishState(true);
            }
            else {
                if( this.skipThis )
                    this.powerupCount += 2;
                
                game.nextState = new Level(this.num + 1);
                game.nextState.powerupCount = this.powerupCount;
                
                var c = new Cookie();
                c.add("level", "" + (this.num+1));
                c.add("lives", "" + game.lives);
                c.set();
                for( var i = 0; i < this.powerups.length; i++ )
                    game.nextState.powerups.push(this.powerups[i]);
                if( this.skipNext && !this.skipThis ) {
                    comment('Level skipped');
                    game.nextState.skipThis = true;
                }
            }
            game.pause();
            setTimeout(game.unpause.bind(game), 2000);
            return;
        }
        
        this.map.each( (function(plate, i) {
            if( !plate ) return;
            if( plate.collideChef(this.chef) )
                this.powerupCount += 0.6;
            plate.update();
            if( plate.dead ) {
                this.map[i] = null;
            }
        }).bind(this) );
        
        // TODO: All collision detection and stuff
        
        var fire = Math.random() < 0.03*(this.num/5+1);
        var fire_mon = this.monsters[parseInt(Math.random() * 4)];
        this.monsters.each((function(monster) {
            monster.update();
            if( fire && fire_mon === monster ) {
                monster.fire(this.bullets);
                fire = false;
                this.powerupCount += 0.1;
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
            if( !this.chef.dead && bullet.collideRect(this.chef.rect) && !this.chef.shield_ ) {
                this.chef.dead = true;
                this.bullets.remove(i);
                return;
            }
        }).bind(this));
        
        var t = new Date().getTime();
        var powerups_cpy = this.powerups.clone();
        powerups_cpy.each( (function(pup, i) {
            pup.update();
            if( pup.dead || ( t - pup.startTime ) > C.POWERUP_EXPIRE ) {
                this.powerups.remove(i);
                return;
            }
            // NOTE: it is important to call bullet.collideRect and not the other way round
            if( !this.chef.dead && pup.collideRect(this.chef.rect) ) {
                comment(pup.name, 500);
                pup.enable(game);
                this.powerups.remove(i);
            }
        }).bind(this));
        
        if( this.chef.dead ) {
            if( game.lives > 0 ) {
                game.lives -= 1;
                
                var c = new Cookie();
                c.add("lives", game.lives).set();
                hudRemoveLife();
                
                this.powerupCount = Math.max(0, this.powerupCount - C.POWERUP_WAIT);
                this.chef.update();
                this.chef.dead = false;
                if( game.lives == 0 )
                    comment("Last life!", 2000);
                else if( game.lives == 1 )
                    comment("1 life", 2000);
                else
                    comment(game.lives + " lives to go", 2000);
                game.pause();
                setTimeout(game.unpause.bind(game), 2000);
                setTimeout(this.reset.bind(this), 1200);
            }
            else {
                game.nextState = new FinishState(false);
            }
        }
        this.chef.update(this);
        
        if( this.powerupCount >= C.POWERUP_WAIT ) {
            this.powerups.push( randomPowerup() );
            // TODO: this is temporary until we get graphics
            comment(this.powerups[this.powerups.length-1].name, 200);
            this.powerupCount = 0;
        }
    },
               
    draw : function(canvas) {
        this.timerCanvas.fillStyle = 'gray';
        this.timerCanvas.fillRect(0, 0, 50, 300);
        this.timerCanvas.fillStyle = 'maroon';
        this.timerCanvas.fillRect(1, 1, 48, 298);
        this.timerCanvas.fillStyle = 'black';
        this.timerCanvas.fillRect(1, 1, 48, Math.floor(this.frac*298));
        
        this.map.each( (function(plate) {
            if( !plate ) return;
            plate.draw(canvas);
        }).bind(this) );
        
        this.sprites.each( (function(grp) {
            grp.each( (function(sprite) {
                sprite.draw(canvas);
            }).bind(this));
        }).bind(this));
    },
    
    reset : function() {
        this.sprites = [];
        
        this.bullets = [];
        
        this.chef = new Chef(this.chefStartX, this.chefStartY);
        this.chef.constraints = rect(C.GRID_LEFT, C.GRID_TOP, C.GRID_RIGHT-C.GRID_LEFT, C.GRID_BOTTOM-C.GRID_TOP);
        
        this.sprites.push([this.chef]);
        this.sprites.push(this.bullets);
        this.sprites.push(this.monsters);
        this.sprites.push(this.powerups);
    },
    
    updateCountdown : function() {
        var time = new Date().getTime()-this.startTime;
        if ( time > this.skipTime ) {
            this.skipNext = false;
            this.frac = 1;
        }
        else {
            this.skipNext = true;
            this.frac = time/this.skipTime;
        }
    },
    
    setupMonsters : function() {
        var mtop = new Monster(rpos(C.MONSTER_LEFT+20,  C.MONSTER_RIGHT - C.MONSTER_LEFT), 0,
                            'chef-bottom',
                            C.MONSTER_DELTA, 0,
                            rect(C.MONSTER_LEFT+20, 0, C.MONSTER_RIGHT - C.MONSTER_LEFT - 15, C.SPRITE_SIZE));
        mtop.direction = C.TOP;
        
        var mright = new Monster(C.MONSTER_RIGHT, rpos(C.MONSTER_TOP+20, C.MONSTER_BOTTOM - C.MONSTER_TOP),
                             'chef-left',
                             0, C.MONSTER_DELTA,
                             rect(C.MONSTER_RIGHT, C.MONSTER_TOP+20, C.SPRITE_SIZE, C.MONSTER_BOTTOM - C.MONSTER_TOP));
        mright.direction = C.RIGHT;
                             
        var mbot = new Monster(rpos(C.MONSTER_LEFT+20, C.MONSTER_RIGHT - C.MONSTER_LEFT), C.MONSTER_BOTTOM,
                           'chef-top',
                           C.MONSTER_DELTA, 0,
                           rect(C.MONSTER_LEFT+20, C.MONSTER_BOTTOM, C.MONSTER_RIGHT - C.MONSTER_LEFT - 15, C.SPRITE_SIZE));
        mbot.direction = C.BOTTOM;
                           
        var mleft = new Monster(C.MONSTER_LEFT, rpos(C.MONSTER_TOP+20, C.MONSTER_BOTTOM - C.MONSTER_TOP),
                            'chef-right',
                            0, C.MONSTER_DELTA,
                            rect(C.MONSTER_LEFT, C.MONSTER_TOP+20, C.SPRITE_SIZE, C.MONSTER_BOTTOM - C.MONSTER_TOP));
        mleft.direction = C.LEFT;
                            
        return [mtop, mright, mbot, mleft];
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