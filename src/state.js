var State = Class.create();
Object.extend( State.prototype, {
    name : "",
    nextState : null,

    initialize : function() {},
               
    update : function() {},
               
    draw : function(canvas) {}
});
Object.inherits(State, Object);