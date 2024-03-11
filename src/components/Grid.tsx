import React from 'react';

interface GridProps {
    children: React.ReactNode | React.ReactNode[];
    line?: number;
}
export const Grid = ({ children, line = 4 }: GridProps) => {
    return (
        <div className={`grid-standard`} style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${line}, 1fr)`
        }}>
            {children}
        </div>
    )
}