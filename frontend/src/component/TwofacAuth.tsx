import {
    Button,
    HStack,
    Icon,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Stack,
    useDisclosure,
    Text,
    ModalCloseButton,
} from '@chakra-ui/react';
import QRCode from 'qrcode';
import React from 'react';
import { FaShieldAlt } from 'react-icons/fa';
import { REGEX_NUM } from '../constants';
import { activate2Fac, delete2Fac, generate2Fac } from '../State/Api';
import { GlobalContext } from '../State/Provider';
import { GiCheckMark } from 'react-icons/gi';

const TwofacAuth = () => {
    // modal
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { dispatch, data } = React.useContext<any>(GlobalContext);
    const [urlQr, setUrlQr] = React.useState('');
    const [code, setCode] = React.useState('');
    const [twoFa, setTwoFa] = React.useState(false);
    const { userInfo } = data;

    const handleClose = () => {
        onClose();
    };

    const qrBinary = (qrStr: string) => {
        QRCode.toDataURL('otpauth://totp/ponGame?secret=' + qrStr, (err, url) => {
            setUrlQr(url);
            console.log(url);
        });
    };
    const changeCode = (e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value.replace(REGEX_NUM, ''));
    const handle2Fa = () => {
        generate2Fac(dispatch).then((qrStr: string) => {
            setTwoFa(true);
            qrBinary(qrStr);
        });
    };
    const handle2FaDelete = () => {
        delete2Fac(dispatch).then(() => {
            setTwoFa(false);
            handleClose();
        });
    };

    const handle2FaActivate = () => {
        if (code.length)
            activate2Fac(dispatch, code).then(() => {
                setTwoFa(false);
                handleClose();
            });
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

            <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={handleClose} isCentered>
                <ModalOverlay />
                <ModalContent borderRadius="2xl">
                    <ModalBody py={6}>
                        <Stack alignItems="center" spacing={8}>
                            {twoFa && (
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
                                </>
                            )}
                            {userInfo?.two_authentication && !twoFa && (
                                <>
                                    <ModalCloseButton />
                                    <Icon as={GiCheckMark} color="green" fontSize="8xl" />
                                    <Text> 2-Factor Authentication is activated</Text>
                                    <Button variant={'ghost'} color="customRed" mr={3} onClick={handle2FaDelete}>
                                        Delete
                                    </Button>
                                </>
                            )}
                            {!userInfo?.two_authentication && !twoFa && (
                                <>
                                    <ModalCloseButton />
                                    <ModalHeader>2-Factor Auth</ModalHeader>
                                    <HStack alignItems="center">
                                        <Button variant={'ghost'} colorScheme="purple" mr={3} onClick={handle2Fa}>
                                            Activate
                                        </Button>
                                    </HStack>
                                </>
                            )}
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default TwofacAuth;
