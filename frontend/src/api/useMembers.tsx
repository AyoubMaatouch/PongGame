import axios from 'axios';
import React, { useContext } from 'react';
import { MEMBERS, USER_URL } from '../constants';
import { ChatContext } from '../State/ChatProvider';
import { GlobalContext } from '../State/Provider';

const useMembers = () => {
    const { selectedChat } = useContext<any>(ChatContext);
    const { setRoomMembers } = useContext<any>(ChatContext);
    const [localMembers, setLocalMem] = React.useState<any>([]);
    const { setLoader } = React.useContext<any>(GlobalContext);

    React.useEffect(() => {
        axios
            .get(MEMBERS + selectedChat.id)
            .then((res: any) => {
                const ids = [];
                for (var i = 0; i < res.data.length; i++) {
                    ids.push({
                        id: res.data[i]?.userId,
                        role: res.data[i]?.prev,
                    });
                    setLocalMem(ids);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    React.useEffect(() => {
        setLoader(true);
        const members: any = [];
        for (var i = 0; i < localMembers.length; i++) {
            const role = localMembers[i].role;
            axios
                .get(USER_URL + localMembers[i].id)
                .then((res: any) => {
                    members.push({
                        id: res.data.user_id,
                        name: res.data.user_name,
                        avatar: res.data.user_avatar,
                        role: role,
                    });
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => setLoader(false));
            setRoomMembers(members);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localMembers]);
};

export default useMembers;
