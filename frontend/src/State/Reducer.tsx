export const GlobalReducer = (state: any, action: any) => {
    const newState = { ...state };
    const { type, payload } = action;

    switch (type) {
        case 'IN_PROGRESS':
            newState.loader = true;
            break;
        case 'COMPLETED':
            newState.loader = false;
            break;
        case 'ERROR':
            newState.notification = {
                message: payload,
                type: 'Error',
            };
            break;
        case 'USER_INFO':
            newState.userInfo = payload;
            break;
        case 'USER_SIGNOUT':
            newState.loader = false;
            newState.notification = null;
            newState.userInfo = null;
            newState.matchHistory = null;
            newState.liveMatch = [];
            break;
        case 'RESET_ALERT':
            newState.notification = null;
            break;
        case 'SET_NOTIFICATION':
            newState.notification = payload;
            break;
        case 'LIVE_MATCH':
            newState.liveMatch = payload;
            break;
        case 'UPDATED_PROFILE':
            newState.userInfo = { ...newState, updated: true };
            break;
        case 'UPDATE_MATCH_HISTORY':
            newState.matchHistory = payload;
            break;

        default:
            break;
    }

    return newState;
};
