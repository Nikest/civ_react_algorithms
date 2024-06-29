import React, { useEffect, useState } from 'react';
import { Title, Box, Grid } from '../../components';
import { TechnologyLevel } from './TechnologyLevel';
import { generateId, capitalizeFirstLetter, formatNumber } from '../../game/utils';

export const TechnologyPanel = () => {
    const [renderId, setRenderId] = useState(generateId());

    useEffect(() => {
        setInterval(() => {
            const changeHash = window.game.civilization.technologies.changeHash;
            if (renderId !== changeHash) setRenderId(changeHash);
        }, 10);
    }, []);

    const buildings = Array.from(window.game.civilization.technologies.allowedBuildings || []).map((building) => {
        return window.game.civilization.technologies.allBuildings.get(building);
    }).filter((b) => b !== undefined);

    const colonyFeatures = Array.from(window.game.civilization.technologies.allowedColonyFeatures || []).map((colonyFeatures) => {
        return window.game.civilization.technologies.allColonyFeatures.get(colonyFeatures);
    }).filter((b) => b !== undefined);

    return (
        <div className="technology-panel" data-render-id={renderId}>
            <Box>
                <Title align={'center'} className={'margin-bottom-big'}>Технологии</Title>
                <p>Открытые постройки:</p>
                <div className={'effects big'}>
                    {
                        buildings.map((b) => (
                            <div key={b?.key} data-tooltip={b?.name} className={'cell building'}/>
                        ))
                    }
                </div>
                <p>Эффекты колонии:</p>
                <div className={'effects big'}>
                    {
                        colonyFeatures.map((c) => (
                            <div key={c?.key} data-tooltip={c?.name} className={'cell colony'}/>
                        ))
                    }
                </div>
                <br/>
                <div className="tech-wrap">
                    {
                        window.game.civilization.technologies.levelsOfTechnologies.map((_, l) => {
                            return <TechnologyLevel key={l + renderId} level={l}/>
                        })
                    }
                </div>
            </Box>
        </div>
);
}