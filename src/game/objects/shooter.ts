export default class Shooter extends Phaser.GameObjects.Sprite {
    public static readonly SHOOTER_SPEED = 1000;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'shooter');
    }

    moveTo(x: number) {
        this.scene.tweens.add({
            targets: this,
            x,
            ease: 'Power2',
            duration: 2000
        })
    }
}
