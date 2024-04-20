import React, { useEffect, useState } from 'react';
import { Title, Box, Grid, Info } from '../components';

import { generateId } from '../game/utils';

export const PersonsPanel = () => {
    const [renderId, setRenderId] = useState(generateId());

    useEffect(() => {
        window.addEventListener('ui:personsUpdate', () => {
            setRenderId(generateId());
        });
    }, []);

    const persons = window.game.civilization.persons;

    return (
        <div className="percons-panel" data-render-id={renderId}>
            <Box>
                <Title align={'center'} className={'margin-bottom-big'}>Персоны</Title>

                <Grid line={6}>
                    {persons.map((person) => (
                        <Box key={person.id}>
                            <Title align={'center'} className={'margin-bottom-big'}>{person.uiName}</Title>
                            <Info data={[
                                { key: 'Роль', value: person.role },
                                { key: 'Пол', value: person.isFemale ? 'Женский' : 'Мужской' },
                                { key: 'Возраст', value: person.age },
                            ]} />
                        </Box>
                    ))}
                </Grid>
            </Box>
        </div>
    );
}