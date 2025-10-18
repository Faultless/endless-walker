export default class Plane extends Phaser.GameObjects.Plane {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame: string, width: number, height: number, tile: true) {
        super(scene, x, y, texture, frame, width, height, tile);
        this.scene.add.existing(this);
    }

    // preUpdate(time, delta) {}
}
