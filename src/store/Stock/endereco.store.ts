import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { enderecoType } from "../../types";

const enderecoSlices = createSlice({
    name: "enderecos",
    initialState: {
        enderecos: Array<enderecoType>(),
    },
    reducers: {
        addEndereco(state, action: PayloadAction<enderecoType>) {
            if (state.enderecos.length > 2) { return }
            if (!action.payload) { return }
            let aux = [{
                'index': Math.random() * 999999,
                'id': state.enderecos.length,
                'cep': action.payload.cep,
                'nomeRua': action.payload.nomeRua,
                'numero': action.payload.numero,
                'complemento': action.payload.complemento,
                'bairro': action.payload.bairro,
                'codigoBairro': action.payload.codigoBairro
            }, ...state.enderecos]

            //console.log('@ENDERECOS', state.enderecos)

            state.enderecos = aux

        },
        removerEndereco(state, action: PayloadAction<number>) {
            state.enderecos = state.enderecos.filter((obj: enderecoType) => (
                obj.index !== action.payload
            ))
            //console.log('id', action.payload)
            // //console.log('index', action.payload)
        },
        editarEndereco(state, action: PayloadAction<enderecoType>) {
            if (!action.payload) { return }

            let aux = state.enderecos;

            //console.log(action.payload)
            aux[action.payload.id] = action.payload

            state.enderecos = aux
        },
        clearEndereco(state) {
            state.enderecos = []
        }
    },
})

export const { addEndereco, removerEndereco, editarEndereco, clearEndereco } = enderecoSlices.actions
export default enderecoSlices.reducer