import { Button, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Status, Text } from '@chakra-ui/react'
import React, { SetStateAction } from 'react'
import { enderecoType } from '../types';

import { useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../store'
import { removerEndereco } from '../store/Stock/endereco.store';

interface props {
    id: number;
    enderecos: Array<enderecoType>
    isOpen: boolean;
    onClose: VoidFunction;
}
const ModalExluirEndereco: React.FC<props> = ({ isOpen, onClose, id, enderecos }) => {
    const dispatch = useDispatch<AppDispatch>()

    function excluir() {
        dispatch(removerEndereco(id))
        onClose()
        // console.log('index', index)
        // console.log('Enderecos', enderecos)
    }

    return (
        <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Heading>Atenção!</Heading>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text>Deseja exluir o endereço {enderecos.length - id}</Text>
                </ModalBody>

                <ModalFooter>
                    <Button variant='outline' colorScheme='gray' mr={3} onClick={() => {
                        onClose()
                    }}>{'Cancelar'}</Button>
                    <Button variant='solid' colorScheme='red' mr={3} onClick={() => {
                        excluir()
                    }}>{'Excluir'}</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ModalExluirEndereco
