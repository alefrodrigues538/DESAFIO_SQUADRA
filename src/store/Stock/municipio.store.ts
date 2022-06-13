import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { municipioType } from "../../types";
import { GET_MUNICIPIO, POST_MUNICIPIO, PUT_MUNICIPIO } from "../../utils/apiConsumers/municipio.consumer";

//ASYNC THUNKS
export const MUNICIPIO_GET = createAsyncThunk(
    'municipio/getAll',
    async (params?: string) => {
        let urlParamsReplaced = params ? ('?' + params.replaceAll(',', '&')) : ''
        let response: any = await GET_MUNICIPIO(urlParamsReplaced)

        let stringify = JSON.stringify(response)
        if (stringify.charAt(0) === '{') {
            response = [response]
        }

        // //console.log("@GET_DATA", response)

        return response
    }
)
export const MUNICIPIO_POST = createAsyncThunk(
    'municipio/post',
    async (municipio: municipioType) => {
        let response: any = await POST_MUNICIPIO(municipio.codigoUF, municipio.nome, municipio.status)
        //console.log('@POST_DATA', response.data)

        let stringify = JSON.stringify(response.data)
        if (stringify.charAt(0) === '{') {
            response.data = [response.data]
        }
        return response.data
    }
)
export const MUNICIPIO_PUT = createAsyncThunk(
    'municipio/put',
    async (municipio: municipioType) => {
        let response: any = await PUT_MUNICIPIO(municipio)

        let stringify = JSON.stringify(response)
        if (stringify.charAt(0) === '{') {
            response = [response]
        }
        //console.log('@PUT_DATA', response)
        return response
    }
)

const municipioSlices = createSlice({
    name: "municipio",
    initialState: {
        listaMunicipio: Array<municipioType>(),
        todosDados: Array<municipioType>(),
        loading: false,
        erroCode: '',
        errorMessage: ''
    },
    reducers: {},
    extraReducers: (builder) => {
        //GET
        builder.addCase(MUNICIPIO_GET.pending, (state) => {
            state.loading = true
        })
        builder.addCase(MUNICIPIO_GET.fulfilled, (state, action) => {
            state.listaMunicipio = action.payload || []
            state.loading = false
        })
        builder.addCase(MUNICIPIO_GET.rejected, (state, action) => {
            state.loading = false
            state.erroCode = action.error.code || ""
            state.errorMessage = action.error.message || ""
        })

        //POST
        builder.addCase(MUNICIPIO_POST.pending, (state) => {
            state.loading = true
        })
        builder.addCase(MUNICIPIO_POST.fulfilled, (state, action) => {
            state.listaMunicipio = action.payload || []
            state.loading = false
        })
        builder.addCase(MUNICIPIO_POST.rejected, (state, action) => {
            state.loading = false
            state.erroCode = action.error.code || ""
            state.errorMessage = action.error.message || ""
        })

        //PUT
        builder.addCase(MUNICIPIO_PUT.pending, (state) => {
            state.loading = true
        })
        builder.addCase(MUNICIPIO_PUT.fulfilled, (state, action) => {
            state.listaMunicipio = action.payload || []
            state.loading = false
        })
        builder.addCase(MUNICIPIO_PUT.rejected, (state, action) => {
            state.loading = false
            state.erroCode = action.error.code || ""
            state.errorMessage = action.error.message || ""
        })
    }
})

export default municipioSlices.reducer