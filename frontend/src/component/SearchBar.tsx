import {HStack, Input, InputGroup, InputLeftElement,} from "@chakra-ui/react";
import {ArrowBackIcon, Search2Icon} from "@chakra-ui/icons";
import React, {useContext, useEffect, useRef} from "react";
import {ChatContext} from "../State/ChatProvider";

const SearchBar = () => {
    const searchInputRef = useRef<any>(null);
    // @ts-ignore
    const {isSearch, toggleSearch} = useContext(ChatContext);

    useEffect(() => {
        const keyDownHandler = (event: any) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                if (!isSearch)
                    searchInputRef.current!.focus();
                else {
                    searchInputRef.current.value = '';
                    searchInputRef.current.blur();
                }
                toggleSearch();
            }
        };
        document.addEventListener('keydown', keyDownHandler);
        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };
    }, [isSearch]);

    return (
        <>
            <HStack
                w={'90%'}
                m={0} p={0} h={'2em'}>
                {isSearch && <ArrowBackIcon m={0} p={0} h={30} fontSize={25} onClick={() => toggleSearch()}/>}
                <InputGroup
                    h={'2.5em'}
                    boxSizing={'border-box'}
                    alignContent={'center'}
                >
                    <InputLeftElement h={'100%'} pointerEvents='none'
                                      children={<Search2Icon color={!isSearch ? 'gray.500' : 'red'}/>}/>
                    <Input
                        ref={searchInputRef}
                        alignItems={'center'}
                        variant={'unstyled'}
                        _hover={{border: isSearch ? '1px solid #EF9795' : '1px solid #BEBEBE'}}
                        border={isSearch ? '1px solid #EF9795' : '1px solid #707070'}
                        onClick={() => {
                            if (!isSearch)
                                toggleSearch();
                        }}
                        onChange={
                            (event) => console.log(event.target.value)
                        }
                        w={'100%'}
                        m={0}
                        rounded={30}
                        size='md'
                        type={'search'}
                        placeholder={'Search'}
                    />
                </InputGroup>
            </HStack>
        </>
    )
}

export default SearchBar;
