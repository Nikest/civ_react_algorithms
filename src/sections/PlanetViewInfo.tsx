import React, { useEffect, useState } from 'react';
import { Title, Box, Grid } from '../components';

export const PlanetViewInfo = () => {
    const [planetId, setPlanetId] = useState('');

    useEffect(() => {
        window.addEventListener('ui:planetUpdate', () => {
            const colonizedPlanetsIds = window.game.system.getColonizedPlanetsIds();
            setPlanetId(colonizedPlanetsIds[0] || '');
        });
    }, []);

    const planet = window.game.system.getPlanetById(planetId);

    if (!planet) {
        return null;
    }

    const planetBuilder = planet.planetBuilder;

    if (!planetBuilder) {
        return null;
    }

    const continents = planetBuilder.lands.filter(l => l.type === 'continent');

    return (
        <Box>
            <Title>Планета <span className={'capitalize'}><b>{planet.name}</b></span></Title>
            <Grid line={10}>
                <span>Континенты:</span>

                {continents.map((land, index) => (
                    <div key={index}>
                        <span key={index} className={'capitalize'}><b>{land.name}</b></span>
                        <p>Размер: {land.indexes.length}</p>
                    </div>
                ))}

            </Grid>
        </Box>
    );
}