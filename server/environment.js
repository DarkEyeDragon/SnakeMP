const CONSTANTS = require('./constants');
const food = require('./food');
const Collision = require('./collision');

class Environment {
    static hitsBorder(player) {
        return player.snake[0].y > CONSTANTS.gridHeight - CONSTANTS.gridSize || player.snake[0].y < 0;
    }

    //Don't be hitting yourself. It will be the death of you.
    static hitsSelf(player) {
        const head = player.snake[0];
        for (let i = 1; i < player.snake.length; i++) {
            if (head.x === player.snake[i].x && head.y === player.snake[i].y) {
                return new Collision(CONSTANTS.collision.HEAD_TO_BODY);
            }
        }
        let collision = new Collision(CONSTANTS.collision.HEAD_TO_BODY);
        collision.isCollision = false;
        return collision;
    }

    //Check if you're hitting someones body, if so, you die.
    static hitsOther(player, socketList) {
        for (let socket of socketList) {
            let target = socket.player;
            if (player !== target) {
                const playerHead = player.snake[0];
                const targetHead = target.snake[0];
                if (playerHead.x === targetHead.x && playerHead.y === targetHead.y) {
                    let collision = new Collision(CONSTANTS.collision.HEAD_TO_HEAD);
                    collision.location = {x: playerHead.x, y: playerHead.y};
                    collision.player = player;
                    collision.target = target;
                    return collision;
                }
                for (let i = 0; i < target.snake.length; i++) {
                    if (playerHead.x === target.snake[i].x && playerHead.y === target.snake[i].y) {
                        let collision = new Collision(CONSTANTS.collision.HEAD_TO_BODY);
                        collision.location = {x: target.snake[i].x, y: target.snake[i].y};
                        collision.target = target;
                        collision.player = player;
                        return collision;
                    }
                }
            }
        }
        let collision = new Collision(CONSTANTS.collision.HEAD_TO_BODY);
        collision.isCollision = false;
        return collision;
    }

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