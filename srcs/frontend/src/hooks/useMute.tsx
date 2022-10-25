import { useDisclosure } from '@chakra-ui/react'

export default function useMute() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return {
        isMuteOpen: isOpen,
        onMuteOpen: onOpen,
        onMuteClose: onClose,
    }
}
