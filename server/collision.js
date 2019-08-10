class Collision {
    constructor(type, isHeadCollision = false) {
        this.isCollision= true;
        this.isHeadCollision = isHeadCollision;
        this.location = {x: 0, y: 0};
        this.type = type;
    }

}
module.exports = Collision;