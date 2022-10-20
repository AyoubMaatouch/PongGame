import React,{useContext} from 'react';
import {Box, IconButton, Menu, MenuButton, MenuItem, MenuList, Text} from '@chakra-ui/react';
import {AddIcon} from "@chakra-ui/icons"
import {ChatContext} from "../State/ChatProvider";

function FloatingActionButton() {
    const {toggleNewChannel} = useContext<any>(ChatContext)
    return (
        <Box
            position={'absolute'}
            right={4} bottom={4}
        >
            <Menu>
                <MenuButton
                    as={IconButton}
                    w={14}
                    h={14}
                    bg={'customPurple'}
                    rounded={30} size={'lg'}
                    aria-label="Search database"
                    icon={<AddIcon/>}
                    variant="ghost"/>
                <MenuList
                    m={0}
                >
                    <MenuItem icon={<AddIcon />}
                              onClick={()=>{
                                  toggleNewChannel()
                              }}
                    > <Text>New Channel</Text> </MenuItem>
                </MenuList>
            </Menu>
        </Box>
    );
}

export default FloatingActionButton;