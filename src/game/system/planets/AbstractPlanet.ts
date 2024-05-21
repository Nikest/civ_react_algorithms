import { SpaceBody } from '../SpaceBody';
import { PlanetTiles } from '../PlanetTiles';
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
import { G, AUinMeters, solarMass } from '../constants';
import * as utils from "../../utils";

export interface IAbstractPlanetProps {
    seed: number;
    temperatureZone: TStarTemperatureZoneIndex;
    orbitRadius: number;
    starMass: number;
    shouldHabitable?: boolean;
}

export abstract class AbstractPlanet extends SpaceBody {
    className: string = 'planet';

    planetType: TPlanetType = 'selena';
    temperatureZone: TStarTemperatureZoneIndex = 0;

    coreType: TPlanetCoreType = 'silicates';
    coreSize: number = 0;

    mantleSize: number = 0;
    mantleInnerType: TPlanetMantleType = 'silicates';
    mantleInnerSize: number = 0;
    mantleOuterType: TPlanetMantleType = 'silicates';
    mantleOuterSize: number = 0;
    asthenosphereType: TPlanetAsthenosphereType = 'silicates';
    asthenosphereSize: number = 0;

    surfaceType: TPlanetSurfaceType = 'regolith';
    surfaceSize: number = 0;
    surfaceLiquidType: TPlanetSurfaceLiquidType = 'water';
    surfaceLiquidSize: number = 0;

    atmospherePressure: number = 0;

    magneticFieldPower: number = 0;
    surfaceGravitation: number = 0;
    gravityAcceleration: number = 0;

    planetTiles: PlanetTiles | null = null;
    waitingForColonization: boolean = false;
    isColonized: boolean = false;

    constructor(props: IAbstractPlanetProps) {
        super(props.seed, props.orbitRadius);
        this.temperatureZone = props.temperatureZone;
    }

    static modifyMass (mass: number, ironPercent: number, waterPercent: number) {
        return mass;
    }

    static modifyRadius (radius: number, ironPercent: number, waterPercent: number) {
        return radius;
    }

    calculateOrbitParams (centralMass: number) {
        const semiMajorAxisMeters = this.orbitRadius * AUinMeters;

        const periodSquared = (4 * Math.PI * Math.PI * Math.pow(semiMajorAxisMeters, 3)) / (G * centralMass);

        const orbitalPeriodInSeconds = Math.sqrt(periodSquared);
        const orbitalPeriodInDays = Math.round(orbitalPeriodInSeconds / (60 * 60 * 24));


        this.orbitAngularVelocity = (2 * Math.PI) / (orbitalPeriodInDays * 24 * 60 * 60);
        this.orbitalPeriod = orbitalPeriodInDays;
    }

    modifiers (shouldHabitable: boolean) {
        if (shouldHabitable) {
            const liquigSizeT = this.rand.randomFloat(0, 1);
            const atmospherePressureT = this.rand.randomFloat(0, 1);
            this.coreType = 'iron';
            this.mantleInnerType = 'silicates';
            this.mantleOuterType = 'silicates';
            this.asthenosphereType = 'silicates';
            this.surfaceType = 'silicates';
            this.surfaceLiquidType = 'water';
            this.surfaceLiquidSize = utils.lerpRounded(1, 2, liquigSizeT, 2);
            this.atmospherePressure = utils.lerpRounded(0.75, 1.75,atmospherePressureT, 2);
        }
    }

    getTiles () {
        if (!this.planetTiles) {
            this.planetTiles = new PlanetTiles(this.seed, this.radius, this.surfaceLiquidSize);
        }
        return this.planetTiles;
    }

    waitForColonization () {
        this.waitingForColonization = true;
    }

    colonize () {
        this.isColonized = true;
        window.game.system.systemUpdated();
    }
}
