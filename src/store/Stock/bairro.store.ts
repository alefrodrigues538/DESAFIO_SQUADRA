import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { bairroType } from "../../types";
import { GET_BAIRRO, POST_BAIRRO, PUT_BAIRRO } from "../../utils/apiConsumers/bairro.consumer";

//ASYNC THUNKS
export const BAIRRO_GET = createAsyncThunk(
    'bairro/getAll',
    async (params?: string) => {
        let urlParamsReplaced = params ? ('?' + params.replaceAll(',', '&')) : ''
        let response: any = await GET_BAIRRO(urlParamsReplaced)

        let stringify = JSON.stringify(response)
        if (stringify.charAt(0) === '{') {
            response = [response]
        }

        //console.log("@GET_PARAMS", urlParamsReplaced)
        //console.log("@GET_DATA", response)

        return response
    }
)
export const BAIRRO_POST = createAsyncThunk(
    'bairro/post',
    async (bairro: bairroType) => {
        let response: any = await POST_BAIRRO(bairro.codigoBairro, bairro.codigoMunicipio, bairro.nome, bairro.status)
        // //console.log('@POST_DATA', response)
        let stringify = JSON.stringify(response.data)
        if (stringify.charAt(0) === '{') {
            response.data = [response.data]
        }

        return response.data
    }
)
export const BAIRRO_PUT = createAsyncThunk(
    'bairro/put',
    async (bairro: bairroType) => {
        let response: any = await PUT_BAIRRO(bairro)

        let stringify = JSON.stringify(response)
        if (stringify.charAt(0) === '{') {
            response = [response]
        }

        //console.log('@PUT_DATA', response)

        return response
    }
)

const bairroSlices = createSlice({
    name: "municipio",
    initialState: {
        listaBairro: Array<bairroType>(),
        todosDados: Array<bairroType>(),
        loading: false,
        erroCode: '',
        errorMessage: ''
    },
    reducers: {},
    extraReducers: (builder) => {
        //GET
        builder.addCase(BAIRRO_GET.pending, (state) => {
            state.loading = true
        })
        builder.addCase(BAIRRO_GET.fulfilled, (state, action) => {
            state.listaBairro = action.payload || []
            state.loading = false
        })
        builder.addCase(BAIRRO_GET.rejected, (state, action) => {
            state.loading = false
            state.erroCode = action.error.code || ""
            state.errorMessage = action.error.message || ""
        })

        //POST
        builder.addCase(BAIRRO_POST.pending, (state) => {
            state.loading = true
        })
        builder.addCase(BAIRRO_POST.fulfilled, (state, action) => {
            state.listaBairro = action.payload || []
            state.loading = false
        })
        builder.addCase(BAIRRO_POST.rejected, (state, action) => {
            state.loading = false
            state.erroCode = action.error.code || ""
            state.errorMessage = action.error.message || ""
        })

        //PUT
        builder.addCase(BAIRRO_PUT.pending, (state) => {
            state.loading = true
        })
        builder.addCase(BAIRRO_PUT.fulfilled, (state, action) => {
            state.listaBairro = action.payload || []
            state.loading = false
        })
        builder.addCase(BAIRRO_PUT.rejected, (state, action) => {
            state.loading = false
            state.erroCode = action.error.code || ""
            state.errorMessage = action.error.message || ""
        })
    }
})

export default bairroSlices.reducer