import * as React from 'react';
import { Box } from '@chakra-ui/react';
import loadingGif from '../assets/pongame.gif';

export const Loading = () => {
    return (
        <Box
            _light={{ bg: 'rgba(0,0,0,0.5)' }}
            _dark={{ bg: 'rgba(0,0,0,0.5)' }}
            sx={{
                w: '100vw',
                h: '100vh',
                zIndex: 10000,
                top: 0,
                right: 0,
                position: 'fixed',
            }}
        >
            <img
                alt="loading"
                style={{
                    maxWidth: '15rem',
                    width: '100%',
                    position: 'fixed',
                    top: '50%',
                    right: '50%',
                    transform: 'translate(50%, -50%)',
                }}
                src={loadingGif}
            />
        </Box>
    );
};
