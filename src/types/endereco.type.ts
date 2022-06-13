import { ufType } from "./uf.type"

export type enderecoType = {
    index: number,
    id: number,
    cep: string,
    codigoBairro: number,
    codigoEndereco?: number,
    codigoPessoa?: number,
    complemento: string,
    nomeRua: string,
    numero: number,
    bairro: Array<bairroTypeApi>
}

export type bairroTypeApi = {
    codigoBairro: number,
    codigoMunicipio: number,
    nome: string,
    status: number,
    municipio: Array<municipioTypeApi>
}

export type municipioTypeApi = {
    codigoMunicipio: number,
    codigoUF: number,
    nome: string,
    status: number,
    uf: Array<ufType>
}
