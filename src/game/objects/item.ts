
export enum ITEM {
    KEY = 'Key',
    HEALING_POT = 'Healing_Potion'
}

export default class Item extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number, type: string = ITEM.KEY) {
        super(scene, x, y, type);
        this.setOrigin(0)
        scene.add.existing(this);
    }
}
