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