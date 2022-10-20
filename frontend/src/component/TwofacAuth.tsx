import {
    Avatar,
    Box,
    Button,
    IconButton,
    Input,
    InputGroup,
    InputLeftAddon,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Switch,
    useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { FaCamera, FaDiscord, FaFacebook, FaInstagram, FaRegEdit, FaShieldAlt } from 'react-icons/fa';
import { REGEX_ALPHANUM } from '../constants';
import { newNotification } from '../State/Action';
import { updatePtofile } from '../State/Api';
import { GlobalContext } from '../State/Provider';

const TwofacAuth = () => {
    // modal
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { dispatch, data } = React.useContext<any>(GlobalContext);

    const { userInfo } = data;

    const handleClose = () => {
        onClose();
    };

    // first render
    React.useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Button
                onClick={onOpen}
                _focus={{
                    bg: userInfo?.two_authentication ? 'green' : 'gray.400',
                }}
                _hover={{
                    bg: userInfo?.two_authentication ? 'green' : 'gray.400',
                }}
                bg={userInfo?.two_authentication ? 'green' : 'gray.400'}
                color="blackAlpha.900"
                leftIcon={<FaShieldAlt fontSize="xs" />}
                borderRadius="2xl"
            >
                2-Factor Auth
            </Button>

            <Modal isOpen={isOpen} onClose={handleClose} isCentered>
                <ModalOverlay />
                <ModalContent borderRadius="2xl">
                    <ModalHeader>2-Factor Auth</ModalHeader>
                    <ModalCloseButton borderRadius="xl" />
                    <ModalBody pb={6}>
                        <Stack alignItems="center" spacing={5}>
                            <Button
                                ml={5}
                                variant="solid"
                                bg="green"
                                borderRadius="2xl"
                                color="blackAlpha.900"
                                fontSize="6xl"
                                size="2xl"
                                py={2}
                                px={5}
                                fontWeight="light"
                                _focus={{
                                    bg: 'green',
                                }}
                                _hover={{
                                    bg: 'green',
                                }}
                                // onClick={submitProfile}
                            >
                                Save
                            </Button>
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default TwofacAuth;
