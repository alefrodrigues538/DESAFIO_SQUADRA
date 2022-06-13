import React from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch, useHistory } from 'react-router-dom'

//pages
import Bairro from './bairro'
import Municipio from './municipio'
import Uf from './uf'
import Usuario from './usuario'
import CadastrarPessoa from './cadastrarPessoa'
import Navbar from '../components/navbar'

export default function RootPages() {
    return (
        <Router>
            <Navbar />
            <Switch>
                <Route path='/cadastrar_pessoa/:codPessoa'><CadastrarPessoa /></Route>
                <Route path='/usuario'><Usuario /></Route>
                <Route path='/bairro'><Bairro /></Route>
                <Route path='/municipio'><Municipio /></Route>
                <Route path='/uf'><Uf /></Route>
                <Route path='/' ><Redirect to={'/uf'} /> </Route>
            </Switch>
        </Router>
    )
}
