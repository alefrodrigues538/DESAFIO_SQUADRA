import api from "../../service/api"
import { ufType } from "../../types"

export const GET_UF = (params: string) => {
    return new Promise((resolve, reject) => {
        api.get('/uf' + params)
            .then((res: any) => {
                resolve(res.data)
            }).catch((err) => {
                reject(err)
            })
    })
}

export const POST_UF = (nome: string, sigla: string, status: number) => {
    sigla = sigla.toUpperCase()
    return new Promise((resolve, reject) => {
        api.post('/uf', {
            nome, sigla, status
        }).then((res) => {
            resolve(res)
        }).catch((err) => {
            reject(err)
        })
    })
}

export const PUT_UF = (uf: ufType) => {
    return new Promise((resolve, reject) => {
        api.put('/uf', uf).then((res) => {
            resolve(res.data)
        }).catch((err) => {
            reject(err)
        })
    })
}