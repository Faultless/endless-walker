import { TILE_SIZE } from "../../helpers/constants";
import { LevelScene } from "../scenes/LevelScene";

export enum SOBRIETY {
    SOBER = 0,
    HAZY = 1,
    HYPERAWARE = 2,
    EGODEATH = 3
}


export default class Player extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0, 'player');
        this.setOrigin(0)
        scene.add.existing(this)
    }

    create() {
        this.setData({ health: 5, sobriety: SOBRIETY.SOBER })
    }

    increaseSobriety() {
        this.setData({ sobriety: this.data.values.sobriety + 1 })
    }

    decreaseSobriety() {
        this.setData({ sobriety: this.data.values.sobriety - 1 })
    }

    move(direction: string) {
        let positionX, positionY;
        switch (direction) {
            case 'up':
                positionX = this.x;
                positionY = this.y - TILE_SIZE;
                break;
            case 'down':
                positionX = this.x;
                positionY = this.y + TILE_SIZE;
                break;
            case 'left':
                positionX = this.x - TILE_SIZE;
                positionY = this.y;
                break;
            case 'right':
                positionX = this.x + TILE_SIZE;
                positionY = this.y;
                break;
            default:
                positionX = this.x;
                positionY = this.y;
        }
        const collisionLayer = (this.scene as LevelScene).collisionLayer;
        const portal = (this.scene as LevelScene).portal;
        if (positionX > collisionLayer[0].length * TILE_SIZE || positionX < 0) return;
        if (positionY >= collisionLayer.length * TILE_SIZE || positionY < 0) return;
        if (positionX === portal.x && positionY === portal.y) {
            this.setPosition(portal.destination.x, portal.destination.y);
            return;
        }
        if (collisionLayer[Math.ceil(positionY / TILE_SIZE)][Math.ceil(positionX / TILE_SIZE)] === 0) this.setPosition(positionX, positionY);
    }

    hit(dmg: number = 1) {
        this.setData({ health: this.data.values.health - dmg })
        if (this.getData('health') <= 0)
            this.die();
    }

    die() {
        this.play('player-death').once('animationcomplete', () => this.destroy());
    }

}
