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
        value: planetInfo.orbitRadius.toFixed(2)
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
                key: 'Liquid',
                value: planetInfo.surface.liquidLevel === 0 ? 'not exist' : `${planetInfo.surface.liquidType}`
            },{
                key: 'Surface',
                value: `${planetInfo.surface.surfaceType}, size: ${(planetInfo.surface.size * 100).toFixed()}%`
            },{
                key: 'Mantle',
                value: `${planetInfo.mantle.type}, size: ${(planetInfo.mantle.size * 100).toFixed()}%`
            },{
                key: 'Core',
                value: `${planetInfo.core.type}, size: ${(planetInfo.core.size * 100).toFixed()}%`
            },
        ],
    },{
        key: 'Magnetic field power',
        value: planetInfo.magneticFieldPower
    },{
        key: 'Atmosphere',
        value: planetInfo.atmosphere.preassure === 0 ? 'not exist' : 'exist'
    }];

    const viewSize = planetInfo.radius >= 1 ? 1 / planetInfo.radius : (1 + (1 - planetInfo.radius));

    const mantleSizePx = (175 * (planetInfo.mantle.size + planetInfo.core.size)) + 'px';
    const coreSizePx = (175 * planetInfo.core.size) + 'px';

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