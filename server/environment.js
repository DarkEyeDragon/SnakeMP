const CONSTANTS = require('./constants');
const food = require('./food');
class Environment{
    static hitsBorder(player){
        if(player.snake[0].x > CONSTANTS.gridWidth-CONSTANTS.gridSize || player.snake[0].x < 0) return true;
        return player.snake[0].y > CONSTANTS.gridHeight-CONSTANTS.gridSize || player.snake[0].y < 0;
    }
}
module.exports = Environment;