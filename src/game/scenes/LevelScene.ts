import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import Player from '../objects/player';
import Plane from '../world/plane';
import { parseEntities, parseIntGrid, parseTileLayer } from '../../parser/ldtk';
import { Coordinate, FieldInstance, LayerInstance } from '../../parser/Convert';
import Door from '../objects/door';
import Item from '../objects/item';
import Portal from '../objects/portal';

export class LevelScene extends Scene {
    levelId: number;
    ldtkData: Coordinate;
    camera: Phaser.Cameras.Scene2D.Camera;
    player: Player;
    labyrinth: Plane;
    backgroundLayer: Phaser.Tilemaps.TilemapLayer;
    foregroundLayer: Phaser.Tilemaps.TilemapLayer;
    collisionLayer: any[][];
    portal: Portal;
    keys?: Record<string, any>;
    entities?: any[];

    constructor(levelId: string, ldtkData: Coordinate) {
        super("LevelScene-" + levelId);
        this.levelId = Number(levelId);
        this.ldtkData = ldtkData;
        this.sound?.stopAll()
    }

    init(data: { ldtkData: Coordinate }) {
        this.data.set('ldtkData', data.ldtkData);
    }

    create() {
        const ldtkData: Coordinate = this.data.get('ldtkData');
        // map builder
        const map = this.make.tilemap({ key: 'stoneTiles', tileWidth: 8, tileHeight: 8, height: 32, width: 32 });
        const tilesets = { stoneTiles: map.addTilesetImage('stoneTiles', undefined, 8, 8)! };
        ldtkData.levels[this.levelId]?.layerInstances?.forEach((layer: LayerInstance) => {
            let l;
            if (layer.__type === "IntGrid") {
                l = parseIntGrid(layer); if (layer.__identifier.includes('Collision')) this.collisionLayer = l!;
            }
            if (layer.__type === "Tiles" || layer.__type === "AutoLayer") {
                l = parseTileLayer(map, tilesets!, layer);
                this.foregroundLayer = l;
            }
            if (layer.__type === "Entities") {
                this.entities = parseEntities(layer);
            }
            console.log('layer', l);
        });

        this.player = new Player(this);
        this.player.setDepth(2);

        this.entities?.forEach(entity => {
            if (entity.type === 'Door') {
                const door = new Door(this, entity.x, entity.y, entity.width, entity.height, 'door', !(entity.props as FieldInstance[])[0].__value);
                this.collisionLayer[entity.y / 8][entity.x / 8] = 1;
                console.log('door', door);
            }
            if (entity.type === 'Item') {
                const item = new Item(this, entity.x, entity.y, (entity.props as FieldInstance[])[0].__value);
                console.log('item', item)
            }
            if (entity.type === 'PlayerStart') {
                this.player.setPosition(entity.x, entity.y);
            }
            if (entity.type === 'Portal') {
                this.portal = new Portal(this, entity.x, entity.y, entity.width, entity.height, entity.props[0].__value);
            }
        })

        const keys = this.input.keyboard?.addKeys('W,A,S,D');

        this.keys = keys;

        this.camera = this.cameras.main;

        EventBus.emit('current-scene-ready', this);
    }

    changeScene() {
        this.scene.start('GameOver');
    }

    update() {
        const { W, A, S, D } = this.keys!;

        if (Phaser.Input.Keyboard.JustDown(W)) this.player.move('up');
        if (Phaser.Input.Keyboard.JustDown(A)) this.player.move('left');
        if (Phaser.Input.Keyboard.JustDown(S)) this.player.move('down');
        if (Phaser.Input.Keyboard.JustDown(D)) this.player.move('right');

        this.player.update();
    }

}
