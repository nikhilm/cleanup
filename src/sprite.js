var Sprite = Class.create();
Object.extend(Sprite.prototype, {
    dx : 0,
    dy : 0,
    rect : null,
    image : null,
    constraints : null,
    dead : false,
    
    // imgid should be id of img/canvas
    initialize : function(x, y, imgid, dx, dy, constraints) {
        this.dx = dx || 0;
        this.dy = dy || 0;
        this.rect = rect(x, y);
        
        this.setImage(imgid);
        
        this.constraints = constraints || rect(0, 0, C.WORLD_WIDTH, C.WORLD_HEIGHT);
    },
               
    setImage : function(id) {        
        this.image = document.getElementById(id);
        this.rect = rect(this.rect.x || 0,
                         this.rect.y || 0,
                         this.image ? this.image.width : 0,
                         this.image ? this.image.height : 0);
    },
    
    erase : function(canvas) {
        canvas.save();
        canvas.fillStyle = 'black';
        canvas.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        canvas.restore();
    },

    draw : function(canvas) {
        canvas.drawImage(this.image, this.rect.x, this.rect.y, this.image.width, this.image.height);
    },
    
    update : function(canvas) {
        var cant_go = 0;
        
        if( this.rect.x + this.dx + this.rect.width >= this.constraints.x + this.constraints.width )
            cant_go |= C.RIGHT;
        if( this.rect.x + this.dx <= this.constraints.x )
            cant_go |= C.LEFT;
        if( this.rect.y + this.dy + this.rect.height >= this.constraints.y + this.constraints.height )
            cant_go |= C.BOTTOM;
        if( this.rect.y + this.dy <= this.constraints.y )
            cant_go |= C.TOP;
        
        if( cant_go != 0 ) {
            if( this.handleConstraint(cant_go) )
                return;
        }
        
        this.rect.x += this.dx;
        this.rect.y += this.dy;
    },
    
    // should return true if we are not allowed to move right now
    handleConstraint : function(cant_go) {
        if( cant_go & C.RIGHT ) this.dx = -Math.abs(this.dx);
        if( cant_go & C.LEFT ) this.dx = Math.abs(this.dx);
        if( cant_go & C.BOTTOM ) this.dy = -Math.abs(this.dy);
        if( cant_go & C.TOP ) this.dy = Math.abs(this.dy);
        return false;
    },
    
    collidePoint : function(x, y) {
        var r = this.rect;
        if( x < r.x || x > r.x + r.width )
            return false;
        if( y < r.y || y > r.y + r.height )
            return false;
        return true;
    },
    
    collideRect : function(rect) {
        var r = this.rect;
        
        if( r.x + r.width < rect.x ) return false;
        if( r.x > rect.x + rect.width ) return false;
        if( r.y + r.height < rect.y ) return false;
        if( r.y > rect.y + rect.height ) return false;
        
        return true;
    },
    
    toString : function() {
        return "Sprite";
    }
});
Object.inherits(Sprite, Object);

var MenuItem = Class.create();
Object.extend(MenuItem.prototype, Sprite.prototype);
Object.extend(MenuItem.prototype, {
    tag : null,
    initialize : function(desc) {
        this._super.initialize.apply(this, Array.prototype.slice.call(arguments, 1));
        this.tag = desc;
        this.deselect();
    },
               
    select : function() {
        this.setImage("menu-" + this.tag + "-h");
    },
    
    deselect : function() {
        this.setImage("menu-" + this.tag);
    },
    
    activate : function() {
        // ... define your own ...
    }
});
Object.inherits(MenuItem, Sprite);

/*** Spaghetti monsters ***/
var Monster = Class.create();
Object.extend(Monster.prototype, Sprite.prototype);
Object.extend(Monster.prototype, {
    direction : null,
    initialize : function() {
        this._super.initialize.apply(this, arguments);
    },
    
    toString : function() {
        return "Monster";
    },
               
    fire : function() {
        var bdx = 0;
        var bdy = 0;
        var bdir = 0;
        
        switch( this.direction ) {
            case C.TOP : bdy = C.BULLET_SPEED; bdir = C.BOTTOM; break;
            case C.RIGHT : bdx = -C.BULLET_SPEED; bdir = C.LEFT; break;
            case C.BOTTOM : bdy = -C.BULLET_SPEED; bdir = C.TOP; break;
            case C.LEFT : bdx = C.BULLET_SPEED; bdir = C.RIGHT; break;
        }
        var b = new Bullet(this.rect.x, this.rect.y);
        b.dx = bdx;
        b.dy = bdy;
        b.direction = bdir;
        return b;
    }
});
Object.inherits(Monster, Sprite);


/*** Bullet ***/
var Bullet = Class.create();
Object.extend(Bullet.prototype, Sprite.prototype);
Object.extend(Bullet.prototype, {
    travelled : 0,
    initialize : function() {
        this._super.initialize.apply(this, arguments);
        this.setImage('bullet');
    },
    
    update : function() {
        this.travelled += Math.max(Math.abs(this.dx), Math.abs(this.dy));
        
        if( this.travelled >= C.BULLET_RANGE )
            this.dead = true;
        
        this._super.update.apply(this, arguments);
    },
               
    collideRect : function(orect) {
        var r = rect(this.rect.x, this.rect.y, this.rect.width, this.rect.height); // important to COPY!
        switch( this.direction ) {
            case C.TOP:
                r.height /= 2;
                break;
            case C.RIGHT:
                r.x += C.SPRITE_SIZE/2;
                r.width /= 2;
                break;
            case C.BOTTOM:
                r.y += C.SPRITE_SIZE/2;
                r.height /= 2;
                break;
            case C.LEFT:
                r.width /= 2;
                break;
        }
        
        if( r.x + r.width < orect.x ) return false;
        if( r.x > orect.x + orect.width ) return false;
        if( r.y + r.height < orect.y ) return false;
        if( r.y > orect.y + orect.height ) return false;
        
        return true;
    },
    
    toString : function() {
        return "Bullet";
    }
});
Object.inherits(Bullet, Sprite);

