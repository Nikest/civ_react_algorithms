import React, { useEffect, useState } from 'react';

export const PlanetTileInfo = () => {
    const [tileData, setTileData] = useState({ tileIndex: 0, planetId: '' });

    useEffect(() => {
        window.addEventListener('ui:planetUpdate:tileHover', ({ detail }: any) => {
            setTileData(detail);
        });
    }, []);

    const planet = window.game.system.getPlanetById(tileData.planetId);

    if (!planet) {
        return null;
    }

    const planetTile = planet.getTiles().getPlanetTile(tileData.tileIndex);

    if (!planetTile) {
        return null;
    }

    const isOcean = planetTile.type === 'liquid';

    const landGroup = planet.getTiles().getLandGroup(tileData.tileIndex);
    const tileType = isOcean ? 'Океан' : landGroup?.type === 'continent' ? 'Континент' : 'Остров';
    const tileName = isOcean ? '--' : landGroup?.name;

    let cityName = '';
    let districtType = '';

    if (planetTile.isColonized) {
        const city = window.game.civilization.getCityById(planetTile.cityId);
        cityName = city?.name || '---';
        districtType = city?.getDistrictById(planetTile.citiDistrictId)?.type || '---';
    }

    const getDistrictType = (type: string) => {
        switch (type) {
            case 'center':
                return 'Центральный район';
            case 'mining':
                return 'Добывающий район';
            case 'science':
                return 'Научный район';
            case 'living':
                return 'Жилой район';
            case 'industrial':
                return 'Промышленный район';
            case 'farming':
                return 'Фермерский район';
            case 'medical':
                return 'Медицинский район';
            case 'religious':
                return 'храмовый район';
            default:
                return '---';
        }
    }

    return (
        <div className={'planet-tile-info'}>
            <p>Тип: {tileType} <b className={'capitalize'}>{tileName}</b></p>
            {
                planetTile.isColonized && (
                    <>
                        <p>Город: <b className={'capitalize'}>{cityName}</b></p>
                        <p>{getDistrictType(districtType)}</p>
                        <br/>
                    </>
                )
            }

            {
                !isOcean && (
                    <>
                        <p>Ресурсы:</p>
                        <div className={'tile-diagram'}>
                            <p>Железо ({(planetTile.iron * 100).toFixed(2)})</p>
                            <p className={'diagram-item-hold'}>
                                <span className={'diagram-item'} style={{
                                    background: '#b9e1fc',
                                    width: `${planetTile.iron * 100 + 1}%`
                                }}/>
                            </p>

                            <p>Медь ({(planetTile.copper * 100).toFixed(2)})</p>
                            <p className={'diagram-item-hold'}>
                                <span className={'diagram-item'} style={{
                                    background: '#eaac6f',
                                    width: `${planetTile.copper * 100 + 1}%`
                                }}/>
                            </p>

                            <p>Литий ({(planetTile.lithium * 100).toFixed(2)})</p>
                            <p className={'diagram-item-hold'}>
                                <span className={'diagram-item'} style={{
                                    background: '#cbffe7',
                                    width: `${planetTile.lithium * 100 + 1}%`
                                }}/></p>

                            <p>Аллюминий ({(planetTile.aluminum * 100).toFixed(2)})</p>
                            <p className={'diagram-item-hold'}>
                                <span className={'diagram-item'} style={{
                                    background: '#ffffff',
                                    width: `${planetTile.aluminum * 100 + 1}%`
                                }}/></p>

                            <p>Титан ({(planetTile.titanium * 100).toFixed(2)})</p>
                            <p className={'diagram-item-hold'}>
                                <span className={'diagram-item'} style={{
                                    background: '#d5c0ff',
                                    width: `${planetTile.titanium * 100 + 1}%`
                                }}/>
                            </p>

                            <p>Уран ({(planetTile.uranium * 100).toFixed(2)})</p>
                            <p className={'diagram-item-hold'}>
                                <span className={'diagram-item'} style={{
                                    background: '#baffa4',
                                    width: `${planetTile.uranium * 100 + 1}%`
                                }}/>
                            </p>
                        </div>
                    </>
                )
            }
        </div>
    );
}