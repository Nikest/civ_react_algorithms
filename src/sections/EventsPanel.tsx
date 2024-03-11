import React, {useEffect, useState} from 'react';

interface IEvent {
    time: number;
    text: string;
}
export const EventsPanel = () => {
    const [events, addEvents] = useState<IEvent[]>([]);

    useEffect(() => {
        window.addEventListener('ui:addEvent', ({ detail }: any) => {
            addEvents([...events, detail]);
        });
    }, [events]);

    return (
        <div className="events-panel">
            {
                events.map((event, index) => {
                    const date = new Date(event.time);
                    const day = date.getDate();
                    const month = date.toLocaleString('ru-RU', {month: 'long'});
                    const year = date.getFullYear();
                    return (
                        <div key={index} className={'event'}>
                            <div className={'time'}>{day} {month} {year}</div>
                            <span className={'text'}>{event.text}</span>
                        </div>
                    );
                })
            }
        </div>
    );
}