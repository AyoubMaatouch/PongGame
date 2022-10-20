import React, { useEffect, useState } from 'react';
import { Badge, Flex, HStack, Tooltip, WrapItem } from '@chakra-ui/react';
import Ach1 from '../assets/ach-1.png';
import Ach2 from '../assets/ach-2.png';
import Ach3 from '../assets/ach-3.png';

// TYPE
type Props = {
    one: boolean;
    two: boolean;
    three: boolean;
};

export const Achievement = ({ one, two, three }: Props) => {
    return (
        <HStack>
            {one && (
                <Tooltip label="Clean sheet !!! 5-0" >
                    <img
                        alt="loading"
                        style={{
                            maxWidth: '3rem',
                            width: '100%',
                        }}
                        src={Ach1}
                    />
                </Tooltip>
            )}
            {two && (
                <Tooltip label="2 Wins in a row !!! Amazing" >
                    <img
                        alt="loading"
                        style={{
                            maxWidth: '3rem',
                            width: '100%',
                        }}
                        src={Ach2}
                    />
                </Tooltip>
            )}
            {three && (
                <Tooltip label="5 Wins in a row !!! Rock Star" >
                    <img
                        alt="loading"
                        style={{
                            maxWidth: '3rem',
                            width: '100%',
                        }}
                        src={Ach3}
                    />
                </Tooltip>
            )}
        </HStack>
    );
};
