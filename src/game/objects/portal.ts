
export default class Portal extends Phaser.GameObjects.Sprite {
    destination: Phaser.Math.Vector2;
    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, destination: any, texture?: string) {
        super(scene, x, y, texture ?? 'door');
        this.setDisplaySize(width, height);
        this.setOrigin(0);
        scene.add.existing(this);
        this.destination = new Phaser.Math.Vector2(destination.x, destination.y);
    }
}
