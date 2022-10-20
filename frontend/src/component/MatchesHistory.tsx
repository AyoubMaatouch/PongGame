import React from 'react';
import { List, ListItem, Avatar, HStack, Text } from '@chakra-ui/react';
import { useMediaQuery, useTheme } from '@chakra-ui/react';
import { GlobalContext } from '../State/Provider';
import { getUserIndoById } from '../State/Api';

// type
type Props = {
    history: {
        userId: string;
        opponent_id: string;
        user_score: number;
        opponent_score: number;
    }[];
};

type MatchData = {
    user: {
        username: string;
        score: string;
        avatar: string;
    };
    opponent: {
        username: string;
        score: string;
        avatar: string;
    };
}[];

export const MatchesHistory = ({ history }: Props) => {
    const theme = useTheme();
    const [isSmallScreen] = useMediaQuery(`(min-width: ${theme.breakpoints.md})`);
    const [matchData, setMatchData] = React.useState<MatchData>([]);

    const { dispatch } = React.useContext<any>(GlobalContext);

    React.useEffect(() => {
        setMatchData([]);
        history.forEach((match) => {
            getUserIndoById(dispatch, match.userId, match.opponent_id).then((info: any) => {
                setMatchData((arr: any) => [
                    ...arr,
                    {
                        user: {
                            username: info.username1,
                            score: match.user_score,
                            avatar: info.avatar1,
                        },
                        opponent: {
                            username: info.username2,
                            score: match.opponent_score,
                            avatar: info.avatar2,
                        },
                    },
                ]);
            });
        });
        return () => {
            setMatchData([]);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [history]);

    return (
        <>
            {history.length ? (
                <List spacing={10} p={5}>
                    {matchData?.map((item, index) => {
                        return (
                            <ListItem key={index}>
                                <HStack spacing={5}>
                                    <HStack spacing={3}>
                                        {isSmallScreen && <Text fontSize="xl">{item.user.username}</Text>}
                                        <Avatar name={item.user.username} src={item.user.avatar} size="sm" />
                                    </HStack>
                                    <HStack fontSize="xl">
                                        <Text>{item.user.score}</Text>
                                        <Text>-</Text>
                                        <Text>{item.opponent.score}</Text>
                                    </HStack>
                                    <HStack spacing={3}>
                                        <Avatar name={item.opponent.username} src={item.opponent.avatar} size="sm" />
                                        {isSmallScreen && <Text fontSize="xl">{item.opponent.username}</Text>}
                                    </HStack>
                                </HStack>
                            </ListItem>
                        );
                    })}
                </List>
            ) : (
                <Text color="gray.400">no match yet</Text>
            )}
        </>
    );
};
