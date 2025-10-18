import { FieldInstance, LayerInstance, ReferenceToAnEntityInstance } from "./Convert";

export const parseTileLayer = (
    map: Phaser.Tilemaps.Tilemap,
    tilesets: Record<string, Phaser.Tilemaps.Tileset>,
    layer: LayerInstance,
) => {
    const tileSize = layer.__gridSize;
    const phaserLayer = map.createBlankLayer(
        layer.__identifier,
        Object.values(tilesets),
    )!;
    layer.autoLayerTiles.forEach((tile) => {
        const [px, py] = tile.px;
        // Extract tileset key from LDtk src
        const srcKey = layer.__tilesetRelPath?.split("/").pop()?.replace(
            ".png",
            "",
        )!;
        const tileset = tilesets[srcKey];
        if (!tileset) {
            console.warn(`No tileset found for src=${tile.src}`);
            return;
        }
        const gid = tile.t + tileset.firstgid;
        map.putTileAt(
            gid,
            Math.floor(px / tileSize),
            Math.floor(py / tileSize),
            true,
            phaserLayer,
        );
    });
    return phaserLayer;
}

export const parseEntities = (layer: LayerInstance) => {
    return layer.entityInstances.map((entity) => {
        const [x, y] = entity.px;
        return {
            x,
            y,
            width: entity.width,
            height: entity.height,
            type: entity.__identifier,
            props: entity.fieldInstances
        }
    });
}

export const parseIntGrid2 = (
    map: Phaser.Tilemaps.Tilemap,
    tilesets: Record<string, Phaser.Tilemaps.Tileset>,
    layer: LayerInstance,
) => {
    const tileSize = layer.__gridSize;

    const phaserLayer = map.createBlankLayer(layer.__identifier, tilesets[0]);
    layer.autoLayerTiles.forEach((tile) => {
        const [px, py] = tile.px;
        // LDtk stores src like "tiles/brick-tilemap.png" → match against tileset keys
        const srcKey = layer.__tilesetRelPath?.split("/").pop()?.replace(
            ".png",
            "",
        )!;
        const tileset = tilesets[srcKey!];
        if (!tileset) {
            console.warn(`No tileset found for src=${tile.src}`);
            return;
        }
        // tile.t is the index inside LDtk tileset, offset it by tileset.firstgid
        const gid = tile.t + tileset.firstgid;
        tile.f;
        // Place tile into layer
        const placedTile = map.putTileAt(
            gid,
            Math.floor(px / tileSize),
            Math.floor(py / tileSize),
            true,
            phaserLayer!,
        )!;
        // Apply flip based on LDtk f property
        switch (tile.f) {
            case 1: // flipX
                placedTile.setFlipX(true);
                break;
            case 2: // flipY
                placedTile.setFlipY(true);
                break;
            case 3: // flip both
                placedTile.setFlipX(true);
                placedTile.setFlipY(true);
                break;
        }
    });
    phaserLayer?.setDepth(20);
    return phaserLayer;
}

function chunkArray(arr: any[], rowSize: number) {
    return Array.from({ length: Math.ceil(arr.length / rowSize) }, (_, i) =>
        arr.slice(i * rowSize, i * rowSize + rowSize)
    );
}

export const parseIntGrid = (layer: LayerInstance) => {
    console.log("int layer", layer)
    const intMap = chunkArray(layer.intGridCsv, layer.__cWid);
    console.log('intMap', intMap);
    return intMap;
}
