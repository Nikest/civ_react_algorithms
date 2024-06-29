import React, { useEffect, useState } from 'react';
import { TechnologyCell } from './TechnologyCell';

interface ITechnologyLevel {
    level: number;
}

export const TechnologyLevel: React.FC<ITechnologyLevel> = ({level}) => {
    const techs = window.game.civilization.technologies.levelsOfTechnologies[level];

    return (
        <div className={'tech-level'}>
            <div className={'level'}>Tech level {level}</div>
            <div className={'tech-list'}>
                {
                    Array.from(techs).map(([id, tech]) => {
                        return <TechnologyCell key={tech.id} id={tech.id} level={level} name={tech.name} description={tech.description} childrenTechs={tech.childrenTechs}/>
                    })
                }
            </div>
        </div>
    );
};