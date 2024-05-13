import { Procedural } from '../../Procedural';
import * as utils from '../../utils';
import { AbstractPlanet, IPlanetProps } from './AbstractPlanet';
import * as spaceUtils from '../SpaceUtils';
import {
    TPlanetCoreType,
    TPlanetMantleType,
    TPlanetType,
    TPlanetSurfaceType,
    TPlanetSurfaceLiquidType,
} from './planetTypes';

const coreTypesFreqByZone: Record<TPlanetCoreType, number>[] = [
    { // hot zone
        iron: 92,
        silicates: 8
    }, { // warm zone
        iron: 87,
        silicates: 13
    }, { // cold zone
        iron: 20,
        silicates: 80
    }, { // cryogenic zone
        iron: 4,
        silicates: 96
    }, { // dark zone
        iron: 1,
        silicates: 99
    },
];

export class PlanetMiniterra extends AbstractPlanet {
    constructor({ seed, temperatureZone, orbitRadius }: IPlanetProps) {
        const rand = new Procedural(seed);
        const planetType: TPlanetType = 'miniterra';

        // CORE

        const coreType = utils.findInFreq<TPlanetCoreType>(coreTypesFreqByZone[temperatureZone], rand.randomInt(0, 100));
        const coreSizeByZone = [[10, 70], [10, 60], [8, 50], [5, 40], [2, 30]];
        const coreSize = rand.randomInt(coreSizeByZone[temperatureZone][0], coreSizeByZone[temperatureZone][1]);

        ////

        // MANTLE
        const coreIsSilicates = coreType === 'silicates';
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
                silicates: 92,
                water: 0,
                carbon: 4,
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

        const mantleTypeFreq = utils.createFreqAndExclude<TPlanetMantleType>(
            mantleTypesFreqByZone_RAW[temperatureZone],
            [coreIsSilicates ? 'iron' : '']
        );

        const mantleType = utils.findInFreq<TPlanetMantleType>(mantleTypeFreq, rand.randomInt(1, 100));
        const mantleSize = 100 - rand.randomInt(2, 5) - coreSize;
        ////

        // SURFACE
        const surfaceTypesFreqByZone_RAW: Record<TPlanetSurfaceType, number>[] = [
            { // hot
                silicates: 96,
                carbon: 3,
                waterIce: 0,
                iron: 1,
                nitrogenIce: 0,
                regolith: 0,
                solidHydrocarbon: 0
            },{ // warm
                silicates: 96,
                carbon: 3,
                waterIce: 0,
                iron: 1,
                nitrogenIce: 0,
                regolith: 0,
                solidHydrocarbon: 0
            },{ // cold
                silicates: 63,
                carbon: 1,
                waterIce: 35,
                iron: 1,
                nitrogenIce: 0,
                regolith: 0,
                solidHydrocarbon: 0
            },{ // cryogenic
                silicates: 23,
                carbon: 0,
                waterIce: 77,
                iron: 0,
                nitrogenIce: 0,
                regolith: 0,
                solidHydrocarbon: 0
            },{ // dark
                silicates: 3,
                carbon: 0,
                waterIce: 7,
                iron: 0,
                nitrogenIce: 95,
                regolith: 0,
                solidHydrocarbon: 5
            },
        ];

        const surfaceLiquidFreqByZone: Record<TPlanetSurfaceLiquidType, number>[] = [
            {   // hot
                water: 0,
                liquidHydrocarbon: 0,
                CO2: 0,
                CH4: 0,
            },{ // warm
                water: 100,
                liquidHydrocarbon: 0,
                CO2: 0,
                CH4: 0,
            },{ // cold
                water: 0,
                liquidHydrocarbon: 2,
                CO2: 98,
                CH4: 0,
            },{ // cryogenic
                water: 0,
                liquidHydrocarbon: 5,
                CO2: 0,
                CH4: 95,
            },{ // dark
                water: 0,
                liquidHydrocarbon: 0,
                CO2: 0,
                CH4: 0,
            },
        ];

        const liquidMaxLevelByZone = [0, 3, 3, 0];


        super({
            seed,
            temperatureZone,
            orbitRadius,
            core,
            mantle,
            surface,
        });

        const physicsRange = rand.randomFloat(1, 1000) / 1000;

        const ironPercent = 0;
        const waterPercent = 0;

        const massRaw = utils.lerpRounded(6, 66, physicsRange, 2);
        this.mass = AbstractPlanet.modifyMass(massRaw, ironPercent, waterPercent);

        const radiusRaw = utils.lerpRounded(43, 84, physicsRange, 2);
        this.radius = AbstractPlanet.modifyRadius(radiusRaw, ironPercent, waterPercent);

        const m = (this.mass / 100) * spaceUtils.earthProps.mass;
        const r = (this.radius / 100) * spaceUtils.earthProps.radius;
        this.gravityAcceleration = utils.numFixed((spaceUtils.G * m) / (r * r), 2);
        this.surfaceGravitation = utils.numFixed((this.gravityAcceleration / spaceUtils.earthProps.gravityAcceleration), 2);
    }
}