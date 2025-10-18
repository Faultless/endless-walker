
export enum ITEM {
    KEY = 'key',
    HEALING_POT = 'healingPot'
}

export default class Item extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number, type: string = ITEM.KEY) {
        super(scene, x, y, type);
        scene.add.existing(this);
    }
}
