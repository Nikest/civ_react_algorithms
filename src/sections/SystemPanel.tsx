import React, { useEffect, useState } from 'react';
import { Info } from '../components';

import { generateId } from '../game/utils';

function importAll(r: any) {
    const images: any = {};
    r.keys().map(r).forEach((filePath: string) => {
        const path = filePath;
        const name = filePath.split('/static/media/').pop()?.split('.')[0] || 'test';
        images[name] = path;
    });

    return images;
}

// @ts-ignore
const planetTextures = importAll(require.context('../assets/planets', false, /\.png$/));

export const SystemPanel = () => {
    const [renderId, setRenderId] = useState(generateId());

    useEffect(() => {
       window.addEventListener('ui:systemUpdate', () => {
           setRenderId(generateId());
       });
    }, []);

    const star = window.game.system.star;
    const planets = window.game.system.planets;

    return (
        <div data-system="board" className="star-system" data-render-id={renderId}>
            <div className="item">
                <div className="block">
                    <div className={`star type-${star.type[0]}`}></div>
                </div>
                <p className="name capitalize"><b>{star.name}</b></p>
                <Info data={[
                    { key: 'Тип', value: star.type },
                ]} />
            </div>

            {planets.map(planet => {
                let texture = '';
                if (planet.texture) {
                    texture = planetTextures[planet.texture as keyof typeof planetTextures];
                }

                return (
                <div key={planet.id} className="item" onClick={() => window.game.system.selectPlanet(planet.id)}>
                    <div className="block">
                        <div className={`planet type-${planet.type} temperature-${planet.temperatureType}`}>
                            <div data-texture={planet.texturePosition} className={`planet-texture`} style={{
                                backgroundImage: `url(${texture})`,
                                backgroundSize: 'cover',
                                backgroundPositionX: planet.texturePosition,
                            }}></div>
                        </div>
                    </div>
                    <p className="name capitalize">{planet.name}</p>
                    <Info data={[
                        {key: 'Тип', value: planet.type},
                        {key: 'Температура', value: planet.temperatureType},
                    ]} />
                </div>
            )})}
        </div>
    );
}