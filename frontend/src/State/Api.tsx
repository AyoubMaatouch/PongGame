import axios from 'axios';
import { API } from '../constants';
import { completed, errorMessage, inProgress, newNotification, resetData, setMatchHistory, storeUserInfo } from './Action';

axios.defaults.withCredentials = true;

const URLS = {
    LOGIN: API + '/user/me',
    USER: API + '/user',
    SIGNOUT: API + '/42/signout',
    UPDATE_PROFILE: API + '/user/update/profile',
    UPDATED_PROFILE: API + '/user/check',
    MATCH_HISTORY: API + '/user/match_history',
};

export const getUserInfo = async (dispatch: any) => {
    dispatch(inProgress());
    try {
        const response = await axios.get(URLS.LOGIN);
        dispatch(storeUserInfo(response.data));
        return response.data;
    } catch (error: any) {
        throw error.message;
    } finally {
        dispatch(completed());
    }
};

export const getFriendInfo = async (dispatch: any, id: string | undefined) => {
    dispatch(inProgress());
    try {
        const response = await axios.get(`${URLS.USER}/${id}`);
        dispatch(storeUserInfo(response.data));
    } catch (error: any) {
        dispatch(errorMessage(error.message));
        throw error.message;
    } finally {
        dispatch(completed());
    }
};

export const signOut = async (dispatch: any) => {
    dispatch(inProgress());
    try {
        await axios.post(URLS.SIGNOUT);
        dispatch(resetData());
    } catch (error: any) {
        dispatch(errorMessage(error.message));
        throw error.message;
    } finally {
        dispatch(completed());
    }
};

export const updatePtofile = async (
    dispatch: any,
    data: {
        avatar: File | null | undefined;
        user_name: string;
        facebook: string;
        discord: string;
        instagram: string;
    }
) => {
    dispatch(inProgress());
    try {
        const response = await axios.post(
            URLS.UPDATE_PROFILE,
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
        );
        dispatch(storeUserInfo(response.data));
        dispatch(newNotification({ type: 'Success', message: 'Profile updated successfuly' }));
    } catch (error: any) {
        dispatch(errorMessage(error.message));
        throw error.message;
    } finally {
        dispatch(completed());
    }
};

export const updatedProfile = async (dispatch: any) => {
    dispatch(inProgress());
    try {
        await axios.get(URLS.UPDATED_PROFILE);
    } catch (error: any) {
        dispatch(errorMessage(error.message));
        throw error.message;
    } finally {
        dispatch(completed());
    }
};

export const getMatchHistory = async (dispatch: any) => {
    dispatch(inProgress());
    try {
        const response = await axios.get(URLS.MATCH_HISTORY);
        dispatch(setMatchHistory(response.data));
        return response.data;
    } catch (error: any) {
        dispatch(errorMessage(error.message));
        throw error.message;
    } finally {
        dispatch(completed());
    }
};

export const getMatchHistoryUsers = async (dispatch: any) => {
    dispatch(inProgress());
    try {
        await axios.post(URLS.SIGNOUT);
        dispatch(resetData());
    } catch (error: any) {
        dispatch(errorMessage(error.message));
        throw error.message;
    } finally {
        dispatch(completed());
    }
};

export const getUserIndoById = async (dispatch: any, id1: string, id2: string) => {
    dispatch(inProgress());
    try {
        const response1 = await axios.get(`${URLS.USER}/${id1}`);
        const response2 = await axios.get(`${URLS.USER}/${id2}`);
        return {
            username1: response1.data.user_name,
            avatar1: response1.data.user_avatar,
            username2: response2.data.user_name,
            avatar2: response2.data.user_avatar,
        };
    } catch (error: any) {
        dispatch(errorMessage(error.message));
        throw error.message;
    } finally {
        dispatch(completed());
    }
};
