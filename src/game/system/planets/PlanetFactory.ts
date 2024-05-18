import { Procedural } from '../../Procedural';
import * as utils from '../../utils';
import * as planets from './index';
import { TPlanetType } from './planetTypes';
import { AbstractPlanet, IAbstractPlanetProps } from './AbstractPlanet';
import { TStarTemperatureZoneIndex, TStarType } from '../star/Star';

type PlanetConstructor = new (args: IAbstractPlanetProps) => AbstractPlanet;

type TPlanetsClassesMap = {
    [key in TPlanetType]: PlanetConstructor;
};

const planetsClassesMap: TPlanetsClassesMap = {
    selena: planets.PlanetSelena,
    miniterra: planets.PlanetMiniterra,
    terra: planets.PlanetTerra,
    superterra: planets.PlanetMiniterra,
    neptunian: planets.PlanetMiniterra,
    jovian: planets.PlanetMiniterra,
}

export class PlanetFactory {
    starType: TStarType;

    planetTypeFreq: utils.IFrequency<TPlanetType> = {
        selena: 5,
        miniterra: 12,
        terra: 20,
        superterra: 26,
        neptunian: 25,
        jovian: 12,
    };

    constructor(starType: TStarType) {
        this.starType = starType;
    }

    create(seed: number, temperatureZone: TStarTemperatureZoneIndex, orbitRadius: number, starMass: number) {
        const rand = new Procedural(seed);
        const planetType: TPlanetType = utils.calculateInFrequency<TPlanetType>(this.planetTypeFreq, rand.randomFloat(0, 100));

        return new planetsClassesMap[planetType]({
            seed: rand.randomInt(1, 100000000),
            temperatureZone,
            orbitRadius,
            starMass,
        });
    }
}