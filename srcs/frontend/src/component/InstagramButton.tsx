import React from 'react';
import { FaInstagram } from "react-icons/fa";

type Props = {
    id: string,
}
function InstagramButton({id}:Props) {
    return (
        <a target={'_blank'} href={`https://www.instagram.com/${id}`} >
            <FaInstagram size={35}/>
        </a>
    );
}

export default InstagramButton;