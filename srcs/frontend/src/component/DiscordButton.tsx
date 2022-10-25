import React from 'react';
import { FaDiscord } from "react-icons/fa";

type Props = {
    id: string,
}
function DiscordButton({id}:Props) {
    return (
        <a target={'_blank'} href={`https://www.discordapp.com/users/${id}`} >
            <FaDiscord size={35}/>
        </a>
    );
}

export default DiscordButton;