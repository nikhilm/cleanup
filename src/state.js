var State = Class.create();
Object.extend( State.prototype, {
    name : "",
    nextState : null,

    initialize : function() {},
               
    update : function() {},
               
    draw : function(canvas) {}
});
Object.inherits(State, Object);

var MenuState = Class.create();
Object.extend( MenuState.prototype, State.prototype );
Object.extend( MenuState.prototype, {
    name : "Menu",
    
    initialize : function() {
        this._super.apply(this, arguments);
    },
    
    draw : function() {
    },
               
    toString : function() {
        return this.name;
    }
});
Object.inherits( MenuState, State );