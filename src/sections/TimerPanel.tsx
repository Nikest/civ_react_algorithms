import React, { useEffect, useState } from 'react';
import { Title, Box, Grid, InfoCircle } from '../components';

import { generateId, formatNumber } from '../game/utils';

export const TimerPanel = () => {
    const [renderId, setRenderId] = useState(generateId());

    useEffect(() => {
        const interval = setInterval(() => {
            setRenderId(generateId());
        }, 10);
        return () => clearInterval(interval);
    }, []);

    const timer = window.game.timer;

    return (
        <div className="timer-panel" data-render-id={renderId}>
            <Box>
                <p className="grid-time">
                    <span><b>{timer.timeDate.getDate()}</b></span>
                    <span><b>{timer.timeDate.toLocaleString('ru-RU', {month: 'long'})}</b></span>
                    <span><b>{formatNumber(timer.timeDate.getFullYear())}</b></span><span>года</span>
                </p>
                <button onClick={() => timer.run()}>Run</button>
                <button onClick={() => timer.stop()}>Stop</button>
                <button onClick={() => timer.timePlus()}>+</button>
                <button onClick={() => timer.timeMinus()}>-</button>
                <span>Скорость: <b><span>{timer.formatDuration()}</span></b> в секунду</span>
            </Box>
        </div>
    );
}