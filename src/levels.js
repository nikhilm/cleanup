var Levels = [
/**
 * Level description:
 *  '#' is one touch plate, '*' is two touch
 *  's' is start position
 */

// LEVEL 0
{},

// LEVEL 1
{},

// LEVEL 2
{
    name : "",
    map : [ "#       #",
            "  ## ##  ",
            " ##   ## ",
            " ##   ## ",
            "  ##s##  ",
            "         ",
            "         ",
            "#       #" ]
}

];






/** Level parser **/

/**
 * Returns {
    startX : n,
    startY : n,
    map : [ ... plates ... ]
    }
 */
function createLevel(desc) {
    var ret = {
        startX: -1,
        startY: -1,
        map : []
    };
    desc.map.each( (function(line, i) {
        for( var j = 0; j < line.length; j++ )
        {
            var x = C.GRID_LEFT + j * 50;
            var y = C.GRID_TOP + i * 50;
            
            if( line[j] == '#' )
                ret.map.push( new Plate(1, x, y) );
            else if( line[j] == '*' )
                ret.map.push( new Plate(2, x, y) );
            else if( line[j] == 's' ) {
                ret.startX = x;
                ret.startY = y;
            }
        }
    }).bind(this) );
    
    return ret;
}