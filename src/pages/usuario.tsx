import React, { useContext, useEffect, useState } from 'react'

import { Alert, AlertDialogContent, AlertIcon, Box, Button, Container, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Select, Stack, Table, TableCaption, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react'

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
import { useHistory } from 'react-router-dom'
import { pessoaType } from '../types/pessoa.type'
import { PESSOA_GET, PESSOA_GET_by_cod, PESSOA_PUT } from '../store/Stock/pessoa.store'
import { clearEndereco } from '../store/Stock/endereco.store'
import ModalDetalharPessoa from '../components/modalDetalharPessoa'
import { BAIRRO_GET } from '../store/Stock/bairro.store'

export default function Pessoa() {
    const { isOpen, onClose, onOpen } = useDisclosure()
    const history = useHistory()
    const { listaUF } = useSelector((state: RootState) => state.uf)
    const { listaMunicipio } = useSelector((state: RootState) => state.municipio)
    const { listaBairro } = useSelector((state: RootState) => state.bairro)
    const { listaPessoa } = useSelector((state: RootState) => state.pessoa)
    const dispatch = useDispatch<AppDispatch>()

    const [codigoPessoa, setCodigoPessoa] = useState(-1)

    useEffect(() => {
        if (listaUF.length === 0) {
            dispatch(UF_GET())
        }
        if (listaMunicipio.length === 0) {
            dispatch(MUNICIPIO_GET())
        }
        if (listaBairro.length === 0) {
            dispatch(BAIRRO_GET())
        }
        if (listaPessoa.length === 0) {
            dispatch(PESSOA_GET())
        }
        dispatch(clearEndereco())
    }, [])

    /**
     * Ativa ou Desativa o UF alterando o status entre 1 e 2 e salvando no DB
     * @param pessoa
     */
    const desativarItem = (pessoa: pessoaType) => {
        let disable = {
            codigoPessoa: pessoa.codigoPessoa,
            nome: pessoa.nome,
            sobrenome: pessoa.sobrenome,
            idade: pessoa.idade,
            login: pessoa.login,
            senha: pessoa.senha,
            status: pessoa.status == 1 ? 2 : 1
        } as pessoaType
        dispatch(PESSOA_PUT(disable))
    }

    return (
        <Container maxWidth={'6xl'}>
            <Heading
                textAlign={'center'}
                margin={'8px 0 16px 0'}
                color={'#5a5a5a'}>
                Usuarios<hr />
            </Heading>
            <Box
                display="flex"
                justifyContent={'flex-end'}
                alignItems={'flex-start'}
                padding={'12px'}>

                <Button
                    onClick={() => { history.push('/cadastrar_pessoa/0') }}
                    colorScheme={"green"}
                    width={'100px'}
                    alignSelf={"flex-end"}
                    marginBottom={'4px'}>Adicionar</Button>
            </Box>
            <Box>
                <TableContainer border={'1px solid #dedede'} borderRadius={'8px'} boxShadow={'2px 2px 6px #ddd'} marginBottom={"32px"}>
                    <Table variant='simple' colorScheme={"purple"}>
                        <Thead>
                            <Tr>
                                <Th textAlign={'center'} maxWidth={"120px"} padding={'4px'}>Codigo Pessoa</Th>
                                <Th textAlign={'center'} maxWidth={"100px"} padding={'4px'} overflowX={'hidden'}>Nome</Th>
                                <Th textAlign={'center'} maxWidth={"100px"} padding={'4px'}>sobrenome</Th>
                                <Th textAlign={'center'} maxWidth={"50px"} padding={'4px'}>idade</Th>
                                <Th textAlign={'center'} maxWidth={"50px"} padding={'4px'}>login</Th>
                                <Th textAlign={'center'} maxWidth={"50px"} padding={'4px'}>senha</Th>
                                <Th textAlign={'center'}>
                                    <Text width={'80px'} padding={'4px'}>Status</Text>
                                </Th>
                                <Th textAlign={'center'} isNumeric>Açoes</Th>
                            </Tr>
                        </Thead>
                        {
                            listaPessoa.length === 0 && (
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
                                listaPessoa.map((pessoa: pessoaType) => {
                                    return (
                                        <Tr key={pessoa.codigoPessoa} overflowX={'auto'}>
                                            <Td textAlign={'center'} padding={'4px'} overflowX={'auto'}>{pessoa.codigoPessoa}</Td>
                                            <Td textAlign={'center'} padding={'4px'} overflowX={'auto'}>{pessoa.nome}</Td>
                                            <Td textAlign={'center'} padding={'4px'} overflowX={'auto'}>{pessoa.sobrenome}</Td>
                                            <Td textAlign={'center'} padding={'4px'} overflowX={'auto'}>{pessoa.idade}</Td>
                                            <Td textAlign={'center'} padding={'4px'} overflowX={'auto'}>{pessoa.login}</Td>
                                            <Td textAlign={'center'} padding={'4px'} overflowX={'auto'}>{pessoa.senha}</Td>
                                            <Td textAlign={'center'} padding={'4px'} overflowX={'auto'}>{pessoa.status === 1 ? "Ativado" : "Desativado"}</Td>
                                            <Td padding={'2px'} isNumeric>
                                                <Button
                                                    leftIcon={<IoNewspaperOutline />}
                                                    variant={'ghost'}
                                                    colorScheme={"gray"}
                                                    marginLeft={'8px'}
                                                    _hover={{ bg: "#ccc" }}
                                                    onClick={() => {
                                                        dispatch(PESSOA_GET_by_cod(pessoa.codigoPessoa))
                                                        onOpen()
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
                                                        history.push('/cadastrar_pessoa/' + pessoa.codigoPessoa)
                                                    }}>
                                                    Editar
                                                </Button>
                                                <Button
                                                    width={'120px'}
                                                    leftIcon={pessoa.status === 1 ? <FiEyeOff /> : <FiEye />}
                                                    variant={'ghost'}
                                                    colorScheme={"red"}
                                                    _hover={{ bg: "#fcc" }}
                                                    onClick={() => desativarItem(pessoa)}>
                                                    {pessoa.status === 1 ? ' Desativar' : ' Ativar'}
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


            <ModalDetalharPessoa
                isOpen={isOpen}
                onClose={onClose}
                listaBairro={listaBairro}
                listaMunicipio={listaMunicipio}
                listaUF={listaUF}
            />
        </Container >
    )
}
