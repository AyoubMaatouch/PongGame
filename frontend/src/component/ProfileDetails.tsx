import React, {useContext, useEffect} from 'react';
import {Flex, HStack, Text, VStack} from "@chakra-ui/react";
import {ChatContext} from "../State/ChatProvider";
import {CloseIcon} from "@chakra-ui/icons";
import MiniProfile from "./MiniProfile";


function ProfileDetails() {
    const {data, friends, groups} = useContext<any>(ChatContext);
    const {setChatDetails, toggleDetails} = useContext<any>(ChatContext);
    const {selectedChat} = useContext<any>(ChatContext);
    let searchIndex;
    if (selectedChat.chat === 'F') searchIndex = friends.findIndex((id: any) => selectedChat.id === id.id);
    else searchIndex = groups.findIndex((id: any) => selectedChat.id === id.id);

    useEffect(() => {
        const keyDownHandler = (event: any) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                toggleDetails()
            }
        };
        document.addEventListener('keydown', keyDownHandler);
        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };
    },);


    return (
        <VStack h={'100%'} w={'100%'}>
            <HStack h={14} px={5} w={'100%'} m={0} spacing={8}>
                <CloseIcon m={0} p={0} h={30} fontSize={15} onClick={() => toggleDetails()}/>
                <Text fontSize={20}>Profile</Text>
            </HStack>
            <Flex
                h={'100%'}
                w={'100%'}
                flex={1}
                alignItems={'center'}
                justifyContent={'center'}
            >
                {
                    <MiniProfile
                        name={'Youssef'}
                        src={selectedChat.chat === 'G' ? groups[searchIndex].name.toString() : friends[searchIndex].avatar}
                        facebook={'face'}
                        instagram={'insta'}
                        discord={'discord'}
                    />
                }
            </Flex>
        </VStack>
    );
}

export default ProfileDetails;