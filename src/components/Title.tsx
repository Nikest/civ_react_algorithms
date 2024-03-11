import React from 'react';

interface TitleProps {
    children: React.ReactNode;
    align?: 'left' | 'center' | 'right';
    className?: string;
}
export const Title = ({ children, align = 'left', className = '' }: TitleProps) => {
    return (
        <h1 className={`text-${align} ${className}`}>
            {children}
        </h1>
    );
}