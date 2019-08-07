const CONSTANTS = require("./constants");
const gridSize = CONSTANTS.gridSize;
class Food {
    constructor() {
        this.generateRandom();
    }

    generateRandom() {
        this.x = Math.floor(Math.random() * CONSTANTS.gridWidth / gridSize) * gridSize;
        this.y = Math.floor(Math.random() * CONSTANTS.gridHeight / gridSize) * gridSize;
    }
}
module.exports = Food;