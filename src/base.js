//(c) 2007 Nikhil Marathe (http://22bits.exofire.net). GNU GPL license.
//@version 0.1

/**
 * Adds a method to easily add properties to an objects prototype.
 * To extend Class with properties of AnotherClass just do
 * <code>Object.extend(Class.prototype, AnotherClass)</code>
*/
Object.extend = function(dest, src) {
    //alert("Copying properties of " + src + " to " + dest);
    for(property in src)
        dest[property] = src[property];
    return dest;
};

Object.inherits = function(subclass, superclass) {
    subclass.prototype._super = superclass.prototype;
};

Class = {
    create:function() {
        return function() {
            this.initialize.apply(this, arguments);
        }
    }
};

/**
 * Binds the function to the passed object.
 * @param {Object} The object to bind to
*/
Function.prototype.bind = function(obj) {
    var __method = this;
    return function() {
        __method.apply(obj, arguments);
    }
};

/*** GAME UTILITIES AND CONSTANTS ***/

// returns a shuffled version of this array
// based on python's random.shuffle
Array.prototype.shuffle = function() {
    cpy = new Array();
    for( i = 0; i < this.length ; i++ )
        cpy[i] = this[i];
        
    for( i = this.length - 1; i >= 1; i-- ) {
        j = parseInt(Math.random() * (i+1));
        tmp = cpy[j];
        cpy[j] = cpy[i];
        cpy[i] = tmp;
    }
    return cpy;
}

function rect(x, y, w, h) {
    return { x: x, y : y, width : w, height : h };
}

/*** CONSTANTS ***/
var C = {
    WORLD_WIDTH : 600,
    WORLD_HEIGHT : 480,
    TILE_WIDTH : 30,
    TILE_HEIGHT : 30,
    
    GRID_TOP : 30,
    GRID_RIGHT : 510,
    GRID_BOTTOM : 450,
    GRID_LEFT : 90,
    
    SPRITE_SIZE : 30,
    
    MONSTER_LEFT : 90,
    MONSTER_RIGHT : 510,
    MONSTER_TOP : 0,
    MONSTER_BOTTOM : 420,
    
    MONSTER_DELTA : 3
}
