title = "WALL JUMPER";

description = `
`;

characters = [];

const G = {
  WIDTH: 100,
  HEIGHT: 150,
  
  WALL_SIZE: 6,
  WALL_ANIM: false,

  PLAYER_JUMP_X: 2,
  PLAYER_JUMP_Y: 0.4,

  PLAYER_START_POS_X: 10,
  PLAYER_START_POS_Y: 90,

  PLAYER_FALL_SPEED: 0.2,

  HALF_A_SECOND: 30,

  ENEMY_SPAWN_CHANCE: 25,

  ENEMY_SPEED_MIN: 0.5,
  ENEMY_SPEED_MAX: 0.8,

  SPAWN_X_MIN: 18,
  SPAWN_X_MAX: 82
}

options = {
  viewSize: {x: G.WIDTH, y: G.HEIGHT},
  isCapturing: true,
  isCapturingGameCanvasOnly: true,
  captureCanvasScale: 2
};

/**
 * @typedef {{
 * pos: Vector,
 * speed: number,
 * direction: Vector,
 * jumping: boolean,
 * flipped: boolean
 * }} Player
 */

/**
 * @type { Player }
 */
let player;

/**
 * @typedef {{
 * squareSize: number
 * }} Wall
 */

/**
* @type  { Wall [] }
*/
let walls;

/**
 * @typedef {{
 * pos: Vector,
 * speed: number
 * }} Enemy
 */

/**
* @type  { Enemy [] }
*/
let enemies = new Array();

/**
* @typedef {{
* timer: number,
* active: boolean
* }} Timer
*/


function update() {
  if (!ticks)
  {
    initPlayer();
    //initObstacles();
  }

  if (input.isJustPressed)
    player.jumping = true;

  updateWalls(ticks);
  updateEnemies(ticks);
  updatePlayer();

  if (ticks % 60 == 0)
    score++;
}

characters = [
`
rrrrrr
rwrrwr
rrrrrr
rwrrwr
rrwwrr
rrrrrr
`,

`
gggggg
bbbbbb
gggggg
bbbbbb
gggggg
bbbbbb
`,

`
bbbbbb
gggggg
bbbbbb
gggggg
bbbbbb
gggggg
`,

`
bbbbbb
bwbbwb
bbbbbb
bwbbwb
bbwwbb
bbbbbb
`,
]

function initPlayer()
{
  player = {
      pos: vec(G.PLAYER_START_POS_X, G.PLAYER_START_POS_Y),
      speed: G.PLAYER_SPEED,
      direction: vec(G.PLAYER_JUMP_X, G.PLAYER_JUMP_Y),
      jumping: false,
      flipped: false,
    };
}

function updateWalls(ticks)
{
  if (ticks % 6 == 0)
  {
    G.WALL_ANIM = !G.WALL_ANIM;
  }

  const wallSprite = G.WALL_ANIM?"b":"c"

  for (let i = 1; i < 3; i++)
    for (let j = 0; j < 26; j++)
    {
      if (i == 1)
        char(wallSprite, 0 + G.WALL_SIZE, j * G.WALL_SIZE);
      else if (i == 2)
        char(wallSprite, G.WIDTH - G.WALL_SIZE, j * G.WALL_SIZE);
    }
}

function updateEnemies(ticks)
{
  trySpawnEnemy(ticks);
  enemies.forEach((e) =>
  {
    char("d", e.pos.x, e.pos.y);
    // update enemy position.
    e.pos.y += e.speed;

    // if enemy is past the bottom of the screen, delete it.
    if (e.pos.y > G.HEIGHT)
      // Don't actually care about this. Don't have time.
      return;
  });
}

function trySpawnEnemy(ticks)
{
  // If you hit a certain random number every 30-60 frames...
  // Spawn an enemy in a particular region.
  if (ticks % 30 == 0)
  {
    if ((rndi(0, 100) < G.ENEMY_SPAWN_CHANCE))
    {
      enemies.push({pos: vec(rndi(G.SPAWN_X_MIN, G.SPAWN_X_MAX), 0), speed: rnd(G.ENEMY_SPEED_MIN, G.ENEMY_SPEED_MAX)})
    }
  }
}

function updatePlayer()
{

  const flipDirection = player.flipped? -1: 1

  if (player.jumping)
  {
    player.pos.y -= G.PLAYER_JUMP_Y;
    player.pos.x += G.PLAYER_JUMP_X * flipDirection;
  }

  if (!player.jumping)
    player.pos.y = player.pos.y + G.PLAYER_FALL_SPEED;

  if (checkEnemyCollision())
  {
    enemies.length = 0;
    end();
  }

  if (checkWallCollision())
  {
    if (player.jumping)
    {
      player.jumping = false;
      player.flipped = !player.flipped;
    }
  }

  if (player.pos.y - 3 > G.HEIGHT || player.pos.y + 3 < 0)
  {
    enemies.length = 0;
    end();
  }
}

function checkWallCollision()
{
    let collided1 = char("a", player.pos.x, player.pos.y).isColliding.char.b;
    let collided2 = char("a", player.pos.x, player.pos.y).isColliding.char.c;
    console.log(`${collided1}, ${collided2}`)

  return collided1 || collided2;
}

function checkEnemyCollision()
{
  return char("a", player.pos.x, player.pos.y).isColliding.char.d;
}