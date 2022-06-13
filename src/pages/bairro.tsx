import React, { useContext, useEffect, useState } from 'react'

import { Alert, AlertDialogContent, AlertIcon, Box, Button, Container, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Select, Stack, Table, TableCaption, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'

import { IoNewspaperOutline } from 'react-icons/io5'
import { FiEdit3, FiEye, FiEyeOff } from 'react-icons/fi'

import { bairroType, municipioType, ufType } from '../types'
import { ChangeValue } from '../utils/functions'

import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../store'

import { UF_GET } from '../store/Stock/uf.store'
import { BAIRRO_GET, BAIRRO_PUT } from '../store/Stock/bairro.store'
import ModalMunicipio from '../components/modalMunicipio'
import { MUNICIPIO_GET } from '../store/Stock/municipio.store'
import ModalBairro from '../components/modalBairro'

export default function Bairro() {
    const { listaUF } = useSelector((state: RootState) => state.uf)
    const { listaMunicipio } = useSelector((state: RootState) => state.municipio)
    const { listaBairro } = useSelector((state: RootState) => state.bairro)
    const dispatch = useDispatch<AppDispatch>()

    const [showModal, setShowModal] = useState(false)

    const [isEditting, setIsEditting] = useState(false);
    const [isShowing, setIsShowing] = useState(false);

    const [searchError, setSearchError] = useState(false);

    const [todosDados, setTodosDados] = useState(Array<bairroType>())
    const [codigoBairro, setCodigoBairro] = useState(-1)
    const [codigoMunicipio, setCodigoMunicipio] = useState(-1)
    const [codigoUF, setCodigoUF] = useState(-1)
    const [nome, setNome] = useState('')
    const [status, setStatus] = useState(0)

    const [bairroEdit, setBairroEdit] = useState({ codigoMunicipio: -1, codigoBairro: -1, nome: '', status: 1 } as bairroType)

    useEffect(() => {
        if (listaUF.length === 0) {
            dispatch(UF_GET())
        }
        if (listaMunicipio.length === 0) {
            dispatch(MUNICIPIO_GET())
        }
        buscarMunicipios()
    }, [])

    async function buscarMunicipios() {
        await dispatch(BAIRRO_GET()).then((res) => {
            setTodosDados(listaBairro)
        })
    }

    /**
     * Ativa ou Desativa o UF alterando o status entre 1 e 2 e salvando no DB
     * @param municipio
     */
    const desativarItem = (municipio: bairroType) => {
        let disable = {
            codigoBairro: municipio.codigoBairro,
            codigoMunicipio: municipio.codigoMunicipio,
            nome: municipio.nome,
            status: municipio.status == 1 ? 2 : 1
        } as bairroType
        dispatch(BAIRRO_PUT(disable))
    }

    /**
     * Aplicar os filtros a lista, buscando os dados de acordo com o filtro definido
     */
    const filtrarLista = async () => {
        //reseta o erro
        setSearchError(false)
        if (codigoMunicipio < 0 && codigoUF >= 0) {
            setSearchError(true)
            return
        }
        let urlparams = (codigoMunicipio >= 0 ? ('codigoMunicipio=' + codigoMunicipio + ',') : '') +
            (codigoBairro >= 0 ? ('codigoBairro=' + codigoBairro + ',') : '') +
            (nome ? ('nome=' + nome + ',') : '') +
            (status > 0 ? ('&status=' + status + ',') : '')

        await dispatch(BAIRRO_GET(urlparams))
            .then((_) => {
                setCodigoUF(-1)
                setCodigoBairro(-1)
                setCodigoMunicipio(-1)
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
                Bairro<hr />
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

                <FormControl w={['100%', '48%', '17%']}>
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
                </FormControl>
                <FormControl w={['100%', '48%', '17%']}>
                    <FormLabel>Municipio</FormLabel>
                    <Select
                        disabled={codigoUF < 0 ? true : false}
                        value={codigoMunicipio}
                        onChange={e => ChangeValue(setCodigoMunicipio, e.currentTarget.value)}
                        borderColor={'#bbb'}>
                        <option value={-1}>Todos</option>
                        {
                            listaMunicipio.length > 0 &&
                            listaMunicipio.map((municipio: municipioType) => {
                                return municipio.status === 1 && municipio.codigoUF == codigoUF && (
                                    <option key={municipio.codigoMunicipio} value={municipio.codigoMunicipio}>{municipio.nome}</option>
                                )
                            })
                        }
                    </Select>
                </FormControl>
                <FormControl w={['100%', '48%', '17%']}>
                    <FormLabel>Bairro</FormLabel>
                    <Select
                        disabled={codigoMunicipio < 0 ? true : false}
                        value={codigoBairro}
                        onChange={e => ChangeValue(setCodigoBairro, e.currentTarget.value)}
                        borderColor={'#bbb'}>
                        <option value={-1}>Todos</option>
                        {
                            listaBairro.length > 0 &&
                            listaBairro.map((bairro: bairroType) => {
                                return bairro.codigoMunicipio == codigoMunicipio && (
                                    <option key={bairro.codigoBairro} value={bairro.codigoBairro}>{bairro.nome}</option>
                                )
                            })
                        }
                    </Select>
                </FormControl>
                <FormControl w={['100%', '48%', '17%']}>
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
                    width={'80px'}
                    alignSelf={"flex-end"}
                    m={['8px 8px 4px auto', '8px 8px 4px auto', '0 0 4px 0']}>Pesquisar</Button>
                <Button
                    onClick={() => { setShowModal(true) }}
                    colorScheme={"green"}
                    width={'135px'}
                    alignSelf={"flex-end"}
                    m={['8px auto 4px 8px', '8px auto 4px 8px', '0 0 4px 0']}>Adicionar bairro</Button>
            </Box>
            {
                codigoMunicipio < 0 && searchError && (
                    <Alert status='warning'>
                        <AlertIcon />
                        <Text>Por favor, selecione corretamente o UF e o município para fazer a pesquisa.</Text>
                    </Alert>
                )
            }
            <Box>
                <TableContainer border={'1px solid #dedede'} borderRadius={'8px'} boxShadow={'2px 2px 6px #ddd'} marginBottom={"32px"}>
                    <Table variant='simple' colorScheme={"purple"}>
                        <Thead>
                            <Tr>
                                <Th textAlign={'center'} width={"120px"}>Codigo Bairro</Th>
                                <Th width={'250px'}>Nome</Th>
                                <Th textAlign={'center'} width={"150px"}>Status</Th>
                                <Th textAlign={'center'} isNumeric>Açoes</Th>
                            </Tr>
                        </Thead>
                        {
                            listaBairro.length === 0 && (
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
                                listaBairro.length > 0 &&
                                listaBairro.map((bairro: bairroType) => {
                                    return (
                                        <Tr key={bairro.codigoBairro}>
                                            <Td textAlign={'center'}>{bairro.codigoBairro}</Td>
                                            <Td>{bairro.nome}</Td>
                                            <Td textAlign={'center'}>{bairro.status === 1 ? "Ativado" : "Desativado"}</Td>
                                            <Td padding={'2px'} isNumeric>
                                                <Button
                                                    leftIcon={<IoNewspaperOutline />}
                                                    variant={'ghost'}
                                                    colorScheme={"gray"}
                                                    marginLeft={'8px'}
                                                    _hover={{ bg: "#ccc" }}
                                                    onClick={() => {
                                                        setBairroEdit(bairro)
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
                                                        setBairroEdit(bairro)
                                                        setIsEditting(true)
                                                        setIsShowing(false)
                                                        setShowModal(true)
                                                    }}>
                                                    Editar
                                                </Button>
                                                <Button
                                                    width={'120px'}
                                                    leftIcon={bairro.status === 1 ? <FiEyeOff /> : <FiEye />}
                                                    variant={'ghost'}
                                                    colorScheme={"red"}
                                                    _hover={{ bg: "#fcc" }}
                                                    onClick={() => desativarItem(bairro)}>
                                                    {bairro.status === 1 ? ' Desativar' : ' Ativar'}
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
            <ModalBairro
                isOpen={showModal}
                onClose={handleCloseModal}
                isEditting={isEditting}
                isShowing={isShowing}
                bairro={bairroEdit}
                setTodosDados={setTodosDados} />
        </Container >
    )
}
