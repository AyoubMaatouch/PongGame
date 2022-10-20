import React from 'react';
import { FaFacebook } from "react-icons/fa";

type Props = {
    id: string,
}
function FacebookButton({id}:Props) {
    return (
        <a target={'_blank'} href={`https://www.facebook.com/${id}`} >
            <FaFacebook size={35}/>
        </a>
    );
}

export default FacebookButton;