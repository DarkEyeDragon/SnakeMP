const CONSTANTS = require('./constants');
const food = require('./food');
const Collision = require('./collision');

class Environment {
    static hitsBorder(player) {
        if (player.snake[0].x > CONSTANTS.gridWidth - CONSTANTS.gridSize || player.snake[0].x < 0) return true;
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

    static hitsOther(player, socketList) {
        for (let socket of socketList) {
            let target = socket.player;
            if(!(target === player)) {
                const playerHead = player.snake[0];
                const targetHead = target.snake[0];
                if (playerHead.x === targetHead.x && playerHead.y === targetHead.y) {
                    let collision = new Collision(CONSTANTS.collision.HEAD_TO_HEAD);
                    collision.location = {x: playerHead.x, y: playerHead.y};
                    collision.otherPlayer = target;
                    return collision;
                }
                for (let i = 1; i < player.snake.length; i++) {
                    for (let j = 1; j < target.snake.length; j++) {
                        if (player.snake[i].x === target.snake[j].x && player.snake[i].y === target.snake[j].y) {
                            let collision = new Collision(CONSTANTS.collision.HEAD_TO_BODY);
                            collision.location = {x: player.snake[i].x, y: player.snake[i].y};
                            collision.otherPlayer = target;
                            return collision
                        }
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
            x: Math.floor((Math.random() * CONSTANTS.gridWidth/CONSTANTS.gridSize))*CONSTANTS.gridSize ,
            y: Math.floor((Math.random() * CONSTANTS.gridHeight/CONSTANTS.gridSize))*CONSTANTS.gridSize
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