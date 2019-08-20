class Collision {
    constructor(type, isHeadCollision = false) {
        this.player = null;
        this.target = null;
        this.isCollision= true;
        this.isHeadCollision = isHeadCollision;
        this.location = {x: 0, y: 0};
        this.type = type;
    }
}
module.exports = Collision;