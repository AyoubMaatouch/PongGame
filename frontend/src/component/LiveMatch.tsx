import * as React from 'react';
import { HStack, Avatar, Text, Button, Grid, GridItem } from '@chakra-ui/react';
import { useMediaQuery, useTheme } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { pagesContent } from '../constants';

// type
type Props = {
    match: {
        room_name: string;
        p0: {
            username: string;
            avatar: string;
        };
        p1: {
            username: string;
            avatar: string;
        };
    };
};

export const LiveMatch = ({ match }: Props) => {
    const theme = useTheme();
    const [isSmallScreen] = useMediaQuery(`(min-width: ${theme.breakpoints.md})`);

    return (
        <Grid h="100%" templateColumns="repeat(9, 1fr)" gap={isSmallScreen ? 5 : 3}>
            <GridItem colSpan={2} h="fit-content" my="auto">
                <HStack justifyContent="flex-end" alignItems="center">
                    <Link to={`${pagesContent.watch.url}/${match.room_name}`}>
                        <Button
                            variant="solid"
                            bg="red"
                            color="gray.900"
                            borderRadius="2xl"
                            fontSize="sm"
                            fontWeight="light"
                            size="xl"
                            py={2}
                            px={4}
                            _focus={{
                                bg: 'red',
                            }}
                            _hover={{
                                bg: 'red',
                            }}
                        >
                            watch
                        </Button>
                    </Link>
                </HStack>
            </GridItem>
            <GridItem colSpan={3}>
                <HStack justifyContent="flex-end">
                    {isSmallScreen && <Text fontSize="xl">{match.p0.username}</Text>}
                    <Avatar name={match.p0.username} src={match.p0.avatar} size="md" />
                </HStack>
            </GridItem>
            <GridItem colSpan={1} h="fit-content" my="auto">
                <HStack fontSize="xl" alignItems="center" justifyContent="center">
                    <Text textAlign="center">vs</Text>
                </HStack>
            </GridItem>
            <GridItem colSpan={3}>
                <HStack justifyContent="flex-start">
                    <Avatar name={match.p1.username} src={match.p1.avatar} size="md" />
                    {isSmallScreen && <Text fontSize="xl">{match.p1.username}</Text>}
                </HStack>
            </GridItem>
        </Grid>
    );
};
