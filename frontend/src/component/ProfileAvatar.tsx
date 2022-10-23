import * as React from 'react';
import { Avatar, AvatarBadge, Text, Stack, Icon } from '@chakra-ui/react';
import { RiPingPongFill } from 'react-icons/ri';
import { motion } from 'framer-motion';

// TYPE
type Props = {
    name: string;
    avatar: string;
    isOnline: boolean;
    isOnGame: boolean;
};

export const ProfileAvatar = ({ name, avatar, isOnline, isOnGame }: Props) => {
    return (
        <Stack alignItems="center">
            <Avatar name={name} src={avatar} size="xl">
                {isOnGame ? (
                    <AvatarBadge
                        as={motion.div}
                        animate={{
                            scale: [1, 1.2, 1],
                            transition: {
                                duration: 2,
                                repeat: Infinity,
                            },
                        }}
                        boxSize="1em"
                    >
                        <Icon color="blue.500" as={RiPingPongFill} />
                    </AvatarBadge>
                ) : (
                    <AvatarBadge boxSize="1em" bg={isOnline ? 'green' : 'red'} />
                )}
            </Avatar>
            <Text fontWeight="bold" fontSize="2xl">
                {name}
            </Text>
        </Stack>
    );
};
