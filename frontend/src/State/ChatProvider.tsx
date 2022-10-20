import axios from "axios";
import React, { useState, createContext, useEffect, useReducer } from "react";
import { io } from "socket.io-client";
// // import { API, SOCKET } from "../constants";
// import socketIOClient, {io} from "socket.io-client";
// import axios from 'axios';
import { FRIENDS_URL, SOCKET, USER_URL } from "../constants";
import { chatReducer } from "../reducers/chatReducer";

// @ts-ignore
export const ChatContext = createContext();

type Props = {
  children: JSX.Element;
};

const ChatProvider = ({ children }: Props) => {
  const InitialValues = {
    newFriends: [],
    users: [],
    newGroups: [],
    newMembers: [],
    allGroups: [],
    messages: [],
    roomDm: "",
    // dm: [],
  };
  const [state, dispatch] = useReducer<any>(chatReducer, InitialValues);

  const socket = io(SOCKET + "/dm");
  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  });

  const [newChannel, setNewChannel] = useState(false);
  const toggleNewChannel = () => {
    setNewChannel(!newChannel);
  };

  const [isSearch, setSearch] = useState(false);
  const toggleSearch = () => {
    setSearch(!isSearch);
  };

  const [selectedChat, setSelectedChat] = useState(null);
  const toggleOffSelectedChat = () => {
    setSelectedChat(null);
  };

  const [friends, setFriends] = useState<any>([]);

  const [groups, setGroups] = useState<any>([]);

  const [roomMembers, setRoomMembers] = React.useState<any>([]);
  const [allUsers, setAllUsers] = React.useState<any>([]);
  // console.log("Chat Provider", friends)

  // const [data, setData] = useState({
  //   // friends: friends,
  //   // groups: [
  //   //     { id: '1', name: 'hhhGroup', avatar: 'https://source.unsplash.com/user/c_v_r/1900x800' },
  //   //     { id: '2', name: 'retardeds', avatar: 'https://source.unsplash.com/user/c_v_r/1900x800' },
  //   //     { id: '3', name: '1337', avatar: 'https://source.unsplash.com/user/c_v_r/1900x800' },
  //   //     { id: '5', name: 'Group6', avatar: 'https://source.unsplash.com/user/c_v_r/1900x800' },
  //   //     { id: '6', name: 'Group7', avatar: 'https://source.unsplash.com/user/c_v_r/1900x800' },
  //   // ],
  //   members: [
  //     {
  //       id: "1",
  //       membs: [
  //         {
  //           id: "12",
  //           name: "User1",
  //           avatar: "https://cdn.intra.42.fr/users/ynoam.jpg",
  //         },
  //         {
  //           id: "109",
  //           name: "User1",
  //           avatar: "https://cdn.intra.42.fr/users/ynoam.jpg",
  //         },
  //         {
  //           id: "106",
  //           name: "User1",
  //           avatar: "https://cdn.intra.42.fr/users/ynoam.jpg",
  //         },
  //         {
  //           id: "23",
  //           name: "User1",
  //           avatar: "https://cdn.intra.42.fr/users/ynoam.jpg",
  //         },
  //         {
  //           id: "104",
  //           name: "User1",
  //           avatar: "https://cdn.intra.42.fr/users/ynoam.jpg",
  //         },
  //         {
  //           id: "106",
  //           name: "User1",
  //           avatar: "https://cdn.intra.42.fr/users/ynoam.jpg",
  //         },
  //       ],
  //     },
  //   ],
  // });
  const [messages, setMessages] = useState([]);

  const [chatDetails, setChatDetails] = useState(false);
  const toggleDetails = () => {
    setChatDetails(!chatDetails);
  };

  return (
    <ChatContext.Provider
      value={{
        isSearch,
        toggleSearch,
        selectedChat,
        setSelectedChat,
        // data,
        // setData,
        messages,
        setMessages,
        setChatDetails,
        chatDetails,
        toggleDetails,
        toggleOffSelectedChat,
        toggleNewChannel,
        newChannel,
        friends,
        socket,
        setFriends,
        setGroups,
        groups,
        roomMembers,
        setRoomMembers,
        allUsers,
        setAllUsers,
        state,
        dispatch,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
