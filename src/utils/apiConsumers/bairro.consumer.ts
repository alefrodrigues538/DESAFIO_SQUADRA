import api from "../../service/api"
import { bairroType, municipioType } from "../../types"

export const GET_BAIRRO = (params: string) => {
    return new Promise((resolve, reject) => {
        api.get('/bairro' + params)
            .then((res: any) => {
                resolve(res.data)
            }).catch((err) => {
                reject(err)
            })
    })
}

export const POST_BAIRRO = (codigoBairro: number, codigoMunicipio: number, nome: string, status: number) => {
    return new Promise((resolve, reject) => {
        api.post('/bairro', {
            codigoBairro, codigoMunicipio, nome, status
        }).then((res) => {
            resolve(res)
        }).catch((err) => {
            reject(err)
        })
    })
}

export const PUT_BAIRRO = (bairro: bairroType) => {
    return new Promise((resolve, reject) => {
        api.put('/bairro', {
            codigoBairro: bairro.codigoBairro,
            codigoMunicipio: bairro.codigoMunicipio,
            nome: bairro.nome,
            status: bairro.status
        }).then((res) => {
            resolve(res.data)
        }).catch((err) => {
            reject(err)
        })
    })
}