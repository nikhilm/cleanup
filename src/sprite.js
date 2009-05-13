var Sprite = Class.create();
Object.extend(Sprite.prototype, {

    initialize : function(x, y, img) {
        this.x = x || 0;
        this.y = y || 0;
        this.dx = 0;
        this.dy = 0;
        this.image = img || null;
    },

    draw : function(canvas) {
        canvas.drawImage(this.image, this.x, this.y, this.image.width, this.image.height);
    },
    
    animate : function(canvas) {
        this.x += this.dx;
        this.y += this.dy;
        if ( this.x > 560 || this.x < /*110*/ 0 )
            this.dx = -this.dx;
        if ( this.y > 420 || this.y < 30 )
            this.dy = -this.dy
        this.draw(canvas);
    },
    
    rect : function() {
        return { x : this.x, y : this.y, width : this.image.width, height : this.image.height };
    },
    
    collidepoint : function(x, y) {
        r = this.rect();
        if( x < r.x || x > r.x + r.width )
            return false;
        if( y < r.y || y > r.y + r.height )
            return false;
        return true;
    },
    
    colliderect : function(rect) {
        r = this.rect();
        
        if( r.x + r.width < rect.x ) return false;
        if( r.x > rect.x + rect.width ) return false;
        if( r.y + r.height < rect.y ) return false;
        if( r.y > rect.y + rect.height ) return false;
        
        return true;
    }
});

/*** Spaghetti monsters ***/
var Monster = Class.create();
Object.extend(Monster.prototype, new Sprite());
Object.extend(Monster.prototype, {
    initialize : function(x, y, img) {
    }
});
