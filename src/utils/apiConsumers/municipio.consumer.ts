import api from "../../service/api"
import { municipioType } from "../../types"

export const GET_MUNICIPIO = (params: string) => {
    return new Promise((resolve, reject) => {
        api.get('/municipio' + params)
            .then((res: any) => {
                resolve(res.data)
            }).catch((err) => {
                reject(err)
            })
    })
}

export const POST_MUNICIPIO = (codigoUF: number, nome: string, status: number) => {
    return new Promise((resolve, reject) => {
        api.post('/municipio', {
            codigoUF, nome, status
        }).then((res) => {
            resolve(res)
        }).catch((err) => {
            reject(err)
        })
    })
}

export const PUT_MUNICIPIO = (municipio: municipioType) => {
    return new Promise((resolve, reject) => {
        api.put('/municipio', municipio).then((res) => {
            resolve(res.data)
        }).catch((err) => {
            reject(err)
        })
    })
}