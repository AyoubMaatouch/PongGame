import React from 'react';
import { Flex, Spacer, Stack, Text } from '@chakra-ui/react';
import ToggleMode from '../component/toggleMode';
import Logo from '../component/logo';
import { Link } from 'react-router-dom';
import { pagesContent } from '../constants';
import notfoundGif from '../assets/404.gif';

export default function PageNotFound() {
    return (
        <Stack h="100%">
            <Flex mb={5} px={10} alignItems="center" overflow={'hideen'}>
                <Link to={pagesContent.home.url}>
                    <Logo />
                </Link>
                <Spacer />
                <ToggleMode />
            </Flex>
            <Stack flexGrow={1} alignItems="center" justifyContent="center">
                <img
                    alt="loading"
                    style={{
                        maxWidth: '12rem',
                        width: '100%',
                    }}
                    src={notfoundGif}
                />
                <Text textAlign="center" fontSize="4xl">Opps, Page Not Found</Text>
            </Stack>
        </Stack>
    );
}
