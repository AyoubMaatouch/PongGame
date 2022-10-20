import { useDisclosure } from '@chakra-ui/react'

export default function useBlock() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return {
        isBlockOpen: isOpen,
        onBlockOpen: onOpen,
        onBlockClose: onClose,
    }
}
