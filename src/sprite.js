var Sprite = Class.create();
Object.extend(Sprite.prototype, {
    dx : 0,
    dy : 0,
    rect : null,
    image : null,
    constraints : null,
    
    // imgid should be id of img/canvas
    initialize : function(x, y, imgid, dx, dy, constraints) {
        this.dx = dx || 0;
        this.dy = dy || 0;
        this.image = document.getElementById(imgid);
        this.rect = rect(x || 0,
                         y || 0,
                         this.image ? this.image.width : 0,
                         this.image ? this.image.height : 0);
        
        this.constraints = constraints || rect(0, 0, C.WORLD_WIDTH, C.WORLD_HEIGHT);
    },

    draw : function(canvas) {
        canvas.drawImage(this.image, this.rect.x, this.rect.y, this.image.width, this.image.height);
    },
    
    animate : function(canvas) {
        this.rect.x += this.dx;
        this.rect.y += this.dy;
        this.draw(canvas);
        
        if( !this.constraints )
            return;
            
        if ( this.rect.x + this.rect.width > this.constraints.x + this.constraints.width )
            this.dx = -Math.abs(this.dx);
            
        if( this.rect.x < this.constraints.x )
            this.dx = Math.abs(this.dx);
            
        if ( this.rect.y + this.rect.height > this.constraints.y + this.constraints.height )
            this.dy = -Math.abs(this.dy);
            
        if( this.rect.y < this.constraints.y )
            this.dy = Math.abs(this.dy);
    },
    
    collidepoint : function(x, y) {
        r = this.rect;
        if( x < r.x || x > r.x + r.width )
            return false;
        if( y < r.y || y > r.y + r.height )
            return false;
        return true;
    },
    
    colliderect : function(rect) {
        r = this.rect;
        
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

/*** Spaghetti monsters ***/
var Monster = Class.create();
Object.extend(Monster.prototype, Sprite.prototype);
Object.extend(Monster.prototype, {
    initialize : function() {
        this._super.initialize.apply(this, arguments);
    },
    
    toString : function() {
        return "Monster";
    }
});
Object.inherits(Monster, Sprite);
