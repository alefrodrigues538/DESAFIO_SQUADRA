import React, { SetStateAction, useEffect, useState } from 'react'
import { Alert, AlertIcon, Box, Button, CloseButton, FormControl, FormErrorMessage, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text } from '@chakra-ui/react'
import { bairroType, municipioType, ufType } from '../types'
import { ChangeValue, checkExists, checkMunicipioExists } from '../utils/functions'

import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store'
import { BAIRRO_GET, BAIRRO_POST, BAIRRO_PUT } from '../store/Stock/bairro.store'

interface props {
    isOpen: boolean;
    onClose: VoidFunction;
    isEditting?: boolean;
    isShowing?: boolean;
    bairro: bairroType;
    setTodosDados: SetStateAction<any>
}
const ModalBairro: React.FC<props> = ({ isOpen, onClose, isEditting, isShowing, bairro, setTodosDados }) => {
    const { listaUF } = useSelector((state: RootState) => state.uf)
    const { listaMunicipio } = useSelector((state: RootState) => state.municipio)
    const { listaBairro } = useSelector((state: RootState) => state.bairro)
    const dispatch = useDispatch<AppDispatch>()

    const [codigoUF, setCodigoUF] = useState(-1)
    const [codigoMunicipio, setCodigoMunicipio] = useState(-1)
    const [codigoBairro, setCodigoBairro] = useState(-1)
    const [nome, setNome] = useState('')
    const [status, setStatus] = useState(1)

    const [duplicateError, setDuplicateError] = useState(false)
    const [nomeError, setNomeError] = useState(false)
    const [codigoUFError, setCodigoUFError] = useState(false)
    const [codigoMunicipioError, setCodigoMunicipioError] = useState(false)

    useEffect(() => {
        if (isEditting == true) {
            let municipio = listaMunicipio.filter((obj: municipioType) => (
                obj.codigoMunicipio == bairro.codigoMunicipio
            ))[0]
            setCodigoUF(municipio.codigoUF)
            setCodigoBairro(bairro.codigoMunicipio)
            setCodigoMunicipio(bairro.codigoMunicipio)
            setNome(bairro.nome)
            setStatus(bairro.status)
        } else {
            setCodigoUF(-1)
            setCodigoBairro(-1)
            setCodigoMunicipio(-1)
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
        //console.log('aqui@')
        let findUF = listaUF.filter((obj: ufType) => (
            obj.codigoUF == codigoUF
        ))
        let findMunicipio = listaMunicipio.filter((obj: municipioType) => (
            obj.codigoMunicipio == codigoMunicipio && obj.codigoUF == codigoUF
        ))
        let findBairro = listaBairro.filter((obj: bairroType) => (
            obj.codigoMunicipio == codigoMunicipio && obj.nome == nome
        ))
        if (nome === bairro.nome && codigoMunicipio === bairro.codigoMunicipio) {
            onClose()
            return
        }
        if ((findBairro.length > 0 && findMunicipio.length > 0 && findUF.length > 0) &&
            findBairro[0].nome == nome && findBairro[0].codigoMunicipio == codigoMunicipio) { setDuplicateError(true) }
        if (codigoUF < 0) { setCodigoUFError(true) }
        if (codigoMunicipio < 0) { setCodigoMunicipioError(true) }
        if (!nome) { setNomeError(true) }
        if (findBairro.length == 0 && nome) {
            await dispatch(BAIRRO_POST({ codigoBairro, codigoMunicipio, nome, status }))
                .then((res) => {
                    setTodosDados(listaBairro)
                    resetErrors()
                    onClose()
                })
        }
    }

    /**
     * Salva a edição do UF
     */
    const editItem = async () => {
        let findUF = listaUF.filter((obj: ufType) => (
            obj.codigoUF == codigoUF
        ))
        let findMunicipio = listaMunicipio.filter((obj: municipioType) => (
            obj.codigoMunicipio == codigoMunicipio && obj.codigoUF == codigoUF
        ))
        let findBairro = listaBairro.filter((obj: bairroType) => (
            obj.codigoMunicipio == codigoMunicipio && obj.nome == nome
        ))
        if (nome === bairro.nome && codigoMunicipio === bairro.codigoMunicipio) {
            onClose()
            return
        }
        if ((findBairro.length > 0 && findMunicipio.length > 0 && findUF.length > 0) &&
            findBairro[0].nome == nome && findBairro[0].codigoMunicipio == codigoMunicipio) { setDuplicateError(true) }
        if (codigoUF < 0) { setCodigoUFError(true) }
        if (codigoMunicipio < 0) { setCodigoMunicipioError(true) }
        if (!nome) { setNomeError(true) }
        if (findBairro.length == 0 && nome && codigoMunicipio) {
            await dispatch(BAIRRO_PUT({
                'codigoBairro': bairro.codigoBairro,
                'codigoMunicipio': codigoMunicipio,
                'nome': nome,
                'status': status
            } as bairroType))
                .then((res) => {
                    setTodosDados(listaBairro)
                    resetErrors()
                    onClose()
                })
        }
    }

    const resetErrors = () => {
        setCodigoUF(-1)
        setCodigoBairro(-1)
        setCodigoMunicipio(-1)
        setNome('')
        setStatus(1)

        setDuplicateError(false)
        setNomeError(false)
        setCodigoMunicipioError(false)
        setCodigoUFError(false)
    }

    return (
        <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader bg={"global.primary"} color="global.secondary">
                    {isShowing ? 'Detalhes do bairro' : isEditting ? 'Editar bairro' : 'Adicionar novo bairro'}
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
                        flexWrap={"wrap"}
                        justifyContent={'space-between'}
                        alignItems={'flex-start'}
                        margin={'0 0 16px 0'}
                        gap={'12px'}
                        padding={'12px'}
                        borderRadius={'8px'}
                        border={'1px solid #cecece'}>

                        <FormControl width={'45%'} isInvalid={codigoUFError}>
                            <FormLabel>UF</FormLabel>
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
                                        return (
                                            <option key={uf.codigoUF} value={uf.codigoUF}>{uf.sigla}</option>
                                        )
                                    })
                                }
                            </Select>
                            <FormErrorMessage>Selecione o UF.</FormErrorMessage>
                        </FormControl>
                        <FormControl width={'45%'} isInvalid={codigoMunicipioError}>
                            <FormLabel>Municipio</FormLabel>
                            <Select
                                disabled={isShowing || codigoUF < 0 ? true : false}
                                _disabled={{ opacity: 1 }}
                                value={codigoMunicipio}
                                onChange={e => {
                                    ChangeValue(setCodigoMunicipio, e.currentTarget.value)
                                }}
                                borderColor={'#bbb'}>
                                <option value={-1}>Selecione</option>
                                {
                                    listaMunicipio.length > 0 &&
                                    listaMunicipio.map((municipio: municipioType) => {
                                        return municipio.status === 1 && municipio.codigoUF == codigoUF && (
                                            <option key={municipio.codigoMunicipio} value={municipio.codigoMunicipio}>{municipio.nome}</option>
                                        )
                                    })
                                }
                            </Select>
                            <FormErrorMessage>Selecione o municipio.</FormErrorMessage>
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
                <hr />
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

export default ModalBairro