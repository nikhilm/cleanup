var Level = Class.create();
Object.extend( Level.prototype, State.prototype );
Object.extend( Level.prototype, {
    name : "",
    map : [], // will be an array of Plates
    
    initialize : function() {},
               
    update : function() {
        for( var i = 0; i < this.map.length; i++ )
            this.map[i].update();
    },
               
    draw : function(canvas) {
        for( var i = 0; i < this.map.length; i++ )
            this.map[i].draw(canvas);
    }
});
Object.inherits(Level, State);