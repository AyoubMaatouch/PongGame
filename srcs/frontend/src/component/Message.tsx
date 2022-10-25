import {Box, Flex, Text, useColorMode, useColorModeValue} from "@chakra-ui/react";
import React from "react";

type MsgProps = {
    isSender: Boolean,
    content: String,
    time: String,
}
const Message = ({isSender, content, time}: MsgProps) => {
    const value = useColorModeValue('#000', 'white')
    const {colorMode} = useColorMode();
    // const purple = 'rgb(132,119,218)';
    // const lightGreen = 'rgb(242,254,225)';
    // const darkGreen = 'rgb(117,179,102)';
    // const lightBlack = 'rgb(33,33,33)';
    return (
        <Flex
            w={'100%'}
            justifyContent={isSender ? 'right' : 'left'}
        >
            <Box
                overflow={'auto'}
                rounded={10}
                roundedBottomRight={isSender ? 0 : 10}
                roundedTopLeft={isSender ? 10 : 0}
                maxW={'20em'}
                my={1}
                px={3}
                py={2}
                bg={isSender ?
                    (colorMode === 'dark' ? 'customPurple' : 'lightGreen') :
                    ((colorMode === 'dark') ? 'lightBlack' : 'white')}
                position={'relative'}
            >
                <Text
                    fontFamily={'monospace'}
                    fontWeight={'bold'}
                    color={value}
                    mb={2}
                >
                    {content}
                </Text>
                {/* <Text
                    fontSize={10}
                    bottom={0}
                    right={3}
                    position={'absolute'}
                    color={isSender ? (colorMode === 'dark' ? 'lightGreen' : 'darkGreen') : 'gray'}
                >
                    {time}
                </Text> */}
            </Box>
        </Flex>
    )
}

export default Message;