import axios from 'axios';
import React from 'react';
import { API } from '../constants';

// types
type Data = {
    avatar: File | null | undefined;
    user_name: string;
    facebook: string;
    discord: string;
    instagram: string;
};

const UpdatePtofile = (
    login: string,
    data: Data,
    setLoader: (value: boolean) => void,
    setUserInfo: (value: any) => void,
    onClose: () => void,
    setNotif: any
) => {
    // general
    const backEnd = API + 'user/update/' + login;

    // show loader
    setLoader(true);

    // api call
    axios.defaults.withCredentials = true;
    axios
        .post(
            backEnd,
            data.avatar
                ? data
                : {
                      user_name: data.user_name,
                      facebook: data.facebook,
                      discord: data.discord,
                      instagram: data.instagram,
                  },
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
        .then((response) => {
            setUserInfo(response.data);
            setNotif({
                exist: true,
                type: 'Success',
                message: 'Profile updated successfuly',
            });
        })
        .catch((error) =>
            setNotif({
                exist: true,
                type: 'Error',
                message: error.message,
            })
        )
        .finally(() => {
            setLoader(false);
            onClose();
        });
};

export default UpdatePtofile;
