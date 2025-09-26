
import React from 'react';

interface TagProps {
    children: React.ReactNode;
    colorClasses: string;
}

const Tag: React.FC<TagProps> = ({ children, colorClasses }) => {
    return (
        <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full border ${colorClasses}`}>
            {children}
        </span>
    );
};

export default Tag;