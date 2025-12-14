
/* =============== Level Schema =============== */

type Level = {
    version: 0;
    // The name of the level. Will be displayed in Steam Workshop.
    // Length must be <= 60.
    // Can only contain alphanumeric characters and common symbols (ASCII codes 32 to 126).
    name: string;
    // The description of the level. Will be displayed in Steam Workshop.
    description: string;
    // The color palette for the walls and floors.
    //    0: orange floor & blue walls
    //    1: blue floor & orange/purple walls
    //    2: purple floor & red walls
    //    3: pink floor & purple walls
    //    4: pale green floor & green walls
    //    5: blue floor & green walls
    //    6: white floor & red walls
    colorPalette: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    // The configuration of explosions in this level.
    // There can only be one explosion for each Direction.
    explosions: Explosion[];
    // The cell that the player will start at.
    entrance: TimeMachine;
    // The cell that the player must reach to win.
    exitPosition: Int2;
    // A list of all entities in the level (except for the entrance and exit, which are defined separately).
    // Only some entities can share the same position. See "Entity Overlap Rules" for more details.
    // This array can have at most (MAX_ENTITY_COUNT - 2) elements.
    entities: Entity[];
};

/* =============== Types =============== */

// Must have an integer (whole-number) value.
type Int = number;

// Represents a cell's position in the level.
type Int2 = {
    x: Int;
    y: Int;
};

// Represents the position of an edge between two cells.
type EdgePosition = {
    cell: Int2;
    alignment: "RIGHT" | "TOP";
};

// Represents a direction in the level.
// A direction can also represent a rotation, in which case it encodes
// the rotation from "RIGHT" to itself. For example:
//    - "RIGHT" = 0 deg
//    - "UP"    = 90 deg counter-clockwise
//    - "LEFT"  = 180 deg counter-clockwise
//    - "DOWN"  = 270 deg counter-clockwise
type Direction = "RIGHT" | "UP" | "LEFT" | "DOWN";

type Explosion = {
    // The direction that the explosions will move.
    direction: Direction;
    // The time at which the explosions will reach startPosition
    startTime: Int;
    // The position that explosions will reach when time = startTime.
    // If direction is "LEFT" or "RIGHT", this refers to an x coordinate.
    // If direction is "UP" or "DOWN", this refers to a y coordinate.
    startPosition: Int;
    // A real number that determines the number of turns it takes for the explosions to advance one cell.
    // For example, a value of 2 would mean the explosions advance every other turn.
    period: number;
};

type Entity = TimeMachine | Wall | Curtain | OneWay | Glass | Staff | Sauce | Mushroom | Button | Door | Wire;

// A time machine, including the walls and doors around it.
type TimeMachine = {
    entityType: "TIME_MACHINE";
    position: Int2;
    // The rotation of the time machine. Aligns with the direction the player will move when going through.
    rotation: Direction;
};

// A barrier that blocks vision and movement.
type Wall = {
    entityType: "WALL";
    edgePosition: EdgePosition;
};

// A barrier that blocks vision, but doesn't block movement.
type Curtain = {
    entityType: "CURTAIN";
    edgePosition: EdgePosition;
};

// A barrier that blocks vision and only blocks movement in one direction.
type OneWay = {
    entityType: "ONE_WAY";
    edgePosition: EdgePosition;
    // Determines which direction the OneWay faces.
    // If false, the one-way points in the positive direction (right or up).
    // If true, the one-way points in the negative direction (left or down).
    flipDirection: boolean;
};

// A barrier that blocks movement, but doesn't block vision.
type Glass = {
    entityType: "GLASS";
    edgePosition: EdgePosition;
};

// An item that the player can pick up and move around the level.
type Staff = {
    entityType: "STAFF";
    position: Int2;
};

// A cell in which time doesn't advance.
type Sauce = {
    entityType: "SAUCE";
    position: Int2;
};

// An item that gives the player a status effect.
type Mushroom = {
    entityType: "MUSHROOM";
    position: Int2;
    mushroomType: "BLUE" | "GREEN" | "RED";
};

// A cell that removes status effects from the player.
type CleansingPool = {
    entityType: "CLEANSING_POOL";
    position: Int2;
};

// An cell that activates a channel when overlapping with a Player or a Staff.
type Button = {
    entityType: "BUTTON";
    position: Int2;
    // When this Button is activated, Doors and Wires that share this channel will become activated.
    channel: Int;
};

// A barrier that blocks movement and vision unless a channel is activated.
type Door = {
    entityType: "DOOR";
    edgePosition: EdgePosition;
    // The door opens when this channel is activated.
    channel: Int;
};

// A cosmetic decoration that can indicate connections between buttons and doors.
// 
//          | Right |  Up   | Left  | Down  
// ---------+-------+-------+-------+-------
// Straight |   -   |   |   |   -   |   |   
// ---------+-------+-------+-------+-------
// Corner   |   ┘   |   ┐   |   ┌   |   └   
// 
type Wire = {
    entityType: "WIRE";
    position: Int2;
    rotation: Direction;
    sprite: "STRAIGHT" | "CORNER";
    // The wire lights up when this channel is activated.
    channel: Int;
};

/* =============== Constraints =============== */

// The maximum number of entities allowed in a level.
// This includes the entrance and exit, so the entities array
// has a maximum length of  MAX_ENTITY_COUNT - 2.
const MAX_ENTITY_COUNT: Int = 4000;

// The maximum file size, in bytes (1MB).
const MAX_FILE_SIZE: Int = 1_048_576;

// The maximum position (inclusive) for all entities, the entrance, and the exit.
const MAX_POSITION: Int2 = { x: 192, y: 104 };

// The minimum position (inclusive) for all entities, the entrance, and the exit.
const MIN_POSITION: Int2 = { x: -192, y: -104 };

//
// Entity Overlap Rules
//
//              | TimeMachine | Staff | Sauce | Mushroom | Button | Wire  | Exit  
// -------------+-------------+-------+-------+----------+--------+-------+-------
//  TimeMachine |      N      |   N   |   N   |    N     |    N   |   Y   |   N   
//  Staff       |      -      |   N   |   Y   |    Y     |    Y   |   Y   |   N   
//  Sauce       |      -      |   -   |   N   |    Y     |    Y   |   Y   |   N   
//  Mushroom    |      -      |   -   |   -   |    N     |    Y   |   Y   |   N   
//  Button      |      -      |   -   |   -   |    -     |    N   |   Y   |   N   
//  Wire        |      -      |   -   |   -   |    -     |    -   |   Y   |   Y   
//  Exit        |      -      |   -   |   -   |    -     |    -   |   -   |   N   
// 
//              | Wall | Curtain | OneWay | Glass | Door 
// -------------+------+---------+--------+-------+------
//  Wall        |   N  |    N    |    N   |   N   |   N  
//  Curtain     |   -  |    N    |    N   |   N   |   Y  
//  OneWay      |   -  |    -    |    N   |   N   |   Y  
//  Glass       |   -  |    -    |    -   |   N   |   N  
//  Door        |   -  |    -    |    -   |   -   |   N  
// 

