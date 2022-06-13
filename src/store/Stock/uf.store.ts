import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ufType } from "../../types";
import { GET_UF, POST_UF, PUT_UF } from "../../utils/apiConsumers/uf.consumer";

//ASYNC THUNKS
export const UF_GET = createAsyncThunk(
    'uf/getAll',
    async (params?: string) => {
        let urlParamsReplaced = params ? ('?' + params.replaceAll(',', '&')) : ''
        let response: any = await GET_UF(urlParamsReplaced)

        let stringify = JSON.stringify(response)
        if (stringify.charAt(0) === '{') {
            response = [response]
        }

        // //console.log("@GET_DATA", response)

        return response
    }
)
export const UF_POST = createAsyncThunk(
    'uf/post',
    async (uf: ufType) => {
        let response: any = await POST_UF(uf.nome, uf.sigla, uf.status)
        // //console.log('@UF_POST_DATA', response.data)

        let stringify = JSON.stringify(response.data)
        if (stringify.charAt(0) === '{') {
            response.data = [response.data]
        }
        return response.data
    }
)
export const UF_PUT = createAsyncThunk(
    'uf/put',
    async (uf: ufType) => {
        let response: any = await PUT_UF(uf)
        // //console.log('@UF_PUT_DATA', response)

        let stringify = JSON.stringify(response)
        if (stringify.charAt(0) === '{') {
            response = [response]
        }
        return response
    }
)

const ufSlices = createSlice({
    name: "uf",
    initialState: {
        listaUF: Array<ufType>(),
        loading: false,
        erroCode: '',
        errorMessage: ''
    },
    reducers: {},
    extraReducers: (builder) => {
        //GET
        builder.addCase(UF_GET.pending, (state) => {
            state.loading = true
        })
        builder.addCase(UF_GET.fulfilled, (state, action) => {
            state.listaUF = action.payload || []
            state.loading = false
        })
        builder.addCase(UF_GET.rejected, (state, action) => {
            state.loading = false
            state.erroCode = action.error.code || ""
            state.errorMessage = action.error.message || ""
        })

        //POST
        builder.addCase(UF_POST.pending, (state) => {
            state.loading = true
        })
        builder.addCase(UF_POST.fulfilled, (state, action) => {
            state.listaUF = action.payload || []
            state.loading = false
        })
        builder.addCase(UF_POST.rejected, (state, action) => {
            state.loading = false
            state.erroCode = action.error.code || ""
            state.errorMessage = action.error.message || ""
        })

        //PUT
        builder.addCase(UF_PUT.pending, (state) => {
            state.loading = true
        })
        builder.addCase(UF_PUT.fulfilled, (state, action) => {
            state.listaUF = action.payload || []
            state.loading = false
        })
        builder.addCase(UF_PUT.rejected, (state, action) => {
            state.loading = false
            state.erroCode = action.error.code || ""
            state.errorMessage = action.error.message || ""
        })
    }
})
export default ufSlices.reducer