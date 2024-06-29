import React, { useEffect, useState } from 'react';
import { Title, Box, Grid, Info } from '../../components';

import { generateId, capitalizeFirstLetter, formatNumber } from '../../game/utils';

export const ColonyPanel = () => {
    const [renderId, setRenderId] = useState(generateId());

    useEffect(() => {
        setInterval(() => {
            setRenderId(generateId());
        }, 2000);
    }, []);

    const cities = window.game.civilization.colonies;

    return (
        <div className="city-panel" data-render-id={renderId}>
            <Box>
                <Title align={'center'} className={'margin-bottom-big'}>Города</Title>

                <Grid line={6}>
                    {
                        Array.from(cities).map(([id, colony]) => {
                            return (
                                <Box key={id}>
                                    <Title align={'center'} className={'margin-bottom-big'}>{capitalizeFirstLetter(colony.name)}</Title>
                                    <p className={'text-center'}>{colony.developmentStage.type}</p>
                                    <Info data={[
                                        { key: 'Планета', value: capitalizeFirstLetter(colony.planetName) },
                                        { key: 'Население', value: formatNumber(colony.totalPopulation) },
                                        { key: 'Районы', value: colony.districts.size },
                                    ]} />
                                    <p>{colony.developmentStage.description}</p>
                                </Box>
                            )
                        })
                    }
                </Grid>
            </Box>
        </div>
    );
}