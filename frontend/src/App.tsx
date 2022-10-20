import { Box, Center, ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './component/Navbar';
import ChatPage from './pages/ChatPage';
import GamePage from './pages/GamePage';
import HomePage from './pages/HomePage';
import PageNotFound from './pages/PageNotFound';
import ProfilePage from './pages/ProfilePage';
import SignInPage from './pages/SignInPage';
import theme from './style/theme';

// CONSTANTS
import { AlertCompo } from './component/AlertCompo';
import { Loading } from './component/Loading';
import { pagesContent } from './constants';
import LiveMatchPage from './pages/LiveMatchPage';
import { GlobalContext } from './State/Provider';

function App() {
    // CONTEXT
    const { data } = React.useContext<any>(GlobalContext);

    // state
    const { loader, notification } = data;

    return (
        <ChakraProvider theme={theme}>
            {loader && <Loading />}
            {notification && <AlertCompo message={notification.message} type={notification.type} />}
            <Center>
                <Box p={[0, 10, 10, 10, 10, 10]} h={'99vh'} w={['100%', '100%', '100%', '100%', '100%', '95%']} maxW={'2000px'}>
                    <BrowserRouter>
                        <Routes>
                            <Route element={<Navbar />}>
                                <Route path={pagesContent.home.url} element={<HomePage />} />
                                <Route path={pagesContent.chat.url} element={<ChatPage />} />
                                <Route path={pagesContent.profile.url + '/:user_id'} element={<ProfilePage />} />
                                <Route path={pagesContent.play.url + '/:speed_mode'} element={<GamePage />} />
                                <Route path={pagesContent.watch.url + '/:room_name'} element={<LiveMatchPage />} />
                            </Route>
                            <Route path={pagesContent.login.url} element={<SignInPage />} />
                            <Route path="*" element={<PageNotFound />} />
                        </Routes>
                    </BrowserRouter>
                </Box>
            </Center>
        </ChakraProvider>
    );
}

export default App;
