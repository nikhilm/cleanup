var Level = Class.create();
Object.extend( Level.prototype, State.prototype );
Object.extend( Level.prototype, {
    num : 1,
    name : "",
    timerCanvas : null,
    startTime : 0,
    skipTime : 10*1000, // 30 seconds
    skipNext : true,
    skipThis : false,
    chefStartX : 0,
    chefStartY : 0,
    map : [], // will be an array of Plates
    monsters : [],
    bullets : [],
    powerups : [],
    chef : null,
    level : null,
    sprites : [],
    
    initialize : function(num) {
        this.num = num;
      
        this.setupMap();
        this.monsters = this.setupMonsters();
        this.powerups = [];
        this.reset();
               
        this.name = Levels[this.num].name;
        
        // TODO: not to be added manually
        var p = new MonsterKillerPowerup(0, 0);
        this.powerups.push( p );
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
        this.timerCanvas.fillStyle = 'maroon';
        this.timerCanvas.fillRect(0, 0, 50, 300);
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
        if( game.paused )
            return;
        
        this.updateCountdown();
        
        if( this.map.length == 0 || this.skipThis ) {
            // we're done with the game
            // TODO: go to highscore/congrats state
            if( this.num+1 == Levels.length ) {
                game.nextState = new Level(0);
            }
            else {
                game.nextState = new Level(this.num + 1);
                var c = new Cookie();
                c.add("level", "" + (this.num+1)).set();
                for( var i = 0; i < this.powerups.length; i++ )
                    game.nextState.powerups.push(this.powerups[i]);
                if( this.skipNext && !this.skipThis )
                    game.nextState.skipThis = true;
            }
            game.pause();
            setTimeout(game.unpause.bind(game), 2000);
            return;
        }
        
        this.map.clone().each( (function(plate, i) {
            plate.collideChef(this.chef);
            plate.update();
            if( plate.dead )
                this.map.remove(i);
        }).bind(this) );
        // TODO: All collision detection and stuff
        
        var fire = Math.random() < 0.03*(this.num/5+1);
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
                pup.enable(game);
                this.powerups.remove(i);
            }
        }).bind(this));
        
        if( this.chef.dead ) {
            if( game.lives > 0 ) {
                game.lives -= 1;
                hudRemoveLife();
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
                comment("You're out");
                //actually go to next state
                game.pause();
            }
        }
        this.chef.update(this);
        
    },
               
    draw : function(canvas) {
        
        this.map.each( (function(plate) {
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
        }
        else {
            frac = time/this.skipTime;
            this.timerCanvas.fillStyle = 'black';
            this.timerCanvas.fillRect(0, 0, 50, frac*300);
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