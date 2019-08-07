export default class Menu{
    constructor(ctx){
        this.ctx = ctx;
        this.textArray = [];
        this.buttonArray = [];
    }
    addText(text, x, y, fontsize = 14, color = "black"){
        console.log(color);
        this.textArray.push({text : text, x: x, y:y, fontsize: fontsize, color: color});
    }
    addButton(text, x, y, width, height){
        this.buttonArray.push({text : text, x : x, y : y, width: width, height: height});
    }
    drawButtons(){
        let ctx = this.ctx;
        let buttonArray = this.buttonArray;
        ctx.fillStyle = "lightblue";
        ctx.textAlign = "center";
        for (let i = 0; i < buttonArray.length; i++) {
            ctx.fillRect(buttonArray[i].x, buttonArray[i].y, buttonArray[i].width, buttonArray[i].height);
            ctx.fillStyle = "black";
            ctx.fillText(buttonArray[i].text, buttonArray[i].x+buttonArray[i].width/2, buttonArray[i].y+buttonArray[i].height/1.5);
        }

    }
    drawText(){
        for (let i = 0; i < this.textArray.length; i++) {
            this.ctx.fillStyle = this.textArray[i].color;
            this.ctx.font = `normal ${this.textArray[i].fontsize}px Verdana`;
            this.ctx.fillText(this.textArray[i].text, this.textArray[i].x, this.textArray[i].y);
        }
    }
    draw(){
        this.ctx.clearRect(0,0 , this.ctx.canvas.width, this.ctx.canvas.height);
        this.drawButtons();
        this.drawText();
    }

}


/*export default class MenuHandler{
    constructor(){
        this.menuArray = []
    }

    addMenu(menu){
        if(menu instanceof Menu){
            this.menuArray.push(menu);
        }
    }
    removeMenu(menu){
        this.menuArray.splice(this.menuArray.indexOf(menu),1);
    }
    clickEvent(){
        for (let i = 0; i < this.menuArray; i++) {

        }
    }
}*/