export const SOCKET = 'http://localhost:3003';
export const API = 'http://localhost:3001';
export const FRIENDS_URL = API + '/user/friends';
export const USER_URL = API + '/user/';
export const GROUP = API + '/user/group/';
export const MY_GROUPS = API + '/user/group/member';
export const MEMBERS = API + '/user/members/';
export const DELETE_ROOM = API + '/user/group/';
export const BLOCK_DM = API + '/user/block/';
export const FRIEND_REQ = API + '/user/add/';
export const ALL_USERS = API + '/user/list/all';
export const ADD_MEMBER = API + '/user/group/add/';
export const UPDATE_GROUP = API + '/user/group/update/';
export const BLOCK_MEMBER = API + '/user/group/block/';
export const ALL_GROUPS = API + '/user/group/all';
export const DM = API + '/user/dm/';
export const MESSAGES = API + '/user/msg/';

export const pagesContent = {
    home: {
        url: '/',
        title: 'PonGame | Welcome',
    },
    login: {
        url: '/login',
        title: 'PonGame | Log In',
    },
    profile: {
        url: '/profile',
        title: 'PonGame | Profile',
    },
    chat: {
        url: '/chat',
        title: 'PonGame | Chat',
    },
    play: {
        url: '/play',
        title: 'PonGame | Play',
    },
    watch: {
        url: '/watch',
        title: 'PonGame | watch',
    },
};

export const tabs = [
    {
        url: '/',
        title: 'Home',
    },
    {
        url: '/chat',
        title: 'Chat',
    },
    {
        url: '/profile/me',
        title: 'Profile',
    },
];

export const REGEX_ALPHANUM = /[^A-Za-z0-9_-]/g;
