import { Alert, AlertIcon, Box, Button, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react';
import React, { useEffect } from 'react'

import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store'
import { PESSOA_GET_by_cod } from '../store/Stock/pessoa.store';
import { bairroType, municipioType, ufType } from '../types';
import { pessoaType } from '../types/pessoa.type';

interface props {
    isOpen: boolean;
    onClose: VoidFunction;
    listaBairro: Array<bairroType>,
    listaMunicipio: Array<municipioType>,
    listaUF: Array<ufType>
}
const ModalDetalharPessoa: React.FC<props> = ({
    isOpen, onClose, listaBairro, listaMunicipio, listaUF
}) => {
    const { pessoa } = useSelector((state: RootState) => state.pessoa)

    return (
        <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader bg={"global.primary"} color="global.secondary">
                    {
                        pessoa && (
                            <Heading textAlign={"center"} textTransform={'uppercase'}>{'Detalhes de ' + pessoa.nome}</Heading>
                        )
                    }
                    <hr />
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>

                    <Box display="flex"
                        flexWrap={"wrap"}
                        justifyContent={"space-between"}
                        gap={"16px"}
                        fontSize={"2xl"} textAlign="center">
                        <Text w={'100%'} m={['auto', '']}><strong>
                            Código pessoa:</strong> {pessoa.codigoPessoa}</Text>

                        <Text w={'48%'} m={['auto', '']}><strong>Nome:</strong> <br />
                            {pessoa.nome}</Text>

                        <Text w={'48%'} m={['auto', '']}><strong>Sobrenome:</strong> <br />
                            {pessoa.sobrenome}</Text>

                        <Text w={'48%'} m={['auto', '']}><strong>Login:</strong> <br />
                            {pessoa.login}</Text>

                        <Text w={'48%'} m={['auto', '']}><strong>Senha:</strong> <br />
                            {pessoa.senha}</Text>

                        <Text w={'48%'} m={['auto', '']}><strong>Idade:</strong> <br />
                            {pessoa.idade + (pessoa.idade > 1 ? ' anos' : 'ano')}</Text>

                        <Text w={'48%'} m={['auto', '']}><strong>Status:</strong> <br />
                            {pessoa.status}</Text>
                    </Box>
                    <hr />
                    <Box display="flex"
                        flexWrap={"wrap"}
                        justifyContent={"space-between"}
                        gap={"16px"}
                        fontSize={"2xl"} textAlign="center">

                        <Heading w={'100%'}>Endereços:</Heading>
                        {
                            pessoa && pessoa.enderecos &&
                            pessoa.enderecos.length == 0 && (
                                <Alert>
                                    <AlertIcon />
                                    <Text>Esta pessoa, não possui endereços cadastrados.</Text>
                                </Alert>
                            )
                        }
                        {
                            pessoa &&
                            pessoa.enderecos &&
                            pessoa.enderecos.map((endereco, index) => {

                                let bairro = listaBairro.find((obj: bairroType) => (
                                    obj.codigoBairro == endereco.codigoBairro
                                ))

                                let municipio = listaMunicipio.find((obj: municipioType) => (
                                    obj.codigoMunicipio == bairro?.codigoMunicipio
                                ))
                                let uf = listaUF.find((obj: ufType) => (
                                    obj.codigoUF == municipio?.codigoUF
                                ))

                                return (
                                    <Box
                                        key={Math.random() * 99999}
                                        width={"100%"}
                                        display="flex"
                                        flexWrap={"wrap"}
                                        justifyContent={"space-between"}
                                        gap={"8px"}
                                        fontSize={"large"}>
                                        <Text fontSize={'2xl'} width={'100%'}>{index + 1} º endereço</Text>
                                        <Text w={['100%', '48%', '32%']}><strong>Código endereço:</strong> <br />{endereco.codigoEndereco}</Text>
                                        <Text w={['100%', '48%', '32%']}><strong>Código bairro:</strong> <br />
                                            {endereco.codigoBairro}</Text>
                                        <Text w={['100%', '48%', '32%']}><strong>Código Pessoa:</strong> <br />
                                            {endereco.codigoPessoa}</Text>

                                        <Text w={['100%', '48%', '32%']}><strong>Nome Rua:</strong> <br />
                                            {endereco.nomeRua}</Text>
                                        <Text w={['100%', '48%', '32%']}><strong>Número:</strong> <br />
                                            {endereco.numero}</Text>
                                        <Text w={['100%', '48%', '32%']}><strong>Complemento:</strong> <br />
                                            {endereco.complemento}</Text>

                                        <Text w={['100%', '48%', '32%']}><strong>Bairro:</strong> <br />
                                            {bairro?.nome}</Text>
                                        <Text w={['100%', '48%', '32%']}><strong>Municipio:</strong> <br />
                                            {municipio?.nome}</Text>
                                        <Text w={['100%', '48%', '32%']}><strong>UF:</strong> <br />
                                            {uf?.nome}</Text>


                                        <hr style={{ width: '100%' }} />
                                    </Box>
                                )
                            })
                        }
                    </Box>

                </ModalBody>

                <hr />
                <ModalFooter>
                    <Button variant='solid' colorScheme='blue' mr={3} onClick={() => {
                        onClose()
                    }}>Fechar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal >
    )
}

export default ModalDetalharPessoa
