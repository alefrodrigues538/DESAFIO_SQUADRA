import React from 'react'
import { Alert, AlertIcon, Button, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
interface props {
    textMessage: string;
    isOpen: boolean;
    onClose: VoidFunction;
}
const ModalMessage: React.FC<props> = ({ isOpen, onClose, textMessage }) => {
    return (
        <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}
            size="4xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Heading>Atenção!</Heading>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Alert status='warning'>
                        <AlertIcon />
                        <Text fontSize={'2xl'}>{textMessage}</Text>
                    </Alert>
                </ModalBody>

                <ModalFooter>
                    <Button variant='solid' colorScheme='red' mr={3} onClick={() => {
                        onClose()
                    }}>{'Confirmar'}</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ModalMessage
