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

Array.prototype.allNull = function() {
    for( var i = 0; i < this.length; i++ )
        if( this[i] != null )
            return false;
    return true;
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
        var j = Math.floor(Math.random() * (i+1));
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
    return start + Math.floor(Math.random() * dim);
}
           
function comment(html, duration) {
    var commentDiv = document.getElementById('comments');
    commentDiv.innerHTML = html;
    commentDiv.style.visibility = "visible";
    setTimeout(function() { commentDiv.style.visibility = "hidden"; }, duration || 5000);
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
    life.src = 'images/weight-lifting.jpg';
    life.width = 30;
    life.height = 30;
    life.className += 'life';
    hud.appendChild(life);
}

var Cookie = Class.create();
Object.extend( Cookie.prototype, {
    oCookie : {},
    expires : 7*24*60*60*1000, // 7 days from last played
    initialize : function() {
        this.expireString = (new Date(new Date().getTime() + this.expires)).toGMTString();
    },
               
    add : function(key, val) {
        this.oCookie[key] = val;
        return this;
    },
    
    // NOTE: DOES NOT DELETE a set cookie. call this before calling set
    remove : function(key) {
        delete this.oCookie[key];
    },
    
    set : function() {
        for( key in this.oCookie ) {
            document.cookie = key + "=" + this.oCookie[key] + "; expires=" + this.expireString + ";";
        }
        return this;
    },
               
    // NOTE: case sensitive
    get : function(key) {
        var entries = document.cookie.split(';');
        for( var i = 0; i < entries.length ; i++ ) {
            var spl = entries[i].split('=');
            
            function strip(st) { return st.replace(/^[\t\n ]*/, "").replace(/[\t\n ]*$/, ""); };
            
            var k = strip(spl[0]), v = strip(spl[1]);
            if( k == key )
                return v;
        }
        return null;
    }
});
    

/*** CONSTANTS ***/
var C = {
    WORLD_WIDTH : 600,
    WORLD_HEIGHT : 480,
    TILE_WIDTH : 30,
    TILE_HEIGHT : 30,
    
    GRID_TOP : 35,
    GRID_RIGHT : 520,
    GRID_BOTTOM : 425,
    GRID_LEFT : 80,
    
    SPRITE_SIZE : 30,
    
    MONSTER_LEFT : 50,
    MONSTER_RIGHT : 520,
    MONSTER_TOP : 0,
    MONSTER_BOTTOM : 430, // top left corner of left and right monsters maximum
    
    MONSTER_DELTA : 4,
    
    BULLET_SPEED : 2,
    BULLET_RANGE : 420,
    
    CHEF_SPEED : 5,
    
    POWERUP_SPEED : 2,
    POWERUP_EXPIRE : 30*1000,
    POWERUP_WAIT : 20, // not time
    
    // general directions, mainly used to constrain sprites
    TOP : 1,
    RIGHT : 2,
    BOTTOM : 4,
    LEFT : 8
}
