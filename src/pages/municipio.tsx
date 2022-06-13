import React, { useContext, useEffect, useState } from 'react'

import { Alert, AlertDialogContent, AlertIcon, Box, Button, Container, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Select, Stack, Table, TableCaption, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'

import { IoNewspaperOutline } from 'react-icons/io5'
import { FiEdit3, FiEye, FiEyeOff } from 'react-icons/fi'

import { municipioType, ufType } from '../types'
import { ChangeValue } from '../utils/functions'

import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../store'

import { UF_GET } from '../store/Stock/uf.store'
import { MUNICIPIO_GET, MUNICIPIO_PUT } from '../store/Stock/municipio.store'
import ModalMunicipio from '../components/modalMunicipio'

export default function Municipio() {
    const { listaUF } = useSelector((state: RootState) => state.uf)
    const { listaMunicipio } = useSelector((state: RootState) => state.municipio)
    const dispatch = useDispatch<AppDispatch>()

    const [showModal, setShowModal] = useState(false)

    const [isEditting, setIsEditting] = useState(false);
    const [isShowing, setIsShowing] = useState(false);

    const [todosDados, setTodosDados] = useState(Array<municipioType>())
    const [codigoUF, setCodigoUF] = useState(-1)
    const [codigoMunicipio, setCodigoMunicipio] = useState(undefined)
    const [nome, setNome] = useState('')
    const [status, setStatus] = useState(0)

    const [municipioEdit, setMunicipioEdit] = useState({ codigoMunicipio: -1, codigoUF: -1, nome: '', status: 1 } as municipioType)

    useEffect(() => {
        if (listaUF.length === 0) {
            dispatch(UF_GET())
        }
        buscarMunicipios()
    }, [])

    async function buscarMunicipios() {
        await dispatch(MUNICIPIO_GET()).then((res) => {
            setTodosDados(listaMunicipio)
        })
    }

    /**
     * Ativa ou Desativa o UF alterando o status entre 1 e 2 e salvando no DB
     * @param municipio
     */
    const desativarItem = (municipio: municipioType) => {
        let disable = {
            codigoMunicipio: municipio.codigoMunicipio,
            codigoUF: municipio.codigoUF,
            nome: municipio.nome,
            status: municipio.status == 1 ? 2 : 1
        } as municipioType
        dispatch(MUNICIPIO_PUT(disable))
    }

    /**
     * Aplicar os filtros a lista, buscando os dados de acordo com o filtro definido
     */
    const filtrarLista = async () => {
        let urlparams = (codigoMunicipio ? ('codigoMunicipio=' + codigoMunicipio + ',') : '') +
            (codigoUF >= 0 ? ('codigoUF=' + codigoUF + ',') : '') +
            (nome ? ('nome=' + nome + ',') : '') +
            (status > 0 ? ('&status=' + status + ',') : '')

        await dispatch(MUNICIPIO_GET(urlparams))
            .then((_) => {
                setCodigoUF(-1)
                setCodigoMunicipio(undefined)
                setStatus(0)
            })
    }

    /**
     * Fechar modal Salvar/Editar UF
     */
    const handleCloseModal = () => {
        setIsEditting(false)
        setShowModal(false)
    }
    return (
        <Container maxWidth={'5xl'}>
            <Heading
                textAlign={'center'}
                margin={'8px 0 16px 0'}
                color={'#5a5a5a'}>
                Município<hr />
            </Heading>
            <Box
                minHeight={'100px'}
                display="flex"
                flexWrap={"wrap"}
                justifyContent={'space-between'}
                alignItems={'flex-start'}
                margin={'16px 0'}
                padding={'12px'}
                borderRadius={'8px'}>

                <FormControl w={['100%', '32%', '20%']}>
                    <FormLabel>Uf</FormLabel>
                    <Select
                        value={codigoUF}
                        onChange={e => ChangeValue(setCodigoUF, e.currentTarget.value)}
                        borderColor={'#bbb'}>
                        <option value={-1}>Todos</option>
                        {
                            listaUF.length > 0 &&
                            listaUF.map((uf: ufType) => {
                                return uf.status === 1 && (
                                    <option key={uf.codigoUF} value={uf.codigoUF}>{uf.sigla}</option>
                                )
                            })
                        }
                    </Select>
                    <FormErrorMessage>Selecione o UF.</FormErrorMessage>
                </FormControl>
                <FormControl w={['100%', '32%', '20%']}>
                    <FormLabel>Município</FormLabel>
                    <Select
                        disabled={codigoUF < 0 ? true : false}
                        value={codigoMunicipio}
                        onChange={e => ChangeValue(setCodigoMunicipio, e.currentTarget.value)}
                        borderColor={'#bbb'}>
                        <option value={-1}>Todos</option>
                        {
                            listaMunicipio.length > 0 &&
                            listaMunicipio.map((municipio: municipioType) => {
                                return codigoUF == municipio.codigoUF && (
                                    <option key={municipio.codigoMunicipio} value={municipio.codigoMunicipio}>{municipio.nome}</option>
                                )
                            })
                        }
                    </Select>
                    <FormErrorMessage>Digite o código do municipio.</FormErrorMessage>
                </FormControl>
                <FormControl w={['100%', '32%', '20%']}>
                    <FormLabel>Status</FormLabel>
                    <Select
                        value={status}
                        onChange={e => ChangeValue(setStatus, e.currentTarget.value)}
                        borderColor={'#bbb'}>
                        <option value={-1}>Todos</option>
                        <option value={1}>1-Ativado</option>
                        <option value={2}>2-Desativado</option>
                    </Select>
                </FormControl>
                <Button
                    onClick={() => filtrarLista()}
                    colorScheme={"blue"}
                    w={['90px']}
                    alignSelf={"flex-end"}
                    justifySelf={"center"}
                    m={['8px 8px 4px auto', '8px 8px 4px auto', '0 0 4px 0']}>Pesquisar</Button>
                <Button
                    onClick={() => { setShowModal(true) }}
                    colorScheme={"green"}
                    w={['180px']}
                    alignSelf={"flex-end"}
                    justifySelf={"center"}
                    m={['8px auto 4px 8px', '8px auto 4px 8px', '0 0 4px 0']}>Adicionar municipio</Button>
            </Box>
            <Box>
                <TableContainer border={'1px solid #dedede'} borderRadius={'8px'} boxShadow={'2px 2px 6px #ddd'} marginBottom={"32px"}>
                    <Table variant='simple' colorScheme={"purple"}>
                        <Thead>
                            <Tr>
                                <Th textAlign={'center'}>Codigo Municipio</Th>
                                <Th>Nome</Th>
                                <Th textAlign={'center'}>UF</Th>
                                <Th textAlign={'center'}>
                                    <Text width={'80px'}>Status</Text>
                                </Th>
                                <Th textAlign={'center'} isNumeric>Açoes</Th>
                            </Tr>
                        </Thead>
                        {
                            listaMunicipio.length === 0 && (
                                <TableCaption marginTop={0} padding={'8px 0'}>
                                    <Alert status='info'>
                                        <AlertIcon />
                                        <Text>Nenhum item encontrado.</Text>
                                    </Alert>
                                </TableCaption>
                            )
                        }
                        <Tbody>
                            {
                                listaMunicipio.map((municipio: municipioType) => {
                                    let ufName = listaUF.filter((obj: ufType) => (
                                        obj.codigoUF === municipio.codigoUF
                                    ))[0]
                                    return ufName && (
                                        <Tr key={municipio.codigoMunicipio}>
                                            <Td textAlign={'center'}>{municipio.codigoMunicipio}</Td>
                                            <Td>{municipio.nome}</Td>
                                            <Td textAlign={'center'}>{ufName.nome}</Td>
                                            <Td textAlign={'center'}>{municipio.status === 1 ? "Ativado" : "Desativado"}</Td>
                                            <Td padding={'2px'} isNumeric>
                                                <Button
                                                    leftIcon={<IoNewspaperOutline />}
                                                    variant={'ghost'}
                                                    colorScheme={"gray"}
                                                    marginLeft={'8px'}
                                                    _hover={{ bg: "#ccc" }}
                                                    onClick={() => {
                                                        setMunicipioEdit(municipio)
                                                        setIsEditting(true)
                                                        setIsShowing(true)
                                                        setShowModal(true)
                                                    }}>
                                                    Detalhar
                                                </Button>
                                                <Button
                                                    leftIcon={<FiEdit3 />}
                                                    variant={'ghost'}
                                                    colorScheme={"gray"}
                                                    marginLeft={'8px'}
                                                    _hover={{ bg: "#ccc" }}
                                                    onClick={() => {
                                                        setMunicipioEdit(municipio)
                                                        setIsEditting(true)
                                                        setIsShowing(false)
                                                        setShowModal(true)
                                                    }}>
                                                    Editar
                                                </Button>
                                                <Button
                                                    width={'120px'}
                                                    leftIcon={municipio.status === 1 ? <FiEyeOff /> : <FiEye />}
                                                    variant={'ghost'}
                                                    colorScheme={"red"}
                                                    _hover={{ bg: "#fcc" }}
                                                    onClick={() => desativarItem(municipio)}>
                                                    {municipio.status === 1 ? ' Desativar' : ' Ativar'}
                                                </Button>
                                            </Td>
                                        </Tr>
                                    )
                                })
                            }
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
            <ModalMunicipio
                isOpen={showModal}
                onClose={handleCloseModal}
                isEditting={isEditting}
                isShowing={isShowing}
                municipio={municipioEdit}
                setTodosDados={setTodosDados} />
        </Container >
    )
}
