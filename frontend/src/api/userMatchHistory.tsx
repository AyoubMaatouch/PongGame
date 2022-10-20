import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { API, pagesContent } from '../constants';
import { GlobalContext } from '../State/Provider';

const UserMatchHistory = () => {
    // general
    const backEnd = API + 'user/math';
    const { setUserMatchHistory, setLoader } = React.useContext<any>(GlobalContext);

    const navigate = useNavigate();
    // api call
    React.useEffect(() => {
        // setloader
        setLoader(true);
        // CORS
        axios.defaults.withCredentials = true;
        axios
            .get(backEnd)
            .then((response) => {
                setUserMatchHistory(response?.data);
            })
            .catch((error) => {
                navigate(pagesContent.login.url);
            })
            .finally(() => setLoader(false));
    }, []);
};

export default UserMatchHistory;
