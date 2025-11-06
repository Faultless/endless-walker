import Shooter from "../objects/shooter";

export default class ShootScene extends Phaser.Scene {
    shooter: Shooter;

    constructor() {
        super('ShootScene');
    }

    create() {
        this.shooter = new Shooter(this, 0, this.cameras.main.height);

        this.shooter.moveTo(
            //end of screen
            this.cameras.default.worldView.width
        )

        // a reticle appears, that slowly centers as an indicator for when to press Z for FIRING a GUN
        //
        // if timed correctly, the enemy at the end of the hall dies, otherwise, you take 1 point of damage
        //
        // if you miss, the loop of shooting begins anew, until you succeed or HP reaches 0.
    }

    update() {

    }
}
