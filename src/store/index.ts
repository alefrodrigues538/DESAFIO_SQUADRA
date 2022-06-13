import { configureStore, Action, ThunkAction } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { ufType } from '../types'

import ufReducer from './Stock/uf.store'
import municipioReducer from './Stock/municipio.store'
import bairroReducer from './Stock/bairro.store'
import enderecoReducer from './Stock/endereco.store'
import pessoaReducer from './Stock/pessoa.store'

const store = configureStore({
    reducer: {
        uf: ufReducer,
        municipio: municipioReducer,
        bairro: bairroReducer,
        endereco: enderecoReducer,
        pessoa: pessoaReducer
    }
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export type AppThunk = ThunkAction<void, RootState, null, Action<ufType>>

// const dispatch = useDispatch();
// const stock = useSelector<RootState>(state => state.stock)