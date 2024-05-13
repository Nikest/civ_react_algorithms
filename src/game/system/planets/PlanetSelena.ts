import { Procedural } from '../../Procedural';
import * as utils from '../../utils';
import {
    AbstractPlanet,
    IAbstractPlanetProps,
} from './AbstractPlanet';
import * as spaceUtils from '../SpaceUtils';
import {
    TPlanetCoreType,
    TPlanetMantleType,
    TPlanetType,
} from './planetTypes';

const coreTypesFreqByZone: Record<TPlanetCoreType, number>[] = [
    { // hot zone
        iron: 90,
        silicates: 10
    }, { // warm zone
        iron: 85,
        silicates: 15
    }, { // cold zone
        iron: 20,
        silicates: 80
    }, { // cryogenic zone
        iron: 5,
        silicates: 95
    }, { // dark zone
        iron: 1,
        silicates: 99
    },
];
const coreSizeByZone = [[20, 70], [20, 60], [12, 50], [9, 40], [5, 30]];

const mantleTypesFreqByZone_RAW: Record<TPlanetMantleType, number>[] = [
    {   // hot zone
        iron: 8,
        silicates: 87,
        water: 0,
        carbon: 5,
        waterIce: 0,
        nitrogenIce: 0,
    }, { // warm zone
        iron: 4,
        silicates: 91,
        water: 0,
        carbon: 5,
        waterIce: 0,
        nitrogenIce: 0,
    }, { // cold zone
        iron: 1,
        silicates: 38,
        water: 60,
        carbon: 1,
        waterIce: 0,
        nitrogenIce: 0,
    }, { // cryogenic zone
        iron: 0,
        silicates: 10,
        water: 0,
        carbon: 0,
        waterIce: 88,
        nitrogenIce: 2,
    }, { // dark zone
        iron: 0,
        silicates: 1,
        water: 0,
        carbon: 0,
        waterIce: 80,
        nitrogenIce: 9,
    },
];

export class PlanetSelena extends AbstractPlanet {
    constructor({ seed, temperatureZone, orbitRadius }: IAbstractPlanetProps) {
        super({
            seed,
            temperatureZone,
            orbitRadius,
        });

        // CORE
        this.coreType = utils.findInFreq<TPlanetCoreType>(coreTypesFreqByZone[temperatureZone], this.rand.randomInt(0, 100));
        this.coreSize = this.rand.randomInt(coreSizeByZone[temperatureZone][0], coreSizeByZone[temperatureZone][1]);

        ////

        // MANTLE
        const coreIsSilicates = coreType === 'silicates';

        const mantleTypeFreq = utils.createFreqAndExclude<TPlanetMantleType>(
            mantleTypesFreqByZone_RAW[temperatureZone],
            [coreIsSilicates ? 'iron' : '']
            );

        const mantleType = utils.findInFreq<TPlanetMantleType>(mantleTypeFreq, rand.randomInt(1, 100));
        const mantleSize = 100 - rand.randomInt(2, 5) - coreSize;

        let mantle = new PlanetMantle(mantleSize, mantleType);
        ////

        // SURFACE
        const surfaceSize = 100 - (mantleSize + coreSize);
        const surface = new PlanetSurface(surfaceSize, 'regolith', false, 'water', 0);
        ////

        mantle.modify(rand.seed, core, surface);

        this.planetType = 'selena';

        const physicsRange = rand.randomFloat(1, 1000) / 1000;

        const ironPercent = 0;
        const waterPercent = 0;

        const massRaw = utils.lerpRounded(0.015, 6, physicsRange, 2);
        this.mass = AbstractPlanet.modifyMass(massRaw, ironPercent, waterPercent);

        const radiusRaw = utils.lerpRounded(22, 43, physicsRange, 2);
        this.radius = AbstractPlanet.modifyRadius(radiusRaw, ironPercent, waterPercent);

        const m = (this.mass / 100) * spaceUtils.earthProps.mass;
        const r = (this.radius / 100) * spaceUtils.earthProps.radius;
        this.gravityAcceleration = utils.numFixed((spaceUtils.G * m) / (r * r), 2);
        this.surfaceGravitation = utils.numFixed((this.gravityAcceleration / spaceUtils.earthProps.gravityAcceleration), 2);
    }
}