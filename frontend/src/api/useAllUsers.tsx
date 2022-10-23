import axios from 'axios';
import React, { useEffect } from 'react';
import { ALL_USERS } from '../constants';
import { ChatContext } from '../State/ChatProvider';

const useAllUsers = () => {
    const {  setAllUsers } = React.useContext<any>(ChatContext);
    // const { setUserMatchHistory, setLoader } = React.useContext<any>(GlobalContext);

    useEffect(() => {
        // setLoader(true);
        axios
            .get(ALL_USERS)
            .then((res: any) => {
                setAllUsers(res.data);
            })
            .catch((err) => {
            });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};

export default useAllUsers;
