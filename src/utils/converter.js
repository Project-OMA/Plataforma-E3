import { CategoryValues, TileValues } from "./types";

import { getPropsByCategory, VOID_ID } from "./tileService";
import { generateFloors } from "./floor";
import { getBestWalls } from "./walls";

const jsonLayers = {
    DOOR_AND_WINDOWS: "door_and_windows",
    FURNITURE: "furniture",
    UTENSILS: "utensils",
    ELETRONICS: "eletronics",
    GOALS: "interactive_elements",
    PERSONS: "persons"
};

const programmableCounters = {};

export function splitMaterials(layer) {

    const materials = {};

    const height = layer.length;
    if (height === 0) return {};

    const width = layer[0].length;

    for (let y = 0; y < height; y++) {

        for (let x = 0; x < width; x++) {

            const tileId = String(layer[y][x]);

            if (tileId !== VOID_ID) {

                if (!materials[tileId]) {
                    materials[tileId] = Array(height).fill(0).map(() => Array(width).fill(TileValues.EMPTY));
                }

                materials[tileId][y][x] = TileValues.TILE;
            }
        }

    }

    return materials;
}


function convertObjectLayer(layer, category) {

    const objects = [];

    const propsByCategory = getPropsByCategory();
    const categoryProps = propsByCategory[category];

    if (!categoryProps) return [];

    const mainIds = new Set(categoryProps.map(prop => prop.code));

    const height = layer.length;
    if (height === 0) return [];
    const width = layer[0].length;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const id = String(layer[y][x]);

            if (mainIds.has(id)) {
                objects.push({ type: id, pos: [x, y] });
            }
        }
    }

    return objects;
}

function applyTileConversion(layer, optimizationFunc) {

    const materialGrids = splitMaterials(layer);

    const allTiles = [];

    for (const materialId in materialGrids) {

        const grid = materialGrids[materialId];

        const optimizedTiles = optimizationFunc(grid);

        for (const tile of optimizedTiles) {
            tile.type = materialId;

            allTiles.push(tile);
        }

    }

    return allTiles;
}

function resetProgrammableCounters() {
    Object.keys(programmableCounters).forEach(key => {
        delete programmableCounters[key];
    });
}

function generateProgrammableId(baseName) {
    const normalizedBaseName = String(baseName)
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^A-Za-z0-9]/g, "")
        .toUpperCase();

    programmableCounters[normalizedBaseName] =
        (programmableCounters[normalizedBaseName] ?? 0) + 1;

    return `${normalizedBaseName}${programmableCounters[normalizedBaseName] - 1}`;
}

function buildProgrammableLookup(programmableSprites = []) {
    return new Set(
        programmableSprites.map(sprite => `${sprite.layer}:${sprite.x}:${sprite.y}`)
    );
}

function addProgrammableIds(objects, layerName, programmableLookup, category) {
    const propsByCategory = getPropsByCategory();
    const categoryProps = propsByCategory[category] ?? [];

    const codeToName = new Map(
        categoryProps.map(prop => [String(prop.code), String(prop.name)])
    );

    return objects.map(object => {
        const [x, y] = object.pos;
        const key = `${layerName}:${x}:${y}`;

        if (!programmableLookup.has(key)) {
            return object;
        }

        const baseName =
            codeToName.get(String(object.type)) ?? String(object.type);

        return {
            ...object,
            id: generateProgrammableId(baseName)
        };
    });
}

export function convertMap(E3Map) {
    resetProgrammableCounters();
    const { size, programmableSprites = [] } = E3Map;

    const [x, y] = size;
    const optimizedSize = [x / 32, y / 32];

    const programmableLookup = buildProgrammableLookup(programmableSprites);
    const walls = applyTileConversion(E3Map.walls, getBestWalls);
    const floors = applyTileConversion(E3Map.floor, generateFloors);

    const door_and_windows = addProgrammableIds(
        convertObjectLayer(E3Map.door_and_windows, CategoryValues.DOOR_WINDOW),
        jsonLayers.DOOR_AND_WINDOWS,
        programmableLookup,
        CategoryValues.DOOR_WINDOW
    );

    const furniture = addProgrammableIds(
        convertObjectLayer(E3Map.furniture, CategoryValues.FURNITURE),
        jsonLayers.FURNITURE,
        programmableLookup,
        CategoryValues.FURNITURE
    );

    const utensils = addProgrammableIds(
        convertObjectLayer(E3Map.utensils, CategoryValues.UTENSILS),
        jsonLayers.UTENSILS,
        programmableLookup,
        CategoryValues.UTENSILS
    );

    const eletronics = addProgrammableIds(
        convertObjectLayer(E3Map.eletronics, CategoryValues.ELECTRONICS),
        jsonLayers.ELETRONICS,
        programmableLookup,
        CategoryValues.ELECTRONICS
    );

    const goals = addProgrammableIds(
        convertObjectLayer(E3Map.interactive_elements, CategoryValues.GOALS),
        jsonLayers.GOALS,
        programmableLookup,
        CategoryValues.GOALS
    );

    const persons = addProgrammableIds(
        convertObjectLayer(E3Map.persons, CategoryValues.PLAYER),
        jsonLayers.PERSONS,
        programmableLookup,
        CategoryValues.PLAYER
    );

    return {
        size: optimizedSize,
        layers: {
            walls,
            floors,
            door_and_windows,
            furniture,
            utensils,
            eletronics,
            goals,
            persons
        }
    };
}