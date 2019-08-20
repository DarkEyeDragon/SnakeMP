export default class ResourceHandler {
    constructor() {
        this.images = new Map();

    }

    loadImages(){
        let swordImg = new Image();
        swordImg.src = "../img/swords.png";
        this.images.set("sword", swordImg);
    }


    getImage(name) {
        this.images.get(name);
    }

    addImage(name, image) {
        this.images.set(name, image);
    }
}