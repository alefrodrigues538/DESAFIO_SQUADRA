import { SetStateAction } from "react";
import { municipioType, ufType } from "../types";

export function ChangeValue(SetState: SetStateAction<any>, value: any) {
    SetState(value)
}

export function checkExists(nome: string, sigla: string, listaUF: ufType[]) {
    if (listaUF.length === 0) { return false }
    let result = false;
    for (let index = 0; index < listaUF.length; index++) {
        const uf = listaUF[index];
        if (uf.nome.toLowerCase() == nome.toLowerCase() || uf.sigla.toLowerCase() == sigla.toLowerCase()) {
            result = true;
        }
    }

    return result
}
export function checkMunicipioExists(codigoUF: number, nome: string, lista: municipioType[]) {
    if (lista.length === 0) { return false }
    let result = false;
    for (let index = 0; index < lista.length; index++) {
        const element = lista[index];
        if (element.codigoUF === codigoUF && element.nome.toLowerCase() == nome.toLowerCase()) {
            result = true;
        }
    }

    return result
}
export function checkBairroExists(codigoMunicipio: number, nome: string, lista: municipioType[]) {
    if (lista.length === 0) { return false }
    let result = false;
    for (let index = 0; index < lista.length; index++) {
        const element = lista[index];
        if (element.codigoMunicipio === codigoMunicipio && element.nome.toLowerCase() == nome.toLowerCase()) {
            result = true;
        }
    }

    return result
}