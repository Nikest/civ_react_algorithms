import React, { useEffect, useState } from 'react';
import { Title, Box, Info } from '../components';

import { generateId, capitalizeFirstLetter, formatNumber } from '../game/utils';

export const ColonialFleet = () => {
    const [renderId, setRenderId] = useState(generateId());

    useEffect(() => {
        window.addEventListener('ui:fleetUpdate', () => {
            setRenderId(generateId());
        });
    }, []);

    const civilization = window.game.civilization;
    const colonialFleet = window.game.civilization.fleets[0];

    if (!colonialFleet) {
        return null;
    }
    const captain = civilization.getPersonById(colonialFleet.captainId);
    const headOfColonization = civilization.getPersonById(colonialFleet.headOfColonizationId);
    const mainScientist = civilization.getPersonById(colonialFleet.mainScientistId);

    return (
        <div className="percons-panel" data-render-id={renderId}>
            <Box>
                <Title align={'center'} className={'margin-bottom-big'}>Колониальный флот</Title>
                <div>
                    <Info data={[
                        { key: 'Название:', value: colonialFleet.name },
                        { key: 'Капитан:', value: captain ? capitalizeFirstLetter(captain.name) + ' ' + capitalizeFirstLetter(captain.surname) : 'Не назначен'},
                        { key: 'Глава колонизации:', value: headOfColonization ? capitalizeFirstLetter(headOfColonization.name) + ' ' + capitalizeFirstLetter(headOfColonization.surname) : 'Не назначен'},
                        { key: 'Главный ученый:', value: mainScientist ? capitalizeFirstLetter(mainScientist.name) + ' ' + capitalizeFirstLetter(mainScientist.surname) : 'Не назначен'},
                        { key: 'Крионированные колонисты:', value: formatNumber(colonialFleet.cryopreservedColonists) },
                    ]} />
                </div>
                <div>{colonialFleet.processDescription}</div>
            </Box>
        </div>
    );
}