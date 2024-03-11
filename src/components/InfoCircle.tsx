import React from 'react';

interface InfoCircleProps {
    info: number | string
}
export const InfoCircle = ({ info }: InfoCircleProps) => {
    return (
        <div className={'info-circle'}>
            {info}
        </div>
    );
}