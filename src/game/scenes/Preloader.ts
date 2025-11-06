import { Scene } from 'phaser';
import { Convert } from '../../parser/Convert';
import { LevelScene } from './LevelScene';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload() {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image('logo', 'logo.png');
        this.load.image('star', 'star.png');
        this.load.image('player', 'playerIdle.png')
        this.load.json('labyrinth', 'lab.ldtk')
        this.load.image('stoneTiles', 'stoneTiles.png')
        this.load.image('Key', 'key.png');
        this.load.image('Healing_Potion', 'healingPotion.png');
        this.load.spritesheet('door', 'stoneTiles.png', { frameWidth: 8, frameHeight: 8, startFrame: 9, endFrame: 10 });
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.
        const ldtkData = this.cache.json.get("labyrinth");
        const schema = Convert.toCoordinate(JSON.stringify(ldtkData));
        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        schema.levels.forEach((level) => {
            console.log("level", level, level.identifier)
            this.scene.add(
                level.identifier,
                new LevelScene(level.identifier),
                false,
            );
        });
        this.registry.set('schema', schema);
        this.scene.start('Level_0');
    }
}
