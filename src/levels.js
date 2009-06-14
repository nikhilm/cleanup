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
},

// LEVEL 3
{
    name : "Genetically modified",
    map : [ "  *#     ",
            "#* #     ",
            " #####   ",
            "   # *#  ",
            " s #* #  ",
            "    #####",
            "      # *",
            "      #* " ]
},

// LEVEL 4
{
    name : "Life is a game",
    map : [ "###   ## ",
            "#      ##",
            "   ***   ",
            "    *  ##",
            "*      ##",
            "*  #     ",
            "*  #  ** ",
            "* ## ** s" ]
},

// LEVEL 5
{
    name : "Upvote the chef",
    map : [ "    *   s",
            "   ***   ",
            "  *****  ",
            "    *    ",
            "    #    ",
            "  #####  ",
            "   ###   ",
            "    #    " ]
},

// LEVEL 6
{
    name : "Functional food",
    map : [ "*    s   ",
            "**       ",
            "  *      ",
            "   *     ",
            "    *    ",
            "   * *   ",
            "  *   *  ",
            "**     **"]
},

// LEVEL 7
{
    name : "Gearheads",
    map : [ "    #   #",
            "  **#  # ",
            " ** # #  ",
            "**  ##  s",
            "*   # #  ",
            "**  # *# ",
            " ** *** #",
            "  ***    "]
},

// LEVEL 8
{
    name : "Lights off",
    map : [ "    *   s",
            "  # * #  ",
            " #  *  # ",
            "#   *   #",
            "#   *   #",
            " #     # ",
            "  #   #  ",
            "   ###   "]
},

// LEVEL 9
{
    name : "Enigma",
    map : [ "   ####  ",
            "  ##  ## ",
            "      ## ",
            "     ##  ",
            "  s ##   ",
            "    **   ",
            "    **   ",
            "         "]
},

// LEVEL 10
{
    name : "The last battle",
    map : [ "     ****",
            "    #   *",
            "  s #   *",
            "    #### ",
            " ####    ",
            "*   #    ",
            "*   #    ",
            "****     "]
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