/*** Plate ***/
var Plate = Class.create();
Object.extend(Plate.prototype, Sprite.prototype);
Object.extend(Plate.prototype, {
    touches : 1,
    touched : 0,
    touching : false,
               
    initialize : function(touches) {
        this._super.initialize.apply(this, Array.prototype.slice.call(arguments, 1));
        this.touches = touches;
        this.setImage('plate-img-'+this.touches);
    },
    
    update : function() {
        if( this.touched == this.touches )
            this.dead = true;
    },
               
    collideChef : function(chef) {
        if( this.touching ) {
            this.touching = this.collideRect(chef.rect);
            return;
        }
        
        if( this.collideRect(chef.rect) ) {
            this.touching = true;
            this.touched += 1;
            this.setImage('plate-img-'+(this.touches-this.touched));
        }
    },
    
    toString : function() {
        return "Plate";
    }
});
Object.inherits(Plate, Sprite);

/*** Chef ***/
var Chef = Class.create();
Object.extend(Chef.prototype, Sprite.prototype);
Object.extend(Chef.prototype, {
               
    initialize : function() {
        this._super.initialize.apply(this, arguments);
        this.setImage('chef-top');
    },
    
    handleConstraint : function(cant_go) {
        if( cant_go & (C.RIGHT|C.LEFT) ) this.dx = 0;
        if( cant_go & (C.TOP|C.BOTTOM) ) this.dy = 0;
        return false;
    },
               
    move : function(dir) {
        this.dx = this.dy = 0;
        if( dir & C.TOP ) {
            this.dy = -C.CHEF_SPEED;
            this.setImage('chef-top');
        }
        else if( dir & C.RIGHT ) {
            this.dx = C.CHEF_SPEED;
            this.setImage('chef-right');
        }
        else if( dir & C.BOTTOM ) {
            this.dy = C.CHEF_SPEED;
            this.setImage('chef-bottom');
        }
        else if( dir & C.LEFT ) { 
            this.dx = -C.CHEF_SPEED;
            this.setImage('chef-left');
        }
    },
    
    toString : function() {
        return "Chef";
    }
});
Object.inherits(Chef, Sprite);

/** Powerups **/
var Powerup = Class.create();
Object.extend(Powerup.prototype, Sprite.prototype);
Object.extend(Powerup.prototype, {
    initialize : function() {
        this._super.initialize.apply(this, arguments);
        this.dx = this.dy = C.POWERUP_SPEED;
        // TODO: not here, each powerup has image
        this.setImage('powerup');
        this.startTime = new Date().getTime();
    },
               
    handleConstraint : function(cant_go) {
        if( cant_go & C.RIGHT ) {
            this.rect.x = -100;
            setTimeout( (function() { this.rect.x = 0; }).bind(this), 500 );
        }
        if( cant_go & C.BOTTOM ) {
            this.rect.y = -100;
            setTimeout( (function() { this.rect.y = 0; }).bind(this), 500 );
        }
        return false;
    },
               
    toString : function() {
        return "Powerup";
    }
});
Object.inherits(Powerup, Sprite);

var CheesePowerup = Class.create();
Object.extend(CheesePowerup.prototype, Powerup.prototype);
Object.extend(CheesePowerup.prototype, {
    name : 'Shot blocker',
    initialize : function() {
        this._super.initialize.apply(this._super, arguments);
        Object.extend(this, this._super);
    },

    enable : function(game) {
        game.state.bullets.length = 0;
    },

    toString : function() {
        return "CheesePowerup";
    }
});
Object.inherits(CheesePowerup, Powerup);

var MonsterKillerPowerup = Class.create();
Object.extend(MonsterKillerPowerup.prototype, Powerup.prototype);
Object.extend(MonsterKillerPowerup.prototype, {
    name : 'One less killer',
    initialize : function() {
        this._super.initialize.apply(this._super, arguments);
        Object.extend(this, this._super);
    },

    enable : function(game) {
        game.state.monsters.remove(game.state.monsters.length * Math.random());
    },

    toString : function() {
        return "MonsterKillerPowerup";
    }
});
Object.inherits(MonsterKillerPowerup, Powerup);

var TimePowerup = Class.create();
Object.extend(TimePowerup.prototype, Powerup.prototype);
Object.extend(TimePowerup.prototype, {
    name : 'Race against the clock',
    initialize : function() {
        this._super.initialize.apply(this._super, arguments);
        Object.extend(this, this._super);
    },

    enable : function(game) {
        game.state.setupTimer();
        console.log("Old startime", game.state.startTime);
        game.state.startTime = new Date().getTime() - 1000;
        console.log("New time", game.state.startTime);
        console.log("Frac", (new Date().getTime()-game.state.startTime)/game.state.skipTime);
    },

    toString : function() {
        return "TimePowerup";
    }
});
Object.inherits(TimePowerup, Powerup);