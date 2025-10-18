export default class Door extends Phaser.GameObjects.Sprite {
    locked: boolean;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, texture: string, locked: boolean = false) {
        super(scene, x, y, texture, 0);
        this.setDisplaySize(width, height)
        this.preFX?.addGlow(0x00ff00);
        this.setOrigin(0)
        this.locked = locked;
        scene.add.existing(this);
    }

    open() {
        this.locked = false;
    }
}
