import React, { SetStateAction, useEffect, useState } from 'react'
import { Alert, AlertIcon, Box, Button, CloseButton, FormControl, FormErrorMessage, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text } from '@chakra-ui/react'
import { municipioType, ufType } from '../types'
import { ChangeValue, checkExists, checkMunicipioExists } from '../utils/functions'

import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store'
import { MUNICIPIO_GET, MUNICIPIO_POST, MUNICIPIO_PUT } from '../store/Stock/municipio.store'

interface props {
    isOpen: boolean;
    onClose: VoidFunction;
    isEditting?: boolean;
    isShowing?: boolean;
    municipio: municipioType;
    setTodosDados: SetStateAction<any>
}
const ModalMunicipio: React.FC<props> = ({ isOpen, onClose, isEditting, isShowing, municipio, setTodosDados }) => {
    const { listaUF } = useSelector((state: RootState) => state.uf)
    const { listaMunicipio } = useSelector((state: RootState) => state.municipio)
    const dispatch = useDispatch<AppDispatch>()

    const [codigoMunicipio, setCodigoMunicipio] = useState(-1)
    const [codigoUF, setCodigoUF] = useState(-1)
    const [nome, setNome] = useState('')
    const [status, setStatus] = useState(1)

    const [duplicateError, setDuplicateError] = useState(false)
    const [nomeError, setNomeError] = useState(false)
    const [codigoUFError, setCodigoUFError] = useState(false)

    useEffect(() => {
        if (isEditting == true) {
            setCodigoMunicipio(municipio.codigoMunicipio)
            setCodigoUF(municipio.codigoUF)
            setNome(municipio.nome)
            setStatus(municipio.status)
        } else {
            setCodigoMunicipio(-1)
            setCodigoUF(-1)
            setNome('')
            setStatus(1)
        }
    }, [isEditting])

    /**
     * isEditting = true    // MODO EDIÇÂO
     * isEditting = false   // MODO ADIÇÂO
     */
    const handleSave = () => {
        if (isEditting) {
            editItem()
        } else {
            addItem()
        }
    }

    /**
     * Adicionar o UF
     */
    const addItem = async () => {
        let find = listaMunicipio.filter((obj: municipioType) => (
            obj.codigoUF == codigoUF && obj.nome == nome
        ))
        if (find.length > 0) { setDuplicateError(true) }
        if (codigoUF < 0) { setCodigoUFError(true) }
        if (!nome) { setNomeError(true) }
        if (find.length == 0 && nome && codigoUF > 0) {
            await dispatch(MUNICIPIO_POST({ codigoMunicipio, codigoUF, nome, status }))
                .then((res) => {
                    setTodosDados(listaMunicipio)
                    resetErrors()
                    onClose()
                })
        }
    }

    /**
     * Salva a edição do UF
     */
    const editItem = async () => {
        let find = listaMunicipio.filter((obj: municipioType) => (
            obj.codigoUF == codigoUF && obj.nome == nome
        ))
        if (nome == municipio.nome && codigoUF == municipio.codigoUF) {
            onClose()
            return
        }
        if (find.length > 0 && nome !== municipio.nome && codigoUF !== municipio.codigoUF) { setDuplicateError(true) }
        if (!codigoUF) { setCodigoUFError(true) }
        if (!nome) { setNomeError(true) }
        if (find.length == 0 && nome && codigoUF) {
            await dispatch(MUNICIPIO_PUT({ codigoMunicipio, codigoUF, nome, status }))
                .then((res) => {
                    setTodosDados(listaMunicipio)
                    resetErrors()
                    onClose()
                })
        }
    }

    const resetErrors = () => {
        setDuplicateError(false)
        setNomeError(false)
        setCodigoUFError(false)
    }

    return (
        <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader bg={"global.primary"} color="global.secondary">
                    {isShowing ? 'Detalhes do município' : isEditting ? 'Editar município' : 'Adicionar novo município'}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>

                    {
                        duplicateError && (
                            <Alert status='error'>
                                <AlertIcon />
                                <Text>Este municipio já está cadastrado.</Text>
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

                        <FormControl width={'100%'} isInvalid={codigoUFError}>
                            <FormLabel>Uf</FormLabel>
                            <Select
                                disabled={isShowing}
                                _disabled={{ opacity: 1 }}
                                value={codigoUF}
                                onChange={e => {
                                    //console.log(e.currentTarget.value)
                                    ChangeValue(setCodigoUF, e.currentTarget.value)
                                }}
                                borderColor={'#bbb'}>
                                <option value={-1}>Selecione</option>
                                {
                                    listaUF.length > 0 &&
                                    listaUF.map((uf: ufType) => {
                                        return uf.status === 1 && (
                                            <option key={uf.codigoUF} value={uf.codigoUF}>{isShowing ? uf.nome : uf.sigla}</option>
                                        )
                                    })
                                }
                            </Select>
                            <FormErrorMessage>Selecione o UF.</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={nomeError}>
                            <FormLabel>Nome</FormLabel>
                            <Input
                                disabled={isShowing}
                                _disabled={{ opacity: 1 }}
                                id="nome"
                                type="text"
                                value={nome}
                                onChange={e => ChangeValue(setNome, e.currentTarget.value)}
                                borderColor={'#bbb'}
                                autoComplete='off' />

                            <FormErrorMessage>Digite digitar o nome da UF.</FormErrorMessage>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Status</FormLabel>
                            <Select
                                disabled={isShowing}
                                _disabled={{ opacity: 1 }}
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
                    }}>{isShowing ? 'Fechar' : 'Cancelar'}</Button>
                    {
                        !isShowing && (
                            <Button colorScheme='blue' mr={3} onClick={() => handleSave()}>
                                Salvar
                            </Button>
                        )
                    }
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ModalMunicipio