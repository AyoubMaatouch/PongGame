import React from 'react';

export const usePageTitle = (title: string) => {
    React.useEffect(() => {
        document.title = title;
    }, [title]);
};
