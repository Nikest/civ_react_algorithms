export type TPlanetType =
    'selena'
    | 'miniterra'
    | 'terra'
    | 'superterra'
    | 'neptunian'
    | 'jovian';

export type TPlanetCoreType = 'iron' | 'silicates';

export type TPlanetMantleType =
    'iron'
    | 'silicates'
    | 'carbon'
    | 'waterIce'
    | 'nitrogenIce';

export type TPlanetAsthenosphereType = 'silicates' | 'water' | 'waterIce' | 'carbon' | 'iron';

export type TPlanetSurfaceType =
    'regolith'
    | 'silicates'
    | 'carbon'
    | 'iron'
    | 'solidHydrocarbon'
    | 'water'
    | 'waterIce'
    | 'nitrogenIce';

export type TPlanetSurfaceLiquidType =
    'water'
    | 'liquidHydrocarbon'
    | 'CO2'
    | 'CH4';

export type TPlanetAtmosphereGas = 'H' | 'He' | 'N' | 'O2' | 'CO2' | 'CH4';
