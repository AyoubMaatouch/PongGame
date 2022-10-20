import React, { useContext } from 'react';
import { Text, Flex, Show, Hide } from '@chakra-ui/react';
import SideBar from '../component/SideBar';
import ChatProvider, { ChatContext } from '../State/ChatProvider';
import Messaging from '../component/Messaging';
import WideMessaging from '../component/WideMessaging';
import axios from 'axios';
import { FRIENDS_URL, pagesContent, USER_URL } from '../constants';
import { getUserInfo } from '../State/Api';
import { GlobalContext } from '../State/Provider';
import { useNavigate } from 'react-router-dom';

export default function ChatPage() {
    const { dispatch } = React.useContext<any>(GlobalContext);
    const navigate = useNavigate();
    
    // useEffect
    React.useEffect(() => {
        getUserInfo(dispatch).catch(() => {
            navigate(pagesContent.login.url);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ChatProvider>
            <Flex w={'100%'} h={'98%'} mx={{ base: 0, md: 0, lg: 0 }} pb={10} direction={'row'} justifyContent={'center'}>
                <SideBar />
            </Flex>
        </ChatProvider>
    );
}
