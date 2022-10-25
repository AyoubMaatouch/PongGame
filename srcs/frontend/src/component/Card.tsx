import * as React from 'react';
import { Stack } from '@chakra-ui/react';

// types
type Props = {
    children?: JSX.Element;
    [other: string]: any;
};

export const Card = ({ children, ...props }: Props) => {
    return (
        <Stack
            p={10}
            _dark={{ boxShadow: 'dark-lg', bg: 'grey.700' }}
            _light={{ boxShadow: 'md' }}
            borderRadius="2xl"
            boxShadow="2xl"
            h="100%"
            {...props}
        >
            {children}
        </Stack>
    );
};
