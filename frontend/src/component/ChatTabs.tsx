import { Flex } from '@chakra-ui/react';
import SearchBar from './SearchBar';
import { AnimatePresence } from 'framer-motion';
import React, { useContext, useEffect } from 'react';
import Tabs from './Tabs';
import { ChatContext } from '../State/ChatProvider';

export default function ChatTabs() {
    const { isSearch, toggleSearch } = useContext<any>(ChatContext);
    const { setChatDetails } = useContext<any>(ChatContext);

    useEffect(() => {
        setChatDetails(false);
        const keyDownHandler = (event: any) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                toggleSearch();
            }
        };
        document.addEventListener('keydown', keyDownHandler);
        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };
    });
    return (
        <>
            <SearchBar />
            <AnimatePresence>{!isSearch ? <Tabs /> : undefined}</AnimatePresence>
        </>
    );
}
