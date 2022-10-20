import * as React from 'react';
import { Avatar, AvatarBadge, Text, Stack } from '@chakra-ui/react';

// TYPE
type Props = {
    name: string;
    avatar: string;
    isOnline: boolean;
};

export const ProfileAvatar = ({ name, avatar, isOnline }: Props) => {    
    return (
        <Stack alignItems="center">
            <Avatar name={name} src={avatar} size="xl">
                <AvatarBadge boxSize="1em" bg={isOnline ? 'green' : 'red'} />
            </Avatar>
            <Text fontWeight="bold" fontSize="2xl">
                {name}
            </Text>
        </Stack>
    );
};
