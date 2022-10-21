import {
    Avatar,
    Box,
    Button,
    HStack,
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
import { activate2Fac, deleteActivate2Fac, updatePtofile } from '../State/Api';
import { GlobalContext } from '../State/Provider';
import QRCode from 'qrcode';

const TwofacAuth = () => {
    // modal
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { dispatch, data } = React.useContext<any>(GlobalContext);
    const [urlQr, setUrlQr] = React.useState('');
    const [code, setCode] = React.useState('');
    const { userInfo } = data;

    const handleClose = () => {
        onClose();
    };

    const qrBinary = (qrStr: string) => {
        QRCode.toDataURL(qrStr, (err, url) => {
            setUrlQr(url);
            console.log(url);
        });
    };
    const changeCode = (e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value.replace(REGEX_ALPHANUM, ''));
    const handle2Fa = () => {
        activate2Fac(dispatch).then((qrStr: string) => {
            qrBinary(qrStr);
        });
    };
    const handle2FaDelete = () => {
        deleteActivate2Fac(dispatch).then(() => {
            handleClose();
        })
    };

    const handle2FaActivate = () => {
        deleteActivate2Fac(dispatch).then(() => {
            handleClose();
        })
    };

    // first render
    React.useEffect(() => {
        if (userInfo?.two_authentication) qrBinary(userInfo?.two_authentication);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInfo?.two_authentication]);

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
                        <Stack alignItems="center" spacing={8}>
                            {userInfo?.two_authentication ? (
                                <>
                                    <img src={urlQr} alt="qr code" />
                                    <Input borderRadius="xl" placeholder="code" value={code} type="text" onChange={changeCode} />
                                    <HStack alignItems="center">
                                    <Button variant={'ghost'} colorScheme="purple" mr={3} onClick={handle2FaActivate}>
                                        Save
                                    </Button>
                                    <Button variant={'ghost'} color="customRed" mr={3} onClick={handle2FaDelete}>
                                        Delete
                                    </Button>
                                </HStack>
                            )}
                                </>
                            ) : (
                                <HStack alignItems="center">
                                    <Button variant={'ghost'} colorScheme="purple" mr={3} onClick={handle2Fa}>
                                        Activate
                                    </Button>
                                    <Button variant={'ghost'} color="customRed" mr={3} onClick={onClose}>
                                        Cancel
                                    </Button>
                                </HStack>
                            )}
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default TwofacAuth;
