import React, { useEffect, useState } from 'react';
import { Title, Box, Grid, Info } from '../components';

import { generateId } from '../game/utils';

export const PopulationsPanel = () => {
    const [renderId, setRenderId] = useState(generateId());

    useEffect(() => {
        setInterval(() => {
            setRenderId(generateId());
        }, 2000);
    }, []);

    const populations = window.game.civilization.populations;

    if (populations.size === 0) {
        return null;
    }

    return (
        <div className="populations-panel" data-render-id={renderId}>
            <Box>
                <Title align={'center'} className={'margin-bottom-big'}>Популяции</Title>

                <Grid line={6}>
                    {Array.from(populations).map(([id, population], i) => {
                        const state = population.getLastCurrentState();
                        return (
                            <Box key={id}>
                                <Title align={'center'} className={'margin-bottom-big'}>Популяция {i + 1}</Title>
                                <Info data={[
                                    { key: 'Дети', value: state.children },
                                    { key: 'Взрослые', value: state.adults },
                                    { key: 'Старики', value: state.elders },
                                    { key: 'Всего', value: state.totalPopulation },
                                ]} />
                            </Box>
                        );
                    })}
                </Grid>
            </Box>
        </div>
    );
}