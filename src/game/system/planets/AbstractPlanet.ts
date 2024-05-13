import { Procedural } from '../../Procedural';
import { SpaceBody } from '../SpaceBody';
import { TStarTemperatureZoneIndex } from '../star/Star';
import {
    TPlanetCoreType,
    TPlanetMantleType,
    TPlanetSurfaceType,
    TPlanetSurfaceLiquidType,
    TPlanetAtmosphereGas,
    TPlanetType,
    TPlanetAsthenosphereType,
} from './planetTypes';

export interface IAbstractPlanetProps {
    seed: number;
    temperatureZone: TStarTemperatureZoneIndex;
    orbitRadius: number;
}

export abstract class AbstractPlanet extends SpaceBody {
    planetType: TPlanetType = 'selena';
    temperatureZone: TStarTemperatureZoneIndex = 0;
    orbitRadius: number = 0;

    coreType: TPlanetCoreType = 'silicates';
    coreSize: number = 0;

    mantleInnerType: TPlanetMantleType = 'silicates';
    mantleInnerSize: number = 0;
    mantleOuterType: TPlanetMantleType = 'silicates';
    mantleOuterSize: number = 0;
    asthenosphereType: TPlanetAsthenosphereType = 'silicates';
    asthenosphereSize: number = 0;

    surfaceType: TPlanetSurfaceType = 'regolith';
    surfaceSize: number = 0;

    //atmosphere: PlanetAtmosphere;

    magneticFieldPower: number = 0;
    surfaceGravitation: number = 0;
    gravityAcceleration: number = 0;

    constructor(props: IAbstractPlanetProps) {
        super(props.seed);
    }

    static modifyMass (mass: number, ironPercent: number, waterPercent: number) {
        return mass;
    }

    static modifyRadius (radius: number, ironPercent: number, waterPercent: number) {
        return radius;
    }
}
