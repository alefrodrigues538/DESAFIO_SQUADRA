import React, { useContext, useEffect, useState } from 'react'

import { Alert, AlertIcon, Box, Button, Container, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Select, Stack, Table, TableCaption, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react'

import { FiEdit3, FiEye, FiEyeOff } from 'react-icons/fi'

import { ufType } from '../types/uf.type'
import { ChangeValue, checkExists } from '../utils/functions'

import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store'
import { UF_GET, UF_POST, UF_PUT } from '../store/Stock/uf.store'
import ModalUF from '../components/modalUF'

export default function Uf() {
    const { onClose } = useDisclosure()
    const [showModal, setShowModal] = useState(false)

    const { listaUF } = useSelector((state: RootState) => state.uf)
    const dispatch = useDispatch<AppDispatch>()

    const [isEditting, setIsEditting] = useState(false);

    const [codigoUF, setCodigoUF] = useState(null)
    const [nome, setNome] = useState('')
    const [sigla, setSigla] = useState('')
    const [status, setStatus] = useState(0)

    const [ufEdit, setUfEdit] = useState({ codigoUF: -1, nome: '', sigla: '', status: 1 } as ufType)

    useEffect(() => {
        dispatch(UF_GET())
    }, [])

    /**
     * Ativa ou Desativa o UF alterando o status entre 1 e 2 e salvando no DB
     * @param uf 
     */
    const desativarItem = (uf: ufType) => {
        let disableUF = { codigoUF: uf.codigoUF, nome: uf.nome, sigla: uf.sigla, status: uf.status == 1 ? 2 : 1 } as ufType
        dispatch(UF_PUT(disableUF))
    }

    /**
     * Aplicar os filtros a lista, buscando os dados de acordo com o filtro definido
     */
    const filtrarLista = () => {
        let urlparams = (codigoUF ? ('codigoUF=' + codigoUF + ',') : '') +
            (nome ? ('nome=' + nome + ',') : '') +
            (sigla ? ('&sigla=' + sigla.toUpperCase() + ',') : '') +
            (status > 0 ? ('&status=' + status + ',') : '')

        dispatch(UF_GET(urlparams))
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
                Uf<hr />
            </Heading>
            <Box display="flex"
                minHeight={'100px'}
                flexWrap={"wrap"}
                justifyContent={'space-between'}
                alignItems={'flex-start'}
                margin={'0 0 16px 0'}
                padding={'12px'}
                borderRadius={'8px'}
                border={'1px solid #cecece'}>

                <FormControl w={['100%', '48%', '100px']}>
                    <FormLabel>CodigoUF</FormLabel>
                    <Input
                        id="codigoUF"
                        type="text"
                        value={codigoUF ? codigoUF : ''}
                        onChange={e => ChangeValue(setCodigoUF, e.currentTarget.value)}
                        borderColor={'#bbb'}
                        autoComplete='off' />

                    <FormErrorMessage>Digite digitar o nome da UF.</FormErrorMessage>
                </FormControl>
                <FormControl w={['100%', '48%', '24%']}>
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
                <FormControl w={['100%', '48%', '10%']}>
                    <FormLabel>Sigla</FormLabel>
                    <Input
                        textTransform={'uppercase'}
                        value={sigla}
                        onChange={e => ChangeValue(setSigla, e.currentTarget.value)}
                        borderColor={'#bbb'}
                        autoComplete='off' />
                    <FormErrorMessage>Digite digitar a sigla da UF.</FormErrorMessage>
                </FormControl>
                <FormControl w={['100%', '48%', '20%']}>
                    <FormLabel>Status</FormLabel>
                    <Select
                        value={status}
                        onChange={e => ChangeValue(setStatus, e.currentTarget.value)}
                        borderColor={'#bbb'}>
                        <option value={0}>Todos</option>
                        <option value={1}>1-Ativado</option>
                        <option value={2}>2-Desativado</option>
                    </Select>
                </FormControl>
                <Button
                    onClick={() => filtrarLista()}
                    colorScheme={'blue'}
                    w={['80px']}
                    alignSelf={"flex-end"}
                    justifySelf={'center'}
                    m={['8px 8px 4px auto', '8px 8px 4px auto', '0 0 4px 0']}>Pesquisar</Button>
                <Button
                    onClick={() => { setShowModal(true) }}
                    colorScheme={"green"}
                    w={['120px']}
                    justifySelf={'center'}
                    alignSelf={"flex-end"}
                    m={['8px auto 4px 8px', '8px auto 4px 8px', '0 0 4px 0']}>Adicionar UF</Button>
            </Box>

            <Box>
                <TableContainer border={'1px solid #dedede'} borderRadius={'8px'} boxShadow={'2px 2px 6px #ddd'} marginBottom={"32px"}>
                    <Table variant='simple' colorScheme={"purple"}>
                        <Thead>
                            <Tr>
                                <Th textAlign={'center'}>CodigoUF</Th>
                                <Th>Nome</Th>
                                <Th textAlign={'center'}>Sigla</Th>
                                <Th textAlign={'center'}>
                                    <Text width={'120px'}>Status</Text>
                                </Th>
                                <Th isNumeric>Açoes</Th>
                            </Tr>
                        </Thead>
                        {
                            listaUF.length === 0 && (
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
                                listaUF.map((uf: ufType) => {
                                    return (
                                        <Tr key={uf.nome}>
                                            <Td textAlign={'center'}>{uf.codigoUF}</Td>
                                            <Td>{uf.nome}</Td>
                                            <Td textAlign={'center'}> {uf.sigla}</Td>
                                            <Td textAlign={'center'}>
                                                <Text width={'120px'}>{uf.status === 1 ? "Ativado" : "Desativado"}</Text>
                                            </Td>
                                            <Td isNumeric padding={'2px'} display='table-cell' justifyContent={'space-between'}>
                                                <Button
                                                    variant={'ghost'}
                                                    colorScheme={"gray"}
                                                    marginLeft={'8px'}
                                                    _hover={{ bg: "#ccc" }}
                                                    onClick={() => {
                                                        setUfEdit(uf)
                                                        setIsEditting(true)
                                                        setShowModal(true)
                                                        // setEditItem(uf)
                                                    }}>
                                                    <FiEdit3 />Editar
                                                </Button>
                                                <Button
                                                    width={'120px'}
                                                    leftIcon={uf.status === 1 ? <FiEyeOff /> : <FiEye />}
                                                    variant={'ghost'}
                                                    colorScheme={"red"}
                                                    _hover={{ bg: "#fcc" }}
                                                    onClick={() => desativarItem(uf)}>
                                                    {uf.status === 1 ? ' Desativar' : ' Ativar'}
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

            <ModalUF
                isOpen={showModal}
                onClose={handleCloseModal}
                isEditting={isEditting}
                uf={ufEdit} />
        </Container >
    )
}
