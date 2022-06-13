import { enderecoType } from "."

export type pessoaType = {
    "codigoPessoa": number,
    "nome": string,
    "sobrenome": string,
    "idade": number,
    "login": string,
    "senha": string,
    "status": number,
    "enderecos": enderecoType[]
}
