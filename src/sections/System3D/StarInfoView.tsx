import React from 'react';
import { Info } from '../../components';
import { capitalizeFirstLetter } from '../../game/utils';

export const StarInfoView = () => {
    const starInfo = window.game.system.star;

    const starViewData = [{
        key: 'name',
        value: capitalizeFirstLetter(starInfo.name)
    },{
        key: 'Class',
        value: starInfo.typeFullText
    },{
        key: 'Mass',
        value: starInfo.mass + ' M☉'
    },{
        key: 'Radius',
        value: starInfo.radius + ' R☉'
    },{
        key: 'Temperature',
        value: starInfo.temperature + ' K'
    },{
        key: 'Luminosity',
        value: starInfo.luminosity + ' L☉'
    },{
        key: 'Zones',
        value: starInfo.temperatureZones.join(', ')
    },{
        key: 'Planets',
        value: starInfo.planets
    }];
    console.log('starInfo.radius', starInfo.radius)
    const viewSize = 1 / starInfo.radius;

    return (
        <div className={'info'}>
            <div className={'graphic-star'}>
                <div className={'target-star'} style={{backgroundColor: starInfo.colorRGB}}/>
                <div className={'sun-compare'}> <div className={'sun'} style={{ transform: `scale(${viewSize})` }} /> </div>
            </div>
            <Info data={starViewData}/>
        </div>
    );
}