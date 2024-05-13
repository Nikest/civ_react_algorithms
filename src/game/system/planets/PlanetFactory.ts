import { Procedural } from '../../Procedural';
import * as utils from '../../utils';
import * as planets from './planets';
import { TPlanetType, AbstractPlanet, IPlanetProps } from './AbstractPlanet';
import { TStarTemperatureZoneIndex, TStarType } from '../star/Star';

type PlanetConstructor = new (args: IPlanetProps) => AbstractPlanet;

type TPlanetsClassesMap = {
    [key in TPlanetType]: PlanetConstructor;
};

const planetsClassesMap: TPlanetsClassesMap = {
    selena: planets.PlanetSelena,
    miniterra: planets.PlanetMiniterra,
    terra: planets.PlanetSelena,
    superterra: planets.PlanetSelena,
    neptunian: planets.PlanetSelena,
    jovian: planets.PlanetSelena,
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


    create(seed: number, temperatureZone: TStarTemperatureZoneIndex, orbitRadius: number) {
        const rand = new Procedural(seed);
        const planetType: TPlanetType = utils.findInFreq(this.planetTypeFreq, rand.randomInt(0, 100));

        return new planetsClassesMap[planetType]({
            seed: rand.randomInt(1, 100000000),
            temperatureZone,
            orbitRadius,
        });
    }
}