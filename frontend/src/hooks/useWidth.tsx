import React from 'react';

const useWindowWidth = () => {
    const [windowSize, setWindowSize] = React.useState(window.innerWidth);

    const handleWindowResize = () => {
        setWindowSize(window.innerWidth);
    };

    React.useEffect(() => {
        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);
    return windowSize;
};

export default useWindowWidth;
