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
        if ( this.x > 500 || this.x < 110 )
            this.dx = -this.dx;
        if ( this.y > 420 || this.y < 30 )
            this.dy = -this.dy
        this.draw(canvas);
    }
});