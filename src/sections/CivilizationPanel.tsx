import React, { useEffect, useState } from 'react';
import { Title, Box, Grid, InfoCircle } from '../components';

import { generateId, formatNumberWithEnd } from '../game/utils';

export const CivilizationPanel = () => {
    const [renderId, setRenderId] = useState(generateId());

    useEffect(() => {
        const interval = setInterval(() => {
            setRenderId(generateId());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const civilization = window.game.civilization;

    return (
        <div className="civilization-panel" data-render-id={renderId}>
            <Box>
                <Title align={'center'}>Цивилизация</Title>
                <div>
                    <p className={'paragraph'}>Background: {civilization.background.description}</p>
                </div>

                <Grid line={6}>
                    <Box>
                        <Title align={'center'} className={'margin-bottom-big'}>Планеты</Title>
                        <div className={'text-center'}><InfoCircle info={civilization.colonizedPlanetsIds.length} /></div>
                    </Box>
                    <Box>
                        <Title align={'center'} className={'margin-bottom-big'}>Орбитальные станции</Title>
                        <div className={'text-center'}><InfoCircle info={civilization.orbitalStations.length}/></div>
                    </Box>
                    <Box>
                        <Title align={'center'} className={'margin-bottom-big'}>Города</Title>
                        <div className={'text-center'}><InfoCircle info={civilization.cities.length}/></div>
                    </Box>
                    <Box>
                        <Title align={'center'} className={'margin-bottom-big'}>Население</Title>
                        <div className={'text-center'}><InfoCircle info={formatNumberWithEnd(civilization.totalPopulation || 0)}/></div>
                    </Box>
                    <Box>
                        <Title align={'center'} className={'margin-bottom-big'}>Популяции</Title>
                        <div className={'text-center'}><InfoCircle info={civilization.populations.length}/></div>
                    </Box>
                    <Box>
                        <Title align={'center'} className={'margin-bottom-big'}>Культуры</Title>
                        <div className={'text-center'}><InfoCircle info={civilization.cultures.length}/></div>
                    </Box>
                </Grid>
            </Box>
        </div>
    );
}