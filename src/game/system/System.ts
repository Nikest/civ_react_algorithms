import { Procedural } from '../Procedural';
import { generatePlanetName } from '../wordGenerator';
import { generateId, lerp } from '../utils';
import { PlanetBuilder } from './PlanetBuilder';

import { Star, TStarTemperatureZoneIndex } from './star/Star';
import { AbstractPlanet } from './planets/AbstractPlanet';
import { PlanetFactory } from './planets/PlanetFactory';

// @ts-ignore
import KtRGB from 'kelvin-to-rgb';

export class System {
    seed = 0;
    star: Star;
    planets: AbstractPlanet[] = [];

    selectedPlanetId = '';
    constructor(seed: number) {
        const procedural = new Procedural(seed);
        this.seed = seed;

        this.star = new Star(this.seed + procedural.randomInt(1, 1000));

        const planetFactory = new PlanetFactory(this.star.type);

        let currentOrbit = procedural.randomFloat(this.star.temperatureZones[0] / 10, this.star.temperatureZones[0]);

        for (let i = 0; i < this.star.planets; i++) {
            const temperatureZone = this.star.temperatureZones.findIndex((z) => currentOrbit <= z) || 0;
            const planetSeed = this.seed + procedural.randomInt(0, 1000);
            const planet = planetFactory.create(planetSeed, temperatureZone as TStarTemperatureZoneIndex, currentOrbit);
            this.planets.push(planet);

            currentOrbit *= procedural.randomFloat(1.25, 3.25);
        }
    }

    colonize(planetId: string) {
        const planet = this.getPlanetById(planetId);
        if (!planet) {
            return;
        }
        //planet.colonized = true;

        window.dispatchEvent(new CustomEvent('ui:systemUpdate'));
        window.dispatchEvent(new CustomEvent('ui:planetUpdate'));
    }

    getPlanetById(id: string) {
        return this.planets.find(p => p.id === id);
    }

    getComfortablePlanetsIds() {
        //return this.planets.filter(p => p.temperatureZone === 1).sort((a, b) => b.perspectiveRate - a.perspectiveRate).map(p => p.id);
    }

    getColonizedPlanetsIds() {
        //return this.planets.filter(p => p.colonized).map(p => p.id);
    }

    selectPlanet(id: string) {
        if (this.selectedPlanetId === id) {
            return;
        }
        this.selectedPlanetId = id;
        //window.dispatchEvent(new CustomEvent('ui:planetUpdate'));
    }

    getSelectedPlanet() {
        return this.getPlanetById(this.selectedPlanetId);
    }
}

interface IPlanetCity {
    citiId: string;
    planetTileIndex: number;
}
export class Planet {
    seed = 0;
    id = '';
    name = '';
    type = '';
    temperatureType = '';
    colonized = false;
    perspectiveRate = 0;
    planetBuilder: PlanetBuilder | null = null;
    orbitRadius: number = 0;
    cities: IPlanetCity[] = [];

    // special
    texture = '';
    texturePosition = 'left';
    constructor(seed: number, temperatureType: string, orbitRadius: number, livable: boolean = false) {
        const procedural = new Procedural(seed);
        const generalTypes = ['selena', 'selena', 'selena', 'miniterra', 'terra', 'superterra','superterra', 'neptun', 'jovian', 'jovian'];
        const livableTypes = ['miniterra', 'miniterra', 'terra', 'superterra'];

        this.seed = seed;
        this.id = generateId();
        this.name = generatePlanetName(this.seed);
        this.type = livable ? procedural.randomFromArray(livableTypes) : procedural.randomFromArray(generalTypes);
        this.temperatureType = temperatureType;
        this.orbitRadius = orbitRadius;

        this.texturePosition = procedural.randomFromArray(['left', 'center', 'right']);

        if (livable && this.temperatureType === 'comfortable') {
            if (this.type === 'miniterra') {
                this.perspectiveRate = procedural.randomInt(20, 30);
            } else if (this.type === 'terra') {
                this.perspectiveRate = procedural.randomInt(30, 40);
            } else if (this.type === 'superterra') {
                this.perspectiveRate = procedural.randomInt(10, 20);
            }
        }

        if (this.type === 'neptun' || this.type === 'jovian') {
            this.texture = 'gas-' + procedural.randomInt(0, 9);
        }

        if (this.type === 'selena') {
            this.texture = 'selena-' + procedural.randomInt(0, 9);
        }

        if (this.type === 'miniterra' || this.type === 'terra' || this.type === 'superterra') {
            if (this.temperatureType === 'hot') {
                this.texture = 'hot-' + procedural.randomInt(0, 9);
            } else if (this.temperatureType === 'cold') {
                this.texture = 'cold-' + procedural.randomInt(0, 9);
            } else {
                this.texture = this.type + '-' + procedural.randomInt(0, 9);

            }
        }
    }

    setCity(cityId: string, districtId: string, planetTileIndex: number) {
        this.cities.push({
            citiId: cityId,
            planetTileIndex: planetTileIndex,
        });

        const planetTile = this.planetBuilder?.getPlanetTile(planetTileIndex);
        if (planetTile) {
            planetTile.isColonized = true;
            planetTile.cityId = cityId;
            planetTile.citiDistrictId = districtId;

            window.dispatchEvent(new CustomEvent('ui:planetUpdate'));
        }
    }

    async getPlanetBuilder() {
        if (!this.planetBuilder) {
            let size = 10;

            switch (this.type) {
                case 'selena':
                    size = 6;
                    break;
                case 'miniterra':
                    size = 12;
                    break;
                case 'terra':
                    size = 15;
                    break;
                case 'superterra':
                    size = 20;
                    break;
                case 'neptun':
                    size = 35;
                    break;
                case 'jovian':
                    size = 40;
                    break;
                default:
                    size = 10;
            }

            this.planetBuilder = new PlanetBuilder(this.seed, size);
        }
        return this.planetBuilder;
    }
}