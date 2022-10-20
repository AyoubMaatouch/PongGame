import * as React from 'react';
import { Divider } from '@chakra-ui/react';

// type
type Props = {
    maxW?: string;
    [other: string]: any;
};

export const Line = ({ maxW, ...props }: Props) => {
    return (
        <Divider
            maxW={maxW}
            border="1px"
            _light={{ borderColor: 'gray.300', backgroundColor: 'gray.300' }}
            _dark={{ borderColor: 'gray.200', backgroundColor: 'gray.200' }}
            {...props}
        />
    );
};
