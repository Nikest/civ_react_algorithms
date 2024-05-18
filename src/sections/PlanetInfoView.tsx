import React from 'react';
import { Info } from '../components';
import { capitalizeFirstLetter } from '../game/utils';

export const PlanetInfoView = ({ id }: { id: string }) => {
    const planetInfo = window.game.system.getPlanetById(id);

    if (!planetInfo) return <span />;

    const planetViewData = [{
        key: 'name',
        value: capitalizeFirstLetter(planetInfo.name),
    },{
        key: 'Class',
        value: planetInfo.planetType
    },{
        key: 'Orbit',
        value: `${planetInfo.orbitRadius.toFixed(2)} AU`
    },{
        key: 'Mass',
        value: (planetInfo.mass / 100).toFixed(2)
    },{
        key: 'Radius',
        value: (planetInfo.radius / 100).toFixed(2)
    },{
        key: 'Gravitation',
        value: planetInfo.surfaceGravitation + ', ' + planetInfo.gravityAcceleration + 'm/s'
    },{
        key: 'Composition',
        value: [
            {
                key: 'Surface',
                value: `${planetInfo.surfaceType}, liquid: ${planetInfo.surfaceLiquidSize > 0.5 ? planetInfo.surfaceLiquidType + ' (' + planetInfo.surfaceLiquidSize + ')' : 'none'}`
            },{
                key: 'Mantle',
                value: `Asteno: ${planetInfo.asthenosphereType}, Outer: ${planetInfo.mantleOuterType}, Inner: ${planetInfo.mantleInnerType}`
            },{
                key: 'Core',
                value: `${planetInfo.coreType}`
            },
        ],
    },{
        key: 'Magnetic field power',
        value: planetInfo.magneticFieldPower
    },{
        key: 'Atmosphere',
        value: planetInfo.atmospherePressure > 0 ? planetInfo.atmospherePressure + ' atm' : 'none'
    }];

    const viewSize = planetInfo.radius >= 1 ? 1 / planetInfo.radius : (1 + (1 - planetInfo.radius));

    const mantleSizePx = (175 * ((planetInfo.mantleSize / 100) + (planetInfo.coreSize / 100))) + 'px';
    const coreSizePx = (175 * (planetInfo.coreSize / 100)) + 'px';

    return (
        <div className={'info planet'}>
            <div className={'graphic-planet'}>
                <div className={'target-planet'} style={{backgroundColor: '#fff'}}>
                    <div className={'planet-composition planet-surface'} style={{ width: '100%', height: '100%' }}>
                        <div className={'planet-composition planet-mantle'} style={{ width: mantleSizePx, height: mantleSizePx }}>
                            <div className={'planet-composition planet-core'}  style={{ width: coreSizePx, height: coreSizePx }} />
                        </div>
                    </div>
                </div>
            </div>
            <Info data={planetViewData}/>
        </div>
    );
}