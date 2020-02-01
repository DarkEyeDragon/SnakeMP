const CONSTANTS = require('./constants');
const food = require('./food');
const Collision = require('./collision');

class Environment {

    static getRanLocation() {
        return {
            x: Math.floor((Math.random() * CONSTANTS.gridWidth / CONSTANTS.gridSize)) * CONSTANTS.gridSize,
            y: Math.floor((Math.random() * CONSTANTS.gridHeight / CONSTANTS.gridSize)) * CONSTANTS.gridSize
        }
    };

    static startPosition(sockets) {
        let location = this.getRanLocation();
        for (let socket of sockets) {
            let player = socket.player;
            let snake = player.snake;
            for (let i = 0; i < snake.length; i++) {
                if (location.x === snake[i].x && location.y === snake[i].y) {
                    this.startPosition(sockets);
                }
            }
        }
        return {x: location.x, y: location.y}
    }
}

module.exports = Environment;