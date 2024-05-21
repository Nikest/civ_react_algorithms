// @ts-ignore
import * as Hexasphere from 'hexasphere.js';
//import * as Hexatest from './Hexatest.mjs';
// @ts-ignore
import FastNoiseLite from "fastnoise-lite";
import { Procedural } from '../Procedural';
import { generatePlanetName } from '../wordGenerator';
import * as utils from '../utils';

export interface IPlanetTile {
    index: number;
    type: 'liquid' | 'land';
    landGroup: number;
    iron: number;
    copper: number;
    lithium: number;
    aluminum: number;
    titanium: number;
    uranium: number;
    isExplored: boolean;
    isColonized: boolean;
    cityId: string;
    citiDistrictId: string;
    isPolarCircle: boolean;
    color: string;
}

export interface ITile {
    visited: boolean;
    boundary: {
        x: number;
        y: number;
        z: number;
    }[]; // 3D координаты вершин
    centerPoint: {
        x: number;
        y: number;
        z: number;
    };
    neighbors: ITile[];
    planetTile: IPlanetTile;
    onClick: () => void;
}

interface IHexaSphere {
    tiles: ITile[];
}

interface ILand {
    type: 'island' | 'continent';
    name: string;
    landGroup: number;
    size: number;
    indexes: number[];
}

function generateTypeNoise(seed: number) {
    const noise = new FastNoiseLite(seed);
    noise.SetNoiseType(FastNoiseLite.NoiseType.Perlin);
    noise.SetFrequency(0.02);
    noise.SetFractalType(FastNoiseLite.FractalType.PingPong);
    noise.SetFractalOctaves(4);
    noise.SetFractalLacunarity(2.0);
    noise.SetFractalGain(0.9);
    noise.SetFractalWeightedStrength(0.7);
    noise.SetFractalPingPongStrength(3);
    return noise;
}

function generateCommonResourcesNoise(seed: number) {
    const noise = new FastNoiseLite(seed);
    noise.SetNoiseType(FastNoiseLite.NoiseType.Perlin);
    noise.SetFrequency(0.2);
    noise.SetFractalType(FastNoiseLite.FractalType.PingPong);
    noise.SetFractalOctaves(6);
    noise.SetFractalLacunarity(2.2);
    noise.SetFractalGain(0.9);
    noise.SetFractalWeightedStrength(0.7);
    noise.SetFractalPingPongStrength(4);
    return noise;
}

function generateIntermediateResourcesNoise(seed: number) {
    const noise = new FastNoiseLite(seed);
    noise.SetNoiseType(FastNoiseLite.NoiseType.Perlin);
    noise.SetFrequency(0.2);
    noise.SetFractalType(FastNoiseLite.FractalType.PingPong);
    noise.SetFractalOctaves(5);
    noise.SetFractalLacunarity(1);
    noise.SetFractalGain(1.1);
    noise.SetFractalWeightedStrength(1.7);
    noise.SetFractalPingPongStrength(5);
    return noise;
}

function generateRareResourcesNoise(seed: number) {
    const noise = new FastNoiseLite(seed);
    noise.SetNoiseType(FastNoiseLite.NoiseType.Perlin);
    noise.SetFrequency(0.2);
    noise.SetFractalType(FastNoiseLite.FractalType.PingPong);
    noise.SetFractalOctaves(5);
    noise.SetFractalLacunarity(1);
    noise.SetFractalGain(2);
    noise.SetFractalWeightedStrength(2);
    noise.SetFractalPingPongStrength(5);
    return noise;
}

export class PlanetTiles {
    seed: number;
    public hexaSphere: IHexaSphere;
    public procedural: Procedural;
    public lands: ILand[] = [];

    public isLiquidExists = false;
    public isLandExists = false;

