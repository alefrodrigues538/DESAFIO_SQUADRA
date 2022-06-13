import React, { useEffect, useState } from 'react'
import { Alert, AlertDescription, AlertIcon, Box, Button, Container, Flex, Heading, Text, useDisclosure } from '@chakra-ui/react'
import InputCustom from '../components/Input'
import SelectCustom from '../components/Select'
import { ChangeValue } from '../utils/functions'

import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../store'

import { UF_GET } from '../store/Stock/uf.store'
import { MUNICIPIO_GET } from '../store/Stock/municipio.store'
import { BAIRRO_GET } from '../store/Stock/bairro.store'
import { bairroType, bairroTypeApi, enderecoType, municipioType, municipioTypeApi, ufType } from '../types'

import ModalExluirEndereco from '../components/modalExcluirEndereco'

import { addEndereco, clearEndereco, editarEndereco } from '../store/Stock/endereco.store'
import ModalMessage from '../components/modalMessage'
import { PESSOA_GET, PESSOA_GET_by_cod, PESSOA_POST, PESSOA_PUT } from '../store/Stock/pessoa.store'
import { pessoaType } from '../types/pessoa.type'
import { Link, useHistory, useParams } from 'react-router-dom'

export default function CadastrarPessoa() {
    const history = useHistory()
    const { codPessoa }: any = useParams()

    const { listaUF } = useSelector((state: RootState) => state.uf)
    const { listaMunicipio } = useSelector((state: RootState) => state.municipio)
    const { listaBairro } = useSelector((state: RootState) => state.bairro)
    const { listaPessoa, pessoa } = useSelector((state: RootState) => state.pessoa)
    const { enderecos } = useSelector((state: RootState) => state.endereco)

    const dispatch = useDispatch<AppDispatch>()

    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {

        dispatch(clearEndereco())

        //console.log('codigoPessoa', codPessoa)
        if (listaUF.length === 0) {
            dispatch(UF_GET())
        }
        if (listaMunicipio.length === 0) {
            dispatch(MUNICIPIO_GET())
        }
        if (listaBairro.length === 0) {
            dispatch(BAIRRO_GET())
        }
        if (codPessoa) {
            buscarListaPessoas()
        }
    }, [])

    async function buscarListaPessoas() {
        if (codPessoa > 0 && listaPessoa.length > 0) {
            await dispatch(PESSOA_GET_by_cod(codPessoa)).then((res) => {
                let pessoa = listaPessoa.filter((obj: pessoaType) => (
                    obj.codigoPessoa == codPessoa
                ))[0]
                // //console.log('Pessoa encontrada', res.payload[0])

                let pessoaEnderecos = res.payload[0].enderecos

                setNome(pessoa.nome)
                setSobrenome(pessoa.sobrenome)
                setIdade(pessoa.idade)
                setLogin(pessoa.login)
                setSenha(pessoa.senha)
                setStatus(pessoa.status)

                for (let i = 0; i < pessoaEnderecos.length; i++) {
                    const endereco = pessoaEnderecos[i];
                    //console.log('endereco' + i, endereco)
                    dispatch(addEndereco(endereco))
                }

                //console.log('todos enderecos', enderecos)
            })
        }
    }

    const [textMessage, setTextMessage] = useState('')
    const [showMessage, setShowMessage] = useState(false)

    const [success, setSuccess] = useState(false)
    const [indexExcluir, setIndexEcluir] = useState(-1)
    const [indexInEdit, setIndexInEdit] = useState(-1)
    const [enderecoInEdit, setEnderecoInEdit] = useState({} as enderecoType)

    const [nome, setNome] = useState('')
    const [sobrenome, setSobrenome] = useState('')
    const [idade, setIdade] = useState<number>(0)
    const [login, setLogin] = useState('')
    const [senha, setSenha] = useState('')
    const [status, setStatus] = useState(-1)

    const [cep, setCep] = useState('')
    const [rua, setRua] = useState('')
    const [numero, setNumero] = useState(0)
    const [complemento, setComplemento] = useState('')
    const [codigoUF, setCodigoUF] = useState(-1)
    const [codigoMunicipio, setCodigoMunicipio] = useState(-1)
    const [codigoBairro, setCodigoBairro] = useState(-1)


    const [nomeError, setNomeError] = useState(false)
    const [sobrenomeError, setSobrenomeError] = useState(false)
    const [idadeError, setIdadeError] = useState(false)
    const [loginError, setLoginError] = useState(false)
    const [senhaError, setSenhaError] = useState(false)
    const [statusError, setStatusError] = useState(false)

    const [cepError, setCepError] = useState(false)
    const [ruaError, setRuaError] = useState(false)
    const [numeroError, setNumeroError] = useState(false)
    const [complementoError, setComplementoError] = useState(false)
    const [codigoUFError, setCodigoUFError] = useState(false)
    const [codigoMunicipioError, setCodigoMunicipioError] = useState(false)
    const [codigoBairroError, setCodigoBairroError] = useState(false)

    async function handleSalvarUsuario() {
        if (enderecos.length === 0) {
            handleShowMessage('Por favor, adicione um endereço para finalizar esta etapa!')
            return
        }
        if (nome.length < 3) { setNomeError(true) } else { setNomeError(false) }
        if (sobrenome.length < 3) { setSobrenomeError(true) } else { setSobrenomeError(false) }
        if (!idade) { setIdadeError(true) } else { setIdadeError(false) }
        if (login.length < 3) { setLoginError(true) } else { setLoginError(false) }
        if (senha.length < 6) { setSenhaError(true) } else { setSenhaError(false) }
        if (status < 1) { setStatusError(true) } else { setStatusError(false) }
        if (nome.length >= 3 &&
            sobrenome.length >= 3 &&
            idade &&
            login.length >= 3 &&
            senha.length >= 6 &&
            status > 0) {


            //montagem do json ENDERECOS
            let allEnderecos = []

            for (let index = 0; index < enderecos.length; index++) {
                const endereco = enderecos[index];
                let aux = {}
                aux = {
                    'cep': endereco.cep,
                    'codigoBairro': endereco.codigoBairro,
                    'codigoEndereço': endereco.codigoEndereco,
                    'codigoPessoa': endereco.codigoPessoa,
                    'complemento': endereco.complemento,
                    'nomeRua': endereco.nomeRua,
                    'numero': endereco.numero,
                    'bairro': endereco.bairro
                }
                //console.log(aux)
                allEnderecos.push(aux)
            }

            //ENVIAR
            if (codPessoa && codPessoa > 0) {
                //console.log('@Editar pessoa')
                await dispatch(PESSOA_PUT({
                    'codigoPessoa': Number(codPessoa),
                    'nome': nome,
                    'sobrenome': sobrenome,
                    'idade': Number(idade),
                    'login': login,
                    'senha': senha,
                    'status': Number(status),
                    'enderecos': allEnderecos
                } as pessoaType)).then((res) => {
                    //console.log(res)
                    setSuccess(true)
                })
            } else {
                //console.log('@Adicionar pessoa')
                await dispatch(PESSOA_POST({
                    'nome': nome,
                    'sobrenome': sobrenome,
                    'idade': idade,
                    'login': login,
                    'senha': senha,
                    'status': status,
                    'enderecos': allEnderecos
                } as pessoaType)).then((res) => {
                    //console.log(res)
                    setSuccess(true)
                })
            }
        }
    }

    function handleAdicionarEndereco() {
        // let find = enderecos.filter((obj: enderecoType) => (
        //     obj.cep == cep &&
        //     obj.codigoUF == codigoUF &&
        //     obj.codigoMunicipio == codigoMunicipio &&
        //     obj.codigoBairro == codigoBairro &&
        //     obj.rua == rua &&
        //     obj.numero == numero
        // ))
        // if (find.length > 0) {
        //     handleShowMessage('Este endereço já esta cadastrado, por favor, insira outro.')
        //     return
        // }
        if (cep.length < 8) { setCepError(true) } else { setCepError(false) }
        if (rua.length < 3) { setRuaError(true) } else { setRuaError(false) }
        if (!numero) { setNumeroError(true) } else { setNumeroError(false) }
        if (!complemento) { setComplementoError(true) } else { setComplementoError(false) }
        if (codigoUF < 0) { setCodigoUFError(true) } else { setCodigoUFError(false) }
        if (codigoMunicipio < 0) { setCodigoMunicipioError(true) } else { setCodigoMunicipioError(false) }
        if (codigoBairro < 0) { setCodigoBairroError(true) } else { setCodigoBairroError(false) }
        if (cep.length >= 8 &&
            rua.length >= 3 &&
            numero &&
            codigoUF >= 0 &&
            codigoMunicipio >= 0 &&
            codigoBairro >= 0) {

            let uf = listaUF.find((obj: ufType) => (
                obj.codigoUF == codigoUF
            ))

            let municipio = listaMunicipio.find((obj: municipioType) => (
                obj.codigoUF == codigoUF
            ))

            let bairro = listaBairro.find((obj: bairroType) => (
                obj.codigoMunicipio == municipio?.codigoMunicipio
            ))

            let endereco = {
                'id': enderecos.length,
                'index': Math.random() * 999999,
                'cep': cep,
                'nomeRua': rua,
                'numero': numero,
                'complemento': complemento,
                'codigoBairro': codigoBairro,
                'bairro': [
                    {
                        'codigoBairro': bairro?.codigoBairro,
                        'codigoMunicipio': bairro?.codigoMunicipio,
                        'nome': bairro?.nome,
                        'status': bairro?.status,
                        'municipio': [
                            {
                                'codigoMunicipio': municipio?.codigoMunicipio,
                                'codigoUF': municipio?.codigoUF,
                                'nome': municipio?.nome,
                                'uf': [uf]
                            }
                        ]
                    }
                ]
            } as enderecoType

            dispatch(addEndereco(endereco))

            resetInputs()
            resetErrors()
        }

    }

    function handleEditarEndereco(end: enderecoType) {
        if (cep.length < 8) { setCepError(true) } else { setCepError(false) }
        if (rua.length < 3) { setRuaError(true) } else { setRuaError(false) }
        if (!numero) { setNumeroError(true) } else { setNumeroError(false) }
        if (codigoUF < 0) { setCodigoUFError(true) } else { setCodigoUFError(false) }
        if (codigoMunicipio < 0) { setCodigoMunicipioError(true) } else { setCodigoMunicipioError(false) }
        if (codigoBairro < 0) { setCodigoBairroError(true) } else { setCodigoBairroError(false) }
        if (cep.length >= 8 &&
            rua.length >= 3 &&
            numero &&
            codigoUF >= 0 &&
            codigoMunicipio >= 0 &&
            codigoBairro >= 0) {

            let bairro = listaBairro.find((obj: bairroType) => (
                obj.codigoBairro == codigoBairro
            ))
            let municipio = listaMunicipio.find((obj: municipioType) => (
                obj.codigoMunicipio == bairro?.codigoMunicipio
            ))
            let uf = listaUF.find((obj: ufType) => (
                obj.codigoUF == municipio?.codigoUF
            ))

            let endereco = {
                'id': indexInEdit,
                'index': Math.random() * 999999,
                'codigoEndereco': end?.codigoEndereco,
                'codigoPessoa': end?.codigoPessoa,
                'cep': cep,
                'nomeRua': rua,
                'numero': numero,
                'complemento': complemento,
                'codigoBairro': codigoBairro,
                'bairro': [
                    {
                        'codigoBairro': bairro?.codigoBairro,
                        'codigoMunicipio': bairro?.codigoMunicipio,
                        'nome': bairro?.nome,
                        'status': bairro?.status,
                        'municipio': [
                            {
                                'codigoMunicipio': municipio?.codigoMunicipio,
                                'codigoUF': municipio?.codigoUF,
                                'nome': municipio?.nome,
                                'uf': [uf]
                            }
                        ]
                    }
                ]
            } as enderecoType

            //console.log(endereco)
            dispatch(editarEndereco(endereco))

            //resetar inputs
            resetInputs()
            resetErrors()
        }
    }

    function resetInputs() {
        setIndexInEdit(-1)
        setCep('')
        setRua('')
        setNumero(0)
        setComplemento('')
        setCodigoBairro(-1)
        setCodigoMunicipio(-1)
        setCodigoUF(-1)
    }
    function resetErrors() {
        setCepError(false)
        setRuaError(false)
        setNumeroError(false)
        setCodigoUFError(false)
        setCodigoMunicipioError(false)
        setCodigoBairroError(false)
    }

    function handleShowMessage(message: string) {
        setTextMessage(message)
        setShowMessage(true)
    }
    function handleCloseMessage() {
        setShowMessage(false)
    }

    return (
        <Container maxWidth={'5xl'}>
            <Heading
                textAlign={'center'}
                margin={'8px 0 16px 0'}
                color={'#5a5a5a'}>
                Pessoa<hr />
            </Heading>
            {
                success && (
                    <Alert status='success' justifyContent={"center"}>
                        <AlertIcon />
                        <AlertDescription>
                            <Text fontSize={"2xl"}>Dados Salvos com sucesso! <br /></Text>

                            <Link to={'/usuario'} replace>Clique aqui para voltar a pagina de usuarios!</Link>
                        </AlertDescription>
                    </Alert>
                )
            }
            <Flex flexWrap={'wrap'} justifyContent="space-between">

                {/* //DADOS DA PESSOA */}
                <Box w={['100%', '100%', '48%']} height={'100%'}>
                    <Text textTransform={'uppercase'} fontSize={"2xl"}>Dados da pessoa</Text>
                    <hr />
                    <Flex h={['auto', 'auto', '420px']}
                        margin={'16px 0 8px 0'} padding={'16px'} justifyContent="space-between" flexWrap={'wrap'} gap={"12px"}
                        boxShadow={"2px 2px 6px #CECECE"} border={"1px solid #CCC"} borderRadius={'8px'}>
                        <InputCustom
                            onChange={async (e) => ChangeValue(setNome, e.currentTarget.value)}
                            value={nome}
                            label='Nome'
                            type='text'
                            error={nomeError}
                            erroMessage={'Insira o nome'}
                            inputProps={{
                                placeholder: "Nome"
                            }}
                            formControlProps={{ w: ['100%', '48%', '48%'] }} />
                        <InputCustom
                            onChange={async (e) => ChangeValue(setSobrenome, e.currentTarget.value)}
                            value={sobrenome}
                            label='Sobrenome'
                            type='text'
                            error={sobrenomeError}
                            erroMessage={'Insira o sobrenome.'}
                            inputProps={{ placeholder: "Sobrenome" }}
                            formControlProps={{ w: ['100%', '48%', '48%'] }} />
                        <InputCustom
                            onChange={async (e) => ChangeValue(setIdade, e.currentTarget.value)}
                            value={idade}
                            label='Idade'
                            type='number'
                            error={idadeError}
                            erroMessage={'Insira a idade.'}
                            inputProps={{
                                placeholder: "Insira a sua idade"
                            }}
                            formControlProps={{ w: ['100%', '48%', '48%'] }} />
                        <InputCustom
                            onChange={async (e) => ChangeValue(setLogin, e.currentTarget.value)}
                            value={login}
                            label='Login'
                            type='text'
                            error={loginError}
                            erroMessage={'Insira um login.'}
                            inputProps={{
                                placeholder: "Insira um login"
                            }}
                            formControlProps={{ w: ['100%', '48%', '48%'] }} />
                        <InputCustom
                            onChange={async (e) => ChangeValue(setSenha, e.currentTarget.value)}
                            value={senha}
                            label='Senha'
                            type='password'
                            error={senhaError}
                            erroMessage={'Insira uma senha.'}
                            inputProps={{
                                placeholder: "Insira uma senha"
                            }}
                            formControlProps={{ w: ['100%', '48%', '48%'] }} />
                        <SelectCustom
                            onChange={async (e) => ChangeValue(setStatus, e.currentTarget.value)}
                            value={status}
                            label='Status'
                            type='number'
                            error={statusError}
                            erroMessage={'Selecione um status.'}
                            formControlProps={{ w: ['100%', '48%', '48%'] }} >
                            <option value={-1}>Selecione</option>
                            <option value={1}>1-Ativado</option>
                            <option value={2}>2-Desativado</option>
                        </SelectCustom>
                        <Button variant={"outline"} colorScheme={"gray"} margin={"auto"} onClick={() => history.replace('/usuario')}>voltar</Button>
                        <Button colorScheme={"blue"} margin={"auto"} onClick={() => {
                            if (indexInEdit >= 0) {
                                handleShowMessage('Por favor, termine de editar o endereço para pode salvar este usuário!')
                            } else {
                                handleSalvarUsuario()
                            }
                        }}>Salvar</Button>
                    </Flex>
                </Box>

                {/* //DADOS DO ENDEREÇO */}
                <Box w={['100%', '100%', '48%']} >
                    <Text textTransform={'uppercase'} fontSize={"2xl"}>Dados do endereço</Text>
                    <hr />
                    <Flex h={['auto', 'auto', '420px']}
                        margin={'16px 0 8px 0'} padding={'16px'} justifyContent="space-between" flexWrap={'wrap'} gap={"12px"}
                        boxShadow={"2px 2px 6px #CECECE"} border={"1px solid #CCC"} borderRadius={'8px'}>

                        <InputCustom
                            onChange={async (e) => ChangeValue(setCep, e.currentTarget.value)}
                            value={cep}
                            label='Cep'
                            type='number'
                            error={cepError}
                            erroMessage={'Digite um cep.'}
                            inputProps={{
                                placeholder: ""
                            }}
                            formControlProps={{ w: ['100%', '28%', '48%'] }} />
                        <InputCustom
                            onChange={async (e) => ChangeValue(setRua, e.currentTarget.value)}
                            value={rua}
                            label='Rua'
                            type='text'
                            error={ruaError}
                            erroMessage={'Insira o nome uma rua.'}
                            inputProps={{
                                placeholder: ""
                            }}
                            formControlProps={{ w: ['100%', '68%', '48%'] }} />
                        <InputCustom
                            onChange={async (e) => ChangeValue(setNumero, e.currentTarget.value)}
                            value={numero}
                            label='Numero'
                            type='number'
                            error={numeroError}
                            erroMessage={'Insira o numero.'}
                            inputProps={{
                                placeholder: ""
                            }}
                            formControlProps={{ w: ['100%', '28%', '48%'] }} />
                        <InputCustom
                            onChange={async (e) => ChangeValue(setComplemento, e.currentTarget.value)}
                            value={complemento}
                            label='Complemento'
                            type='text'
                            error={complementoError}
                            erroMessage={'Insira o complemento.'}
                            inputProps={{
                                placeholder: ""
                            }}
                            formControlProps={{ w: ['100%', '68%', '48%'] }} />
                        <SelectCustom
                            onChange={async (e) => ChangeValue(setCodigoUF, e.currentTarget.value)
                            }
                            value={codigoUF}
                            label='UF'
                            type='number'
                            error={codigoUFError}
                            erroMessage={'Selecione um UF.'}
                            formControlProps={{ w: ['100%', '100%', '30%'] }} >
                            <option value={-1}>Selecione</option>
                            {
                                listaUF.map((uf: ufType) => {
                                    return uf.status === 1 && (
                                        <option key={uf.codigoUF} value={uf.codigoUF}>{uf.nome}</option>
                                    )
                                })
                            }
                        </SelectCustom>
                        <SelectCustom
                            onChange={async (e) => ChangeValue(setCodigoMunicipio, e.currentTarget.value)}
                            disabled={codigoUF < 0 ? true : false}
                            value={codigoMunicipio}
                            label='Municipio'
                            type='number'
                            error={codigoMunicipioError}
                            erroMessage={'Selecione um municipio.'}
                            formControlProps={{ w: ['100%', '100%', '30%'] }} >
                            <option value={-1}>Selecione</option>
                            {
                                listaMunicipio.map((municipio: municipioType) => {
                                    return municipio.status === 1 && municipio.codigoUF == codigoUF && (
                                        <option key={municipio.codigoMunicipio} value={municipio.codigoMunicipio}>{municipio.nome}</option>
                                    )
                                })
                            }
                        </SelectCustom>
                        <SelectCustom
                            onChange={async (e) => ChangeValue(setCodigoBairro, e.currentTarget.value)}
                            disabled={codigoMunicipio < 0 ? true : false}
                            value={codigoBairro}
                            label='Bairro'
                            type='number'
                            error={codigoBairroError}
                            erroMessage={'Selecione um bairro.'}
                            formControlProps={{ w: ['100%', '100%', '30%'] }} >
                            <option value={-1}>Selecione</option>
                            {
                                listaBairro.map((bairro: bairroType) => {
                                    return bairro.status === 1 && bairro.codigoMunicipio == codigoMunicipio && (
                                        <option key={bairro.codigoBairro} value={bairro.codigoBairro}>{bairro.nome}</option>
                                    )
                                })
                            }
                        </SelectCustom>
                        <Button colorScheme={'blackAlpha'} marginLeft={"auto"} onClick={() => {
                            resetInputs()
                            resetErrors()
                        }}>cancelar</Button>
                        {
                            indexInEdit >= 0 ?
                                <Button colorScheme={'blue'} marginRight={"auto"} onClick={() => {
                                    handleEditarEndereco(enderecos[indexInEdit])
                                }}>Editar</Button>
                                :
                                <Button colorScheme={'green'} marginRight={"auto"} onClick={() => {
                                    if (enderecos.length == 3) {
                                        handleShowMessage("O limite máximo de endereços por usuário é 3, por favor, edite ou exclua um endereço para continuar!")
                                    } else {
                                        handleAdicionarEndereco()
                                    }

                                }}>Adicionar</Button>
                        }
                    </Flex>
                </Box>

                {/* // ENDEREÇOS */}
                {
                    enderecos.length === 0 && (
                        <Box width={'100%'}>
                            <Text textTransform={'uppercase'} fontSize={"2xl"}>Endereços cadastrados</Text>
                            <hr />
                            <Alert status='info' margin={'16px 0 32px 0'}>
                                <AlertIcon />
                                <Text>Nenhum endereço listado.</Text>
                            </Alert>
                        </Box>
                    )
                }
                {
                    enderecos &&
                    enderecos.map((endereco, index) => {
                        let bairro = listaBairro.find((obj: bairroType) => (
                            obj.codigoBairro == endereco.codigoBairro
                        ))
                        let municipio = listaMunicipio.find((obj: municipioType) => (
                            obj.codigoMunicipio == bairro?.codigoMunicipio
                        ))
                        let uf = listaUF.find((obj: ufType) => (
                            obj.codigoUF == municipio?.codigoUF
                        ))
                        //console.log('MU', uf)
                        return (

                            <Box key={endereco.index} width={'100%'} hidden={indexInEdit === index ? true : false}>
                                <Text textTransform={'uppercase'} fontSize={"2xl"}>Endereços cadastrados</Text>
                                <hr />
                                <Flex margin={'16px 0 8px 0'} padding={'16px'} justifyContent="space-between" flexWrap={'wrap'} gap={"12px"}
                                    boxShadow={"2px 2px 6px #CECECE"} border={"1px solid #CCC"} borderRadius={'8px'}>

                                    {/* //ENDEREÇO 1 */}
                                    {/* <Text fontSize={"2xl"} width="100%">Endereço {enderecos.length - index}</Text> */}
                                    <InputCustom
                                        disabled={true}
                                        onChange={async (e) => enderecos[index].cep = e.currentTarget.value}
                                        defaultValue={enderecos[index].cep}
                                        label='Cep'
                                        type='number'
                                        error={false}
                                        erroMessage={'Insira o cep.'}
                                        inputProps={{
                                            placeholder: "00000-000"
                                        }}
                                        formControlProps={{ w: ['100%', '28%', '17%'] }} />
                                    <InputCustom
                                        disabled={true}
                                        onChange={async (e) => enderecos[index].nomeRua = e.currentTarget.value}
                                        defaultValue={enderecos[index].nomeRua}
                                        label='Rua'
                                        type='text'
                                        error={false}
                                        erroMessage={'Insira o nome uma rua.'}
                                        inputProps={{
                                            placeholder: ""
                                        }}
                                        formControlProps={{ w: ['100%', '68%', '35%'] }} />
                                    <InputCustom
                                        disabled={true}
                                        onChange={async (e) => enderecos[index].numero = Number(e.currentTarget.value)}
                                        defaultValue={enderecos[index].numero}
                                        label='Numero'
                                        type='number'
                                        error={false}
                                        erroMessage={'Insira o numero.'}
                                        inputProps={{
                                            placeholder: ""
                                        }}
                                        formControlProps={{ w: ['100%', '28%', '15%'] }} />
                                    <InputCustom
                                        disabled={true}
                                        onChange={(e) => enderecos[index].complemento = e.currentTarget.value}
                                        defaultValue={enderecos[index].complemento}
                                        label='Complemento'
                                        type='text'
                                        error={false}
                                        erroMessage={'Insira o complemento.'}
                                        inputProps={{
                                            placeholder: ""
                                        }}
                                        formControlProps={{ w: ['100%', '68%', '25%'] }} />
                                    <InputCustom
                                        disabled={true}
                                        onChange={(e) => enderecos && (enderecos[index].bairro[0].municipio[0].codigoUF = Number(e.currentTarget.value))}
                                        defaultValue={uf?.sigla}
                                        label='UF'
                                        type='text'
                                        error={false}
                                        formControlProps={{ w: ['100%', '100%', '32%'] }} />
                                    <InputCustom
                                        disabled={true}
                                        onChange={(e) => enderecos && (enderecos[index].bairro[0].codigoMunicipio = Number(e.currentTarget.value))}
                                        defaultValue={municipio?.nome}
                                        label='Municipio'
                                        type='text'
                                        error={false}
                                        formControlProps={{ w: ['100%', '100%', '32%'] }} />
                                    <InputCustom
                                        disabled={true}
                                        onChange={(e) => enderecos && (enderecos[index].bairro[0].codigoBairro = Number(e.currentTarget.value))}
                                        defaultValue={bairro?.nome}
                                        label='Bairro'
                                        type='text'
                                        error={false}
                                        formControlProps={{ w: ['100%', '100%', '32%'] }} />


                                    <Button colorScheme={'blue'} marginLeft={"auto"} onClick={() => {


                                        let bairro = listaBairro.find((obj: bairroType) => (
                                            obj.codigoBairro == enderecos[index].codigoBairro
                                        ))
                                        let municipio = listaMunicipio.find((obj: municipioType) => (
                                            obj.codigoMunicipio == bairro?.codigoMunicipio
                                        ))
                                        let uf = listaUF.find((obj: ufType) => (
                                            obj.codigoUF == municipio?.codigoUF
                                        ))

                                        // handleToggleDisabled(index)
                                        setIndexInEdit(index)
                                        setCep(enderecos[index].cep)
                                        setRua(enderecos[index].nomeRua)
                                        setNumero(enderecos[index].numero)
                                        setComplemento(enderecos[index].complemento)
                                        setCodigoBairro(bairro?.codigoBairro || -1)
                                        setCodigoMunicipio(municipio?.codigoMunicipio || -1)
                                        setCodigoUF(uf?.codigoUF || -1)
                                        setEnderecoInEdit(enderecos[index])
                                    }}>Editar</Button>
                                    <Button colorScheme={'red'} marginRight={"auto"} onClick={() => {
                                        setIndexEcluir(enderecos[index].index)
                                        onOpen()
                                    }}>Excluir</Button>
                                </Flex>
                            </Box>
                        )
                    })
                }
            </Flex>

            <ModalExluirEndereco
                enderecos={enderecos}
                // setEnderecos={setEnderecos}
                id={indexExcluir}
                isOpen={isOpen}
                onClose={onClose}
            />

            <ModalMessage
                isOpen={showMessage} onClose={handleCloseMessage}
                textMessage={textMessage} />
        </Container>
    )
}
