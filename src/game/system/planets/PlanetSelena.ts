import { Procedural } from '../../Procedural';
import * as utils from '../../utils';
import {
    AbstractPlanet,
    IAbstractPlanetProps,
} from './AbstractPlanet';
import * as spaceUtils from '../SpaceUtils';
import {
    TPlanetCoreType,
    TPlanetMantleType, TPlanetSurfaceType,
} from './planetTypes';
import { solarMass } from '../constants';

const massRange = [0.015, 6];
const radiusRange = [22, 43];

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
const coreSizeByZone = [[30, 70], [30, 65], [25, 50], [20, 40], [18, 38]];

const mantleTypesFreqByZone: Record<TPlanetMantleType, number>[] = [
    {   // hot zone
        iron: 8,
        silicates: 87,
        carbon: 5,
        waterIce: 0,
        nitrogenIce: 0,
    }, { // warm zone
        iron: 4,
        silicates: 91,
        carbon: 5,
        waterIce: 0,
        nitrogenIce: 0,
    }, { // cold zone
        iron: 1,
        silicates: 38,
        carbon: 1,
        waterIce: 60,
        nitrogenIce: 0,
    }, { // cryogenic zone
        iron: 0,
        silicates: 2,
        carbon: 0,
        waterIce: 93,
        nitrogenIce: 5,
    }, { // dark zone
        iron: 0,
        silicates: 1,
        carbon: 0,
        waterIce: 80,
        nitrogenIce: 9,
    },
];

const surfaceTypesFreqByZone: Record<TPlanetSurfaceType, number>[] = [
    {   // hot zone
        regolith: 99,
        silicates: 0,
        carbon: 0,
        iron: 1,
        solidHydrocarbon: 0,
        water: 0,
        waterIce: 0,
        nitrogenIce: 0,
    },
    {   // warm zone
        regolith: 99,
        silicates: 0,
        carbon: 0,
        iron: 1,
        solidHydrocarbon: 0,
        water: 0,
        waterIce: 0,
        nitrogenIce: 0,
    },
    {   // cold zone
        regolith: 5,
        silicates: 2,
        carbon: 0,
        iron: 1,
        solidHydrocarbon: 0,
        water: 0,
        waterIce: 92,
        nitrogenIce: 0,
    },
    {   // cryogenic zone
        regolith: 2,
        silicates: 0,
        carbon: 0,
        iron: 0,
        solidHydrocarbon: 2,
        water: 0,
        waterIce: 73,
        nitrogenIce: 20,
    },
    {   // dark zone
        regolith: 2,
        silicates: 0,
        carbon: 0,
        iron: 0,
        solidHydrocarbon: 0,
        water: 0,
        waterIce: 0,
        nitrogenIce: 98,
    },
]

export class PlanetSelena extends AbstractPlanet {
    constructor({ seed, temperatureZone, orbitRadius, starMass }: IAbstractPlanetProps) {
        super({
            seed,
            temperatureZone,
            orbitRadius,
            starMass,
        });

        // CORE
        this.coreType = utils.calculateInFrequency<TPlanetCoreType>(coreTypesFreqByZone[temperatureZone], this.rand.randomFloat(1, 100));
        this.coreSize = this.rand.randomInt(coreSizeByZone[temperatureZone][0], coreSizeByZone[temperatureZone][1]);

        ////

        // MANTLE
        this.surfaceSize = this.rand.randomInt(2, 5);
        this.mantleSize = 100 - this.surfaceSize - this.coreSize;
        const mantleTypeFreq = mantleTypesFreqByZone[temperatureZone];

        // inner
        const innerMantleExclude: TPlanetMantleType[] = [];
        if (this.coreType === 'silicates') innerMantleExclude.push('iron');
        innerMantleExclude.push('carbon');

        this.mantleInnerType = utils.calculateInFrequency<TPlanetMantleType>(mantleTypeFreq, this.rand.randomFloat(1, 100), innerMantleExclude);

        // outer
        const outerMantleExclude: TPlanetMantleType[] = [];
        if (this.mantleInnerType !== 'iron') outerMantleExclude.push('iron');
        if (this.mantleInnerType !== 'silicates') outerMantleExclude.push('silicates');

        this.mantleOuterType = utils.calculateInFrequency<TPlanetMantleType>(mantleTypeFreq, this.rand.randomFloat(1, 100), outerMantleExclude);

        ////

        //// SURFACE
        const surfaceTypeExclude: TPlanetSurfaceType[] = [];
        if (this.mantleOuterType !== 'iron') surfaceTypeExclude.push('iron');
        this.surfaceType = utils.calculateInFrequency<TPlanetSurfaceType>(surfaceTypesFreqByZone[temperatureZone], this.rand.randomFloat(1, 100), surfaceTypeExclude);

        ////

        //// ASTENOSPHERE
        if (this.surfaceType === 'waterIce' || this.surfaceType === 'nitrogenIce') {
            this.asthenosphereType = temperatureZone === 4 ? 'waterIce' : 'water';
        } else if (this.surfaceType === 'iron') {
            this.asthenosphereType = 'iron';
        } else {
            this.asthenosphereType = 'silicates';
        }

        this.asthenosphereSize = this.rand.randomInt(5, 12);
        this.mantleInnerSize = this.rand.randomInt(30, 60);
        this.mantleOuterSize = 100 - this.mantleInnerSize - this.asthenosphereSize;

        ////

        this.planetType = 'selena';

        const physicsRange = this.rand.randomFloat(1, 1000) / 1000;

        const ironPercent = 0;
        const waterPercent = 0;

        const massRaw = utils.lerpRounded(massRange[0], massRange[1], physicsRange, 2);
        this.mass = AbstractPlanet.modifyMass(massRaw, ironPercent, waterPercent);

        const radiusRaw = utils.lerpRounded(radiusRange[0], radiusRange[1], physicsRange, 2);
        this.radius = AbstractPlanet.modifyRadius(radiusRaw, ironPercent, waterPercent);

        const m = (this.mass / 100) * spaceUtils.earthProps.mass;
        const r = (this.radius / 100) * spaceUtils.earthProps.radius;
        this.gravityAcceleration = utils.numFixed((spaceUtils.G * m) / (r * r), 2);
        this.surfaceGravitation = utils.numFixed((this.gravityAcceleration / spaceUtils.earthProps.gravityAcceleration), 2);

        this.calculateOrbitParams(starMass * solarMass);
    }
}