    constructor(seed: number, size: number, surfaceLiquidLevel: number = 1) {
        const tileSize = Math.round(15 * (size / 100));
        const seaLevel = utils.lerp(0.1, 1.4, surfaceLiquidLevel - 1);

        this.seed = seed;
        this.procedural = new Procedural(seed);
        this.hexaSphere = new Hexasphere(30, tileSize, 0.98);

        const noiseForType = generateTypeNoise(seed);

        const noiseForIron = generateCommonResourcesNoise(seed + 1);
        const noiseForCopper = generateCommonResourcesNoise(seed + 2);

        const noiseForLithium = generateIntermediateResourcesNoise(seed + 3);
        const noiseForAluminum = generateIntermediateResourcesNoise(seed + 4);
        const noiseForTitanium = generateIntermediateResourcesNoise(seed + 5);

        const noiseForUranium = generateRareResourcesNoise(seed + 6);
        const maxY = this.hexaSphere.tiles.reduce((max, tile) => Math.max(max, tile.centerPoint.y), 0);

        this.hexaSphere.tiles.forEach((tile: any, index) => {
            const noiseTypeValue = noiseForType.GetNoise(5 + tile.centerPoint.x, 5 + tile.centerPoint.y, 5 + tile.centerPoint.z) + 0.5;

            const type = noiseTypeValue > seaLevel ? 'land' : 'liquid';
            if (type === 'land') {
                this.isLandExists = true;
            } else {
                this.isLiquidExists = true;
            }
            const isPolarCircle = Math.abs(tile.centerPoint.y) > maxY * 0.85;
            const planetTile: IPlanetTile = {
                color: isPolarCircle ? 'rgb(255,255,255)' : type === 'land' ? 'rgb(182,143,78)' : 'rgb(32,46,72)',
                isExplored: false,
                isColonized: false,
                cityId: '',
                citiDistrictId: '',
                landGroup: 0,
                isPolarCircle,
                index,
                type,
                iron: type === 'land' ? Math.max(noiseForIron.GetNoise(5 + tile.centerPoint.x, 5 + tile.centerPoint.y, 5 + tile.centerPoint.z), 0) : 0,
                copper: type === 'land' ? Math.max(noiseForCopper.GetNoise(5 + tile.centerPoint.x, 5 + tile.centerPoint.y, 5 + tile.centerPoint.z), 0) : 0,
                lithium: type === 'land' ? Math.max(noiseForLithium.GetNoise(5 + tile.centerPoint.x, 5 + tile.centerPoint.y, 5 + tile.centerPoint.z), 0) : 0,
                aluminum: type === 'land' ? Math.max(noiseForAluminum.GetNoise(5 + tile.centerPoint.x, 5 + tile.centerPoint.y, 5 + tile.centerPoint.z), 0) : 0,
                titanium: type === 'land' ? Math.max(noiseForTitanium.GetNoise(5 + tile.centerPoint.x, 5 + tile.centerPoint.y, 5 + tile.centerPoint.z), 0) : 0,
                uranium: type === 'land' ? Math.max(noiseForUranium.GetNoise(5 + tile.centerPoint.x, 5 + tile.centerPoint.y, 5 + tile.centerPoint.z), 0) : 0,
            }

            tile.onClick = () => {
                this.onTileClick(planetTile);
            };

            tile.planetTile = planetTile;
        });

        this.calculateLandGroup();
    }

    calculateLandGroup() {
        this.procedural = new Procedural(this.seed + 10);
        this.lands = [];
        let currentLandGroup = 0;

        if (!this.isLandExists || !this.isLiquidExists) return;

        this.hexaSphere.tiles.forEach(tile => {
            tile.visited = false;
        });

        this.hexaSphere.tiles.forEach(tile => {
            if (tile.planetTile.type === 'land' && !tile.visited) {
                currentLandGroup++;
                const landTiles = this.dfs(tile, currentLandGroup);

                this.lands.push({
                    type: landTiles.length > 15 ? 'continent' : 'island',
                    name: generatePlanetName(this.procedural.randomInt(landTiles.length, 100000)),
                    landGroup: currentLandGroup,
                    size: landTiles.length,
                    indexes: landTiles.map(t => t.planetTile.index)
                });
            }
        });
    }

    dfs(tile: ITile, landGroup: number) {
        tile.visited = true;
        tile.planetTile.landGroup = landGroup;
        const landTiles = [tile];

        tile.neighbors.forEach(neighbor => {
            if (neighbor.planetTile.type === 'land' && !neighbor.visited) {
                landTiles.push(...this.dfs(neighbor, landGroup));
            }
        });

        return landTiles;
    }

    getLandGroup(index: number) {
        return this.lands.find(land => land.indexes.includes(index));
    }

    getHexaSphere() {
        return this.hexaSphere;
    }

    getPlanetTile(index: number) {
        return this.hexaSphere.tiles[index].planetTile;
    }

    getBestCityLocation(): ITile {
        let land = this.lands[0];
        this.lands.forEach(l => {
            if (l.size > land.size) {
                land = l;
            }
        });

        const landTiles = this.hexaSphere.tiles.filter(t => land.indexes.includes(t.planetTile.index) && !t.planetTile.isPolarCircle);
        const boundaryTiles = landTiles.filter(t => t.neighbors.some(n => n.planetTile.type === 'liquid'));
        return this.procedural.randomFromArray(boundaryTiles);
    }

    onClickAction: ((tile: IPlanetTile) => void) | null = null;
    setActionOnClick(action: (tile: IPlanetTile) => void) {
        this.onClickAction = action;
    }
    onTileClick(tile: IPlanetTile) {
        if (tile.type === 'land') {
            this.onClickAction?.(tile);
            this.onClickAction = null;
        }
    }

    colonizeTile(index: number, cityId: string, districtId: string, color: string) {
        this.hexaSphere.tiles[index].planetTile.isColonized = true;
        this.hexaSphere.tiles[index].planetTile.cityId = cityId;
        this.hexaSphere.tiles[index].planetTile.citiDistrictId = districtId;
        this.hexaSphere.tiles[index].planetTile.color = color;

        window.game.system.systemUpdated();
    }
}