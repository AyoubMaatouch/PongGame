import React from "react"
import {Heading, Text} from "@chakra-ui/react";

export default function Logo() {
    return (
        <Heading
            _dark={{color: 'white'}} _light={{color: '#000000'}}
        >
            Pon
            <Text as={"span"} color={'red'}>G</Text>
            ame
        </Heading>
    )
}
