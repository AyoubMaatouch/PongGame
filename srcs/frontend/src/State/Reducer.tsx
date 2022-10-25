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
            newState.matchHistory = [];
            newState.liveMatch = [];
            newState.online = [];
            newState.on_game = [];
            newState.user_id = null;
            newState.opponent_id = null;
            newState.playing_with_friend = null;
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
        case 'ONLINE_USERS':
            newState.online = payload;
            break;
        case 'ON_GAME_USERS':
            newState.on_game = payload;
            break;
        case 'USER_ID':
            newState.user_id = payload;
            break;
        case 'CLEAR_MATCH_HISTORY':
            newState.matchHistory = [];
            break;
        case 'OPPONENT_ID':
            newState.opponent_id = payload;
            break;
        case 'CLEAR_OPPONENT_ID':
            newState.opponent_id = null;
            break;
        case 'TWO_FAC_QRCODE':
            newState.userInfo.two_authentication = payload;
            break;
        case 'CLEAR_TWO_FAC_QRCODE':
            newState.userInfo.two_authentication = null;
            break;
        case 'IM_PLAYING_WITH_FRIEND':
            newState.playing_with_friend = payload;
            break;
        case 'CLEAR_IM_PLAYING_WITH_FRIEND':
            newState.playing_with_friend = null;
            break;
        default:
            break;
    }

    return newState;
};
