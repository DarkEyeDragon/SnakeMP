class Player{
    constructor(id, displayName, x, y, color) {
        this.id = id;
        this.displayName = displayName;
        this.x = x;
        this.y = y;
        this.bodyLength = 1;
        this.pressingRight = false;
        this.pressingLeft = false;
        this.pressingUp = false;
        this.pressingDown = false;
        this.color = color;
    }
    updatePosition(){
        if(this.pressingRight){
            this.x += gridSize;
        }
        if(this.pressingLeft){
            this.x -= gridSize;
        }
        if(this.pressingUp){
            this.y -= gridSize;
        }
        if(this.pressingDown){
            this.y += gridSize;
        }
    }
}
module.exports = Player;