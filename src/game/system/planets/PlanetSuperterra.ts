import * as utils from '../../utils';
import {
    AbstractPlanet,
    IAbstractPlanetProps,
} from './AbstractPlanet';
import * as spaceUtils from '../SpaceUtils';
import {
    TPlanetCoreType,
    TPlanetMantleType,
    TPlanetSurfaceType,
} from './planetTypes';
import { solarMass } from '../constants';

const massRange = [180, 800];
const radiusRange = [135, 260];

const coreTypesFreqByZone: Record<TPlanetCoreType, number>[] = [
    { // hot zone
        iron: 98,
        silicates: 2
    }, { // warm zone
        iron: 95,
        silicates: 5
    }, { // cold zone
        iron: 90,
        silicates: 10
    }, { // cryogenic zone
        iron: 70,
        silicates: 30
    }, { // dark zone
        iron: 60,
        silicates: 40
    },
];
const coreSizeByZone = [[25, 50], [24, 49], [20, 40], [17, 30], [15, 20]];

const mantleTypesFreqByZone: Record<TPlanetMantleType, number>[] = [
    {   // hot zone
        iron: 8,
        silicates: 87,
        carbon: 5,
        waterIce: 0,
        nitrogenIce: 0,
    }, { // warm zone
        iron: 4,
        silicates: 94,
        carbon: 2,
        waterIce: 0,
        nitrogenIce: 0,
    }, { // cold zone
        iron: 1,
        silicates: 60,
        carbon: 1,
        waterIce: 38,
        nitrogenIce: 0,
    }, { // cryogenic zone
        iron: 0,
        silicates: 10,
        carbon: 0,
        waterIce: 88,
        nitrogenIce: 2,
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
        regolith: 0,
        silicates: 99,
        carbon: 0,
        iron: 1,
        solidHydrocarbon: 0,
        water: 0,
        waterIce: 0,
        nitrogenIce: 0,
    },
    {   // warm zone
        regolith: 0,
        silicates: 97,
        carbon: 1,
        iron: 1,
        solidHydrocarbon: 0,
        water: 1,
        waterIce: 0,
        nitrogenIce: 0,
    },
    {   // cold zone
        regolith: 0,
        silicates: 28,
        carbon: 0,
        iron: 0,
        solidHydrocarbon: 0,
        water: 0,
        waterIce: 72,
        nitrogenIce: 0,
    },
    {   // cryogenic zone
        regolith: 0,
        silicates: 0,
        carbon: 0,
        iron: 0,
        solidHydrocarbon: 15,
        water: 0,
        waterIce: 80,
        nitrogenIce: 5,
    },
    {   // dark zone
        regolith: 0,
        silicates: 0,
        carbon: 0,
        iron: 0,
        solidHydrocarbon: 1,
        water: 0,
        waterIce: 4,
        nitrogenIce: 95,
    },
];

export class PlanetSuperterra extends AbstractPlanet {
    constructor({ seed, temperatureZone, orbitRadius, starMass, shouldHabitable }: IAbstractPlanetProps) {
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
        if (this.mantleInnerType === 'waterIce') this.mantleInnerType = 'silicates';

        this.mantleOuterType = utils.calculateInFrequency<TPlanetMantleType>(mantleTypeFreq, this.rand.randomFloat(1, 100), outerMantleExclude);

        ////

        //// SURFACE
        const surfaceTypeExclude: TPlanetSurfaceType[] = [];
        if (this.mantleOuterType !== 'iron') surfaceTypeExclude.push('iron');
        if (this.mantleOuterType !== 'silicates') surfaceTypeExclude.push('silicates');
        if (this.mantleOuterType === 'waterIce') surfaceTypeExclude.push('carbon');
        this.surfaceType = utils.calculateInFrequency<TPlanetSurfaceType>(surfaceTypesFreqByZone[temperatureZone], this.rand.randomFloat(1, 100), surfaceTypeExclude);

        ////

        //// ASTENOSPHERE
        if (this.surfaceType === 'waterIce' || this.surfaceType === 'nitrogenIce' || this.surfaceType === 'water') {
            this.asthenosphereType = temperatureZone === 4 ? 'waterIce' : 'water';
            if (this.mantleOuterType !== 'waterIce' && this.rand.randomInt(1, 10) <= 4) this.asthenosphereType = 'silicates';
        } else if (this.surfaceType === 'iron') {
            this.asthenosphereType = 'iron';
        } else {
            this.asthenosphereType = 'silicates';
        }

        this.asthenosphereSize = this.rand.randomInt(5, 7);
        this.mantleInnerSize = this.rand.randomInt(30, 60);
        this.mantleOuterSize = 100 - this.mantleInnerSize - this.asthenosphereSize;

        ////

        //// SURFACE LIQUID
        if (temperatureZone === 1) {
            this.surfaceLiquidType = 'water';
            if (this.surfaceType === 'water') {
                this.surfaceLiquidSize = 4;
            } else {
                this.surfaceLiquidSize = Math.max(0, utils.easeOutQuadRounded(-0.5, 3.5, this.rand.randomFloat(0, 1), 2));
            }
        } else if (temperatureZone === 2) {
            this.surfaceLiquidType = 'CO2';
            this.surfaceLiquidSize = Math.max(0, utils.easeOutQuadRounded(-1, 3.5, this.rand.randomFloat(0, 1), 2));

        } else if (temperatureZone === 3) {
            this.surfaceLiquidType = 'CH4';
            this.surfaceLiquidSize = Math.max(0, utils.easeOutQuadRounded(-0.5, 4, this.rand.randomFloat(0, 1), 2));

        }

        ////

        //// ATMOSPHERE

        if (temperatureZone === 0) {
            this.atmospherePressure = utils.easeInExpoRounded(0, 3, this.rand.randomFloat(0, 1), 2);
        } else if (temperatureZone === 1) {
            this.atmospherePressure = utils.easeInExpoRounded(0.5, 5, this.rand.randomFloat(0, 1), 2);
        } else if (temperatureZone === 2) {
            this.atmospherePressure = utils.easeInExpoRounded(0.5, 10, this.rand.randomFloat(0, 1), 2);
            if (this.atmospherePressure < 5) this.surfaceLiquidSize = 0;
        } else if (temperatureZone === 3) {
            this.atmospherePressure = utils.easeInExpoRounded(0, 3, this.rand.randomFloat(0, 1), 2);
        }

        ////

        this.planetType = 'superterra';

        this.modifiers(!!shouldHabitable);

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