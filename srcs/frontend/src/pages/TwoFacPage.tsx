import { Box, Button, Flex, Icon, Input, Spacer, Stack, Text } from '@chakra-ui/react';
import React from 'react';
import { AiFillLock } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../component/logo';
import ToggleMode from '../component/toggleMode';
import { pagesContent, REGEX_NUM } from '../constants';
import { getUserInfo, URLS } from '../State/Api';
import { GlobalContext } from '../State/Provider';

export default function TwoFacPage() {
    const [code, setCode] = React.useState('');
    const { dispatch } = React.useContext<any>(GlobalContext);
    const navigate = useNavigate();

    const changeCode = (e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value.replace(REGEX_NUM, ''));

    React.useEffect(() => {
        getUserInfo(dispatch).then(() => {
            navigate(pagesContent.home.url);
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <Stack h="100%">
            <Flex mb={5} px={10} alignItems="center" overflow={'hideen'}>
                <Link to={pagesContent.home.url}>
                    <Logo />
                </Link>
                <Spacer />
                <ToggleMode />
            </Flex>
            <Stack flexGrow={1} alignItems="center" alignSelf="center" justifyContent="center" spacing={5} maxW="30rem">
                <Icon as={AiFillLock} color="green" fontSize="9xl" />

                <Text textAlign="center" fontSize="4xl">
                    2-Factor Authentication
                </Text>
                <Text textAlign="center" fontSize="xl">
                    Please enter the code
                </Text>
                <Box as="form" method={'POST'} action={URLS.TWO_FA} display="flex" flexDirection="column" alignItems="center" w="100%">
                    <Input name="code" borderRadius="xl" placeholder="code" value={code} type="text" onChange={changeCode} />
                    <Button mt={10} color="customPurple" type="submit" variant="ghost">
                        Authenticate
                    </Button>
                </Box>
            </Stack>
            f
        </Stack>
    );
}
