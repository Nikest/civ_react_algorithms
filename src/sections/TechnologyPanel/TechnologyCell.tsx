import React, { useEffect, useState } from 'react';

interface ITechnology {
    id: string;
    level?: number;
    name: string;
    description: string;
    childrenTechs: Set<ITechnology>;
}

export const TechnologyCell: React.FC<ITechnology> = ({id, name, level, description, childrenTechs}) => {
    const isActive = window.game.civilization.technologies.technologiesInProgress.has(id);
    const isDone = window.game.civilization.technologies.researchedTechnologyIds.has(id);
    const progress = window.game.civilization.technologies.technologiesInProgress.get(id) || 0;
    const allowedLevel = window.game.civilization.technologies.allowedForResearchLevel;
    const technology = window.game.civilization.technologies.getTechnologyById(id);
    const techCost = technology?.cost || 0;

    const isAllowed = (level || 0) <= allowedLevel;
    let additionalClassName = '';
    if (isActive) additionalClassName = 'active';
    if (isDone) additionalClassName = 'done';

    const buildings = Array.from(technology?.buildings || []).map((building) => {
        return window.game.civilization.technologies.allBuildings.get(building);
    }).filter((b) => b !== undefined);

    const colonyFeatures = Array.from(technology?.feature || []).map((colonyFeatures) => {
        return window.game.civilization.technologies.allColonyFeatures.get(colonyFeatures);
    }).filter((b) => b !== undefined);

    const onStartResearch = () => {
        !isDone && isAllowed && window.game.civilization.technologies.startResearch(id);
    }

    return (
        <div className={'tech-group'}>
            <div className={`tech-cell ${isAllowed ? 'allowed' : ''} ${isDone ? 'done' : ''}`} onClick={onStartResearch}>
                <p className={`text-center title ${additionalClassName} ${(level || 0) <= allowedLevel ? 'allowed' : ''}`}>
                    {name}
                    {
                        isActive ? <span>{Math.floor(((techCost - progress) / techCost) * 100)}%</span> : null
                    }
                </p>
                <p className={'text-center descr'}>{description}</p>
                <div className={'effects'}>
                    {
                        buildings.map((b) => (
                            <div key={b?.key} data-tooltip={b?.name} className={'cell building'} />
                        ))
                    }
                    {
                        colonyFeatures.map((c) => (
                            <div key={c?.key} data-tooltip={c?.name} className={'cell colony'} />
                        ))
                    }
                </div>
            </div>
            {
                Array.from(childrenTechs).map(tech => {
                    return <TechnologyCell key={tech.id} id={tech.id} name={tech.name} level={level} description={tech.description} childrenTechs={tech.childrenTechs} />
                })
            }
        </div>
    );
};