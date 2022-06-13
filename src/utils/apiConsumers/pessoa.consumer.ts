import api from "../../service/api"
import { enderecoType, municipioType } from "../../types"
import { pessoaType } from "../../types/pessoa.type"

export const GET_PESSOA = (params: string) => {
    return new Promise((resolve, reject) => {
        api.get('/pessoa' + params)
            .then((res: any) => {
                resolve(res.data)
            }).catch((err) => {
                reject(err)
            })
    })
}

export const POST_PESSOA = (nome: string, sobrenome: string, idade: number, login: string, senha: string, status: number, enderecos: enderecoType[]) => {

    return new Promise((resolve, reject) => {

        console.log("DADOS ENVIADOS", {
            nome, sobrenome, idade, login, senha, status, 'enderecos': enderecos
        })
        api.post('/pessoa', {
            'nome': nome,
            'sobrenome': sobrenome,
            'idade': idade,
            'login': login,
            'senha': senha,
            'status': status,
            'enderecos': enderecos
        }).then((res) => {
            resolve(res)
        }).catch((err) => {
            reject(err)
        })
    })
}

export const PUT_PESSOA = (codigoPessoa: number, nome: string, sobrenome: string, idade: number, login: string, senha: string, status: number, enderecos: enderecoType[]) => {
    return new Promise((resolve, reject) => {
        api.put('/pessoa', {
            'codigoPessoa': codigoPessoa,
            'nome': nome,
            'sobrenome': sobrenome,
            'idade': idade,
            'login': login,
            'senha': senha,
            'status': status,
            'enderecos': enderecos
        }).then((res) => {
            resolve(res)
        }).catch((err) => {
            reject(err)
        })
    })
}