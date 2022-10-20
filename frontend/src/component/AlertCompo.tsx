import { Box, chakra, Flex, Icon, ScaleFade } from '@chakra-ui/react';
import React from 'react';
import { BsLightningFill } from 'react-icons/bs';
import { IoMdCheckmarkCircle, IoMdAlert } from 'react-icons/io';
import { resetAlert } from '../State/Action';
import { GlobalContext } from '../State/Provider';

interface Props {
    message: string;
    type: string;
}

export const AlertCompo = ({ message, type }: Props) => {
    // context
    const { dispatch } = React.useContext<any>(GlobalContext);

    // clear the notif tate
    React.useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(resetAlert());
        }, 3000);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Box zIndex={1000000} position="fixed" top="0.3rem" right="50%" transform="translate(50%,0)">
            <ScaleFade initialScale={0.9} in={true}>
                <Flex
                    maxW="sm"
                    w="full"
                    mx="auto"
                    bg="white"
                    _dark={{
                        bg: 'gray.800',
                    }}
                    shadow="md"
                    rounded="lg"
                    overflow="hidden"
                >
                    <Flex
                        justifyContent="center"
                        alignItems="center"
                        w={12}
                        bg={type === 'Error' ? 'red' : type === 'Info' ? 'blue.500' : 'green'}
                    >
                        <Icon
                            as={type === 'Error' ? BsLightningFill : type === 'Info' ? IoMdAlert : IoMdCheckmarkCircle}
                            color="white"
                            boxSize={6}
                        />
                    </Flex>

                    <Box mx={-3} py={2} px={4}>
                        <Box mx={3}>
                            <chakra.span color={type === 'Error' ? 'red' : type === 'Info' ? 'blue.500' : 'green'} fontWeight="bold">
                                {type}
                            </chakra.span>
                            <chakra.p
                                color="gray.600"
                                _dark={{
                                    color: 'gray.200',
                                }}
                                fontSize="sm"
                            >
                                {message}
                            </chakra.p>
                        </Box>
                    </Box>
                </Flex>
            </ScaleFade>
        </Box>
    );
};
