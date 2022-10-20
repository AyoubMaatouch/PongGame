import React from 'react';
import {Avatar, Button, HStack, Text, VStack,} from "@chakra-ui/react";
import {FaDiscord, FaFacebook, FaInstagram} from "react-icons/fa";
import FacebookButton from "./FacebookButton";
import InstagramButton from "./InstagramButton";
import DiscordButton from "./DiscordButton";

type Props = {
    name: string,
    src: string,
    facebook: string,
    instagram: string,
    discord: string,
}

function MiniProfile({name, src, facebook, discord, instagram}: Props) {
    return (
        <VStack
            h={'100%'}
            w={'100%'}
            alignItems={'center'}
            justifyContent={'center'}
            direction={'column'}
            spacing={6}
        >
            <Avatar
                size={'2xl'}
                name={name}
                src={src}
            ></Avatar>
            <Text my={7} fontSize={25} fontWeight={'bold'}> {name} </Text>
            <HStack spacing={8}>
                <FacebookButton id={facebook}/>
                <DiscordButton id={discord}/>
                <InstagramButton id={instagram}/>
            </HStack>
            <Button
                _hover={{bg: 'red'}}
                mb={7}
                bg={'#BFC5DC'}
                color={'#000000'}
                w={200}
                h={35}
                rounded={20}
                colorScheme='gray' variant='solid'>
                <HStack spacing={4} >
                    <Text fontSize={30} > 🏓 </Text>
                    <Text> Invite to Game </Text>
                </HStack>
            </Button>
        </VStack>
    );
}

export default MiniProfile;