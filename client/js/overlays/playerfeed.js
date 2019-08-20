class PlayerFeed{
    constructor(ctx, width= 200, height = 500, color = "white"){
        this.ctx = ctx;
        this.data = [];
        this.width = width;
        this.height = height;
        this.x = 1920-width;
        this.y = 0;
        this.color = color;
        this.padding = 10;
    }
    //TODO CONTINUE
    draw(){
        const ctx = this.ctx;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        for (let i = 0; i < this.data.length; i++) {
            let element = this.data[i];
            ctx.fillText(element.first, this.x+this.padding, this.padding+i*this.padding);
            ctx.drawImage();
            ctx.fillText(element.second, this.x+this.padding, this.padding+i*this.padding);
        }
    }
    add(feedElement){
        this.data.unshift(feedElement);
    }
}