import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { municipioType } from "../../types";
import { pessoaType } from "../../types/pessoa.type";
import { GET_PESSOA, POST_PESSOA, PUT_PESSOA } from "../../utils/apiConsumers/pessoa.consumer";

//ASYNC THUNKS
export const PESSOA_GET = createAsyncThunk(
    'pessoa/getAll',
    async (params?: string) => {
        let urlParamsReplaced = params ? ('?' + params.replaceAll(',', '&')) : ''
        let response: any = await GET_PESSOA(urlParamsReplaced)

        let stringify = JSON.stringify(response)
        if (stringify.charAt(0) === '{') {
            response = [response]
        }

        // //console.log("@GET_DATA", response)

        return response
    }
)
export const PESSOA_GET_by_cod = createAsyncThunk(
    'pessoa/getByCod',
    async (cod: number) => {
        let response: any = await GET_PESSOA("?codigoPessoa=" + cod)

        let stringify = JSON.stringify(response)
        if (stringify.charAt(0) === '{') {
            response = [response]
        }

        //console.log("@GET_BY_COD_DATA", response)

        return response
    }
)
export const PESSOA_POST = createAsyncThunk(
    'pessoa/post',
    async (pessoa: pessoaType) => {
        let response: any = await POST_PESSOA(pessoa.nome, pessoa.sobrenome, pessoa.idade, pessoa.login, pessoa.senha, pessoa.status, pessoa.enderecos)
        //console.log('@POST_DATA', response)

        let stringify = JSON.stringify(response.data)
        if (stringify.charAt(0) === '{') {
            response.data = [response.data]
        }
        return response.data
    }
)
export const PESSOA_PUT = createAsyncThunk(
    'pessoa/put',
    async (pessoa: pessoaType) => {
        let response: any = await PUT_PESSOA(pessoa.codigoPessoa, pessoa.nome, pessoa.sobrenome, pessoa.idade, pessoa.login, pessoa.senha, pessoa.status, pessoa.enderecos)

        let stringify = JSON.stringify(response.data)
        if (stringify.charAt(0) === '{') {
            response.data = [response.data]
        }
        //console.log('@PUT_DATA', response.data)
        return response.data
    }
)

const pessoaSlices = createSlice({
    name: "pessoa",
    initialState: {
        listaPessoa: Array<pessoaType>(),
        pessoa: {} as pessoaType,
        loading: false,
        erroCode: '',
        errorMessage: ''
    },
    reducers: {},
    extraReducers: (builder) => {
        //GET
        builder.addCase(PESSOA_GET.pending, (state) => {
            state.loading = true
        })
        builder.addCase(PESSOA_GET.fulfilled, (state, action) => {
            state.listaPessoa = action.payload || []
            state.loading = false
        })
        builder.addCase(PESSOA_GET.rejected, (state, action) => {
            state.loading = false
            state.erroCode = action.error.code || ""
            state.errorMessage = action.error.message || ""
        })

        //GET by cod
        builder.addCase(PESSOA_GET_by_cod.pending, (state) => {
            state.loading = true
        })
        builder.addCase(PESSOA_GET_by_cod.fulfilled, (state, action) => {
            //console.log('action', action.payload[0])
            state.pessoa = action.payload[0] || []
            state.loading = false
        })
        builder.addCase(PESSOA_GET_by_cod.rejected, (state, action) => {
            state.loading = false
            state.erroCode = action.error.code || ""
            state.errorMessage = action.error.message || ""
        })

        //POST
        builder.addCase(PESSOA_POST.pending, (state) => {
            state.loading = true
        })
        builder.addCase(PESSOA_POST.fulfilled, (state, action) => {
            state.listaPessoa = action.payload || []
            state.loading = false
        })
        builder.addCase(PESSOA_POST.rejected, (state, action) => {
            state.loading = false
            state.erroCode = action.error.code || ""
            state.errorMessage = action.error.message || ""
        })

        //PUT
        builder.addCase(PESSOA_PUT.pending, (state) => {
            state.loading = true
        })
        builder.addCase(PESSOA_PUT.fulfilled, (state, action) => {
            state.listaPessoa = action.payload || []
            state.loading = false
        })
        builder.addCase(PESSOA_PUT.rejected, (state, action) => {
            state.loading = false
            state.erroCode = action.error.code || ""
            state.errorMessage = action.error.message || ""
        })
    }
})

export default pessoaSlices.reducer