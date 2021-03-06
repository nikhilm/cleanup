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

    fire : function(bullet_arr) {
        var oldimage = (this.image.id.indexOf('-hot') == -1) ? this.image.id : this.image.id.replace('-hot', '');
        this.setImage(oldimage + '-hot');
        
        setTimeout( (function() {
            var b = new Bullet(0, 0);
            
            switch( this.direction ) {
                case C.TOP :
                    b.rect.x = this.rect.x + this.rect.width/2;
                    b.rect.y = this.rect.y + this.rect.height;
                    b.dy = C.BULLET_SPEED;
                    b.direction = C.BOTTOM;
                    break;
                    
                case C.RIGHT :
                    b.rect.x = this.rect.x;
                    b.rect.y = this.rect.y + this.rect.height/2;
                    b.dx = -C.BULLET_SPEED;
                    b.direction = C.LEFT;
                    break;
                    
                case C.BOTTOM :
                    b.rect.x = this.rect.x + this.rect.width/2;
                    b.rect.y = this.rect.y - b.rect.height;
                    b.dy = -C.BULLET_SPEED;
                    b.direction = C.TOP;
                    break;
                    
                case C.LEFT :
                    b.rect.x = this.rect.x + this.rect.width;
                    b.rect.y = this.rect.y + this.rect.height/2;
                    b.dx = C.BULLET_SPEED;
                    b.direction = C.RIGHT;
                    break;
            }            
            this.setImage(oldimage);
            bullet_arr.push(b);
        }).bind(this), 800 );
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
            return false;
        }
        
        if( this.collideRect(chef.rect) ) {
            this.touching = true;
            this.touched += 1;
            this.setImage('plate-img-'+Math.max(1, (this.touches-this.touched)));
            return true;
        }
        return false;
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
    shield_ : null,
    initialize : function() {
        this._super.initialize.apply(this, arguments);
        this.setImage('chef-top');
    },
    
    handleConstraint : function(cant_go) {
        if( cant_go & (C.RIGHT|C.LEFT) ) this.dx = 0;
        if( cant_go & (C.TOP|C.BOTTOM) ) this.dy = 0;
        return false;
    },

    update : function(game) {
        this._super.update.apply(this, arguments);
        
        if( this.shield_ ) {
            this.shield_.dx = this.dx;
            this.shield_.dy = this.dy;
            this.shield_.update(game);
        }   
    },
               
    draw : function(canvas) {
        this._super.draw.apply(this, arguments);
        if( this.shield_ )
            this.shield_.draw(canvas);
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

    shield : function() {
        this.shield_ = new Sprite(this.rect.x-5, this.rect.y-5, 'shield-strong', this.dx, this.dy);
        setTimeout( (function() {
            this.shield_ = new Sprite(this.rect.x-5, this.rect.y-5, 'shield-weak', this.dx, this.dy);
            setTimeout( (function() {
                this.shield_ = null;
            }).bind(this), 2000 );
        }).bind(this), 5000 );
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
        this.setImage('powerup-cheese');
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
        this.setImage('powerup-monster');
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
        this.setImage('powerup-timer');
    },

    enable : function(game) {
        game.state.setupTimer();
        var nt = new Date().getTime();
        
        var add = 3000;
        var diff = nt - game.state.startTime;
        if( diff > game.state.skipTime )
            game.state.startTime = nt - (game.state.skipTime - add);
        else            
            game.state.startTime += Math.min(diff, add);
    },

    toString : function() {
        return "TimePowerup";
    }
});
Object.inherits(TimePowerup, Powerup);

var LifePowerup = Class.create();
Object.extend(LifePowerup.prototype, Powerup.prototype);
Object.extend(LifePowerup.prototype, {
    name : 'Extra Life',
    initialize : function() {
        this._super.initialize.apply(this._super, arguments);
        Object.extend(this, this._super);
        this.setImage('powerup-life');
    },

    enable : function(game) {
        game.lives += 1;
        hudAddLife();
    },

    toString : function() {
        return "LifePowerup";
    }
});
Object.inherits(LifePowerup, Powerup);

var ShieldPowerup = Class.create();
Object.extend(ShieldPowerup.prototype, Powerup.prototype);
Object.extend(ShieldPowerup.prototype, {
    name : 'New apron',
    initialize : function() {
        this._super.initialize.apply(this._super, arguments);
        Object.extend(this, this._super);
        this.setImage('shield-strong');
    },

    enable : function(game) {
        game.state.chef.shield();
    },

    toString : function() {
        return "ShieldPowerup";
    }
});
Object.inherits(ShieldPowerup, Powerup);

function randomPowerup() {
    var pows = [ CheesePowerup, MonsterKillerPowerup, TimePowerup, ShieldPowerup, LifePowerup ];
    return new pows[Math.floor(Math.random()*pows.length)]( -50, -50 );
}