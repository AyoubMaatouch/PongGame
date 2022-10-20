import React, { useEffect, useState } from 'react';
import { Badge, WrapItem } from '@chakra-ui/react';

// TYPE
type Props = {
    rate: number;
};

export const StatusProfile = ({ rate }: Props) => {
    const [color, setColor] = useState('teal');
    const [status, setStatus] = useState('Beginner');

    useEffect(() => {
        if (rate >= 90) {
            setColor('purple');
            setStatus('pro');
        } else if (rate >= 50) {
            setColor('orange');
            setStatus('Intermediate');
        } else {
            setColor('teal');
            setStatus('Beginner');
        }
    }, [rate]);
    return (
        <WrapItem>
            <Badge borderRadius="full" px={6} pt={1.5} pb={1} colorScheme={color}>
                {status}
            </Badge>
        </WrapItem>
    );
};
