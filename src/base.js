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

Array.prototype.clone = function() {
    var cpy = new Array();
    for( var i = 0; i < this.length ; i++ )
        cpy[i] = this[i];
    return cpy;
}
    
/*
 * Removes element at index i, returns the array.
 */
Array.prototype.remove = function(i) {
    this.splice(i,1);
    return this;
}

/*
 * Pass a function f(elt) or f(elt, i)
 */
Array.prototype.each = function(fun) {
    for( var i = 0; i < this.length; i++ ) {
        fun(this[i], i);
    }
}

// returns a shuffled version of this array
// based on python's random.shuffle
Array.prototype.shuffle = function() {    
    var cpy = this.clone();
    for( var i = this.length - 1; i >= 1; i-- ) {
        var j = parseInt(Math.random() * (i+1));
        tmp = cpy[j];
        cpy[j] = cpy[i];
        cpy[i] = tmp;
    }
    return cpy;
}

function rect(x, y, w, h) {
    return { x: x, y : y, width : w, height : h };
}

// start <= random x < start+dim
function rpos(start, dim) {
    return start + parseInt(Math.random() * dim);
}
           
function comment(html) {
    document.getElementById('comments').innerHTML = html;
    setTimeout(function() { document.getElementById('comments').innerHTML = "" }, 5000);
}

function hudRemoveLife() {
    var hud = document.getElementById('lives');
    console.log(hud.getElementsByTagName('img')[0]);
    hud.removeChild(hud.getElementsByTagName('img')[0]);
    /*var blank = document.createElement('img');
    blank.src = 'blank.png';
    hud.appendChild(blank);*/
}

function hudAddLife() {
    var hud = document.getElementById('lives');
    var life = document.createElement('img');
    life.src = 'weight-lifting.jpg';
    life.width = 30;
    life.height = 30;
    life.className += 'life';
    hud.appendChild(life);
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
    MONSTER_BOTTOM : 420, // top left corner of left and right monsters maximum
    
    MONSTER_DELTA : 3,
    
    BULLET_SPEED : 2,
    BULLET_RANGE : 420,
    
    CHEF_SPEED : 3,
    
    // general directions, mainly used to constrain sprites
    TOP : 1,
    RIGHT : 2,
    BOTTOM : 4,
    LEFT : 8
}
