import React, { useEffect, useState } from 'react';

export const PlanetTileInfo = () => {
    const [tileData, setTileData] = useState({ tileIndex: 0, planetId: '', landGroup: 0 });

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

    const landGroup = planet.getTiles().getLandGroup(tileData.landGroup);
    const liquidGroup = planet.getTiles().getLiquidBodyGroup(tileData.landGroup);

    const tileName = isOcean ? liquidGroup?.name : landGroup?.name;

    let cityName = '';
    let districtType = '';

    if (planetTile.isColonized) {
        const city = window.game.civilization.getColonyById(planetTile.colonyId);
        cityName = city?.name || '---';
        districtType = city?.districts.get(planetTile.index) || '---';
    }

    const getTileType = (type: string) => {
        switch (type) {
            case 'lake':
                return 'Озеро';
            case 'sea':
                return 'Море';
            case 'ocean':
                return 'Океан';
            case 'continent':
                return 'Континент';
            case 'island':
                return 'Остров';
            default:
                return '---';
        }
    }

    const getDistrictType = (type: string) => {
        switch (type) {
            case 'outpost':
                return 'Аванпост';
            case 'center':
                return 'Центральный район';
            case 'farming':
                return 'Фермерский район';
            case 'mining':
                return 'Добывающий район';
            case 'industrial':
                return 'Промышленный район';
            case 'medical':
                return 'Медицинский район';
            case 'science':
                return 'Научный район';
            case 'religious':
                return 'храмовый район';
            case 'living':
                return 'Жилой район';
            case 'business':
                return 'Бизнес район';
            default:
                return '---';
        }
    }

    return (
        <div className={'planet-tile-info'}>
            <p>Тип: {getTileType(isOcean ? liquidGroup.type : landGroup.type)} <b className={'capitalize'}>{tileName}</b></p>
            {
                planetTile.isColonized && (
                    <>
                        <p>Колония: <b className={'capitalize'}>{cityName}</b></p>
                        <p>{getDistrictType(districtType)}</p>
                        <br/>
                    </>
                )
            }

            {
                !isOcean ? (
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
                ) : (
                    <>
                    <p>Размер: {liquidGroup.size}</p>
                    </>
                )
            }
        </div>
    );
}