import React from 'react';
import { GlobalReducer } from './Reducer';

// @ts-ignore
export const GlobalContext = React.createContext();

type Props = {
    children: JSX.Element;
};

const GlobalContextProvider = ({ children }: Props) => {
    // init values
    const initValue = {
        loader: false,
        notification: null,
        userInfo: null,
        matchHistory: [],
        liveMatch: [],
        online: [],
        user_id: null,
        opponent_id: null,
    };

    // reducer
    const [data, dispatch] = React.useReducer(GlobalReducer, initValue);

    return <GlobalContext.Provider value={{ data, dispatch }}>{children}</GlobalContext.Provider>;
};

export default GlobalContextProvider;
