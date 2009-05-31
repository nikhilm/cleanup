var Levels = [
/**
 * Level description:
 *  '#' is one touch plate, '*' is two touch
 *  's' is start position
 */

// LEVEL 0
{
    name : "The first wave",
    map : [ "    #    ",
            "    #    ",
            "    #    ",
            "####s####",
            "#########",
            "    #    ",
            "    #    ",
            "    #    " ]
},

// LEVEL 1
{
    name : "Say cheese",
    map : [ "         ",
            "      #  ",
            "   #  ## ",
            "s     # #",
            "   #  ## ",
            "      #  ",
            "         ",
            "         " ]
},

// LEVEL 2
{
    name : "From alpha to omega",
    map : [ "   ###   ",
            "  ## ##  ",
            " ##   ## ",
            " ##   ## ",
            " ##   ## ",
            "* ## ## *",
            " *** *** ",
            "    s    " ]
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
    
    if( !desc )
        return ret;
    
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