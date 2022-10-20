export const inProgress = () => ({
    type: 'IN_PROGRESS',
});

export const completed = () => ({
    type: 'COMPLETED',
});

export const errorMessage = (message: {}) => ({
    type: 'ERROR',
    payload: message,
});

export const storeUserInfo = (data: any) => ({
    type: 'USER_INFO',
    payload: data,
});

export const resetData = () => ({
    type: 'USER_SIGNOUT',
});

export const resetAlert = () => ({
    type: 'RESET_ALERT',
});

export const newNotification = (data: any) => ({
    type: 'SET_NOTIFICATION',
    payload: data,
});

export const updateLiveMatch = (data: any) => ({
    type: 'LIVE_MATCH',
    payload: data,
});
export const setUpdatedProfile = () => ({
    type: 'UPDATED_PROFILE',
});

export const setMatchHistory = (data: any) => ({
    type: 'UPDATE_MATCH_HISTORY',
    payload: data,
});

export const setOnlineUsers = (data: any) => ({
    type: 'ONLINE_USERS',
    payload: data,
});

export const storeUserId = (data: any) => ({
    type: 'USER_ID',
    payload: data,
});

export const clearMatchHistory = () => ({
    type: 'CLEAR_MATCH_HISTORY',
});

