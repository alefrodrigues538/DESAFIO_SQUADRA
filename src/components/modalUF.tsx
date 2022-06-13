import React, { useEffect, useState } from 'react'
import { Alert, AlertIcon, Box, Button, CloseButton, FormControl, FormErrorMessage, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text } from '@chakra-ui/react'
import { ufType } from '../types'
import { ChangeValue, checkExists } from '../utils/functions'

import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store'
import { UF_GET, UF_POST, UF_PUT } from '../store/Stock/uf.store'

interface props {
    isOpen: boolean;
    onClose: VoidFunction;
    isEditting?: boolean;
    uf: ufType;
}
const ModalUF: React.FC<props> = ({ isOpen, onClose, isEditting, uf }) => {
    const { listaUF } = useSelector((state: RootState) => state.uf)
    const dispatch = useDispatch<AppDispatch>()

    const [codigoUF, setCodigoUF] = useState(0)
    const [nome, setNome] = useState('')
    const [sigla, setSigla] = useState('')
    const [status, setStatus] = useState(1)

    const [duplicateError, setDuplicateError] = useState(false)
    const [nomeError, setNomeError] = useState(false)
    const [siglaError, setSiglaError] = useState(false)

    useEffect(() => {
        if (isEditting == true) {
            setCodigoUF(uf.codigoUF)
            setNome(uf.nome)
            setSigla(uf.sigla)
            setStatus(uf.status)
        } else {
            setCodigoUF(-1)
            setNome('')
            setSigla('')
            setStatus(1)
        }
    }, [isEditting])

    /**
     * isEditting = true    // MODO EDIÇÂO
     * isEditting = false   // MODO ADIÇÂO
     * @param uf 
     */
    const handleSave = (uf: ufType) => {
        if (isEditting) {
            editItem(uf)
        } else {
            addItem(uf)
        }
    }

    /**
     * Adicionar o UF
     * @param uf 
     */
    const addItem = async (uf: ufType) => {
        let find = listaUF.find((obj: ufType) => (
            obj.codigoUF == uf.codigoUF
        ))
        if (find && find.nome != uf.nome && find.sigla != uf.sigla) { setDuplicateError(true) } else { setDuplicateError(false) }
        if (!nome) { setNomeError(true) } else { setNomeError(false) }
        if (!sigla) { setSiglaError(true) } else { setSiglaError(false) }
        if (!find && nome && sigla) {
            await dispatch(UF_POST({ codigoUF, nome, sigla, status }))
                .then((res) => {
                    resetErrors()
                    onClose()
                })
        }
    }

    /**
     * Salva a edição do UF
     * @param uf 
     */
    const editItem = async (uf: ufType) => {

        let find = listaUF.find((obj: ufType) => (
            obj.sigla == uf.sigla
        ))
        if (find && find.nome == nome && find.sigla == uf.sigla) {
            setDuplicateError(false)
            onClose()
        }

        if (find?.nome == uf.nome && find?.sigla == uf.sigla) { return }
        if (find && find.nome != nome) { setDuplicateError(true) } else { setDuplicateError(false) }
        if (!nome) { setNomeError(true) } else { setNomeError(false) }
        if (!sigla) { setSiglaError(true) } else { setSiglaError(false) }
        if (!find && nome && sigla) {
            await dispatch(UF_PUT({ codigoUF, nome, sigla, status }))
                .then((res) => {
                    resetErrors()
                    onClose()
                })
        }
    }

    const resetErrors = () => {
        setNomeError(false)
        setSiglaError(false)
        setDuplicateError(false)
    }

    return (
        <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{isEditting ? 'Editar UF' : 'Adicionar Novo UF'}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>

                    {
                        duplicateError && (
                            <Alert status='error'>
                                <AlertIcon />
                                <Text>Este uf já está cadastrado.</Text>
                            </Alert>
                        )
                    }
                    <Box display="flex"
                        flexDirection={'column'}
                        justifyContent={'center'}
                        alignItems={'flex-start'}
                        margin={'0 0 16px 0'}
                        gap={'12px'}
                        padding={'12px'}
                        borderRadius={'8px'}
                        border={'1px solid #cecece'}>

                        <FormControl isInvalid={nomeError}>
                            <FormLabel>Nome</FormLabel>
                            <Input
                                id="nome"
                                type="text"
                                value={nome}
                                onChange={e => ChangeValue(setNome, e.currentTarget.value)}
                                borderColor={'#bbb'}
                                autoComplete='off' />

                            <FormErrorMessage>Digite digitar o nome da UF.</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={siglaError}>
                            <FormLabel>Sigla</FormLabel>
                            <Input
                                textTransform={'uppercase'}
                                value={sigla}
                                onChange={e => ChangeValue(setSigla, e.currentTarget.value)}
                                borderColor={'#bbb'}
                                autoComplete='off' />
                            <FormErrorMessage>Digite digitar a sigla da UF.</FormErrorMessage>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Status</FormLabel>
                            <Select
                                value={status}
                                onChange={e => ChangeValue(setStatus, e.currentTarget.value)}
                                borderColor={'#bbb'}>
                                <option value={1}>1-Ativado</option>
                                <option value={2}>2-Desativado</option>
                            </Select>
                        </FormControl>
                    </Box>
                </ModalBody>

                <ModalFooter>
                    <Button variant='outline' colorScheme='gray' mr={3} onClick={() => {
                        resetErrors()
                        onClose()
                    }}>Cancelar</Button>
                    <Button colorScheme='blue' mr={3} onClick={() => handleSave(uf)}>
                        Salvar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ModalUF